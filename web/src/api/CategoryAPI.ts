import { IHeadersManager } from "src/manager/HeadersManager";
import { Client } from "ttypes/http";

export interface ICategoryResponseData {
  id: number;
  name: string;
  feature_types: number[];
}

export interface ICategoryAPI {
  getAll(): Promise<ICategoryResponseData[]>;
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
      const response = await this.client.get("/api/categories", {
        headers: this.headersManager.getHeaders()
      });
      const { data } = response.data;
      return data;
    } catch (e) {
      throw e;
    }
  }
}
