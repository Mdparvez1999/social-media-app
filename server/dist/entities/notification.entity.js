var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, UpdateDateColumn, ManyToOne, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity.js";
let Notifications = class Notifications {
    id;
    message;
    type;
    isRead;
    sentBy;
    receivedBy;
    createdAt;
    updatedAt;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Notifications.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Notifications.prototype, "message", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Notifications.prototype, "type", void 0);
__decorate([
    Column({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Notifications.prototype, "isRead", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.sentNotifications, {
        onDelete: "CASCADE",
        eager: true,
    }),
    __metadata("design:type", Object)
], Notifications.prototype, "sentBy", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.receivedNotifications, {
        onDelete: "CASCADE",
        eager: true,
    }),
    __metadata("design:type", Object)
], Notifications.prototype, "receivedBy", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Notifications.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Notifications.prototype, "updatedAt", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Notifications.prototype, "addId", null);
Notifications = __decorate([
    Entity()
], Notifications);
export { Notifications };
