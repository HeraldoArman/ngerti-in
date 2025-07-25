import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  // If duration is in milliseconds, convert to seconds
  if (duration > 100000) duration = Math.floor(duration / 1000);
  // Round duration to nearest integer (seconds)
  duration = Math.round(duration);

  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = duration % 60;
  return [h ? `${h}h` : null, m ? `${m}m` : null, s ? `${s}s` : null]
    .filter(Boolean)
    .join(" ");
}
