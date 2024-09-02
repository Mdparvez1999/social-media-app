import { asyncHandler } from "../utils/asyncHandler.js";
import { postSchema } from "../validation/post.validation.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Post } from "../entities/post.entity.js";
import { PostFile } from "../entities/postFile.entity.js";
import { AppError } from "../utils/AppError.js";
import { PostLike } from "../entities/postLike.entity.js";
import { Users } from "../entities/user.entity.js";
import { UserUtils } from "../utils/user.utils.js";
import { PostUtils } from "../utils/post.utils.js";
import { NotificationUtils } from "../utils/notification.utils.js";
import { Follower } from "../entities/follower.entity.js";
import { In } from "typeorm";
export class PostControllers {
    get postRepository() {
        return AppDataSource.getRepository(Post);
    }
    get postFileRepository() {
        return AppDataSource.getRepository(PostFile);
    }
    get postLikeRepository() {
        return AppDataSource.getRepository(PostLike);
    }
    get user() {
        return AppDataSource.getRepository(Users);
    }
    get followerRepository() {
        return AppDataSource.getRepository(Follower);
    }
    createPost = asyncHandler(async (req, res, next) => {
        const { error, value } = postSchema.validate(req.body);
        const files = req.files;
        if (!files || files.length === 0) {
            return next(new AppError("please write something", 400));
        }
        if (error)
            return next(error);
        const { caption } = value;
        const userId = res.locals.user.id;
        const user = (await UserUtils.findUserById(userId));
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
    });
    updatePostCaption = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const userId = res.locals.user.id;
        await PostUtils.ensurePostWithPostIdAndUserIdExists(postId, userId);
        const caption = req.body.caption;
        const result = await this.postRepository
            .createQueryBuilder()
            .update(Post)
            .set({ caption })
            .where("id = :postId AND user.id = :userId", { postId, userId })
            .returning("*")
            .execute();
        const updatedPost = result.raw[0];
        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });
    });
    deletePost = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const userId = res.locals.user.id;
        const user = await UserUtils.findUserById(userId);
        const post = await PostUtils.findPostWithPostIdAndUserId(postId, userId);
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
    });
    getAllPosts = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        const allPosts = await this.postRepository.find({
            where: { user: { id: userId } },
            relations: ["files", "postlikes", "user", "postlikes.user"],
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
            message: allPosts.length === 0
                ? "No posts found"
                : "Posts fetched successfully",
            data: posts || [],
        });
    });
    getAllPostsByUserId = asyncHandler(async (req, res, next) => {
        const userId = req.params.id;
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
            message: allPosts.length === 0
                ? "No posts found"
                : "Posts fetched successfully",
            data: posts || [],
        });
    });
    getPostById = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const userId = res.locals.user.id;
        const post = await PostUtils.findPostWithPostIdAndUserId(postId, userId);
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
    });
    getPostByIdAndUserId = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const userId = req.query.userId;
        const post = await PostUtils.findPostWithPostIdAndUserId(postId, userId);
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
    });
    likePost = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        // Find the post by its ID
        const post = await PostUtils.findPostById(postId);
        // Get the ID of the currently authenticated user
        const userId = res.locals.user.id;
        // Find the user who is liking the post
        const user = await UserUtils.findUserById(userId);
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
        await NotificationUtils.createNotification(type, message, user, // sentBy
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
    });
    unlikePost = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const userId = res.locals.user.id;
        const post = await PostUtils.findPostById(postId);
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
    });
    getPostLikes = asyncHandler(async (req, res, next) => {
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
            message: postLikes.length === 0
                ? "No likes found"
                : "Post likes fetched successfully",
            data: likedUser || [],
        });
    });
    userFeed = asyncHandler(async (req, res, next) => {
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
        });
        return res.status(200).json({
            success: true,
            message: post.length === 0 ? "No posts found" : "Posts fetched successfully",
            data: responseData || [],
        });
    });
    getSingleFeedPost = asyncHandler(async (req, res, next) => {
        const postId = req.params.id;
        const post = await PostUtils.findPostById(postId);
        const userId = post?.user.id;
        const feedPost = await PostUtils.findPostWithPostIdAndUserId(postId, userId);
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
    });
}
