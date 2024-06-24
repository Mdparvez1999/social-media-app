import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostLike } from "./postLike.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    nullable: false,
  })
  userName!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    nullable: false,
  })
  DOB!: Date;

  @Column({
    nullable: false,
  })
  password!: string;

  @Column({
    type: "enum",
    enum: ["user", "admin"],
    default: "user",
  })
  role!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  profilePic!: string | null;

  @Column({
    nullable: false,
  })
  gender!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  isPrivate!: boolean;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: "text",
    nullable: true,
  })
  bio!: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  forgotPasswordToken!: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  forgotPasswordExpiry!: Date | null;

  @OneToMany(() => PostLike, (postlike) => postlike.user)
  postLikes!: PostLike[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
