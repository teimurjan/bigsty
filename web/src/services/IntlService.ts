import { IIntlAPI, IIntlListResponseItem } from "src/api/IntlAPI";
import * as intlStorage from "src/storage/IntlStorage";

export const DEFAULT_LOCALE = "en-US";

export interface IIntlService {
  getLocale(): string;
  setLocale(locale: string): void;
  getAvailableLocales(): Promise<IIntlListResponseItem[]>;
}

export class IntlService implements IIntlService {
  private storage: intlStorage.IIntlStorage;
  private API: IIntlAPI;

  constructor(API: IIntlAPI, storage: intlStorage.IIntlStorage) {
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
