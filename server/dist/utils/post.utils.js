import { Comments } from "../entities/comments.entity.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Post } from "../entities/post.entity.js";
import { AppError } from "./AppError.js";
export class PostUtils {
    static get postRepository() {
        return AppDataSource.getRepository(Post);
    }
    static get commentRepository() {
        return AppDataSource.getRepository(Comments);
    }
    static async findPostById(id) {
        if (!id)
            throw new AppError("Post id is required", 400);
        const post = await this.postRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!post) {
            throw new AppError("post not found", 404);
        }
        return post;
    }
    static async checkPostExists(id) {
        if (!id)
            throw new AppError("Post id is required", 400);
        const post = await this.postRepository.findOneBy({ id });
        if (!post) {
            throw new AppError("post not found", 404);
        }
    }
    static async ensurePostWithPostIdAndUserIdExists(postId, userId) {
        if (!postId || !userId)
            throw new AppError("post id and user id are required", 400);
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
            relations: { user: true },
        });
        if (!post) {
            throw new AppError("post not found", 404);
        }
    }
    static async findPostWithPostIdAndUserId(postId, userId) {
        if (!postId || !userId)
            throw new AppError("post id and user id are required", 400);
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ["files", "postlikes", "user", "postlikes.user"],
        });
        if (!post) {
            throw new AppError("post not found", 404);
        }
        return post;
    }
    static async findCommentByCommentId(id) {
        if (!id)
            throw new AppError("comment id is required", 400);
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ["post", "user"],
        });
        if (!comment) {
            throw new AppError("comment not found", 404);
        }
        return comment;
    }
    static async findCommentByUserIdAndCommentId(userId, commentId) {
        if (!userId || !commentId)
            throw new AppError("user id and comment id are required", 400);
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                user: { id: userId },
            },
            relations: { user: true },
        });
        if (!comment) {
            throw new AppError("comment not found", 404);
        }
        return comment;
    }
}
