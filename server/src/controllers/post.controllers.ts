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
import { AwsS3Utils } from "../utils/awsS3.utils";

export class PostControllers {
  private get postRepository() {
    return AppDataSource.getRepository(Post);
  }

  private get postFileRepository() {
    return AppDataSource.getRepository(PostFile);
  }

  private get postLikeRepository() {
    return AppDataSource.getRepository(PostLike);
  }

  private get user() {
    return AppDataSource.getRepository(Users);
  }

  private get followerRepository() {
    return AppDataSource.getRepository(Follower);
  }

  public createPost = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { error, value } = postSchema.validate(req.body);

      if (error) return next(error);

      const { caption, files } = value;

      const userId: string = res.locals.user.id;

      const user: Users | null = (await UserUtils.findUserById(
        userId
      )) as Users;

      const newPost = new Post();

      newPost.caption = caption;
      newPost.user = user;

      await this.postRepository.save(newPost);

      if (files && files.length > 0) {
        const postFiles = files.map((file: string) => {
          const sanitizedFile = file.replace(/[\s-_]/g, "");

          const postFile = new PostFile();

          postFile.fileName = sanitizedFile;
          postFile.type = sanitizedFile.split(".").pop() || "unknown";
          postFile.post = newPost;

          return postFile;
        });

        await this.postFileRepository.save(postFiles);
      }

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
        relations: [
          "files",
          "files.post",
          "postlikes",
          "user",
          "postlikes.user",
        ],
      });

      const posts = allPosts.map((post) => {
        return {
          ...post,
          files: post.files.map((file) => file.fileName),
          postlikes: post.postlikes.map((like) => ({
            postLikeId: like.id,
            likedAt: like.liked_at,
            postId: post.id,
            user: {
              id: like.user.id,
              userName: like.user.userName,
              profilePic: like.user.profilePic,
            },
          })),
          user: {
            id: post.user.id,
            userName: post.user.userName,
            profilePic: post.user.profilePic,
          },
        };
      });

      return res.status(200).json({
        success: true,
        message:
          allPosts.length === 0
            ? "No posts found"
            : "Posts fetched successfully",
        data: posts || [],
      });
    }
  );

  public getAllPostsByUserId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = req.params.id;

      const allPosts = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: ["files", "user", "postlikes", "postlikes.user"],
      });

      const posts = allPosts.map((post) => {
        return {
          ...post,
          files: post.files.map((file) => file.fileName),
          postlikes: post.postlikes.map((like) => ({
            postLikeId: like.id,
            likedAt: like.liked_at,
            postId: post.id,
            user: {
              id: like.user.id,
              userName: like.user.userName,
              profilePic: like.user.profilePic,
            },
          })),
          user: {
            id: post.user.id,
            userName: post.user.userName,
            profilePic: post.user.profilePic,
          },
        };
      });

      return res.status(200).json({
        success: true,
        message:
          allPosts.length === 0
            ? "No posts found"
            : "Posts fetched successfully",
        data: posts || [],
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

      const responseData = {
        id: post.id,
        caption: post.caption,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        files: post.files,
        postlikes: post.postlikes.map((like) => ({
          postLikeId: like.id,
          likedAt: like.liked_at,
          postId: post.id,
          user: {
            id: like.user.id,
            userName: like.user.userName,
            profilePic: like.user.profilePic,
          },
        })),
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          userName: post.user.userName,
          profilePic: post.user.profilePic,
        },
      };

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: responseData,
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

      const responseData = {
        id: post.id,
        caption: post.caption,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        files: post.files,
        postlikes: post.postlikes.map((like) => ({
          postLikeId: like.id,
          likedAt: like.liked_at,
          postId: post.id,
          user: {
            id: like.user.id,
            userName: like.user.userName,
            profilePic: like.user.profilePic,
          },
        })),
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          userName: post.user.userName,
          profilePic: post.user.profilePic,
        },
      };

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: responseData,
      });
    }
  );

  public likePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;

      // Find the post by its ID
      const post: Post | null = await PostUtils.findPostById(postId);

      // Get the ID of the currently authenticated user
      const userId: string = res.locals.user.id;

      // Find the user who is liking the post
      const user: Users | null = await UserUtils.findUserById(userId);

      // Check if the user has already liked the post
      const alreadyLiked = await this.postLikeRepository.findOneBy({
        post: { id: postId },
        user: { id: userId },
      });

      if (alreadyLiked) {
        return res.status(200).json({
          success: true,
          message: "You have already liked this post",
        });
      }

      // Create a new PostLike instance
      const postLike = new PostLike();
      postLike.post = post;
      postLike.user = user;

      // Save the like to the database
      await this.postLikeRepository.save(postLike);

      // Increment the like count on the post
      post.likeCount = post.likeCount + 1;
      await this.postRepository.save(post);

      // Create a notification for the post owner
      const type = "like";
      const message = `${user?.userName} liked your post`;

      await NotificationUtils.createNotification(
        type,
        message,
        user, // sentBy
        post.user // receivedBy
      );

      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        data: {
          postLikeId: postLike.id,
          likedAt: postLike.liked_at,
          postId: postId,
          user: {
            id: postLike.user.id,
            username: postLike.user.userName,
            profilePic: postLike.user.profilePic,
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

      const likedUser = postLikes.map((postLike) => {
        return {
          postLikeId: postLike.id,
          likedAt: postLike.liked_at,
          postId: postId,
          user: {
            id: postLike.user.id,
            username: postLike.user.userName,
            profilePic: postLike.user.profilePic,
          },
        };
      });

      return res.status(200).json({
        success: true,
        message:
          postLikes.length === 0
            ? "No likes found"
            : "Post likes fetched successfully",
        data: likedUser || [],
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
        relations: ["user", "files", "postlikes", "postlikes.user"],
        order: { createdAt: "DESC" },
      });

      const responseData = post.map((post) => {
        return {
          id: post.id,
          caption: post.caption,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          files: post.files.map((file) => file.fileName),
          postlikes: post.postlikes.map((like) => ({
            postLikeId: like.id,
            likedAt: like.liked_at,
            postId: post.id,
            user: {
              id: like.user.id,
              userName: like.user.userName,
              profilePic: like.user.profilePic,
            },
          })),
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
        message:
          post.length === 0 ? "No posts found" : "Posts fetched successfully",
        data: responseData || [],
      });
    }
  );

  public getSingleFeedPost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: string = req.params.id;
      const post = await PostUtils.findPostById(postId);

      const userId: string = post?.user.id;

      const feedPost: Post | null = await PostUtils.findPostWithPostIdAndUserId(
        postId,
        userId
      );

      const responseData = {
        id: feedPost.id,
        caption: feedPost.caption,
        likeCount: feedPost.likeCount,
        commentCount: feedPost.commentCount,
        files: feedPost.files,
        postlikes: feedPost.postlikes.map((like) => ({
          postLikeId: like.id,
          likedAt: like.liked_at,
          postId: post.id,
          user: {
            id: like.user.id,
            userName: like.user.userName,
            profilePic: like.user.profilePic,
          },
        })),
        createdAt: feedPost.createdAt,
        user: {
          id: feedPost.user.id,
          userName: feedPost.user.userName,
          profilePic: feedPost.user.profilePic,
        },
      };

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: responseData,
      });
    }
  );
}
