import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { v4 as uuid } from "uuid";
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

  @ManyToOne(() => Users, (user) => user.notifications, {
    onDelete: "CASCADE",
    eager: true,
  })
  user!: Users;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  addId() {
    this.id = uuid();
  }
}
