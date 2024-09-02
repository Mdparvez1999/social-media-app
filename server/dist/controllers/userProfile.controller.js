import { asyncHandler } from "../utils/asyncHandler.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Users } from "../entities/user.entity.js";
import { updateUserNameSchema, updateEmailSchema, updateDOBSchema, changePasswordSchema, updateBioSchema, updateGenderSchema, updatefullNameSchema, } from "../validation/userProfile.validation.js";
import { comparePassword, hashPassword } from "../helpers/auth.helper.js";
import { AppError } from "../utils/AppError.js";
import { Not } from "typeorm";
export class UserProfileController {
    get userRepsitory() {
        return AppDataSource.getRepository(Users);
    }
    getUserProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        const user = await this.userRepsitory.findOne({
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
    });
    updateUserName = asyncHandler(async (req, res, next) => {
        const { error, value } = updateUserNameSchema.validate(req.body);
        if (error)
            return next(error);
        const userName = value.userName;
        const userId = res.locals.user.id;
        await this.userRepsitory.update({ id: userId }, { userName });
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
        });
    });
    updateFullName = asyncHandler(async (req, res, next) => {
        const { error, value } = updatefullNameSchema.validate(req.body);
        if (error)
            return next(error);
        const fullName = value.fullName;
        const userId = res.locals.user.id;
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
    });
    updateEmail = asyncHandler(async (req, res, next) => {
        const { error, value } = updateEmailSchema.validate(req.body);
        if (error)
            return next(error);
        const email = value.email;
        const userId = res.locals.user.id;
        await this.userRepsitory.update({ id: userId }, { email });
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
        });
    });
    updateDOB = asyncHandler(async (req, res, next) => {
        const { error, value } = updateDOBSchema.validate(req.body);
        if (error)
            return next(error);
        const DOB = value.DOB;
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
            DOB: updatedUser.DOB,
        });
    });
    updateBio = asyncHandler(async (req, res, next) => {
        const { error, value } = updateBioSchema.validate(req.body);
        if (error)
            return next(error);
        const bio = value.bio;
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
            bio: updatedUser.bio,
        });
    });
    updateGender = asyncHandler(async (req, res, next) => {
        const { error, value } = updateGenderSchema.validate(req.body);
        if (error)
            return next(error);
        const gender = value.gender;
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
            gender: updatedUser.gender,
        });
    });
    updateProfilePic = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        const fileName = req.file?.filename;
        await this.userRepsitory.update({ id: userId }, { profilePic: fileName });
        const user = await this.userRepsitory.findOneBy({
            id: userId,
        });
        res.status(200).json({
            success: true,
            message: "profilepic changed successfully",
            profilePic: user?.profilePic,
        });
    });
    changePassword = asyncHandler(async (req, res, next) => {
        const { error, value } = changePasswordSchema.validate(req.body);
        if (error)
            return next(error);
        const { oldPassword, newPassword } = value;
        const userId = res.locals.user.id;
        const user = await this.userRepsitory.findOneBy({
            id: userId,
        });
        if (!user) {
            return next(new AppError("user not found", 404));
        }
        const isCorrectPassword = await comparePassword(oldPassword, user.password);
        if (!isCorrectPassword) {
            return next(new AppError("incorrect old password", 400));
        }
        const hashedPassword = await hashPassword(newPassword);
        await this.userRepsitory.update({ id: userId }, { password: hashedPassword });
        res.status(200).json({
            success: true,
            message: "password changed successfully",
        });
    });
    privateProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "account updated to private",
            isPrivate: updatedUser.isPrivate,
        });
    });
    publicProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "account updated to public",
            isPrivate: updatedUser.isPrivate,
        });
    });
    deleteProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        await this.userRepsitory.delete({ id: userId });
        res.status(200).json({
            success: true,
            message: "account deleted successfully",
        });
    });
    deActivateProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
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
        const updatedUser = result.raw[0];
        res.status(200).json({
            success: true,
            message: "account deactivated successfully",
            isActive: updatedUser.isActive,
        });
    });
    reActivateProfile = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        await this.userRepsitory.update({ id: userId }, { isActive: true });
        const user = await this.userRepsitory.findOneBy({ id: userId });
        res.status(200).json({
            success: true,
            message: "account reactivated successfully",
            user: {
                id: user?.id,
                userName: user?.userName,
                isActive: user?.isActive,
            },
        });
    });
    suggestedUsers = asyncHandler(async (req, res, next) => {
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
            message: suggestedUsers.length > 0 ? "suggested users" : "no suggested users",
            data: usersData,
        });
    });
}
