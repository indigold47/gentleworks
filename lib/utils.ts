import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class name merge helper — used by shadcn/ui and throughout the app. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
