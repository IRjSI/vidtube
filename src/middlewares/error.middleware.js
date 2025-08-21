import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err,_,res,_) => {
    let error = err

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || 'Something went wrong'
        error = new ApiError(statusCode, message, error?.errors || [], error.stack)
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    }

    return res.status(error.statusCode).json(response)
}

export { errorHandler };