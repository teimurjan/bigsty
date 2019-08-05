import { Client } from "ttypes/http";

import { IHeadersManager } from "src/manager/HeadersManager";
import { buildQueryString } from "src/utils/queryString";

export interface ICategoryListResponseItem {
  id: number;
  name: string;
  feature_types: number[];
  parent_category_id: number | null;
}

export interface ICategoryListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_types: number[];
  parent_category_id: number | null;
}

export interface ICategoryListResponseData {
  data: ICategoryListResponseItem[];
}

export interface ICategoryListRawIntlResponseData {
  data: ICategoryListRawIntlResponseItem[];
}

export interface ICategoryRawIntlResponseData {
  data: ICategoryListRawIntlResponseItem;
}

export interface ICategoryCreatePayload {
  names: {
    [key: string]: string;
  };
  feature_types: number[];
  parent_category_id?: number;
}

export interface ICategoryAPI {
  getAll(): Promise<ICategoryListResponseData>;
  getAllRawIntl(): Promise<ICategoryListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(
    payload: ICategoryCreatePayload
  ): Promise<ICategoryRawIntlResponseData>;
  edit(
    id: number,
    payload: ICategoryCreatePayload
  ): Promise<ICategoryRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<ICategoryRawIntlResponseData>;
}

export const errors = {
  CategoryNotFound: class extends Error {
    constructor() {
      super("Feature type not found");
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
};

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
        `/api/categories${buildQueryString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders()
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number) {
    try {
      const response = await this.client.delete<{}>(`/api/categories/${id}`, {
        headers: this.headersManager.getHeaders()
      });
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.CategoryNotFound();
      }

      throw e;
    }
  }

  public async status(id: number) {
    try {
      const response = await this.client.head<{}>(`/api/categories/${id}`, {
        headers: this.headersManager.getHeaders()
      });
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.CategoryNotFound();
      }
      throw e;
    }
  }

  public async create(payload: ICategoryCreatePayload) {
    try {
      const response = await this.client.post<ICategoryRawIntlResponseData>(
        `/api/categories`,
        payload,
        {
          headers: this.headersManager.getHeaders()
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async edit(id: number, payload: ICategoryCreatePayload) {
    try {
      const response = await this.client.put<ICategoryRawIntlResponseData>(
        `/api/categories/${id}${buildQueryString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders()
        }
      );
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.CategoryNotFound();
      }
      throw e;
    }
  }

  public async getOneRawIntl(id: number) {
    try {
      const response = await this.client.get<ICategoryRawIntlResponseData>(
        `/api/categories/${id}${buildQueryString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders()
        }
      );
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.CategoryNotFound();
      }
      throw e;
    }
  }
}
