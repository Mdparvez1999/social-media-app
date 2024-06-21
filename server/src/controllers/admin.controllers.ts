import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/auth/user.entity";
import { AppError } from "../utils/AppError";

const userRepository = AppDataSource.getRepository(Users);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUsers: Users[] = await userRepository.find();

    const users = allUsers.map((user) => {
      return {
        id: user.id,
        userName: user.userName,
        email: user.email,
        DOB: user.DOB,
        role: user.role,
      };
    });

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    const user: Users | null = await userRepository.findOneBy({ id });

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    await userRepository.delete({ id });
    
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  }
);
