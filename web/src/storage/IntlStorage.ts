import { Storage } from 'ttypes/storage';

export interface IIntlStorage {
  getLocale(): string | null;
  setLocale(locale: string): void;
  clearLocale(): void;
}

export class IntlStorage implements IIntlStorage {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  public getLocale() {
    return this.storage.getItem('locale');
  }

  public setLocale(locale: string) {
    this.storage.setItem('locale', locale);
  }

  public clearLocale() {
    this.storage.removeItem('locale');
  }
}
