import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/auth/user.entity";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "../validation/userProfile.validation";
import { comparePassword, hashPassword } from "../utils/auth.utils";
import { AppError } from "../utils/AppError";

const userRepsitory = AppDataSource.getRepository(Users);
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = res.locals.user.id;

    const user: Users | null = await userRepsitory.findOneBy({ id: userId });

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        userName: user.userName,
        email: user.email,
        DOB: user.DOB,
        password: "********",
        role: user.role,
      },
    });
  }
);

interface updateProfileRequest extends Request {
  body: {
    userName: string;
    email: string;
    DOB: string;
  };
}

export const updateUserProfile = asyncHandler(
  async (req: updateProfileRequest, res: Response, next: NextFunction) => {
    const { error, value } = updateProfileSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { userName, email, DOB } = value;

    const userId: string = res.locals.user.id;

    const user: Users | null = await userRepsitory.findOneBy({ id: userId });

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    await userRepsitory.update({ id: userId }, { userName, email, DOB });

    res.status(200).json({
      success: true,
      message: "profile updated successfully",
    });
  }
);

interface changePasswordRequest extends Request {
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

export const changePassword = asyncHandler(
  async (req: changePasswordRequest, res: Response, next: NextFunction) => {
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { oldPassword, newPassword } = value;

    const userId: string = res.locals.user.id;

    const user: Users | null = await userRepsitory.findOneBy({ id: userId });

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    const isCorrectPassword: boolean = await comparePassword(
      oldPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return next(new AppError("incorrect old password", 400));
    }

    const hashedPassword: string = await hashPassword(newPassword);

    await userRepsitory.update({ id: userId }, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  }
);
