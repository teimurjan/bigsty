import {
  GET, POST, PATCH, PUT, DELETE, parseJsonOrReturnPlain, getFetchParams,
  respondWithStub, sendRequestSafely
} from './utils';
import { ApiService, StubData } from '../typings/api';

export function makeApiService(): ApiService {
  async function sendRequest(method: string, url: string, payload?: {}, stubData?: StubData) {
    if (stubData) {
      return await respondWithStub(stubData);
    }

    const response = await sendRequestSafely(url, getFetchParams(method, payload));

    const body = await response.text();
    if (response.status >= 400) {
      throw parseJsonOrReturnPlain(body);
    } else {
      return parseJsonOrReturnPlain(body);
    }
  }

  return {
    get: (url: string, stubData?: StubData) => sendRequest(GET, url, undefined, stubData),
    post: sendRequest.bind(undefined, POST),
    patch: sendRequest.bind(undefined, PATCH),
    put: sendRequest.bind(undefined, PUT),
    remove: (url: string, stubData?: StubData) => sendRequest(DELETE, url, undefined, stubData)
  };
}