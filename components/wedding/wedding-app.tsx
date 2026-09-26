"use client";

import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/wedding/countdown";
import { EditDetailsDialog } from "@/components/wedding/edit-details-dialog";
import { Checklist } from "@/components/wedding/checklist";
import { database, DEFAULT_WEDDING_AT, type WeddingSettings } from "@/lib/db";
import { getSettings } from "@/lib/data/wedding";
import { formatDateLong, formatTime } from "@/lib/format";
import { useDatabaseTransfer, useStorageStatus, useStoredQuery } from "@/lib/storage/react";

/**
 * Shown while the database is still opening. The seed writes exactly these values on a first
 * visit, so the fallback doubles as a no-flash first paint; a returning visitor with edited
 * details sees them for only the few milliseconds before Dexie resolves.
 */
const FALLBACK_SETTINGS: WeddingSettings = {
  id: "main",
  partnerA: "Dhama",
  partnerB: "Dhama",
  weddingAt: DEFAULT_WEDDING_AT,
};

function TransferFooter() {
  const { state, exportToFile, importFromFile } = useDatabaseTransfer(database);
  const fileInput = useRef<HTMLInputElement>(null);
  const working = state.kind === "working";

  return (
    <footer className="mt-2 flex flex-wrap items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
      <span className="min-w-0 flex-1 basis-32">
        {state.kind === "error"
          ? state.message
          : state.kind === "imported"
            ? "Imported."
            : "Everything here lives in this browser only."}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => void exportToFile()} disabled={working}>
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInput.current?.click()}
          disabled={working}
        >
          Import
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importFromFile(file, "merge");
            event.target.value = "";
          }}
        />
      </div>
    </footer>
  );
}

export function WeddingApp() {
  const status = useStorageStatus(database);
  const { data: settings } = useStoredQuery(database, getSettingsSafe);
  const current = settings ?? FALLBACK_SETTINGS;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
      {status === "memory" && (
        <Alert>
          <AlertTitle>This browser will not keep your data</AlertTitle>
          <AlertDescription>
            Storage was refused here, so everything works for this visit only. Export it to a file
            if you want to keep it.
          </AlertDescription>
        </Alert>
      )}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Save the date
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {current.partnerA} &amp; {current.partnerB}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {formatDateLong(current.weddingAt)} &middot; {formatTime(current.weddingAt)}
          </p>
        </div>
        <EditDetailsDialog settings={current} />
      </header>
      <Countdown weddingAt={current.weddingAt} />
      <Checklist />
      <TransferFooter />
    </main>
  );
}

/** The seed guarantees the settings row; a database without one falls back to the seed defaults. */
function getSettingsSafe(): Promise<WeddingSettings> {
  return getSettings().catch(() => FALLBACK_SETTINGS);
}