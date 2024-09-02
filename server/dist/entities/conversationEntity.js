var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity.js";
import { Message } from "./message.entity.js";
let Conversations = class Conversations {
    id;
    title;
    participants;
    messages;
    createdAt;
    updatedAt;
    isGroup;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Conversations.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Conversations.prototype, "title", void 0);
__decorate([
    ManyToMany(() => Users, (user) => user.conversations, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Conversations.prototype, "participants", void 0);
__decorate([
    OneToMany(() => Message, (message) => message.conversation, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Conversations.prototype, "messages", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Conversations.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Conversations.prototype, "updatedAt", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Conversations.prototype, "isGroup", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Conversations.prototype, "addId", null);
Conversations = __decorate([
    Entity()
], Conversations);
export { Conversations };
