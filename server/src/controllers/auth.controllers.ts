import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "../config/DB_Connection";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/auth.validation";
import { Users } from "../entities/user.entity";
import {
  comparePassword,
  hashPassword,
  genForgotPasswordToken,
} from "../helpers/auth.helper";
import { genrateToken } from "../helpers/jwt.helpers";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { UserUtils } from "../utils/user.utils";

export class AuthController {
  private get userRepository() {
    return AppDataSource.getRepository(Users);
  }

  public userRegister = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | Error | void> => {
      const { error, value } = registerSchema.validate(req.body);

      if (error) return next(error);

      const { userName, email, DOB, password, gender } = value;

      await UserUtils.checkEmailExists(email);

      const hashedPassword: string = await hashPassword(password);

      const newUser = this.userRepository.create({
        userName,
        email,
        DOB,
        password: hashedPassword,
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
    }
  );

  public userLogin = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | Error | void> => {
      const { error, value } = loginSchema.validate(req.body);

      if (error) next(error);

      const { email, password } = value;

      const user = await UserUtils.findUserByEmail(email);

      if (!user) {
        return next(new AppError("Invalid credentials", 400));
      }

      const correctPassword = await comparePassword(password, user.password);

      if (!correctPassword) {
        return next(new AppError("Invalid credentials", 400));
      }

      const token = genrateToken(user.id, res);

      return res.status(200).json({
        success: true,
        message: "login successfull",
        user: {
          id: user.id,
          userName: user.userName,
          isActive: user.isActive,
        },
        token,
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

      if (error) next(error);

      const { email } = value;

      const user: Users | null = await UserUtils.findUserByEmail(email);

      if (!user) {
        return next(new AppError("Invalid credentials", 400));
      }

      const forgotPasswordToken: string = genForgotPasswordToken();

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

      if (error) next(error);

      const { password } = value;

      const token: string = req.params.token;

      const user: Users | null = await UserUtils.findUserByFPToken(token);

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

  public userLogout = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | Error | void> => {
      res.clearCookie("jwt");

      return res.status(200).json({
        success: true,
        message: "user logged out successfully",
      });
    }
  );
}
