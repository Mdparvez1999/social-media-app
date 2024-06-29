import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    return next(new AppError("Too many requests", 429));
  },
  headers: true,
});
