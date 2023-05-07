import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

// error code: 400
class UnAuthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnAuthenticatedError;