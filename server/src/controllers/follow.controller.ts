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
  private get followerRepository() {
    return AppDataSource.getRepository(Follower);
  }

  private get followRequestRepository() {
    return AppDataSource.getRepository(FollowRequest);
  }

  private get userRepository() {
    return AppDataSource.getRepository(Users);
  }

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

      if (!reqSenderUser || !reqReciverUser) {
        return next(new AppError("User not found", 404));
      }

      if (reqReciverUser.isPrivate) {
        await FollowUtils.ensureNoPendingFollowRequest(senderId, recieverId);

        const followRequest = new FollowRequest();
        followRequest.requestedUser = reqSenderUser;
        followRequest.receivedUser = reqReciverUser;

        await this.followRequestRepository.save(followRequest);

        const type = "followRequest";
        const message = `${reqSenderUser.userName} sent you a request`;

        await NotificationUtils.createNotification(
          type,
          message,
          reqSenderUser,
          reqReciverUser
        );

        return res.status(200).json({
          status: "success",
          message: "Request sent successfully",
          data: {
            id: followRequest.id,
            status: followRequest.status,
            requestedUser: {
              id: followRequest.requestedUser.id,
              username: followRequest.requestedUser.userName,
              profilePic: followRequest.requestedUser.profilePic,
            },
            recievedUser: {
              id: followRequest.receivedUser.id,
              username: followRequest.receivedUser.userName,
              profilePic: followRequest.receivedUser.profilePic,
            },
          },
        });
      }

      await FollowUtils.ensureNotAlreadyFollowing(senderId, recieverId);

      const follower = new Follower();
      follower.followers = reqSenderUser;
      follower.following = reqReciverUser;

      await this.followerRepository.save(follower);

      const type = "follow";
      const message = `${reqSenderUser.userName} followed you`;

      await NotificationUtils.createNotification(
        type,
        message,
        reqSenderUser,
        reqReciverUser
      );

      return res.status(200).json({
        status: "success",
        message: "Followed successfully",
        data: {
          follower: {
            id: follower.followers.id,
            username: follower.followers.userName,
            fullName: follower.followers.fullName,
            profilePic: follower.followers.profilePic,
          },
          following: {
            id: follower.following.id,
            username: follower.following.userName,
            fullName: follower.following.fullName,
            profilePic: follower.following.profilePic,
          },
        },
      });
    }
  );

  public acceptFollowRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const followRequestId: string = req.params.id;
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const followRequest: FollowRequest | null =
        (await FollowUtils.getPendingFollowRequestByReceiverId(
          userId,
          followRequestId
        )) as FollowRequest;

      if (!followRequest) {
        return next(new AppError("Follow request not found", 404));
      }

      await FollowUtils.ensureNotAlreadyFollowing(
        followRequest.requestedUser.id,
        followRequest.receivedUser.id
      );

      const follower = new Follower();
      follower.followers = followRequest.requestedUser;
      follower.following = followRequest.receivedUser;

      await AppDataSource.transaction(async (entityTransactionalManager) => {
        await entityTransactionalManager.save(follower);
        followRequest.status = "accepted";
        await entityTransactionalManager.save(followRequest);
      });

      const type = "follow";
      const message = `${user.userName} accepted your follow request`;

      // Updated notification creation
      await NotificationUtils.createNotification(
        type,
        message,
        followRequest.receivedUser, // `sentBy`: the user who accepted the request
        followRequest.requestedUser // `receivedBy`: the user who sent the request
      );

      return res.status(200).json({
        status: "success",
        message: "Follow request accepted",
        follower: {
          id: follower.followers.id,
          username: follower.followers.userName,
          fullName: follower.followers.fullName,
          profilePic: follower.followers.profilePic,
        },
        following: {
          id: follower.following.id,
          username: follower.following.userName,
          fullName: follower.following.fullName,
          profilePic: follower.following.profilePic,
        },
      });
    }
  );

  public getFollowRequests = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const allFollowRequests: FollowRequest[] =
        await this.followRequestRepository.find({
          where: {
            receivedUser: { id: userId },
            status: "pending",
          },
          relations: ["requestedUser", "receivedUser"],
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
          requestedUser: {
            id: request.requestedUser.id,
            username: request.requestedUser.userName,
            profilePic: request.requestedUser.profilePic,
          },
          recievedUser: {
            id: request.receivedUser.id,
            username: request.receivedUser.userName,
            profilePic: request.receivedUser.profilePic,
          },
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

  public getSentRequests = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = req.params.id;

      const allSentRequests: FollowRequest[] =
        await this.followRequestRepository.find({
          where: {
            requestedUser: { id: userId },
            status: "pending",
          },
          relations: ["requestedUser", "receivedUser"],
        });

      if (!allSentRequests || allSentRequests.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "no sent requests",
          data: [],
        });
      }

      const data = allSentRequests.map((request) => {
        return {
          id: request.id,
          requestedUser: {
            id: request.requestedUser.id,
            userName: request.requestedUser.userName,
            profilePic: request.requestedUser.profilePic,
          },
          receivedUser: {
            id: request.receivedUser.id,
            userName: request.receivedUser.userName,
            profilePic: request.receivedUser.profilePic,
          },
        };
      });

      return res.status(200).json({
        status: "success",
        message: "sent requests",
        data: {
          countOfSentRequests: allSentRequests.length,
          sentRequests: data,
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

      if (followRequest.receivedUser.id !== user.id && user.role !== "admin") {
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
        data: {
          follower: {
            id: follower.followers.id,
            username: follower.followers.userName,
            fullName: follower.followers.fullName,
            profilePic: follower.followers.profilePic,
          },
          following: {
            id: follower.following.id,
            username: follower.following.userName,
            fullName: follower.following.fullName,
            profilePic: follower.following.profilePic,
          },
        },
      });
    }
  );

  public getFollowers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = req.params.id;

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
          userName: follower.followers.userName,
          fullName: follower.followers.fullName,
          profilePic: follower.followers.profilePic,
        };
      });

      return res.status(200).json({
        status: "success",
        message: "followers fetched successfully",
        data: followers,
      });
    }
  );

  public getFollowing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;

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
          userName: following.following.userName,
          fullName: following.following.fullName,
          profilePic: following.following.profilePic,
        };
      });

      return res.status(200).json({
        status: "success",
        message: "following users fetched successfully",
        data: followingUsers,
      });
    }
  );

  public searchUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id;

      const searchName = req.query.userName;

      if (searchName === "" || typeof searchName !== "string") {
        return next(new AppError("Invalid userName parameter", 400));
      }

      const users = await this.userRepository
        .createQueryBuilder("users")
        .where("users.userName LIKE :userName", {
          userName: `${searchName}%`,
        })
        .andWhere("users.id != :id", { id: userId })
        .select(["users.id", "users.userName", "users.profilePic"])
        .getMany();

      if (!users || users.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      res.status(200).json({
        success: true,
        message: "users fetched successfully",
        data: users,
      });
    }
  );

  public getUsersProfileById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = req.params.id;

      const user: Users | null = await this.userRepository.findOne({
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
          id: user.id,
          userName: user.userName,
          fullName: user.fullName,
          profilePic: user.profilePic,
          bio: user.bio,
          postsCount: user.posts.length,
          followersCount: user.following.length,
          followingCount: user.followers.length,
        },
      });
    }
  );
}
