var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity.js";
import { Conversations } from "./conversationEntity.js";
let Message = class Message {
    id;
    message;
    sender;
    reciever;
    conversation;
    createdAt;
    updatedAt;
    addId() {
        this.id = uuidv4();
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.sentMessages, { onDelete: "CASCADE" }),
    __metadata("design:type", Object)
], Message.prototype, "sender", void 0);
__decorate([
    ManyToOne(() => Users, (user) => user.recievedMessages, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], Message.prototype, "reciever", void 0);
__decorate([
    ManyToOne(() => Conversations, (conversation) => conversation.messages, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], Message.prototype, "conversation", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Message.prototype, "addId", null);
Message = __decorate([
    Entity()
], Message);
export { Message };
