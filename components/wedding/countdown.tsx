"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsHydrated } from "@/lib/storage/react";
import { formatDateLong, formatTime, pad2 } from "@/lib/format";

/**
 * Days / hours / minutes until the ceremony, ticking every second so the minute readout rolls
 * over without a reload. Until the first client render there is no clock to read, so the readouts
 * show placeholder zeros — the server and the first client render agree on those, which keeps
 * hydration quiet.
 */
export function Countdown({ weddingAt }: { weddingAt: number }) {
  const hydrated = useIsHydrated();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = weddingAt - now;

  if (hydrated && remaining <= 0) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-8 text-center">
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">We&rsquo;re married!</p>
          <p className="mt-2 text-muted-foreground">
            The wedding took place on {formatDateLong(weddingAt)} at {formatTime(weddingAt)}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const minutesLeft = remaining > 0 ? Math.floor(remaining / 60_000) : 0;
  const days = Math.floor(minutesLeft / 1440);
  const hours = Math.floor(minutesLeft / 60) % 24;
  const minutes = minutesLeft % 60;

  const readouts = [
    { value: hydrated ? pad2(days) : "00", label: "days" },
    { value: hydrated ? pad2(hours) : "00", label: "hours" },
    { value: hydrated ? pad2(minutes) : "00", label: "minutes" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Time until the wedding">
      {readouts.map((readout) => (
        <Card key={readout.label} className="text-center">
          <CardContent className="px-2 py-5 sm:py-6">
            <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
              {readout.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {readout.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}