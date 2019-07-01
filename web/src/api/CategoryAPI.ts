import { Client } from "ttypes/http";

import { IHeadersManager } from "src/manager/HeadersManager";

export interface ICategoryListResponseItem {
  id: number;
  name: string;
  feature_types: number[];
}

export interface ICategoryListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_types: number[];
}

export interface ICategoryListResponseData {
  data: ICategoryListResponseItem[];
}

export interface ICategoryListRawIntlResponseData {
  data: ICategoryListRawIntlResponseItem[];
}

export interface ICategoryAPI {
  getAll(): Promise<ICategoryListResponseData>;
  getAllRawIntl(): Promise<ICategoryListRawIntlResponseData>;
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

  public async getAllRawIntl() {
    try {
      const response = await this.client.get<ICategoryListRawIntlResponseData>(
        "/api/categories?raw_intl=1",
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
