import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity";
import { Users } from "./user.entity";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  liked_at!: Date;

  @Column({
    default: false,
  })
  isLiked!: boolean;

  @ManyToOne(() => Post, (post) => post.postlikes, {
    onDelete: "CASCADE",
  })
  post!: Post;

  @ManyToOne(() => Users, (users) => users.postLikes, {
    onDelete: "CASCADE",
  })
  user!: Users;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
