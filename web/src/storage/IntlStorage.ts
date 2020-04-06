import Cookies from 'js-cookie';

export interface IIntlStorage {
  getLocale(): string | undefined;
  setLocale(locale: string): void;
  clearLocale(): void;
}

export class IntlStorage implements IIntlStorage {
  public getLocale() {
    return Cookies.get('locale');
  }

  public setLocale(locale: string) {
    Cookies.set('locale', locale);
  }

  public clearLocale() {
    Cookies.remove('locale');
  }
}
