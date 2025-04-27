import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom badge variants
export function getBadgeVariant(status: boolean) {
  return status ? "success" : "destructive";
}

// Round to a specific precision
export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 2): string {
  return value.toFixed(decimals) + "%";
}
