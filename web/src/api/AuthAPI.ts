import { Client } from "ttypes/http";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Given email already exists.");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EmailOrPasswordInvalidError extends Error {
  constructor() {
    super("Email or password are incorrect.");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface IAuthAPI {
  logIn(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  register(
    name: string,
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  refreshTokens(
    refreshToken: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

export class AuthAPI implements IAuthAPI {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async logIn(email: string, password: string) {
    try {
      const response = await this.client.post("/api/auth/login", {
        email,
        password
      });
      const {
        access_token: accessToken,
        refresh_token: refreshToken
      } = response.data;
      return {
        accessToken,
        refreshToken
      };
    } catch (e) {
      if (e.response.data.credentials) {
        throw new EmailOrPasswordInvalidError();
      }
      throw e;
    }
  }

  public async register(name: string, email: string, password: string) {
    try {
      const response = await this.client.post("/api/auth/register", {
        email,
        name,
        password
      });
      const {
        access_token: accessToken,
        refresh_token: refreshToken
      } = response.data;
      return {
        accessToken,
        refreshToken
      };
    } catch (e) {
      if (e.response.email) {
        throw new DuplicateEmailError();
      }
      throw e;
    }
  }

  public async refreshTokens(refreshToken: string) {
    const response = await this.client.post("/api/auth/refresh", {
      refresh_token: refreshToken
    });
    const {
      access_token: accessToken,
      refresh_token: newRefreshToken
    } = response.data;
    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }
}
