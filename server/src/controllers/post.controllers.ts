import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { postSchema } from "../validation/post.validation";
import { AppDataSource } from "../config/DB_Connection";
import { Post } from "../entities/post.entity";
import { PostFile } from "../entities/postFile.entity";
import { AppError } from "../utils/AppError";
import { PostLike } from "../entities/postLike.entity";
import { Users } from "../entities/user.entity";
import { UserUtils } from "../utils/user.utils";
import { PostUtils } from "../utils/post.utils";
import { NotificationUtils } from "../utils/notification.utils";
import { Follower } from "../entities/follower.entity";
import { In } from "typeorm";

export class PostControllers {
  private postRepository = AppDataSource.getRepository(Post);

  private postFileRepository = AppDataSource.getRepository(PostFile);

  private postLikeRepository = AppDataSource.getRepository(PostLike);

  private user = AppDataSource.getRepository(Users);

  private followerRepository = AppDataSource.getRepository(Follower);

  public createPost = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { error, value } = postSchema.validate(req.body);

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return next(new AppError("please write something", 400));
      }

      if (error) {
        return next(error);
      }

      const { caption } = value;

      const userId: string = res.locals.user.id;

      const user: Users | null = (await UserUtils.findUserById(
        userId
      )) as Users;

      const newPost = new Post();

      newPost.caption = caption;
      newPost.user = user;

      await this.postRepository.save(newPost);

      const postFiles = files.map((file) => {
        const postFile = new PostFile();

        postFile.fileName = file.filename;
        postFile.type = file.mimetype.split("/")[1];
        postFile.post = newPost;

        return postFile;
      });

      await this.postFileRepository.save(postFiles);

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
    }
  );

  public updatePostCaption = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const userId: string = res.locals.user.id;

      await PostUtils.ensurePostWithPostIdAndUserIdExists(postId, userId);

      const caption: string = req.body.caption;

      const result: any = await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({ caption })
        .where("id = :postId AND user.id = :userId", { postId, userId })
        .returning("*")
        .execute();

      const updatedPost: Post = result.raw[0];

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    }
  );

  public deletePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const post: Post | null = await PostUtils.findPostWithPostIdAndUserId(
        postId,
        userId
      );

      if (post.user.id !== userId && user.role !== "admin") {
        return next(new AppError("unauthorized", 401));
      }

      await AppDataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(PostFile, {
          post: { id: postId },
        });

        await transactionalEntityManager.delete(Post, {
          id: postId,
          user: { id: userId },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    }
  );

  public getAllPosts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const allPosts = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: { files: true },
      });

      if (!allPosts || allPosts.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No posts found",
          data: [],
        });
      }

      const posts = allPosts.map((post) => {
        return {
          ...post,
          files: post.files.map((file) => file.fileName),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    }
  );
  public getAllPostsByUserId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = req.params.id;

      const allPosts = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: { files: true },
      });

      if (!allPosts || allPosts.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No posts found",
          data: [],
        });
      }

      const posts = allPosts.map((post) => {
        return {
          ...post,
          files: post.files.map((file) => file.fileName),
        };
      });

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    }
  );

  public getPostById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const post: Post | null = await PostUtils.findPostWithPostIdAndUserId(
        postId,
        userId
      );

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    }
  );

  public getPostByIdAndUserId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const userId: string = req.query.userId as string;

      const post: Post | null = await PostUtils.findPostWithPostIdAndUserId(
        postId,
        userId
      );

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    }
  );

  public likePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const post: Post | null = await PostUtils.findPostById(postId);

      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const alreadyLiked = await this.postLikeRepository.findOneBy({
        post: { id: postId },
        user: { id: userId },
      });

      if (alreadyLiked) {
        return res.status(200).json({
          success: true,
          message: "you have already liked this post",
          data: alreadyLiked,
        });
      }

      const postLike = new PostLike();

      postLike.isLiked = true;
      postLike.post = post;
      postLike.user = user;

      await this.postLikeRepository.save(postLike);

      post.likeCount = post.likeCount + 1;
      await this.postRepository.save(post);

      const type = "like";
      const message = `liked your post`;
      await NotificationUtils.createNotification(type, message, post.user.id);

      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        data: {
          id: postLike.id,
          isLiked: postLike.isLiked,
          liked_at: postLike.liked_at,
          post: post.id,
          user: {
            id: user.id,
            userName: user.userName,
            profilePic: user.profilePic,
          },
        },
      });
    }
  );

  public unlikePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      const userId: string = res.locals.user.id;

      const post: Post | null = await PostUtils.findPostById(postId);

      const likedPost = await this.postLikeRepository.findOneBy({
        post: { id: postId },
        user: { id: userId },
      });

      if (!likedPost) {
        return next(new AppError("Post not found", 404));
      }

      await this.postLikeRepository.delete({
        post: { id: postId },
        user: { id: userId },
      });

      if (post.likeCount > 0) {
        post.likeCount -= 1;
        await this.postRepository.save(post);
      }

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    }
  );

  public getPostLikes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;

      await PostUtils.checkPostExists(postId);

      const postLikes = await this.postLikeRepository.find({
        where: { post: { id: postId } },
        relations: { user: true },
      });

      if (!postLikes || postLikes.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No post likes found",
          data: [],
        });
      }

      const likedUser = postLikes.map((postLike) => {
        return {
          postLikeId: postLike.id,
          userid: postLike.user.id,
          isLiked: postLike.isLiked,
          likedAt: postLike.liked_at,
          username: postLike.user.userName,
          profilePic: postLike.user.profilePic,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Post likes fetched successfully",
        data: likedUser,
      });
    }
  );

  public userFeed = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id;

      const followingUser = await this.followerRepository.find({
        where: { followers: { id: userId } },
        relations: { following: true },
      });

      const followingUsersIds = followingUser.map((user) => {
        return user.following.id;
      });

      const post = await this.postRepository.find({
        where: { user: { id: In(followingUsersIds) } },
        relations: ["user", "files"],
        order: { createdAt: "DESC" },
      });

      if (!post || post.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No posts found",
          data: [],
        });
      }

      const responseData = post.map((post) => {
        return {
          id: post.id,
          caption: post.caption,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          files: post.files,
          createdAt: post.createdAt,
          user: {
            id: post.user.id,
            userName: post.user.userName,
            profilePic: post.user.profilePic,
          },
        };
      });

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: responseData,
      });
    }
  );

  public test = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "hello world",
    });
  });
}
