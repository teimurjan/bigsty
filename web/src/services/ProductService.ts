import { normalize, schema } from 'normalizr';

import * as productAPI from 'src/api/ProductAPI';

export const errors = {
  ProductNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductService {
  getAll(
    page: number,
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
    meta: productAPI.IProductListResponseMeta;
  }>;
  delete(id: number): Promise<{}>;
  create(payload: productAPI.IProductCreatePayload): Promise<productAPI.IProductListResponseItem>;
  edit(id: number, payload: productAPI.IProductEditPayload): Promise<productAPI.IProductListResponseItem>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<productAPI.IProductListResponseItem | undefined>;
}

export class ProductService implements IProductService {
  private API: productAPI.IProductAPI;
  constructor(API: productAPI.IProductAPI) {
    this.API = API;
  }

  public async getAll(page: number) {
    const products = await this.API.getAll(page);
    return {
      ...normalize(products.data, [new schema.Entity('products')]),
      meta: products.meta,
    };
  }

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  }

  public async create(payload: productAPI.IProductCreatePayload) {
    return (await this.API.create(payload)).data;
  }

  public async edit(id: number, payload: productAPI.IProductEditPayload) {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  }

  public async exists(id: number) {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        return false;
      }

      throw e;
    }
  }

  public async getOne(id: number) {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        return undefined;
      }

      throw e;
    }
  }
}
