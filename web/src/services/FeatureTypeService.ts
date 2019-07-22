import { normalize, schema } from "normalizr";

import {
  IFeatureTypeAPI,
  IFeatureTypeCreatePayload,
  IFeatureTypeListRawIntlResponseItem,
  IFeatureTypeListResponseItem
} from "src/api/FeatureTypeAPI";

export interface IFeatureTypeService {
  getAll(): Promise<{
    entities: { featureTypes: { [key: string]: IFeatureTypeListResponseItem } };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      featureTypes: { [key: string]: IFeatureTypeListRawIntlResponseItem };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: IFeatureTypeCreatePayload
  ): Promise<IFeatureTypeListRawIntlResponseItem>;
}

export class FeatureTypeService implements IFeatureTypeService {
  private API: IFeatureTypeAPI;
  constructor(API: IFeatureTypeAPI) {
    this.API = API;
  }

  public async getAll() {
    const featureTypes = await this.API.getAll();
    return normalize(featureTypes.data, [new schema.Entity("featureTypes")]);
  }

  public async getAllRawIntl() {
    const featureTypes = await this.API.getAllRawIntl();
    return normalize(featureTypes.data, [new schema.Entity("featureTypes")]);
  }

  public delete(id: number) {
    return this.API.delete(id);
  }

  public async create(payload: IFeatureTypeCreatePayload) {
    return (await this.API.create(payload)).data;
  }
}
