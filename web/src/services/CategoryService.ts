import { normalize, schema } from "normalizr";
import { ICategoryAPI } from "src/api/CategoryAPI";

export interface ICategoryService {
  getAll(): Promise<{ entities: any; result: any }>;
}

export class CategoryService implements ICategoryService {
  private API: ICategoryAPI;
  constructor(API: ICategoryAPI) {
    this.API = API;
  }

  public async getAll() {
    const categories = await this.API.getAll();
    return normalize(categories, [new schema.Entity("categories")]);
  }
}
