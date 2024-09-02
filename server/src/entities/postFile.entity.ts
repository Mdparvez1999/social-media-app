import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  Index,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity";

@Entity()
export class PostFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  type!: string;

  @ManyToOne(() => Post, (post) => post.files, { onDelete: "CASCADE" })
  @Index()
  post!: Relation<Post>;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
