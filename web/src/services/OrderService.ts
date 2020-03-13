import { normalize, schema } from 'normalizr';

import * as orderAPI from 'src/api/OrderAPI';

export interface IOrderService {
  getAll(): Promise<{
    entities: {
      orders: {
        [key: string]: orderAPI.IOrderListResponseItem;
      };
    };
    result: number[];
  }>;
  create(payload: orderAPI.IOrderCreatePayload): Promise<orderAPI.IOrderListResponseItem>;
}

export class OrderService implements IOrderService {
  private API: orderAPI.IOrderAPI;
  constructor(API: orderAPI.IOrderAPI) {
    this.API = API;
  }

  public getAll: IOrderService['getAll'] = async () => {
    const products = await this.API.getAll();
    return normalize(products.data, [new schema.Entity('orders')]);
  };

  public create: IOrderService['create'] = async (payload: orderAPI.IOrderCreatePayload) => {
    return (await this.API.create(payload)).data;
  };
}
