import { IHeadersManager } from "src/manager/HeadersManager";
import { Client } from "ttypes/http";

export interface ICategoryListResponseItem {
  id: number;
  name: string;
  feature_types: number[];
}

export interface ICategoryListResponseData {
  data: ICategoryListResponseItem[];
}

export interface ICategoryAPI {
  getAll(): Promise<ICategoryListResponseData>;
}

export class CategoryAPI implements ICategoryAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<ICategoryListResponseData>(
        "/api/categories",
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
