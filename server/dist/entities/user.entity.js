var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, ManyToMany, JoinTable, Index, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostLike } from "./postLike.entity.js";
import { Comments } from "./comments.entity.js";
import { Post } from "./post.entity.js";
import { Follower } from "./follower.entity.js";
import { FollowRequest } from "./followRequest.entity.js";
import { Notifications } from "./notification.entity.js";
import { Conversations } from "./conversationEntity.js";
import { Message } from "./message.entity.js";
let Users = class Users {
    id;
    userName;
    fullName;
    email;
    DOB;
    password;
    role;
    profilePic;
    gender;
    isPrivate;
    isActive;
    bio;
    forgotPasswordToken;
    forgotPasswordExpiry;
    posts;
    postLikes;
    comments;
    followers;
    following;
    sentFollowRequest;
    recievedFollowRequest;
    // Updated relationships for Notifications
    sentNotifications;
    receivedNotifications;
    sentMessages;
    recievedMessages;
    conversations;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    Column({
        nullable: false,
    }),
    Index(),
    __metadata("design:type", String)
], Users.prototype, "userName", void 0);
__decorate([
    Column({
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "fullName", void 0);
__decorate([
    Column({
        unique: true,
        nullable: false,
    }),
    Index(),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    Column({
        nullable: true,
    }),
    __metadata("design:type", Date)
], Users.prototype, "DOB", void 0);
__decorate([
    Column({
        nullable: false,
    }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user",
    }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    Column({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Users.prototype, "profilePic", void 0);
__decorate([
    Column({
        nullable: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "gender", void 0);
__decorate([
    Column({
        type: "boolean",
        default: false,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isPrivate", void 0);
__decorate([
    Column({
        type: "boolean",
        default: true,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isActive", void 0);
__decorate([
    Column({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Users.prototype, "bio", void 0);
__decorate([
    Column({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Users.prototype, "forgotPasswordToken", void 0);
__decorate([
    Column({
        type: "timestamp",
        nullable: true,
    }),
    __metadata("design:type", Object)
], Users.prototype, "forgotPasswordExpiry", void 0);
__decorate([
    OneToMany(() => Post, (post) => post.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "posts", void 0);
__decorate([
    OneToMany(() => PostLike, (postlike) => postlike.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "postLikes", void 0);
__decorate([
    OneToMany(() => Comments, (comment) => comment.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "comments", void 0);
__decorate([
    OneToMany(() => Follower, (follower) => follower.followers, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "followers", void 0);
__decorate([
    OneToMany(() => Follower, (follower) => follower.following, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "following", void 0);
__decorate([
    OneToMany(() => FollowRequest, (followRequest) => followRequest.requestedUser, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "sentFollowRequest", void 0);
__decorate([
    OneToMany(() => FollowRequest, (followRequest) => followRequest.receivedUser, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "recievedFollowRequest", void 0);
__decorate([
    OneToMany(() => Notifications, (notification) => notification.sentBy, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "sentNotifications", void 0);
__decorate([
    OneToMany(() => Notifications, (notification) => notification.receivedBy, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "receivedNotifications", void 0);
__decorate([
    OneToMany(() => Message, (message) => message.sender, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "sentMessages", void 0);
__decorate([
    OneToMany(() => Message, (message) => message.reciever, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "recievedMessages", void 0);
__decorate([
    ManyToMany(() => Conversations, (conversation) => conversation.participants, { cascade: true }),
    JoinTable(),
    __metadata("design:type", Array)
], Users.prototype, "conversations", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Users.prototype, "addId", null);
Users = __decorate([
    Entity()
], Users);
export { Users };
