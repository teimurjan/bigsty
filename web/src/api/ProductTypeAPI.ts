import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildQueryString } from 'src/utils/queryString';

export interface IProductTypeListResponseMeta {
  count: number;
  pages_count: number;
  page: number;
  limit: number;
}

export interface IProductTypeListResponseItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  image: string;
  category: number;
  feature_types: number[];
  products?: Array<{
    discount: number;
    feature_values: number[];
    id: number;
    price: number;
    quantity: number;
  }>;
}

export interface IProductTypeListRawIntlResponseItem {
  id: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  short_description: { [key: string]: string };
  image: string;
  category: number;
  feature_types: number[];
}

export interface IProductTypeBaseListResponseItem {
  id: number;
  name: string;
}

export interface IProductTypeBaseListResponseItemData {
  data: IProductTypeBaseListResponseItem[];
}

export interface IProductTypeListResponseData {
  data: IProductTypeListResponseItem[];
  meta: IProductTypeListResponseMeta;
}

export interface IProductTypeListRawIntlResponseData {
  data: IProductTypeListRawIntlResponseItem[];
  meta: IProductTypeListResponseMeta;
}

export interface IProductTypeRawIntlResponseData {
  data: IProductTypeListRawIntlResponseItem;
  meta: IProductTypeListResponseMeta;
}

export interface IProductTypeCreatePayload {
  names: {
    [key: string]: string;
  };
  descriptions: {
    [key: string]: string;
  };
  short_descriptions: {
    [key: string]: string;
  };
  image: string;
  category_id: number;
  feature_types: number[];
}

export type IProductTypeEditPayload = IProductTypeCreatePayload;

export interface IProductTypeAPI {
  getForCategory(categoryId: number, page: number): Promise<IProductTypeListResponseData>;
  getAll(page: number): Promise<IProductTypeListResponseData>;
  getAllWithBaseFields(): Promise<IProductTypeBaseListResponseItemData>;
  getAllRawIntl(page: number): Promise<IProductTypeListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IProductTypeCreatePayload): Promise<IProductTypeRawIntlResponseData>;
  edit(id: number, payload: IProductTypeEditPayload): Promise<IProductTypeRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<IProductTypeRawIntlResponseData>;
}

export const errors = {
  ProductTypeNotFound: class extends Error {
    constructor() {
      super('Product type not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  ProductTypeWithProductsIsUntouchable: class extends Error {
    constructor() {
      super('Product type with products cannot be deleted');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

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
        `/api/categories/${categoryId}/product_types${buildQueryString({ page })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async getAll(page: number) {
    try {
      const response = await this.client.get<IProductTypeListResponseData>(
        `/api/product_types${buildQueryString({ page })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async getAllWithBaseFields() {
    try {
      const response = await this.client.get<IProductTypeBaseListResponseItemData>(
        `/api/product_types${buildQueryString({ fields: ['id', 'name'] })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async getAllRawIntl(page: number) {
    try {
      const response = await this.client.get<IProductTypeListRawIntlResponseData>(
        `/api/product_types${buildQueryString({ page, raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number) {
    try {
      const response = await this.client.delete<{}>(`/api/product_types/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.ProductTypeNotFound();
      }
      if (e.response.data.products) {
        throw new errors.ProductTypeWithProductsIsUntouchable();
      }

      throw e;
    }
  }

  public async create({ image, ...json }: IProductTypeCreatePayload) {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<IProductTypeRawIntlResponseData>(`/api/product_types`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async edit(id: number, { image, ...json }: IProductTypeEditPayload) {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.put<IProductTypeRawIntlResponseData>(
        `/api/product_types/${id}${buildQueryString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.ProductTypeNotFound();
      }
      throw e;
    }
  }

  public async status(id: number) {
    try {
      const response = await this.client.head<{}>(`/api/product_types/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.ProductTypeNotFound();
      }
      throw e;
    }
  }

  public async getOneRawIntl(id: number) {
    try {
      const response = await this.client.get<IProductTypeRawIntlResponseData>(
        `/api/product_types/${id}${buildQueryString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response.status === 404) {
        throw new errors.ProductTypeNotFound();
      }
      throw e;
    }
  }
}
