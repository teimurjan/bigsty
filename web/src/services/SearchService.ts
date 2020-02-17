import { normalize, schema } from 'normalizr';

import * as categoryAPI from 'src/api/CategoryAPI';
import * as productTypeAPI from 'src/api/ProductTypeAPI';
import * as searchAPI from 'src/api/SearchAPI';

export interface ISearchService {
  search(
    query: string,
  ): Promise<{
    entities: {
      categories: { [key: string]: categoryAPI.ICategoryListResponseItem };
      productTypes: { [key: string]: productTypeAPI.IProductTypeListResponseItem };
    };
    result: {
      categories: number[];
      productTypes: number[];
    };
  }>;
}

export class SearchService implements ISearchService {
  private API: searchAPI.ISearchAPI;
  constructor(API: searchAPI.ISearchAPI) {
    this.API = API;
  }

  public async search(query: string) {
    const { data } = await this.API.search(query);

    const { entities: categoriesEntities, result: categoriesResult } = normalize(data.categories, [
      new schema.Entity('categories'),
    ]);
    const { entities: productTypesEntities, result: productTypesResult } = normalize(data.product_types, [
      new schema.Entity('productTypes'),
    ]);

    return {
      entities: { ...categoriesEntities, ...productTypesEntities },
      result: { categories: categoriesResult, productTypes: productTypesResult },
    };
  }
}
