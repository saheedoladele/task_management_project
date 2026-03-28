import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Status } from "@/types/task";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const options: { value: Status; label: string; icon: typeof Circle }[] = [
  { value: "todo", label: "To Do", icon: Circle },
  { value: "in_progress", label: "In Progress", icon: Clock },
  { value: "done", label: "Done", icon: CheckCircle2 },
];

interface StatusSelectProps {
  value: Status;
  onChange: (v: Status) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Status)}>
      <SelectTrigger
        className="h-8 w-[130px] text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            <span className="flex items-center gap-1.5">
              <o.icon className="h-3.5 w-3.5" />
              {o.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
