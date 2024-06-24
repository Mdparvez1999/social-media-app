import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "../config/DB_Connection";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/auth.validation";
import { Users } from "../entities/user.entity";
import { comparePassword, hashPassword } from "../utils/auth.utils";
import { genrateToken } from "../utils/jwt.utils";
import crypto from "crypto";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
  private userRepository = AppDataSource.getRepository(Users);

  public userRegister = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | Error | void> => {
      const { error, value } = registerSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const { userName, email, DOB, password, gender } = value;

      const profilePicName: string | undefined = req.file?.filename;

      const hashedPassword: string = await hashPassword(password);

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
        message: "User created successfully",
        data: newUser,
      });
    }
  );

  public userLogin = asyncHandler(
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

      const user = await this.userRepository.findOneBy({ email });

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

  public forgotPassword = asyncHandler(
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

      const user: Users | null = await this.userRepository.findOneBy({ email });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const forgotPasswordToken: string = crypto
        .randomBytes(20)
        .toString("hex");

      user.forgotPasswordToken = forgotPasswordToken;
      user.forgotPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await this.userRepository.save(user);

      return res.status(200).json({
        success: true,
        message: "forgot password token sent to your email",
        token: `http://localhost:3000/reset-password/${forgotPasswordToken}`,
      });
    }
  );

  public resetPassword = asyncHandler(
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

      const user: Users | null = await this.userRepository.findOneBy({
        forgotPasswordToken: token,
      });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const hashedPassword = await hashPassword(password);

      user.password = hashedPassword;
      user.forgotPasswordToken = null;
      user.forgotPasswordExpiry = null;

      await this.userRepository.save(user);

      return res.status(200).json({
        success: true,
        message: "password reset successfully",
      });
    }
  );
}
