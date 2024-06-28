import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity";

@Entity()
export class Follower {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  requestSentAt!: Date;

  @CreateDateColumn()
  acceptedAt!: Date;

  @ManyToOne(() => Users, (user) => user.followers, {
    onDelete: "CASCADE",
  })
  followers!: Users;

  @ManyToOne(() => Users, (user) => user.following, {
    onDelete: "CASCADE",
  })
  following!: Users;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
