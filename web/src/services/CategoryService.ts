import { normalize, schema } from "normalizr";

import {
  ICategoryAPI,
  ICategoryListRawIntlResponseItem,
  ICategoryListResponseItem
} from "src/api/CategoryAPI";

export interface ICategoryService {
  getAll(): Promise<{
    entities: { categories: { [key: string]: ICategoryListResponseItem } };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      categories: { [key: string]: ICategoryListRawIntlResponseItem };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
}

export class CategoryService implements ICategoryService {
  private API: ICategoryAPI;
  constructor(API: ICategoryAPI) {
    this.API = API;
  }

  public async getAll() {
    const categories = await this.API.getAll();
    return normalize(categories.data, [new schema.Entity("categories")]);
  }

  public async getAllRawIntl() {
    const categories = await this.API.getAllRawIntl();
    return normalize(categories.data, [new schema.Entity("categories")]);
  }

  public async delete(id: number) {
    return await this.API.delete(id);
  }
}
