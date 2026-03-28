import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity.js";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 500 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "date", nullable: true })
  due_date!: Date | null;

  @Column({ type: "enum", enum: ["low", "medium", "high"] })
  priority!: TaskPriority;

  @Column({ type: "enum", enum: ["todo", "in_progress", "done"] })
  status!: TaskStatus;

  /** Every task belongs to exactly one user (FK `user_id`, NOT NULL). */
  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
