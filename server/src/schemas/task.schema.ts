import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);
export const statusSchema = z.enum(["todo", "in_progress", "done"]);

const optionalDueDate = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.union([z.string(), z.null()]),
).refine((v) => v === null || !Number.isNaN(Date.parse(v)), { message: "Invalid due_date" });

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string(),
  due_date: optionalDueDate,
  priority: prioritySchema,
  status: statusSchema,
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
