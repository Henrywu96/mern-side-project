import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    // If the error has status code, use this one, otherwise use the generic one (error code: 500)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later.",
    };

    // check error code
    if (err.name === "ValidationError") {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        // defaultError.msg = err.message;
        // print out the corresponding error object's value
        defaultError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
    }

    // check error code and sends corresponding message
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.msg = `${Object.keys(
            err.keyValue
        )} field has to be unique`;
    }

    res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
