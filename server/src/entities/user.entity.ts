import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostLike } from "./postLike.entity";
import { Comments } from "./comments.entity";
import { Post } from "./post.entity";
import { Follower } from "./follower.entity";
import { FollowRequest } from "./followRequest.entity";
import { Notifications } from "./notification.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    nullable: false,
  })
  userName!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    nullable: true,
  })
  DOB!: Date;

  @Column({
    nullable: false,
  })
  password!: string;

  @Column({
    type: "enum",
    enum: ["user", "admin"],
    default: "user",
  })
  role!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  profilePic!: string | null;

  @Column({
    nullable: true,
  })
  gender!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  isPrivate!: boolean;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: "text",
    nullable: true,
  })
  bio!: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  forgotPasswordToken!: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  forgotPasswordExpiry!: Date | null;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts!: Post[];

  @OneToMany(() => PostLike, (postlike) => postlike.user, { cascade: true })
  postLikes!: PostLike[];

  @OneToMany(() => Comments, (comment) => comment.user, { cascade: true })
  comments!: Comments[];

  @OneToMany(() => Follower, (follower) => follower.followers, {
    cascade: true,
  })
  followers!: Follower[];

  @OneToMany(() => Follower, (follower) => follower.following, {
    cascade: true,
  })
  following!: Follower[];

  @OneToMany(
    () => FollowRequest,
    (followRequest) => followRequest.requestedUser,
    { cascade: true }
  )
  sentFollowRequest!: FollowRequest[];

  @OneToMany(
    () => FollowRequest,
    (followRequest) => followRequest.recievedUser,
    {
      cascade: true,
    }
  )
  recievedFollowRequest!: FollowRequest[];

  @OneToMany(() => Notifications, (notification) => notification.user, {
    cascade: true,
  })
  notifications!: Notifications[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
