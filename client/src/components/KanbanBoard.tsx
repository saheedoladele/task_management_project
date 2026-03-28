import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { Task, Status } from "@/types/task";
import { TaskCard } from "./TaskCard";

const columns: { id: Status; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

const columnColors: Record<Status, string> = {
  todo: "bg-muted-foreground",
  in_progress: "bg-primary",
  done: "bg-[hsl(var(--status-done))]",
};

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-lg border bg-muted/40 p-3"
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${columnColors[col.id]}`}
                />
                <h2 className="text-sm font-semibold text-foreground">
                  {col.label}
                </h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  {colTasks.length}
                </span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[120px] flex-1 flex-col gap-2 rounded-md p-1 transition-colors ${
                      snapshot.isDraggingOver ? "bg-accent/60" : ""
                    }`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-shadow ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <TaskCard
                              task={task}
                              onStatusChange={onStatusChange}
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
