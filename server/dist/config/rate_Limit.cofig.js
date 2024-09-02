import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";
export const apiLimiter = rateLimit({
    windowMs: 150 * 60 * 1000,
    max: 1000,
    handler: (req, res, next) => {
        return next(new AppError("Too many requests from this IP, please try again later", 429));
    },
    headers: true,
});
