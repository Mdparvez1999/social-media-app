import { AppError } from "../utils/AppError.js";
import { QueryFailedError } from "typeorm";
const isValidationError = (err) => {
    return err && err.isJoi;
};
const isQueryFailedError = (err) => {
    return err && err instanceof QueryFailedError;
};
export const errorHandler = (err, req, res, next) => {
    console.log("error handler : ", err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (isValidationError(err)) {
        err = handleValidationError(err);
    }
    if (err instanceof QueryFailedError && err.driverError.code === "23505") {
        err = handleDuplicateKeyError(err);
    }
    errorResponse(err, res);
};
const handleValidationError = (err) => {
    const errMsg = err.details
        .map((detail) => {
        return detail.message;
    })
        .join("");
    return new AppError(errMsg, 400);
};
const handleDuplicateKeyError = (err) => {
    return new AppError("please use different email", 400);
};
const errorResponse = (err, res) => {
    if (!err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: "something went wrong,please try again later",
        });
    }
    else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
};
