import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity";

@Entity()
export class PostFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  path!: string;

  @Column()
  type!: string;

  @ManyToOne(() => Post, (post) => post.files)
  post!: Post;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
