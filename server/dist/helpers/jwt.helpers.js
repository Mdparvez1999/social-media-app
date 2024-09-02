import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
export const genrateToken = (id, res) => {
    try {
        const jwtPayload = { id };
        const jwtSecret = process.env.JWT_SECRET;
        const signOptions = {
            expiresIn: "1d",
        };
        if (!jwtSecret) {
            throw new AppError("JWT Secret is not defined", 500);
        }
        const token = jwt.sign(jwtPayload, jwtSecret, signOptions);
        res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
    }
    catch (error) {
        throw new AppError(error instanceof Error ? error.message : "Error generating token", 500);
    }
};
