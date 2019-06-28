import { normalize, schema } from "normalizr";
import {
  IProductTypeAPI,
  IProductTypeListResponseItem,
  IProductTypeListResponseMeta
} from "src/api/ProductTypeAPI";

export interface IProductTypeService {
  getForCategory(
    categoryId: number,
    page: number
  ): Promise<{
    entities: { productTypes: { [key: string]: IProductTypeListResponseItem } };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
}

export class ProductTypeService implements IProductTypeService {
  private API: IProductTypeAPI;
  constructor(API: IProductTypeAPI) {
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
