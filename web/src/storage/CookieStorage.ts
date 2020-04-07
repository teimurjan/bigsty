import { Storage } from 'ttypes/storage';

import Cookies, { CookieAttributes } from 'js-cookie';

export class CookieStorage implements Storage {
  get length() {
    return Object.keys(Cookies.getJSON()).length;
  }

  key = (i: number) => Object.keys(Cookies.getJSON())[i];

  removeItem = (key: string) => {
    Cookies.remove(key);
  };

  clear = () => {
    Object.keys(Cookies.getJSON()).forEach(this.removeItem);
  };

  getItem = (key: string) => {
    const item = Cookies.get(key);
    return item ? item : null;
  };

  setItem = (key: string, value: string, options?: CookieAttributes) => {
    Cookies.set(key, value, options);
  };
}
