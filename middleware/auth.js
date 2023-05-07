import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

UnAuthenticatedError;

const auth = async (req, res, next) => {
    //* auth header, before using cookies
    // const authHeader = req.headers.authorization;
    
    // if no authorization header, throw error
    // if (!authHeader || !authHeader.startsWith('Bearer')) {
    //     throw new UnAuthenticatedError('Authentication Invalid!');
    // }

    // const token = authHeader.split(' ')[1]; // second value in the array, which is the token

    //* using cookies method
    const token = req.cookies.token;
    if (!token) {
        throw new UnAuthenticatedError('Authentication Invalid!');
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(payload);

        // test user
        const testUser = payload.userId === '6456f40d66a4dd4c7b5593fb';

        // attach the user request object
        req.user = { userId: payload.userId, testUser };
        // req.user = payload;


        next();
    } catch (err) {
        throw new UnAuthenticatedError('Authentication Invalid!');
    }
}

export default auth;