import type { Task } from "../entities/task.entity.js";

/** `pg` often returns `DATE` as `YYYY-MM-DD` string, not a `Date` instance. */
function formatDueDate(value: Date | string | null | undefined): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

function toIsoTimestamp(value: Date | string): string {
  if (typeof value === "string") {
    return value;
  }
  return value.toISOString();
}

/** API shape matches frontend `Task` (ISO date strings). */
export function taskToJson(task: Task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    due_date: formatDueDate(task.due_date as Date | string | null),
    priority: task.priority,
    status: task.status,
    created_at: toIsoTimestamp(task.created_at as Date | string),
    updated_at: toIsoTimestamp(task.updated_at as Date | string),
  };
}
