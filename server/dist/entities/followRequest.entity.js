var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity.js";
let FollowRequest = class FollowRequest {
    id;
    status;
    requestedUser;
    receivedUser;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], FollowRequest.prototype, "id", void 0);
__decorate([
    Column({
        type: "enum",
        enum: ["pending", "accepted"],
        default: "pending",
    }),
    __metadata("design:type", String)
], FollowRequest.prototype, "status", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.sentFollowRequest, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], FollowRequest.prototype, "requestedUser", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.recievedFollowRequest, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], FollowRequest.prototype, "receivedUser", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FollowRequest.prototype, "addId", null);
FollowRequest = __decorate([
    Entity()
], FollowRequest);
export { FollowRequest };
