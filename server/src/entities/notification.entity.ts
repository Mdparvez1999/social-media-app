import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Relation,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Users } from "./user.entity";

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  message!: string;

  @Column()
  type!: string;

  @Column({
    default: false,
  })
  isRead!: boolean;

  @ManyToOne(() => Users, (user) => user.sentNotifications, {
    onDelete: "CASCADE",
    eager: true,
  })
  sentBy!: Relation<Users>;

  @ManyToOne(() => Users, (user) => user.receivedNotifications, {
    onDelete: "CASCADE",
    eager: true,
  })
  receivedBy!: Relation<Users>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
