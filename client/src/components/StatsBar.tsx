import type { Task } from "@/types/task";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface StatsBarProps {
  tasks: Task[];
}

export function StatsBar({ tasks }: StatsBarProps) {
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const stats = [
    { label: "To Do", count: todo, icon: Circle, color: "text-muted-foreground" },
    { label: "In Progress", count: inProgress, icon: Clock, color: "text-primary" },
    { label: "Done", count: done, icon: CheckCircle2, color: "text-[hsl(var(--status-done))]" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          <s.icon className={`h-5 w-5 ${s.color}`} />
          <div>
            <p className="text-2xl font-bold text-card-foreground">{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
