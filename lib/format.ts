/**
 * Deterministic date helpers. Formatting is done by hand rather than with `toLocaleDateString`
 * because the app server-renders its shell and the browser must produce exactly the same string,
 * whatever locale data each environment carries. All times are the visitor's local time.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function pad2(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

/** "Saturday, 25 November 2026" */
export function formatDateLong(ms: number): string {
  const date = new Date(ms);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "12:00" */
export function formatTime(ms: number): string {
  const date = new Date(ms);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** "2026-11-25", for `<input type="date">` */
export function toDateInput(ms: number): string {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** "12:00", for `<input type="time">` */
export function toTimeInput(ms: number): string {
  const date = new Date(ms);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** Combines the two pickers back into epoch millis; null when either part is missing or bogus. */
export function parseDateTime(dateInput: string, timeInput: string): number | null {
  if (!dateInput || !timeInput) return null;
  const parsed = new Date(`${dateInput}T${timeInput}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}
