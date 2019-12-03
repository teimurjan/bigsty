import { normalize, schema } from 'normalizr';

import * as featureValueAPI from 'src/api/FeatureValueAPI';

export interface IFeatureValueService {
  getAll(): Promise<{
    entities: {
      featureValues: {
        [key: string]: featureValueAPI.IFeatureValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureValues: {
        [key: string]: featureValueAPI.IFeatureValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: featureValueAPI.IFeatureValueCreatePayload,
  ): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem>;
  edit(
    id: number,
    payload: featureValueAPI.IFeatureValueEditPayload,
  ): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<featureValueAPI.IFeatureValueListRawIntlResponseItem | undefined>;
}

export const errors = {
  FeatureValueNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class FeatureValueService implements IFeatureValueService {
  private API: featureValueAPI.IFeatureValueAPI;
  constructor(API: featureValueAPI.IFeatureValueAPI) {
    this.API = API;
  }

  public async getAll() {
    const featureValues = await this.API.getAll();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  }

  public async getAllRawIntl() {
    const featureValues = await this.API.getAllRawIntl();
    return normalize(featureValues.data, [new schema.Entity('featureValues')]);
  }

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        throw new errors.FeatureValueNotExists();
      }

      throw e;
    }
  }

  public async create(payload: featureValueAPI.IFeatureValueCreatePayload) {
    return (await this.API.create(payload)).data;
  }

  public async edit(id: number, payload: featureValueAPI.IFeatureValueEditPayload) {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        throw new errors.FeatureValueNotExists();
      }

      throw e;
    }
  }

  public async exists(id: number) {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        return false;
      }

      throw e;
    }
  }

  public async getOneRawIntl(id: number) {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof featureValueAPI.errors.FeatureValueNotFound) {
        return undefined;
      }

      throw e;
    }
  }
}
