declare module "ttypes/http" {
  export interface Client {
    get: (...args: Array<any>) => Promise<any>;
    post: (...args: Array<any>) => Promise<any>;
    put: (...args: Array<any>) => Promise<any>;
    patch: (...args: Array<any>) => Promise<any>;
    delete: (...args: Array<any>) => Promise<any>;
    head: (...args: Array<any>) => Promise<any>;
  }
}
