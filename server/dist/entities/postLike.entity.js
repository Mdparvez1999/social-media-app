var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, CreateDateColumn, Index, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity.js";
import { Users } from "./user.entity.js";
let PostLike = class PostLike {
    id;
    liked_at;
    post;
    user;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], PostLike.prototype, "id", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PostLike.prototype, "liked_at", void 0);
__decorate([
    ManyToOne(() => Post, (post) => post.postlikes, {
        onDelete: "CASCADE",
    }),
    Index(),
    __metadata("design:type", Object)
], PostLike.prototype, "post", void 0);
__decorate([
    ManyToOne(() => Users, (users) => users.postLikes, {
        onDelete: "CASCADE",
    }),
    Index(),
    __metadata("design:type", Object)
], PostLike.prototype, "user", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostLike.prototype, "addId", null);
PostLike = __decorate([
    Entity()
], PostLike);
export { PostLike };
