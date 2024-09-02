import { FollowRequest } from "../entities/followRequest.entity.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { AppError } from "./AppError.js";
import { Follower } from "../entities/follower.entity.js";
export class FollowUtils {
    static get followRequestRepository() {
        return AppDataSource.getRepository(FollowRequest);
    }
    static get followerRepository() {
        return AppDataSource.getRepository(Follower);
    }
    static async ensureNoPendingFollowRequest(senderId, receiverId) {
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
    static async ensureNotAlreadyFollowing(followerId, followingId) {
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
    static async getPendingFollowRequestByUserId(userId, followRequestId) {
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
    static async getPendingFollowRequestByReceiverId(userId, followRequestId) {
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
    static async getFollowerRelation(currentUserId, unfollowedUserId) {
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
