import { asyncHandler } from "../utils/asyncHandler.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Comments } from "../entities/comments.entity.js";
import { AppError } from "../utils/AppError.js";
import { commentSchema } from "../validation/comments.validation.js";
import { Post } from "../entities/post.entity.js";
import { UserUtils } from "../utils/user.utils.js";
import { PostUtils } from "../utils/post.utils.js";
import { NotificationUtils } from "../utils/notification.utils.js";
export class CommentsController {
    postRepository = AppDataSource.getRepository(Post);
    commentRepository = AppDataSource.getRepository(Comments);
    writeComment = asyncHandler(async (req, res, next) => {
        const { error, value } = commentSchema.validate(req.body);
        if (error)
            return next(error);
        const comment = value.comment;
        const postId = req.params.id;
        // Find the post by its ID
        const post = (await PostUtils.findPostById(postId));
        // Get the ID of the currently authenticated user
        const userId = res.locals.user.id;
        // Find the user who is writing the comment
        const user = await UserUtils.findUserById(userId);
        // Create a new Comment instance
        const newComment = new Comments();
        newComment.comment = comment;
        newComment.post = post;
        newComment.user = user;
        // Save the comment to the database
        await this.commentRepository.save(newComment);
        // Increment the comment count on the post
        post.commentCount += 1;
        await this.postRepository.save(post);
        // Create a notification for the post owner
        const type = "comment";
        const message = `${user?.userName} commented on your post`;
        await NotificationUtils.createNotification(type, message, user, // sentBy
        post.user // receivedBy
        );
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: {
                id: newComment.id,
                comment: newComment.comment,
                commentedAt: newComment.commentedAt,
                postId: newComment.post.id,
                user: {
                    id: newComment.user.id,
                    userName: newComment.user.userName,
                    profilePic: newComment.user.profilePic,
                },
            },
        });
    });
    editComment = asyncHandler(async (req, res, next) => {
        const { error, value } = commentSchema.validate(req.body);
        if (error)
            return next(error);
        const { comment } = value;
        const commentId = req.params.id;
        const userId = res.locals.user.id;
        const user = await UserUtils.findUserById(userId);
        const commentToEdit = await PostUtils.findCommentByUserIdAndCommentId(userId, commentId);
        if (commentToEdit.user.id !== userId && user.role !== "admin") {
            return next(new AppError("unauthorized", 401));
        }
        const result = await this.commentRepository
            .createQueryBuilder()
            .update(Comments)
            .set({ comment: comment })
            .where("id= :id AND userId= :userId", {
            id: commentId,
            userId: userId,
        })
            .returning("*")
            .execute();
        const updatedComment = result.raw[0];
        res.status(200).json({
            success: true,
            message: "comment updated successfully",
            data: updatedComment,
        });
    });
    deleteComment = asyncHandler(async (req, res, next) => {
        const commentId = req.params.id;
        const userId = res.locals.user.id;
        const user = await UserUtils.findUserById(userId);
        const commentToDelete = await PostUtils.findCommentByCommentId(commentId);
        if (commentToDelete.user.id !== userId &&
            commentToDelete.post.user.id !== userId &&
            user.role !== "admin") {
            return next(new AppError("unauthorized", 401));
        }
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.remove(commentToDelete);
            commentToDelete.post.commentCount -= 1;
            await this.postRepository.save(commentToDelete.post);
        });
        res.status(200).json({
            success: true,
            message: "comment deleted successfully",
            data: commentToDelete,
        });
    });
    getAllComments = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        await PostUtils.checkPostExists(postId);
        const comments = await this.commentRepository.find({
            where: { post: { id: postId } },
            relations: { user: true },
            order: { commentedAt: "DESC" },
        });
        if (!comments || comments.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No comments found",
                data: [],
            });
        }
        const commentsWithUser = comments.map((comment) => {
            return {
                ...comment,
                user: {
                    id: comment.user.id,
                    userName: comment.user.userName,
                    profilePic: comment.user.profilePic,
                },
            };
        });
        res.status(200).json({
            success: true,
            message: "comments fetched successfully",
            data: commentsWithUser,
        });
    });
}
