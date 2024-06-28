import { FollowRequest } from "../entities/followRequest.entity";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { AppError } from "./AppError";
import { Follower } from "../entities/follower.entity";

export class FollowUtils {
  private static followRequestRepository =
    AppDataSource.getRepository(FollowRequest);

  private static followerRepository = AppDataSource.getRepository(Follower);

  public static async ensureNoPendingFollowRequest(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    const followRequest = await this.followRequestRepository.findOne({
      where: {
        requestedUser: { id: senderId },
        recievedUser: { id: receiverId },
        status: "pending",
      },
    });

    if (followRequest) {
      throw new AppError("Follow request already sent", 400);
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
        recievedUser: { id: userId },
        status: "pending",
      },
      relations: ["requestedUser", "recievedUser"],
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
    const followRequest = await this.followRequestRepository.findOne({
      where: {
        id: followRequestId,
        recievedUser: { id: userId },
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
