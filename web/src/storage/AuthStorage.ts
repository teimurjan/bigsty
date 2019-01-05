import { Storage } from "ttypes/storage";

export interface IAuthStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearAccessToken(): void;
  clearRefreshToken(): void;
}

export class AuthStorage implements IAuthStorage {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  public getAccessToken() {
    return this.storage.getItem("access_token");
  }

  public getRefreshToken() {
    return this.storage.getItem("refresh_token");
  }

  public setAccessToken(token: string) {
    this.storage.setItem("access_token", token);
  }

  public setRefreshToken(token: string) {
    this.storage.setItem("refresh_token", token);
  }

  public clearAccessToken() {
    this.storage.removeItem("access_token");
  }

  public clearRefreshToken() {
    this.storage.removeItem("refresh_token");
  }
}
