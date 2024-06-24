import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppDataSource } from "../config/DB_Connection";
import { Comments } from "../entities/comments.entity";
import { AppError } from "../utils/AppError";
import { Users } from "../entities/user.entity";
import { commentSchema } from "../validation/comments.validation";
import { Post } from "../entities/post.entity";

export class CommentsController {
  private postRepository = AppDataSource.getRepository(Post);
  private commentRepository = AppDataSource.getRepository(Comments);
  private userRepository = AppDataSource.getRepository(Users);

  public writeComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = commentSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const comment: string = value.comment;

      const postId: string = req.params.id;

      const post: Post | null = await this.postRepository.findOneBy({
        id: postId,
      });

      if (!post) {
        return next(new AppError("post not found", 404));
      }

      const userId: string = res.locals.user.id;

      const user: Users | null = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user) {
        return next(new AppError("user not found", 404));
      }

      const newComment = new Comments();

      newComment.comment = comment;
      newComment.post = post;
      newComment.user = user;

      await this.commentRepository.save(newComment);

      post.commentCount += 1;
      await this.postRepository.save(post);

      res.status(201).json({
        success: true,
        message: "comment created successfully",
        data: newComment,
      });
    }
  );

  public editComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = commentSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const { comment } = value;

      const commentId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const user: Users | null = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user) {
        return next(new AppError("user not found", 404));
      }

      const commentToEdit = await this.commentRepository.findOne({
        where: { id: commentId, user: { id: userId } },
        relations: { user: true },
      });

      if (!commentToEdit) {
        return next(new AppError("comment not found", 404));
      }

      const result = await this.commentRepository
        .createQueryBuilder()
        .update(commentToEdit)
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

      const user: Users | null = await this.userRepository.findOneBy({
        id: userId,
      });

      if (!user) {
        return next(new AppError("user not found", 404));
      }

      const commentToDelete: Comments | null =
        await this.commentRepository.findOne({
          where: { id: commentId },
          relations: ["user", "post"],
        });

      if (!commentToDelete) {
        return next(new AppError("comment not found", 404));
      }

      if (
        commentToDelete.user.id !== userId &&
        commentToDelete.post.user.id !== userId &&
        user.role !== "admin"
      ) {
        return next(new AppError("unauthorized", 401));
      }

      await this.commentRepository.remove(commentToDelete);

      commentToDelete.post.commentCount -= 1;
      await this.postRepository.save(commentToDelete.post);

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

      const post: Post | null = await this.postRepository.findOneBy({
        id: postId,
      });

      if (!post) {
        return next(new AppError("post not found", 404));
      }

      const comments: Comments[] = await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: { user: true },
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
