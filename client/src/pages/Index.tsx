import { useState, useMemo, useLayoutEffect, useCallback } from "react";
import { toast } from "sonner";
import { useDashboardLayout } from "@/contexts/dashboard-layout-context";
import { getApiErrorMessage } from "@/lib/api";
import { useTasks } from "@/hooks/useTasks";
import { StatsBar } from "@/components/StatsBar";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Task, TaskFormData, Status } from "@/types/task";
import { ClipboardList } from "lucide-react";

export default function Index() {
  const { setTaskHeaderControls } = useDashboardLayout();
  const { tasks, addTask, updateTask, deleteTask, isLoading } = useTasks();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"list" | "board">("list");

  const handleCreate = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  useLayoutEffect(() => {
    setTaskHeaderControls({
      view,
      setView,
      onNewTask: handleCreate,
    });
    return () => setTaskHeaderControls(null);
  }, [view, setTaskHeaderControls, handleCreate]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success("Task updated");
      } else {
        await addTask(data);
        toast.success("Task created");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      throw err;
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await updateTask(id, { status });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <>
      <main
        className={`space-y-6 ${view === "board" ? "max-w-none" : "max-w-4xl"}`}
      >
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading tasks…</p>
        ) : null}
        <StatsBar tasks={tasks} />
        {view === "list" && (
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
          />
        )}

        {view === "board" ? (
          <KanbanBoard
            tasks={filtered}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={setDeletingTask}
          />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/90 py-16 text-center backdrop-blur-sm">
            <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              {tasks.length === 0
                ? "No tasks yet"
                : "No tasks match your filters"}
            </p>
            {tasks.length === 0 && (
              <Button variant="link" className="mt-1" onClick={handleCreate}>
                Create your first task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={setDeletingTask}
              />
            ))}
          </div>
        )}
      </main>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={!!deletingTask}
        onOpenChange={() => setDeletingTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingTask?.title}" will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
