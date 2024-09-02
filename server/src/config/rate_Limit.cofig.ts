import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { AppError } from "../utils/AppError";
import { NextFunction, Request, Response } from "express";

export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 150 * 60 * 1000,
  max: 1000,
  handler: (req: Request, res: Response, next: NextFunction) => {
    return next(
      new AppError(
        "Too many requests from this IP, please try again later",
        429
      )
    );
  },
  headers: true,
});
