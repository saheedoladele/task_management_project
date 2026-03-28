export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string;
}

export type TaskFormData = Omit<Task, "id" | "created_at" | "updated_at">;
