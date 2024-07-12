import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { AppError } from "../utils/AppError";
import { FollowRequest } from "../entities/followRequest.entity";
import { Follower } from "../entities/follower.entity";
import { FollowUtils } from "../utils/follow.utils";
import { UserUtils } from "../utils/user.utils";
import { NotificationUtils } from "../utils/notification.utils";

export class FollowController {
  private followerRepository = AppDataSource.getRepository(Follower);

  private followRequestRepository = AppDataSource.getRepository(FollowRequest);

  public followUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const recieverId: string = req.params.id;
      const senderId: string = res.locals.user.id;

      if (recieverId === senderId) {
        return next(new AppError("you can't follow yourself", 400));
      }

      const reqSenderUser: Users | null = await UserUtils.findUserById(
        senderId
      );

      const reqReciverUser: Users | null = await UserUtils.findUserById(
        recieverId
      );

      if (reqReciverUser.isPrivate) {
        await FollowUtils.ensureNoPendingFollowRequest(senderId, recieverId);

        const followRequest = new FollowRequest();

        followRequest.requestedUser = reqSenderUser;
        followRequest.recievedUser = reqReciverUser;

        await this.followRequestRepository.save(followRequest);

        const type = "followRequest";
        const message = `sent you a request`;

        await NotificationUtils.createNotification(type, message, recieverId);

        return res.status(200).json({
          status: "success",
          message: "request sent successfully",
        });
      }

      await FollowUtils.ensureNotAlreadyFollowing(senderId, recieverId);

      const follower = new Follower();

      follower.followers = reqSenderUser;
      follower.following = reqReciverUser;

      await this.followerRepository.save(follower);

      const type = "follow";
      const message = `followed you`;
      await NotificationUtils.createNotification(type, message, recieverId);

      return res.status(200).json({
        status: "success",
        message: "followed successfully",
      });
    }
  );

  public acceptFollowRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const followRequestId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const followRequest: FollowRequest | null =
        (await FollowUtils.getPendingFollowRequestByUserId(
          userId,
          followRequestId
        )) as FollowRequest;

      await FollowUtils.ensureNotAlreadyFollowing(
        followRequest.requestedUser.id,
        followRequest.recievedUser.id
      );

      const follower = new Follower();

      follower.followers = followRequest.requestedUser;
      follower.following = followRequest.recievedUser;

      await AppDataSource.transaction(async (entityTransactionalManager) => {
        await entityTransactionalManager.save(follower);
        followRequest.status = "accepted";
        await entityTransactionalManager.save(followRequest);
      });

      const type = "follow";
      const message = `accepted your request`;
      await NotificationUtils.createNotification(
        type,
        message,
        followRequest.requestedUser.id
      );

      return res.status(200).json({
        status: "success",
        message: "follow request accepted",
      });
    }
  );

  public getFollowRequests = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const allFollowRequests: FollowRequest[] =
        await this.followRequestRepository.find({
          where: {
            recievedUser: { id: userId },
            status: "pending",
          },
          relations: ["requestedUser"],
        });

      if (!allFollowRequests || allFollowRequests.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "no follow requests",
          data: [],
        });
      }

      const data = allFollowRequests.map((request) => {
        return {
          id: request.id,
          requestedUserId: request.requestedUser.id,
          requestedUserName: request.requestedUser.userName,
          requestedUserProfilePic: request.requestedUser.profilePic,
        };
      });

      return res.status(200).json({
        status: "success",
        message: "follow requests",
        data: {
          countOfFollowRequests: allFollowRequests.length,
          followRequests: data,
        },
      });
    }
  );

  public cancelFollowRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const followRequestId: string = req.params.id;

      const followRequest: FollowRequest | null =
        (await FollowUtils.getPendingFollowRequestByUserId(
          user.id,
          followRequestId
        )) as FollowRequest;

      if (followRequest.requestedUser.id !== user.id && user.role !== "admin") {
        return next(new AppError("unauthorized", 401));
      }
      await this.followRequestRepository.remove(followRequest);

      return res.status(200).json({
        status: "success",
        message: "follow request canceled",
      });
    }
  );

  public declineFollowRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const followRequestId: string = req.params.id;

      const followRequest: FollowRequest | null =
        (await FollowUtils.getPendingFollowRequestByReceiverId(
          user.id,
          followRequestId
        )) as FollowRequest;

      if (followRequest.recievedUser.id !== user.id && user.role !== "admin") {
        return next(new AppError("unauthorized", 401));
      }

      await this.followRequestRepository.remove(followRequest);

      return res.status(200).json({
        status: "success",
        message: "follow request deleted",
      });
    }
  );

  public unfollowUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUserId: string = res.locals.user.id;

      const unfollowedUserId: string = req.params.id;

      if (currentUserId === unfollowedUserId) {
        return next(new AppError("you can't unfollow yourself", 400));
      }

      await UserUtils.checkUserExists(currentUserId);

      await UserUtils.checkUserExists(unfollowedUserId);

      const follower = (await FollowUtils.getFollowerRelation(
        currentUserId,
        unfollowedUserId
      )) as Follower;

      await this.followerRepository.remove(follower);

      return res.status(200).json({
        status: "success",
        message: "unfollowed user successfully",
      });
    }
  );

  public getFollowers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const allFollowers = await this.followerRepository.find({
        where: {
          following: { id: userId },
        },
        relations: {
          followers: true,
        },
      });

      if (!allFollowers || allFollowers.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "no followers",
          data: [],
        });
      }

      const followers = allFollowers.map((follower) => {
        return {
          id: follower.followers.id,
          username: follower.followers.userName,
          profilePic: follower.followers.profilePic,
        };
      });

      return res.status(200).json({
        status: "success",
        message: "followers fetched successfully",
        data: {
          countOfFollowers: followers.length,
          followers: followers,
        },
      });
    }
  );

  public getFollowing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id;

      const allFollowingUsers = await this.followerRepository.find({
        where: {
          followers: { id: userId },
        },
        relations: { following: true },
      });

      if (!allFollowingUsers || allFollowingUsers.length === 0) {
        return res.status(200).json({
          status: " success",
          message: "no following users",
          data: [],
        });
      }

      const followingUsers = allFollowingUsers.map((following) => {
        return {
          id: following.following.id,
          username: following.following.userName,
          profilePic: following.following.profilePic,
        };
      });

      return res.status(200).json({
        status: "success",
        message: "following users fetched successfully",
        data: {
          countOfFollowingUsers: followingUsers.length,
          followingUsers: followingUsers,
        },
      });
    }
  );
}
