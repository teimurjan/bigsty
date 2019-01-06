import * as intlStorage from "../storage/IntlStorage";

export const DEFAULT_LOCALE = "en-US";

export interface IIntlService {
  getLocale(): string;
  setLocale(locale: string): void;
}

export class IntlService implements IIntlService {
  private storage: intlStorage.IIntlStorage;

  constructor(storage: intlStorage.IIntlStorage) {
    this.storage = storage;
  }

  public getLocale = () => this.storage.getLocale() || DEFAULT_LOCALE;

  public setLocale = (locale: string) => this.storage.setLocale(locale);
}
