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
  updatefullNameSchema,
} from "../validation/userProfile.validation";
import { comparePassword, hashPassword } from "../helpers/auth.helper";
import { AppError } from "../utils/AppError";
import { Not } from "typeorm";
import { genrateToken } from "../helpers/jwt.helpers";

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
  private get userRepsitory() {
    return AppDataSource.getRepository(Users);
  }

  public getUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const user: Users | null = await this.userRepsitory.findOne({
        where: {
          id: userId,
        },
        relations: ["posts", "comments", "followers", "following"],
      });

      if (!user) {
        return next(new AppError("user not found", 404));
      }

      res.status(200).json({
        success: true,
        data: {
          userName: user.userName,
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          DOB: user.DOB,
          password: "********",
          isPrivate: user.isPrivate,
          profilePic: user.profilePic,
          gender: user.gender,
          isActive: user.isActive,
          bio: user.bio,
          postsCount: user.posts.length,
          followersCount: user.following.length,
          followingCount: user.followers.length,
          follwers: user.followers,
          following: user.following,
        },
      });
    }
  );

  public updateUserName = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateUserNameSchema.validate(req.body);

      if (error) return next(error);

      const userName: string = value.userName;

      const userId: string = res.locals.user.id;

      await this.userRepsitory.update({ id: userId }, { userName });

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
      });
    }
  );

  public updateFullName = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updatefullNameSchema.validate(req.body);

      if (error) return next(error);

      const fullName: string = value.fullName;

      const userId: string = res.locals.user.id;

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ fullName })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (result.raw.affectedRows === 0) {
        return next(new AppError("user not found", 404));
      }

      const updatedUser = result.raw[0];

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
        fullName: updatedUser.fullName,
      });
    }
  );

  public updateEmail = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateEmailSchema.validate(req.body);

      if (error) return next(error);

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

      if (error) return next(error);

      const DOB: string = value.DOB;

      const userId: string = res.locals.user.id;

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ DOB })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
        DOB: updatedUser.DOB,
      });
    }
  );

  public updateBio = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateBioSchema.validate(req.body);

      if (error) return next(error);

      const bio: string = value.bio;

      const userId: string = res.locals.user.id;

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ bio })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
        bio: updatedUser.bio,
      });
    }
  );

  public updateGender = asyncHandler(
    async (req: updateProfileRequest, res: Response, next: NextFunction) => {
      const { error, value } = updateGenderSchema.validate(req.body);

      if (error) return next(error);

      const gender: string = value.gender;

      const userId: string = res.locals.user.id;

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ gender })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "profile updated successfully",
        gender: updatedUser.gender,
      });
    }
  );

  public updateProfilePic = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const fileName: string = req.body.profilePic;

      const user: Users | null = await this.userRepsitory.findOneBy({
        id: userId,
      });

      await this.userRepsitory.update({ id: userId }, { profilePic: fileName });

      res.status(200).json({
        success: true,
        message: "profilepic changed successfully",
        profilePic: user?.profilePic,
      });
    }
  );

  public changePassword = asyncHandler(
    async (req: changePasswordRequest, res: Response, next: NextFunction) => {
      const { error, value } = changePasswordSchema.validate(req.body);

      if (error) return next(error);

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

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ isPrivate: true })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "account updated to private",
        isPrivate: updatedUser.isPrivate,
      });
    }
  );

  public publicProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ isPrivate: false })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "account updated to public",
        isPrivate: updatedUser.isPrivate,
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

      const result = await this.userRepsitory
        .createQueryBuilder()
        .update(Users)
        .set({ isActive: false })
        .where({ id: userId })
        .returning("*")
        .execute();

      if (!result) {
        return next(new AppError("failed to update", 400));
      }

      const updatedUser: Users = result.raw[0];

      res.status(200).json({
        success: true,
        message: "account deactivated successfully",
        isActive: updatedUser.isActive,
      });
    }
  );

  public reActivateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = String(req.query.id);

      await this.userRepsitory.update({ id: userId }, { isActive: true });

      const user = await this.userRepsitory.findOneBy({ id: userId });

      if (!user) {
        return next(new AppError("Invalid credentials", 400));
      }

      const token = genrateToken(user?.id, res);

      res.status(200).json({
        success: true,
        message: "account reactivated successfully",
        user: {
          id: user?.id,
          userName: user?.userName,
          isActive: user?.isActive,
        },
        token,
      });
    }
  );

  public suggestedUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUserId = res.locals.user.id;

      const suggestedUsers = await this.userRepsitory.find({
        where: {
          id: Not(currentUserId),
          isActive: true,
        },
        take: 10,
      });

      const usersData = suggestedUsers.map((user) => {
        return {
          id: user.id,
          userName: user.userName,
          profilePic: user.profilePic,
        };
      });

      return res.status(200).json({
        status: true,
        message:
          suggestedUsers.length > 0 ? "suggested users" : "no suggested users",
        data: usersData,
      });
    }
  );
}
