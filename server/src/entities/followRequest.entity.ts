import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  BeforeInsert,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity";

@Entity()
export class FollowRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: ["pending", "accepted"],
    default: "pending",
  })
  status!: "pending" | "accepted";

  @ManyToOne(() => Users, (user) => user.sentFollowRequest, {
    onDelete: "CASCADE",
  })
  requestedUser!: Relation<Users>;

  @ManyToOne(() => Users, (user) => user.recievedFollowRequest, {
    onDelete: "CASCADE",
  })
  receivedUser!: Relation<Users>;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
