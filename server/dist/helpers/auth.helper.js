import { compare, genSalt, hash } from "bcrypt";
import crypto from "crypto";
import { AppError } from "../utils/AppError.js";
export const hashPassword = async (password) => {
    try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        throw new AppError("Error hashing the password", 500);
    }
};
export const comparePassword = async (password, dbPassword) => {
    try {
        return await compare(password, dbPassword);
    }
    catch (error) {
        throw new AppError("Error comparing the passwords", 500);
    }
};
export const genForgotPasswordToken = () => {
    return crypto.randomBytes(20).toString("hex");
};
