import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';

// LIST
export interface IOrderListResponseItem {
  id: number;
  user_name: string;
  user_phone_number: string;
  user_address: string;
  created_on: string;
  items: Array<{
    quantity: number;
    product_price: number;
    product_discount: number;
    product_upc?: string;
    product?: {
      id: number;
      product_type: {
        id: number;
        name: string;
      };
    };
  }>;
}

export interface IOrderListResponseData {
  data: IOrderListResponseItem[];
}

// DETAIL
export interface IOrderResponseData {
  data: IOrderListResponseItem;
}

// PAYLOADS
export interface IOrderCreatePayload {
  user_name: string;
  user_phone_number: string;
  user_address: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface IOrderAPI {
  getAll(): Promise<IOrderListResponseData>;
  create(payload: IOrderCreatePayload): Promise<IOrderResponseData>;
}

export class OrderAPI implements IOrderAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<IOrderListResponseData>(`/api/orders`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async create(data: IOrderCreatePayload) {
    try {
      const response = await this.client.post<IOrderResponseData>(`/api/orders`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
