import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostFile } from "./postFile.entity";
import { Comments } from "./comments.entity";
import { PostLike } from "./postLike.entity";
import { Users } from "./user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  caption!: string;

  @Column({
    default: 0,
  })
  likeCount!: number;

  @Column({
    default: 0,
  })
  commentCount!: number;

  @ManyToOne(() => Users, (user) => user.posts, { onDelete: "CASCADE" })
  @Index()
  user!: Relation<Users>;

  @OneToMany(() => PostFile, (postfile) => postfile.post, { cascade: true })
  files!: Relation<PostFile>[];

  @OneToMany(() => PostLike, (postlike) => postlike.post, { cascade: true })
  postlikes!: Relation<PostLike>[];

  @OneToMany(() => Comments, (comments) => comments.post, { cascade: true })
  comments!: Relation<Comments>[];

  @CreateDateColumn()
  @Index()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
