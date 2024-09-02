import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostLike } from "./postLike.entity";
import { Comments } from "./comments.entity";
import { Post } from "./post.entity";
import { Follower } from "./follower.entity";
import { FollowRequest } from "./followRequest.entity";
import { Notifications } from "./notification.entity";
import { Conversations } from "./conversationEntity";
import { Message } from "./message.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    nullable: false,
  })
  @Index()
  userName!: string;

  @Column({
    unique: true,
    nullable: true,
  })
  fullName!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @Index()
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
  posts!: Relation<Post>[];

  @OneToMany(() => PostLike, (postlike) => postlike.user, { cascade: true })
  postLikes!: Relation<PostLike>[];

  @OneToMany(() => Comments, (comment) => comment.user, { cascade: true })
  comments!: Relation<Comments>[];

  @OneToMany(() => Follower, (follower) => follower.followers, {
    cascade: true,
  })
  followers!: Relation<Follower>[];

  @OneToMany(() => Follower, (follower) => follower.following, {
    cascade: true,
  })
  following!: Relation<Follower>[];

  @OneToMany(
    () => FollowRequest,
    (followRequest) => followRequest.requestedUser,
    { cascade: true }
  )
  sentFollowRequest!: Relation<FollowRequest>[];

  @OneToMany(
    () => FollowRequest,
    (followRequest) => followRequest.receivedUser,
    {
      cascade: true,
    }
  )
  recievedFollowRequest!: Relation<FollowRequest>[];

  // Updated relationships for Notifications
  @OneToMany(() => Notifications, (notification) => notification.sentBy, {
    cascade: true,
  })
  sentNotifications!: Relation<Notifications>[];

  @OneToMany(() => Notifications, (notification) => notification.receivedBy, {
    cascade: true,
  })
  receivedNotifications!: Relation<Notifications>[];

  @OneToMany(() => Message, (message) => message.sender, { cascade: true })
  sentMessages!: Relation<Message>[];

  @OneToMany(() => Message, (message) => message.reciever, { cascade: true })
  recievedMessages!: Relation<Message>[];

  @ManyToMany(
    () => Conversations,
    (conversation) => conversation.participants,
    { cascade: true }
  )
  @JoinTable()
  conversations!: Relation<Conversations>[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
