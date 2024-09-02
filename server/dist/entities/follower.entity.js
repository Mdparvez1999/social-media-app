var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, CreateDateColumn, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity.js";
let Follower = class Follower {
    id;
    requestSentAt;
    acceptedAt;
    followers;
    following;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Follower.prototype, "id", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Follower.prototype, "requestSentAt", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Follower.prototype, "acceptedAt", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.followers, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], Follower.prototype, "followers", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.following, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], Follower.prototype, "following", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Follower.prototype, "addId", null);
Follower = __decorate([
    Entity()
], Follower);
export { Follower };
