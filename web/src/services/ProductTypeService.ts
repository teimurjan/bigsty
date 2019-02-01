import { normalize, schema } from "normalizr";
import { IProductTypeAPI } from "src/api/ProductTypeAPI";

export interface IProductTypeService {
  getForCategory(
    categoryId: number,
    page: number
  ): Promise<{ entities: any; result: any }>;
}

export class ProductTypeService implements IProductTypeService {
  private API: IProductTypeAPI;
  constructor(API: IProductTypeAPI) {
    this.API = API;
  }

  public async getForCategory(categoryId: number, page: number) {
    const productTypes = await this.API.getForCategory(categoryId, page);
    return normalize(productTypes.data, [new schema.Entity("productTypes")]);
  }
}
