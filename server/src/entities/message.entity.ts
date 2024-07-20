import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity";
import { Conversations } from "./conversationEntity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({})
  message!: string;

  @ManyToOne(() => Users, (user) => user.sentMessages, { onDelete: "CASCADE" })
  sender!: Users;

  @ManyToOne(() => Users, (user) => user.recievedMessages, {
    onDelete: "CASCADE",
  })
  reciever!: Users;

  @ManyToOne(() => Conversations, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  conversation!: Conversations;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
