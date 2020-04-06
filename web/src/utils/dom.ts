import { SyntheticEvent } from 'react';

export const PAGE_LOADER_ID = 'pageLoader';

export const preventDefault = <T extends SyntheticEvent>(fn: (e: T) => void) => (e: T) => {
  e.preventDefault();
  fn(e);
};

export function safeWindow<T>(f: ((w: Window) => T) | T, defaultValue: T) {
  return typeof window === 'undefined' ? defaultValue : typeof f === 'function' ? (f as (w: Window) => T)(window) : f;
}

export function safeDocument<T>(f: ((d: Document) => T) | T, defaultValue: T) {
  return typeof document === 'undefined'
    ? defaultValue
    : typeof f === 'function'
    ? (f as (d: Document) => T)(document)
    : f;
}
