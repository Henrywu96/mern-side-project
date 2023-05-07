import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // check for empty values
    if (!name || !email || !password) {
        throw new BadRequestError("Please enter all values!");
    }

    // check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new BadRequestError("Email already in use!");
    }

    const user = await User.create({ name, email, password });
    const token = user.createJWT();

    // cookies
    attachCookies({ res, token });

    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
        },
        // token, // no need to use it after using cookies
        location: user.location,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please enter all values!');
    }

    // if user exist check password, if not exist throw bad req
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new UnAuthenticatedError('Invalid Credentials!');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials!');
    }

    // setup JWT token
    const token = user.createJWT();
    user.password = undefined; // prevents showing password from the user instance in the response body

    // cookies
    attachCookies({ res, token });

    //* before using cookies
    // res.status(StatusCodes.OK).json({ user, token, location: user.location }); 

    //* after using cookies
    res.status(StatusCodes.OK).json({ user, location: user.location }); 

};

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please enter all values!');
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;
    
    await user.save(); // save the updated user

    // create new token
    const token = user.createJWT();

    // cookies
    attachCookies({ res, token });

    //* before using cookies
    // res.status(StatusCodes.OK).json({ user, token, location: user.location });

    //* after using cookies
    res.status(StatusCodes.OK).json({ user, location: user.location });
};

// get current user
const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ user, location: user.location });
}

// logout current user
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
}

export { register, login, updateUser, getCurrentUser, logout };
