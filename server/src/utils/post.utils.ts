import { Comments } from "../entities/comments.entity";
import { AppDataSource } from "../config/DB_Connection";
import { Post } from "../entities/post.entity";
import { AppError } from "./AppError";

export class PostUtils {
  private static postRepository = AppDataSource.getRepository(Post);
  private static commentRepository = AppDataSource.getRepository(Comments);

  public static async findPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!post) {
      throw new AppError("post not found", 404);
    }

    return post;
  }

  public static async checkPostExists(id: string): Promise<void> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new AppError("post not found", 404);
    }
  }

  public static async ensurePostWithPostIdAndUserIdExists(
    postId: string,
    userId: string
  ): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: { user: true },
    });

    if (!post) {
      throw new AppError("post not found", 404);
    }
  }

  public static async findPostWithPostIdAndUserId(
    postId: string,
    userId: string
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: { user: true },
    });

    if (!post) {
      throw new AppError("post not found", 404);
    }

    return post;
  }

  public static async findCommentByCommentId(id: string): Promise<Comments> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["post", "user"],
    });

    if (!comment) {
      throw new AppError("comment not found", 404);
    }

    return comment;
  }

  public static async findCommentByUserIdAndCommentId(
    userId: string,
    commentId: string
  ): Promise<Comments> {
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
