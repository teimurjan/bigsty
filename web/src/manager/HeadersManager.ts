import { DEFAULT_LOCALE } from 'src/services/IntlService';
import { IAuthStorage } from 'src/storage/AuthStorage';
import { IIntlStorage } from 'src/storage/IntlStorage';
import { safeWindow } from 'src/utils/dom';
import { getServerGlobal } from 'src/utils/global';

interface IHeaders {
  [key: string]: string | null | undefined;
}

export interface IHeadersManager {
  getHeaders(): IHeaders;
}

export class HeadersManager implements IHeadersManager {
  private authStorage: IAuthStorage;
  private intlStorage: IIntlStorage;

  constructor(authStorage: IAuthStorage, intlStorage: IIntlStorage) {
    this.authStorage = authStorage;
    this.intlStorage = intlStorage;
  }

  private filterHeaders = (headers: IHeaders) =>
    Object.keys(headers).reduce(
      (acc, headerKey) => (headers[headerKey] ? { ...acc, [headerKey]: headers[headerKey] } : acc),
      {},
    );

  public getHeaders() {
    const locale = safeWindow(this.intlStorage.getLocale(), getServerGlobal('locale'));
    const accessToken = safeWindow(this.authStorage.getAccessToken(), getServerGlobal('accessToken'));
    return this.filterHeaders({
      'X-Locale': locale || DEFAULT_LOCALE,
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    });
  }
}
