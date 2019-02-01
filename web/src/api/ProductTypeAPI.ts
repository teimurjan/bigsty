import { IHeadersManager } from "src/manager/HeadersManager";
import { Client } from "ttypes/http";

export interface IProductTypeListResponseItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  image: string;
  category: number;
  feature_values: number[];
}

export interface IProductTypeListResponseData {
  data: IProductTypeListResponseItem[];
}

export interface IProductTypeAPI {
  getForCategory(categoryId: number, page: number): Promise<IProductTypeListResponseData>;
}

export class ProductTypeAPI implements IProductTypeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getForCategory(categoryId: number, page: number) {
    try {
      const response = await this.client.get<IProductTypeListResponseData>(
        `/api/categories/${categoryId}/product_types?page=${page}`,
        {
          headers: this.headersManager.getHeaders()
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
