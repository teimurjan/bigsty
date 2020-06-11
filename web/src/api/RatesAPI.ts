import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildQueryString } from 'src/utils/queryString';

export interface RatesListResponseData {
  data: {
    kgs_to_usd: number;
  };
}

export interface IRatesAPI {
  getOne(date?: string): Promise<RatesListResponseData>;
}

export class RatesAPI implements IRatesAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getOne(date?: string) {
    try {
      const response = await this.client.get<RatesListResponseData>(
        `/api/currency_rates${buildQueryString({ date })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
