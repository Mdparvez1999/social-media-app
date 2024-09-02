import { AppDataSource } from "../config/DB_Connection.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, } from "../validation/auth.validation.js";
import { Users } from "../entities/user.entity.js";
import { comparePassword, hashPassword, genForgotPasswordToken, } from "../helpers/auth.helper.js";
import { genrateToken } from "../helpers/jwt.helpers.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserUtils } from "../utils/user.utils.js";
export class AuthController {
    get userRepository() {
        return AppDataSource.getRepository(Users);
    }
    userRegister = asyncHandler(async (req, res, next) => {
        const { error, value } = registerSchema.validate(req.body);
        if (error)
            return next(error);
        const { userName, email, DOB, password, gender } = value;
        const profilePicName = req.file?.filename;
        const existingUser = await UserUtils.findUserByEmail(email);
        if (existingUser) {
            return next(new AppError("Email already exists", 400));
        }
        const hashedPassword = await hashPassword(password);
        const newUser = this.userRepository.create({
            userName,
            email,
            DOB,
            password: hashedPassword,
            profilePic: profilePicName,
            gender,
        });
        await this.userRepository.save(newUser);
        return res.status(201).json({
            success: true,
            message: "account created successfully",
            data: {
                id: newUser.id,
                userName: newUser.userName,
                isActive: newUser.isActive,
            },
        });
    });
    userLogin = asyncHandler(async (req, res, next) => {
        const { error, value } = loginSchema.validate(req.body);
        if (error)
            next(error);
        const { email, password } = value;
        const user = await UserUtils.findUserByEmail(email);
        const correctPassword = await comparePassword(password, user.password);
        if (!correctPassword) {
            return next(new AppError("Invalid credentials", 400));
        }
        genrateToken(user.id, res);
        return res.status(200).json({
            success: true,
            message: "login successfull",
            user: {
                id: user.id,
                userName: user.userName,
                isActive: user.isActive,
            },
        });
    });
    forgotPassword = asyncHandler(async (req, res, next) => {
        const { error, value } = forgotPasswordSchema.validate(req.body);
        if (error)
            next(error);
        const { email } = value;
        const user = await UserUtils.findUserByEmail(email);
        const forgotPasswordToken = genForgotPasswordToken();
        user.forgotPasswordToken = forgotPasswordToken;
        user.forgotPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.userRepository.save(user);
        return res.status(200).json({
            success: true,
            message: "forgot password token sent to your email",
            token: `http://localhost:3000/reset-password/${forgotPasswordToken}`,
        });
    });
    resetPassword = asyncHandler(async (req, res, next) => {
        const { error, value } = resetPasswordSchema.validate(req.body);
        if (error)
            next(error);
        const { password } = value;
        const token = req.params.token;
        const user = await UserUtils.findUserByFPToken(token);
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.forgotPasswordToken = null;
        user.forgotPasswordExpiry = null;
        await this.userRepository.save(user);
        return res.status(200).json({
            success: true,
            message: "password reset successfully",
        });
    });
    userLogout = asyncHandler(async (req, res, next) => {
        res.clearCookie("jwt");
        return res.status(200).json({
            success: true,
            message: "user logged out successfully",
        });
    });
}
