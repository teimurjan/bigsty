import { SyntheticEvent } from 'react';

export const PAGE_LOADER_ID = 'pageLoader';

export const preventDefault = <T extends SyntheticEvent>(fn: (e: T) => void) => (e: T) => {
  e.preventDefault();
  fn(e);
};
