// duplicate email error
// code: '23505',
// detail: 'Key (email)=(user@gmail.com) already exists.'
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ValidationError } from "joi";
import { QueryFailedError } from "typeorm";

const isValidationError = (err: any): err is ValidationError => {
  return err && err.isJoi;
};

const isQueryFailedError = (err: any): err is QueryFailedError => {
  return err && err instanceof QueryFailedError;
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("error handler : ", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (isValidationError(err)) {
    err = handleValidationError(err as ValidationError);
  }
  if (err instanceof QueryFailedError && err.driverError.code === "23505") {
    err = handleDuplicateKeyError(err);
  }
  errorResponse(err, res);
};

const handleValidationError = (err: ValidationError): AppError => {
  const errMsg = err.details
    .map((detail) => {
      return detail.message;
    })
    .join("");

  return new AppError(errMsg, 400);
};

const handleDuplicateKeyError = (err: QueryFailedError): AppError => {
  return new AppError("please use different email", 400);
};

const errorResponse = (err: AppError, res: Response) => {
  if (!err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: "something went wrong",
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
