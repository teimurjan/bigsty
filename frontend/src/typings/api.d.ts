export interface DataPayload {
  data: object | Array<object>;
}

export interface StubData {
  isError?: boolean;
}

export interface ApiService {
  get: (url: string, stubData?: StubData) => Promise<string | object>,
  post: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>,
  put: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>,
  patch: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>,
  remove: (url: string, stubData?: StubData) => Promise<string | object>,
}