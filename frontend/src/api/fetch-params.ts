export interface FetchParams extends RequestInit {
  token?: string;
}

export function createFetchParams(params: RequestInit): FetchParams {
  return {
    ...params,
    set token(newToken: string) {
      if (newToken) {
        this.headers.Authorization = `Bearer ${newToken}`;
      } else if (this.headers.Authorization !== undefined) {
        delete this.headers.Authorization;
      }
    },
    set body(body: {} | string) {
      if (typeof body === 'string') {
        this.body = JSON.stringify(body);
      } else if (typeof body === 'object') {
        this.body = JSON.stringify(body);
      }
    }
  };
}