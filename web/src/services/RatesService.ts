import * as ratesAPI from 'src/api/RatesAPI';
import * as stateCacheStorage from 'src/storage/StateCacheStorage';
import { getRatesDateKey } from 'src/utils/rates';

export interface ICachedRates {
  [key: string]: {
    kgsToUsd?: number;
  };
}

export interface IRatesService {
  getOne(date?: string): Promise<ratesAPI.RatesListResponseData>;
  getAllCached(): ICachedRates;
  addChangeListener: stateCacheStorage.IStateCacheStorage['addChangeListener'];
}

export class RatesService implements IRatesService {
  private storage: stateCacheStorage.IStateCacheStorage;
  private API: ratesAPI.IRatesAPI;

  constructor(API: ratesAPI.IRatesAPI, storage: stateCacheStorage.IStateCacheStorage) {
    this.API = API;
    this.storage = storage;
  }

  public getOne: IRatesService['getOne'] = async date => {
    const rates = await this.API.getOne(date);
    this.storage.set(
      'rates',
      {
        ...this.storage.get('rates'),
        [getRatesDateKey(date)]: { kgsToUsd: rates.data.kgs_to_usd },
      },
      { expireIn: 60 * 60 },
    );
    return rates;
  };

  public getAllCached: IRatesService['getAllCached'] = () => {
    return (this.storage.get('rates') || {}) as ICachedRates;
  };

  public addChangeListener: IRatesService['addChangeListener'] = listener => {
    return this.storage.addChangeListener((key, value, options) => {
      if (key === 'rates') {
        listener(key, value, options);
      }
    });
  };
}
