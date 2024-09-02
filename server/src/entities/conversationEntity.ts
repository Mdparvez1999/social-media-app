import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
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
  participants!: Relation<Users>[];

  @OneToMany(() => Message, (message) => message.conversation, {
    onDelete: "CASCADE",
  })
  messages!: Relation<Message>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: false })
  isGroup!: boolean;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
