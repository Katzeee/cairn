import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: readonly ClassValue[]): string {
  return clsx(inputs);
}
