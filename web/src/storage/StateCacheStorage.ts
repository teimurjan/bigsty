import { Storage } from 'ttypes/storage';

import { objectWithout } from 'src/utils/object';
import { getCurrentTimestamp } from 'src/utils/time';

export interface IStateCacheStorage {
  get<T = object>(key: string): T | null;
  set(key: string, value: object, options?: { expireIn: number }): void;
  clear(key: string): void;
  clearAll(): void;
}

export class StateCacheStorage implements IStateCacheStorage {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  private getCachedState() {
    const cachedState = this.storage.getItem('cachedState') || '{}';
    return JSON.parse(cachedState);
  }

  public get(key: string) {
    const value = this.getCachedState()[key];
    if (value && value.timestamp && value.expireIn) {
      const currentTimestamp = getCurrentTimestamp();
      if (currentTimestamp - value.timestamp > value.expireIn) {
        this.clear(key);
        return null;
      }

      return objectWithout(value, 'timestamp', 'expireIn');
    }

    return value;
  }

  public set: IStateCacheStorage['set'] = (key, value, options) => {
    const cachedState = this.getCachedState();
    if (options && options.expireIn) {
      const currentTimestamp = getCurrentTimestamp();
      cachedState[key] = { ...value, timestamp: currentTimestamp, expireIn: options.expireIn };
    } else {
      cachedState[key] = value;
    }
    this.storage.setItem('cachedState', JSON.stringify(cachedState));
  };

  public clear(key: string) {
    const cachedState = this.getCachedState();
    cachedState[key] = undefined;
    this.set(key, cachedState);
  }

  public clearAll() {
    this.storage.removeItem('cachedState');
  }
}
