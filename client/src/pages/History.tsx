import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import { PriorityBadge } from "@/components/PriorityBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Status } from "@/types/task";
import { ClipboardList } from "lucide-react";

const statusLabel: Record<Status, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function formatTs(iso: string) {
  try {
    return format(parseISO(iso), "MMM d, yyyy HH:mm");
  } catch {
    return iso;
  }
}

function formatDue(due: string | null) {
  if (!due) return "—";
  try {
    return format(
      parseISO(due.length === 10 ? `${due}T12:00:00` : due),
      "MMM d, yyyy",
    );
  } catch {
    return due;
  }
}

export default function History() {
  const { tasks, isLoading } = useTasks();

  const rows = useMemo(
    () =>
      [...tasks].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      ),
    [tasks],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Task history</h2>
        <p className="text-sm text-muted-foreground">
          All your tasks in one table.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading tasks…</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            No tasks yet
          </p>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Title</TableHead>
                <TableHead className="min-w-[180px] max-w-[280px]">
                  Description
                </TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell
                    className="max-w-[280px] truncate text-muted-foreground"
                    title={task.description}
                  >
                    {task.description || "—"}
                  </TableCell>
                  <TableCell>{formatDue(task.due_date)}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>{statusLabel[task.status]}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                    {formatTs(task.created_at)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                    {formatTs(task.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
