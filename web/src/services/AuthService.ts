import * as authAPI from "../api/AuthAPI";
import * as authStorage from "../storage/AuthStorage";

export interface IAuthService {
  logIn(
    email: string,
    password: string
  ): Promise<{ error: string | undefined }>;
  signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ error: string | undefined }>;
  refreshTokens(refreshToken: string): void;
  getAccessToken(): string | null;
  logOut(): void;
}

export const errors = {
  EmailExistsError: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  InvalidCredentialsError: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
};

export class AuthService implements IAuthService {
  private API: authAPI.IAuthAPI;
  private storage: authStorage.IAuthStorage;

  constructor(API: authAPI.IAuthAPI, storage: authStorage.IAuthStorage) {
    this.API = API;
    this.storage = storage;
  }

  public async logIn(email: string, password: string) {
    try {
      const { accessToken, refreshToken } = await this.API.logIn(
        email,
        password
      );

      this.storage.setAccessToken(accessToken);
      this.storage.setRefreshToken(refreshToken);

      return { error: undefined };
    } catch (e) {
      if (e instanceof authAPI.errors.EmailOrPasswordInvalidError) {
        throw new errors.InvalidCredentialsError();
      }
      throw e;
    }
  }

  public async signUp(name: string, email: string, password: string) {
    try {
      const { accessToken, refreshToken } = await this.API.signUp(
        name,
        email,
        password
      );

      this.storage.setAccessToken(accessToken);
      this.storage.setRefreshToken(refreshToken);

      return { error: undefined };
    } catch (e) {
      if (e instanceof authAPI.errors.DuplicateEmailError) {
        throw new errors.EmailExistsError();
      }
      throw e;
    }
  }

  public async refreshTokens(oldRefreshToken: string) {
    const { accessToken, refreshToken } = await this.API.refreshTokens(
      oldRefreshToken
    );

    this.storage.setAccessToken(accessToken);
    this.storage.setRefreshToken(refreshToken);
  }

  public getAccessToken() {
    return this.storage.getAccessToken();
  }

  public logOut() {
    this.storage.clearAccessToken();
    this.storage.clearRefreshToken();
  }
}
