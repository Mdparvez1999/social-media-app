import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Comments } from "../entities/comments.entity";
import { AppError } from "../utils/AppError";
import { Users } from "../entities/user.entity";
import { commentSchema } from "../validation/comments.validation";
import { Post } from "../entities/post.entity";
import { UserUtils } from "../utils/user.utils";
import { PostUtils } from "../utils/post.utils";
import { NotificationUtils } from "../utils/notification.utils";

export class CommentsController {
  private postRepository = AppDataSource.getRepository(Post);
  private commentRepository = AppDataSource.getRepository(Comments);

  public writeComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = commentSchema.validate(req.body);

      if (error) return next(error);

      const comment: string = value.comment;

      const postId: string = req.params.id;

      // Find the post by its ID
      const post: Post | null = (await PostUtils.findPostById(postId)) as Post;

      // Get the ID of the currently authenticated user
      const userId: string = res.locals.user.id;

      // Find the user who is writing the comment
      const user: Users | null = await UserUtils.findUserById(userId);

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

      await NotificationUtils.createNotification(
        type,
        message,
        user, // sentBy
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
    }
  );

  public editComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = commentSchema.validate(req.body);

      if (error) return next(error);

      const { comment } = value;

      const commentId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const commentToEdit = await PostUtils.findCommentByUserIdAndCommentId(
        userId,
        commentId
      );

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
    }
  );

  public deleteComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const commentId: string = req.params.id;
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const commentToDelete: Comments | null =
        await PostUtils.findCommentByCommentId(commentId);

      if (
        commentToDelete.user.id !== userId &&
        commentToDelete.post.user.id !== userId &&
        user.role !== "admin"
      ) {
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
    }
  );

  public getAllComments = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      await PostUtils.checkPostExists(postId);

      const comments: Comments[] = await this.commentRepository.find({
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
    }
  );
}
