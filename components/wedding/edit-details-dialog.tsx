"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSettings } from "@/lib/data/wedding";
import type { WeddingSettings } from "@/lib/db";
import { parseDateTime, toDateInput, toTimeInput } from "@/lib/format";

/**
 * Radix unmounts dialog content when it closes, so the form state below re-initialises from the
 * current settings every time the dialog opens — no effect needed to sync it.
 */
export function EditDetailsDialog({ settings }: { settings: WeddingSettings }) {
  const [open, setOpen] = useState(false);
  const [partnerA, setPartnerA] = useState(settings.partnerA);
  const [partnerB, setPartnerB] = useState(settings.partnerB);
  const [dateInput, setDateInput] = useState(toDateInput(settings.weddingAt));
  const [timeInput, setTimeInput] = useState(toTimeInput(settings.weddingAt));
  const [missingA, setMissingA] = useState(false);
  const [missingB, setMissingB] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const a = partnerA.trim();
    const b = partnerB.trim();
    const weddingAt = parseDateTime(dateInput, timeInput);
    const missingANow = !a;
    const missingBNow = !b;
    const dateBad = weddingAt === null;
    setMissingA(missingANow);
    setMissingB(missingBNow);
    setDateError(dateBad);
    if (missingANow || missingBNow || dateBad || saving) return;
    setSaving(true);
    try {
      await saveSettings({ partnerA: a, partnerB: b, weddingAt });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0">
          Edit details
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit details</DialogTitle>
          <DialogDescription>
            The names at the top and the moment the countdown runs to.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="partner-a">Partner one</Label>
            <Input
              id="partner-a"
              value={partnerA}
              onChange={(event) => setPartnerA(event.target.value)}
              autoComplete="off"
              aria-invalid={missingA}
            />
            {missingA && (
              <p className="text-sm text-destructive" id="partner-a-error">
                Please enter a name — the previous one was kept.
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="partner-b">Partner two</Label>
            <Input
              id="partner-b"
              value={partnerB}
              onChange={(event) => setPartnerB(event.target.value)}
              autoComplete="off"
              aria-invalid={missingB}
            />
            {missingB && (
              <p className="text-sm text-destructive" id="partner-b-error">
                Please enter a name — the previous one was kept.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="wedding-date">Ceremony date</Label>
              <Input
                id="wedding-date"
                type="date"
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value)}
                aria-invalid={dateError}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="wedding-time">Time of day</Label>
              <Input
                id="wedding-time"
                type="time"
                value={timeInput}
                onChange={(event) => setTimeInput(event.target.value)}
                aria-invalid={dateError}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-sm text-destructive">Choose a date and a time of day.</p>
          )}
          <DialogFooter className="mt-1 gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Save details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}