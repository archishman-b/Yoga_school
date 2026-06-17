import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Locale = 'en' | 'hi' | 'bn';

/** Pick the right language column from a multilingual DB row */
export function localised<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: Locale,
): string {
  const val = (row[`${field}_${locale}`] ?? row[`${field}_en`] ?? '') as string;
  return val;
}
