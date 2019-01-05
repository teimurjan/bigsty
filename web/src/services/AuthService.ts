import * as authAPI from "../api/AuthAPI";
import * as authStorage from "../storage/AuthStorage";

export class EmailExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface IAuthService {
  logIn(
    email: string,
    password: string
  ): Promise<{ error: string | undefined }>;
  register(
    name: string,
    email: string,
    password: string
  ): Promise<{ error: string | undefined }>;
  refreshTokens(refreshToken: string): void;
}

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
      if (e instanceof authAPI.EmailOrPasswordInvalidError) {
        throw new InvalidCredentialsError();
      }
      throw e;
    }
  }

  public async register(name: string, email: string, password: string) {
    try {
      const { accessToken, refreshToken } = await this.API.register(
        name,
        email,
        password
      );

      this.storage.setAccessToken(accessToken);
      this.storage.setRefreshToken(refreshToken);

      return { error: undefined };
    } catch (e) {
      if (e instanceof authAPI.DuplicateEmailError) {
        throw new EmailExistsError();
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
}
