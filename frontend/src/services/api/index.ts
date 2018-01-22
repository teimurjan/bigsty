import {
  GET, POST, PATCH, PUT, DELETE, getFetchParams,
  makeResponseFromStub
} from './utils';
import { StubData } from '../../typings/api';
import { AuthService } from '../auth';

export interface ApiService {
  get: (url: string, stubData?: StubData) => Promise<string | object>;
  getJSON: (url: string, stubData?: StubData) => Promise<string | object>;
  post: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  postJSON: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  put: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  putJSON: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  patch: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  patchJSON: (url: string, payload?: {}, stubData?: StubData) => Promise<string | object>;
  remove: (url: string, stubData?: StubData) => Promise<string | object>;
  removeJSON: (url: string, stubData?: StubData) => Promise<string | object>;
  setAuthService: (authService: AuthService) => void;
  getAuthService: () => AuthService;
}

export default class implements ApiService {
  private authService: AuthService;

  setAuthService(authService: AuthService) {
    this.authService = authService;
  }

  getAuthService() {
    return this.authService;
  }

  get = async (url: string, stubData?: StubData) => {
    return await this.sendRequest(GET, url, undefined, stubData);
  };

  getJSON = async (url: string, stubData?: StubData) => {
    return await (await this.get(url, stubData)).json();
  };

  post = async (url: string, payload?: {}, stubData?: StubData) => {
    return await this.sendRequest(POST, url, payload, stubData);
  };

  postJSON = async (url: string, payload?: {}, stubData?: StubData) => {
    return await (await this.post(url, payload, stubData)).json();
  };

  patch = async (url: string, payload?: {}, stubData?: StubData) => {
    return await this.sendRequest(PATCH, url, payload, stubData);
  };

  patchJSON = async (url: string, payload?: {}, stubData?: StubData) => {
    return await (await this.patch(url, payload, stubData)).json();
  };

  put = async (url: string, payload?: {}, stubData?: StubData) => {
    return await this.sendRequest(PUT, url, payload, stubData);
  };

  putJSON = async (url: string, payload?: {}, stubData?: StubData) => {
    return await (await this.put(url, payload, stubData)).json();
  };

  remove = async (url: string, stubData?: StubData) => {
    return await this.sendRequest(DELETE, url, undefined, stubData);
  };

  removeJSON = async (url: string, stubData?: StubData) => {
    return await (await this.remove(url, stubData)).json();
  };

  private sendRequest = async (method: string, url: string, payload?: {}, stubData?: StubData) => {
    let response: Response;

    if (stubData) {
      await setTimeout(1000);
      response = makeResponseFromStub(stubData);
    } else {
      const fetchParams = getFetchParams(method, payload);
      response = await fetch(url, fetchParams);

      if (response.status === 401) {
        const tokens = await this.authService.refreshTokens();
        if (tokens) {
          fetchParams.headers.Authorization = `Bearer ${tokens.accessToken}`;
          response = await fetch(url, fetchParams);
        } else {
          this.authService.logOut();
        }
      }
    }

    if (response.status < 400) {
      return response;
    } else {
      throw {errors: await response.json(), status: response.status};
    }
  };
}