import { Client } from "ttypes/http";

import { IHeadersManager } from "src/manager/HeadersManager";

export interface IFeatureTypeListResponseItem {
  id: number;
  name: string;
}

export interface IFeatureTypeListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
}

export interface IFeatureTypeListResponseData {
  data: IFeatureTypeListResponseItem[];
}

export interface IFeatureTypeListRawIntlResponseData {
  data: IFeatureTypeListRawIntlResponseItem[];
}

export interface IFeatureTypeAPI {
  getAll(): Promise<IFeatureTypeListResponseData>;
  getAllRawIntl(): Promise<IFeatureTypeListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
}

export class FeatureTypeAPI implements IFeatureTypeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<IFeatureTypeListResponseData>(
        "/api/feature_types",
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
      const response = await this.client.get<
        IFeatureTypeListRawIntlResponseData
      >("/api/feature_types?raw_intl=1", {
        headers: this.headersManager.getHeaders()
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number) {
    try {
      const response = await this.client.delete<{}>(
        `/api/feature_types/${id}`,
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
