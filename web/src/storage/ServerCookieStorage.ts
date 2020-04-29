import { IncomingMessage, ServerResponse } from 'http';

import cookie from 'cookie';
import { Storage } from 'ttypes/storage';

export class ServerCookieStorage implements Storage {
  private incomingCookies: { [key: string]: string };
  private outcomingCookies: { [key: string]: string };
  private res: ServerResponse;
  constructor(req: IncomingMessage, res: ServerResponse) {
    this.incomingCookies = cookie.parse(req.headers.cookie || '');
    this.outcomingCookies = {};
    this.res = res;
  }

  // Incoming cookies length
  get length() {
    return Object.keys(this.incomingCookies).length;
  }

  // Incoming cookies key by index
  key = (i: number) => Object.keys(this.incomingCookies)[i];

  // Search outcoming cookies by key then search incoming as fallback
  getItem = (key: string) => this.outcomingCookies[key] || this.incomingCookies[key];

  // Set both cookies so the search works correctly
  setItem = (key: string, value: string) => {
    this.incomingCookies[key] = value;
    this.outcomingCookies[key] = value;
    this.res.setHeader(
      'Set-Cookie',
      Object.keys(this.outcomingCookies).map(cookieKey =>
        cookie.serialize(cookieKey, this.outcomingCookies[cookieKey]),
      ),
    );
  };

  // Remove outcoming cookie
  removeItem = (key: string) => {
    this.setItem(key, '');
  };

  // Clear outcoming cookies
  clear = () => {
    Object.keys(this.outcomingCookies).forEach(this.removeItem);
  };
}
