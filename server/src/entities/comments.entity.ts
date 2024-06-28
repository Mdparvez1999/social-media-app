import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity";
import { Users } from "./user.entity";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  comment!: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post!: Post;

  @ManyToOne(() => Users, (users) => users.comments, { onDelete: "CASCADE" })
  user!: Users;

  @CreateDateColumn()
  commentedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
