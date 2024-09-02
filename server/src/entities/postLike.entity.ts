import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
  Index,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./post.entity";
import { Users } from "./user.entity";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  liked_at!: Date;

  @ManyToOne(() => Post, (post) => post.postlikes, {
    onDelete: "CASCADE",
  })
  @Index()
  post!: Relation<Post>;

  @ManyToOne(() => Users, (users) => users.postLikes, {
    onDelete: "CASCADE",
  })
  @Index()
  user!: Relation<Users>;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
