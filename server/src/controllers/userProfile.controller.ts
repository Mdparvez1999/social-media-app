import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import {
  updateUserNameSchema,
  updateEmailSchema,
  updateDOBSchema,
  changePasswordSchema,
  updateBioSchema,
  updateGenderSchema,
} from "../validation/userProfile.validation";
import { comparePassword, hashPassword } from "../helpers/auth.helper";
import { AppError } from "../utils/AppError";

interface updateProfileRequest extends Request {
  body: {
    userName: string;
    email: string;
    DOB: string;
  };
}

interface changePasswordRequest extends Request {
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

export class UserProfileController {
  private userRepsitory = AppDataSource.getRepository(Users);

  public getUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const user: Users | null = await this.userRepsitory.findOneBy({
        id: userId,
      });

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
          isPrivate: user.isPrivate,
          profilePic: user.profilePic,
          gender: user.gender,
          isActive: user.isActive,
          bio: user.bio,
        },
      });
    }
  );

  public updateUserName = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateUserNameSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const userName: string = value.userName;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { userName });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateEmail = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateEmailSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const email: string = value.email;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { email });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateDOB = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateDOBSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const DOB: string = value.DOB;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { DOB });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateBio = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateBioSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const bio: string = value.bio;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { bio });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateGender = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateGenderSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const gender: string = value.gender;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { gender });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateProfilePic = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const fileName = req.file?.filename;

      await this.userRepsitory.update({ id: userId }, { profilePic: fileName });

      res.status(200).json({
        success: true,
        message: "profilepic changed successfully",
      });
    }
  );

  public changePassword = asyncHandler(
    async (req: changePasswordRequest, res: Response, next: NextFunction) => {
      const { error, value } = changePasswordSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const { oldPassword, newPassword } = value;

      const userId: string = res.locals.user.id;

      const user: Users | null = await this.userRepsitory.findOneBy({
        id: userId,
      });

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

      await this.userRepsitory.update(
        { id: userId },
        { password: hashedPassword }
      );

      res.status(200).json({
        success: true,
        message: "password changed successfully",
      });
    }
  );

  public privateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { isPrivate: true });

      res.status(200).json({
        success: true,
        message: "account updated to private",
      });
    }
  );

  public publicProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { isPrivate: false });

      res.status(200).json({
        success: true,
        message: "account updated to public",
      });
    }
  );

  public deleteProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      await this.userRepsitory.delete({ id: userId });

      res.status(200).json({
        success: true,
        message: "account deleted successfully",
      });
    }
  );

  public deActivateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { isActive: false });

      res.status(200).json({
        success: true,
        message: "account deactivated successfully",
      });
    }
  );

  public reActivateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { isActive: true });

      res.status(200).json({
        success: true,
        message: "account reactivated successfully",
      });
    }
  );
}
