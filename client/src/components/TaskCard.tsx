import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./PriorityBadge";
import { StatusSelect } from "./StatusSelect";
import type { Task, Status } from "@/types/task";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date && task.status !== "done" && new Date(task.due_date) < new Date();

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold text-card-foreground ${
                task.status === "done" ? "line-through opacity-60" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(task)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusSelect
            value={task.status}
            onChange={(s) => onStatusChange(task.id, s)}
          />
          {task.due_date && (
            <span
              className={`flex items-center gap-1 text-xs ${
                isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(task.due_date), "MMM d, yyyy")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
