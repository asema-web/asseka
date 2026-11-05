import type { Attempt } from "../types";
const KEY = "interrogation.attempts.v1";

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch { return []; }
}
export function saveAttempt(a: Attempt): void {
  try { localStorage.setItem(KEY, JSON.stringify([...loadAttempts(), a])); } catch { /* storage full or blocked */ }
}
export function clearAttempts(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
