var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostFile } from "./postFile.entity.js";
import { Comments } from "./comments.entity.js";
import { PostLike } from "./postLike.entity.js";
import { Users } from "./user.entity.js";
let Post = class Post {
    id;
    caption;
    likeCount;
    commentCount;
    user;
    files;
    postlikes;
    comments;
    createdAt;
    updatedAt;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Post.prototype, "id", void 0);
__decorate([
    Column({
        type: "text",
        nullable: true,
    }),
    __metadata("design:type", String)
], Post.prototype, "caption", void 0);
__decorate([
    Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], Post.prototype, "likeCount", void 0);
__decorate([
    Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], Post.prototype, "commentCount", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.posts, { onDelete: "CASCADE" }),
    Index(),
    __metadata("design:type", Object)
], Post.prototype, "user", void 0);
__decorate([
    OneToMany(() => PostFile, (postfile) => postfile.post, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "files", void 0);
__decorate([
    OneToMany(() => PostLike, (postlike) => postlike.post, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "postlikes", void 0);
__decorate([
    OneToMany(() => Comments, (comments) => comments.post, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    CreateDateColumn(),
    Index(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Post.prototype, "addId", null);
Post = __decorate([
    Entity()
], Post);
export { Post };
