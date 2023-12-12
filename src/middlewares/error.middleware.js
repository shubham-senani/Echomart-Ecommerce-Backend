// error middleware || NEXT function
import ApiError from "../utils/ApiError.js";
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(message, 400)
}

const handleDuplicateFieldsBD = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field values ${value}. Please use another value`;
    return new ApiError(message, 400);
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input Data. ${errors.join(". ")}`;
    console.log(errors);
    return new ApiError(message, 400);
}

const handleJWTError = (err) => {
    return new ApiError("Invalid token, Please log in again", 401);
}

const handleJWTExpiredError = (err) => {
    return next(ApiError("Token has been expired, Please login again", 401));
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    })
}

const sendErrorPro = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: "error",
            err,
            message: "Something went on server side"
        })
    }
}

const errorMiddleware = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError") err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateFieldsBD(err);
        if (err.name === "ValidationError") err = handleValidationError(err);
        if (err.name === "JsonWebTokenError") err = handleJWTError(err);
        if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);
        sendErrorPro(err, res);
    }
    console.log(err);
    next();
}

export default errorMiddleware;