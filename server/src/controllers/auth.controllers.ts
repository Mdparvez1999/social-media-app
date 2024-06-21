import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "../config/DB_Connection";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/authValidation/auth.validation";
import { Users } from "../entities/auth/user.entity";
import { comparePassword, hashPassword } from "../utils/auth.utils";
import { genrateToken } from "../utils/jwt.utils";
import crypto from "crypto";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

const userRepository = AppDataSource.getRepository(Users);

export const userRegister = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | Error | void> => {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { userName, email, DOB, password } = value;

    const hashedPassword = await hashPassword(password);

    const newUser = userRepository.create({
      userName,
      email,
      DOB,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  }
);

export const userLogin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | Error | void> => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      next(error);
    }

    const { email, password } = value;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    const correctPassword = await comparePassword(password, user.password);

    if (!correctPassword) {
      return next(new AppError("Invalid credentials", 400));
    }

    genrateToken(user.id, res);

    return res.status(200).json({
      success: true,
      message: "login successfull",
      data: user,
    });
  }
);

export const forgotPassword = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | Error | void> => {
    const { error, value } = forgotPasswordSchema.validate(req.body);

    if (error) {
      next(error);
    }

    const { email } = value;

    const user: Users | null = await userRepository.findOneBy({ email });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const forgotPasswordToken: string = crypto.randomBytes(20).toString("hex");

    user.forgotPasswordToken = forgotPasswordToken;
    user.forgotPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await userRepository.save(user);

    return res.status(200).json({
      success: true,
      message: "forgot password token sent to your email",
      token: `http://localhost:3000/reset-password/${forgotPasswordToken}`,
    });
  }
);

export const resetPassword = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | Error | void> => {
    const { error, value } = resetPasswordSchema.validate(req.body);

    if (error) {
      next(error);
    }

    const { password } = value;

    const token: string = req.params.token;

    const user: Users | null = await userRepository.findOneBy({
      forgotPasswordToken: token,
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;

    await userRepository.save(user);

    return res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  }
);
