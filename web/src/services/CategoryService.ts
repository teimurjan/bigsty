import { normalize, schema } from "normalizr";

import * as categoryAPI from "src/api/CategoryAPI";

export interface ICategoryService {
  getAll(): Promise<{
    entities: {
      categories: { [key: string]: categoryAPI.ICategoryListResponseItem };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      categories: {
        [key: string]: categoryAPI.ICategoryListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: categoryAPI.ICategoryCreatePayload
  ): Promise<categoryAPI.ICategoryListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
}

export const errors = {
  CategoryNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
};

export class CategoryService implements ICategoryService {
  private API: categoryAPI.ICategoryAPI;
  constructor(API: categoryAPI.ICategoryAPI) {
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
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        throw new errors.CategoryNotExists();
      }

      throw e;
    }
  }

  public async create(payload: categoryAPI.ICategoryCreatePayload) {
    return (await this.API.create(payload)).data;
  }

  public async exists(id: number) {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof categoryAPI.errors.CategoryNotFound) {
        return false;
      }

      throw e;
    }
  }
}
