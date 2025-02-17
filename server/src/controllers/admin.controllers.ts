import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { UserUtils } from "../utils/user.utils";

export class AdminController {
  private get userRepository() {
    return AppDataSource.getRepository(Users);
  }

  public getAllUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allUsers: Users[] = await this.userRepository.find();

      const users = allUsers.map((user) => {
        return {
          id: user.id,
          userName: user.userName,
          email: user.email,
          DOB: user.DOB,
          role: user.role,
          isPrivate: user.isPrivate,
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

  public deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: string = req.params.id;

      await UserUtils.findUserById(id);

      await this.userRepository.delete({ id });

      res.status(200).json({
        success: true,
        message: "user deleted successfully",
      });
    }
  );
}
