import { database, newId, type WeddingSettings, type WeddingTask } from "@/lib/db";

const tasksTable = async () => (await database.ready()).tasks;
const settingsTable = async () => (await database.ready()).settings;

/** The single settings row; the seed guarantees it exists, so a missing one is an internal error. */
export async function getSettings(): Promise<WeddingSettings> {
  const settings = await (await settingsTable()).get("main");
  if (!settings) throw new Error("Wedding settings row is missing from the database.");
  return settings;
}

export async function saveSettings(next: {
  partnerA: string;
  partnerB: string;
  weddingAt: number;
}): Promise<void> {
  await (await settingsTable()).put({ id: "main", ...next });
}

export async function listTasks(): Promise<WeddingTask[]> {
  return (await tasksTable()).orderBy("createdAt").toArray();
}

export async function addTask(label: string): Promise<void> {
  const trimmed = label.trim();
  if (!trimmed) return;
  await (await tasksTable()).add({ id: newId(), label: trimmed, done: false, createdAt: Date.now() });
}

export async function setTaskDone(id: string, done: boolean): Promise<void> {
  await (await tasksTable()).update(id, { done });
}

export async function deleteTask(id: string): Promise<void> {
  await (await tasksTable()).delete(id);
}
