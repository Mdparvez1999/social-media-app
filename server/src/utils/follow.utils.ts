import { FollowRequest } from "../entities/followRequest.entity";
import { AppDataSource } from "../config/DB_Connection";
import { AppError } from "./AppError";
import { Follower } from "../entities/follower.entity";

export class FollowUtils {
  private static get followRequestRepository() {
    return AppDataSource.getRepository(FollowRequest);
  }

  private static get followerRepository() {
    return AppDataSource.getRepository(Follower);
  }

  public static async ensureNoPendingFollowRequest(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    const followRequest = await this.followRequestRepository.findOne({
      where: {
        requestedUser: { id: senderId },
        receivedUser: { id: receiverId },
        status: "pending",
      },
    });

    if (followRequest) {
      throw new AppError("A follow request is already pending.", 400);
    }
  }

  public static async ensureNotAlreadyFollowing(
    followerId: string,
    followingId: string
  ): Promise<void> {
    const follower = await this.followerRepository.findOne({
      where: {
        followers: { id: followerId },
        following: { id: followingId },
      },
    });

    if (follower) {
      throw new AppError("Already following", 400);
    }
  }

  public static async getPendingFollowRequestByUserId(
    userId: string,
    followRequestId: string
  ): Promise<FollowRequest | null> {
    const followRequest = await this.followRequestRepository.findOne({
      where: {
        id: followRequestId,
        requestedUser: { id: userId },
        status: "pending",
      },
      relations: ["requestedUser", "receivedUser"],
    });

    if (!followRequest) {
      throw new AppError("Follow request not found", 404);
    }

    return followRequest;
  }

  public static async getPendingFollowRequestByReceiverId(
    userId: string,
    followRequestId: string
  ): Promise<FollowRequest | null> {
    console.log("getPendingFollowRequestByReceiverId", followRequestId);

    const followRequest = await this.followRequestRepository.findOne({
      where: {
        id: followRequestId,
        receivedUser: { id: userId },
        status: "pending",
      },
      relations: ["requestedUser", "receivedUser"],
    });

    if (!followRequest) {
      throw new AppError("Follow request not found", 404);
    }

    return followRequest;
  }

  public static async getFollowerRelation(
    currentUserId: string,
    unfollowedUserId: string
  ): Promise<Follower | null> {
    const follow = await this.followerRepository.findOne({
      where: {
        followers: { id: currentUserId },
        following: { id: unfollowedUserId },
      },
      relations: ["followers", "following"],
    });

    if (!follow) {
      throw new AppError("Follower relation not found", 404);
    }

    return follow;
  }
}
