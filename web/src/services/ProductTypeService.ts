import { normalize, schema } from "normalizr";
import * as productTypeAPI from "src/api/ProductTypeAPI";

export interface IProductTypeService {
  getForCategory(
    categoryId: number,
    page: number
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
}

export class ProductTypeService implements IProductTypeService {
  private API: productTypeAPI.IProductTypeAPI;
  constructor(API: productTypeAPI.IProductTypeAPI) {
    this.API = API;
  }

  public async getForCategory(categoryId: number, page: number) {
    const productTypes = await this.API.getForCategory(categoryId, page);
    return {
      ...normalize(productTypes.data, [new schema.Entity("productTypes")]),
      meta: productTypes.meta
    };
  }
}
