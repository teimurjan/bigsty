import { normalize, schema } from 'normalizr';

import * as productTypeAPI from 'src/api/ProductTypeAPI';

export const errors = {
  ProductTypeNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductTypeService {
  getForCategory(
    categoryId: number,
    page: number,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getAll(
    page: number,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(
    page: number,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: productTypeAPI.IProductTypeCreatePayload,
  ): Promise<productTypeAPI.IProductTypeListRawIntlResponseItem>;
  edit(
    id: number,
    payload: productTypeAPI.IProductTypeEditPayload,
  ): Promise<productTypeAPI.IProductTypeListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<productTypeAPI.IProductTypeListRawIntlResponseItem | undefined>;
}

export class ProductTypeService implements IProductTypeService {
  private API: productTypeAPI.IProductTypeAPI;
  constructor(API: productTypeAPI.IProductTypeAPI) {
    this.API = API;
  }

  public async getForCategory(categoryId: number, page: number) {
    const productTypes = await this.API.getForCategory(categoryId, page);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  }

  public async getAll(page: number) {
    const productTypes = await this.API.getAll(page);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  }

  public async getAllRawIntl(page: number) {
    const productTypes = await this.API.getAllRawIntl(page);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  }

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }

      throw e;
    }
  }

  public async create(payload: productTypeAPI.IProductTypeCreatePayload) {
    return (await this.API.create(payload)).data;
  }

  public async edit(id: number, payload: productTypeAPI.IProductTypeEditPayload) {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }

      throw e;
    }
  }

  public async exists(id: number) {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return false;
      }

      throw e;
    }
  }

  public async getOneRawIntl(id: number) {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return undefined;
      }

      throw e;
    }
  }
}
