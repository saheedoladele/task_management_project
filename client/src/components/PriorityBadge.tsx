import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types/task";

const config: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className:
      "bg-[hsl(var(--priority-high))] text-white hover:bg-[hsl(var(--priority-high))]/90 border-transparent",
  },
  medium: {
    label: "Medium",
    className:
      "bg-[hsl(var(--priority-medium))] text-white hover:bg-[hsl(var(--priority-medium))]/90 border-transparent",
  },
  low: {
    label: "Low",
    className:
      "bg-[hsl(var(--priority-low))] text-white hover:bg-[hsl(var(--priority-low))]/90 border-transparent",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority];
  return <Badge className={c.className}>{c.label}</Badge>;
}
