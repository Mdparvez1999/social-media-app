import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity";
import { Message } from "./message.entity";

@Entity()
export class Conversations {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  title!: string;

  @ManyToMany(() => Users, (user) => user.conversations, {
    onDelete: "CASCADE",
  })
  participants!: Users[];

  @OneToMany(() => Message, (message) => message.conversation, {
    onDelete: "CASCADE",
  })
  messages!: Message[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: false })
  isGroup!: boolean;

  addId() {
    this.id = uuidv4();
  }
}
