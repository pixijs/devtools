import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { StoreApi, UseBoundStore } from 'zustand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ZustSet<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export type BridgeFn = <T>(code: string) => Promise<T>;

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Check if two values are different
 * @param a - First value
 * @param b - Second value
 * @returns True if the values are different, false otherwise
 */
export function isDifferent(a: unknown | string, b: unknown | string) {
  const convertedA = a instanceof String ? a : JSON.stringify(a);
  const convertedB = b instanceof String ? b : JSON.stringify(b);

  return convertedA !== convertedB;
}

export function formatCamelCase(string: string) {
  let result = string.replace(/([A-Z])/g, ' $1');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

export function copyToClipboard(text: string) {
  // @TODO navigator.clipboard is buggy in extensions
  if (typeof document === 'undefined') {
    return;
  }
  const dummyTextArea = document.createElement('textarea');
  dummyTextArea.textContent = text;
  document.body.appendChild(dummyTextArea);
  dummyTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(dummyTextArea);
}
