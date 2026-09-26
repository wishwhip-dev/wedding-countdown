/**
 * This application's database.
 *
 * The reusable half of the setup is in `lib/storage/` and is not edited. This file is the half
 * that describes the product: which tables exist, what is indexed, how the schema has changed over
 * time, and what a first visit starts with.
 */
import { defineDatabase } from "@/lib/storage/database";

/** The single settings row. `id` is always "main". */
export type WeddingSettings = {
  id: "main";
  partnerA: string;
  partnerB: string;
  /** Epoch millis of the ceremony, in the visitor's own timezone. */
  weddingAt: number;
};

export type WeddingTask = {
  id: string;
  label: string;
  done: boolean;
  /** Epoch millis; the list is ordered by it, so it is the one indexed property. */
  createdAt: number;
};

/** Ids are generated here so the data layer never depends on an auto-increment round trip. */
export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** November 25th of the current year, midday, local time — the seed default for a first visit. */
function defaultWeddingAt(): number {
  return new Date(new Date().getFullYear(), 10, 25, 12, 0, 0, 0).getTime();
}

/** Used as the on-screen fallback while the database is still opening; the seed writes the same. */
export const DEFAULT_WEDDING_AT = defaultWeddingAt();

const DEFAULT_SETTINGS: WeddingSettings = {
  id: "main",
  partnerA: "Dhama",
  partnerB: "Dhama",
  weddingAt: DEFAULT_WEDDING_AT,
};

/** What a first visit opens to. An app that opens empty looks broken. */
const SAMPLE_TASKS: WeddingTask[] = [
  "Send invitations",
  "Book photographer",
  "Order cake",
  "Reserve the venue",
  "Choose the music",
  "Arrange flowers",
  "Pick up the rings",
].map((label, index) => ({
  id: `sample-task-${index}`,
  label,
  done: false,
  createdAt: Date.now() + index, // distinct, and keeps the seed order.
}));

export const database = defineDatabase<{ settings: WeddingSettings; tasks: WeddingTask }>({
  // Part of the origin's storage identity. Renaming it does not migrate anything — it points the
  // application at a different, empty database and abandons the old one in place. That is exactly
  // what you want on a first build, and never what you want afterwards.
  name: "wedding-countdown",
  versions: [
    // Only the primary key and the properties queried on. Nothing here is filtered or sorted
    // beyond the task order, so nothing else earns an index.
    { version: 1, stores: { settings: "id", tasks: "id, createdAt" } },
  ],
  // Written once, inside `ready()`, in one transaction with its own marker. Do not hand-roll this:
  // no `meta` table, no flag, no promise to dedupe a double mount — see `docs/storage.md`.
  seed: {
    tables: ["settings", "tasks"],
    run: async (db) => {
      await db.settings.add(DEFAULT_SETTINGS);
      await db.tasks.bulkAdd(SAMPLE_TASKS);
    },
  },
});
