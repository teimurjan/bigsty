import * as intlAPI from 'src/api/IntlAPI';
import * as intlStorage from 'src/storage/IntlStorage';

export const DEFAULT_LOCALE = 'ru-RU';

export interface IIntlService {
  getLocale(): string;
  setLocale(locale: string): void;
  getAvailableLocales(): Promise<intlAPI.IIntlListResponseItem[]>;
}

export class IntlService implements IIntlService {
  private storage: intlStorage.IIntlStorage;
  private API: intlAPI.IIntlAPI;

  constructor(API: intlAPI.IIntlAPI, storage: intlStorage.IIntlStorage) {
    this.API = API;
    this.storage = storage;
  }

  public getLocale = () => this.storage.getLocale() || DEFAULT_LOCALE;

  public setLocale = (locale: string) => this.storage.setLocale(locale);

  public getAvailableLocales = async () => {
    const locales = await this.API.getAll();
    return locales.data;
  };
}
