import { IAuthStorage } from "src/storage/AuthStorage";
import { IIntlStorage } from "src/storage/IntlStorage";

export interface IHeadersManager {
  getHeaders(): { [key: string]: string | null };
}

export class HeadersManager implements IHeadersManager {
  private authStorage: IAuthStorage;
  private intlStorage: IIntlStorage;

  constructor(authStorage: IAuthStorage, intlStorage: IIntlStorage) {
    this.authStorage = authStorage;
    this.intlStorage = intlStorage;
  }

  public getHeaders() {
    const locale = this.intlStorage.getLocale();
    const accessToken = this.authStorage.getAccessToken();
    return {
      "Accept-Language": locale || 'en-US',
      Authorization: accessToken ? `Bearer ${accessToken}` : null
    };
  }
}
