import { SyntheticEvent } from 'react';

export const PAGE_LOADER_ID = 'pageLoader';

export const preventDefault = <T extends SyntheticEvent>(fn: (e: T) => void) => (e: T) => {
  e.preventDefault();
  fn(e);
};

export function safeWindow<T>(f: (w: Window) => T, defaultValue: T) {
  return typeof window === 'undefined' ? defaultValue : f(window);
}

export function safeDocument<T>(f: (w: Document) => T, defaultValue: T) {
  return typeof document === 'undefined' ? defaultValue : f(document);
}
