"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoredQuery } from "@/lib/storage/react";
import { database } from "@/lib/db";
import { addTask, deleteTask, listTasks, setTaskDone } from "@/lib/data/wedding";

function AddTaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [label, setLabel] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [adding, setAdding] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) {
      // Nothing is written, no row appears, and the dialog stays open so the input can be corrected.
      setInvalid(true);
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      await addTask(trimmed);
      onOpenChange(false);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a task</DialogTitle>
          <DialogDescription>One thing you still need to do before the day.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="task-label">Task</Label>
            <Input
              id="task-label"
              value={label}
              onChange={(event) => {
                setLabel(event.target.value);
                if (event.target.value.trim()) setInvalid(false);
              }}
              placeholder="e.g. Confirm the seating plan"
              autoComplete="off"
              aria-invalid={invalid}
              autoFocus
            />
            {invalid && <p className="text-sm text-destructive">Please enter a task first.</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={adding}>
              Add task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Checklist() {
  const { data: tasks, isLoading } = useStoredQuery(database, listTasks);
  const [addOpen, setAddOpen] = useState(false);

  const visible = tasks ?? [];
  const done = visible.filter((task) => task.done).length;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Before the day</CardTitle>
          <Badge variant="secondary" className="tabular-nums">
            {done} of {visible.length} done
          </Badge>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add task</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 py-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : visible.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No tasks yet — add the first thing you still need to do.
          </p>
        ) : (
          <ul className="divide-y">
            {visible.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-2.5">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={(checked) => void setTaskDone(task.id, checked === true)}
                  aria-label={`Mark “${task.label}” as done`}
                  className="shrink-0"
                />
                <button
                  type="button"
                  onClick={() => void setTaskDone(task.id, !task.done)}
                  className={`min-w-0 flex-1 text-left text-sm leading-5 break-words ${
                    task.done ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {task.label}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => void deleteTask(task.id)}
                  aria-label={`Delete task: ${task.label}`}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />
    </Card>
  );
}