import urls from '../urls';
import { createFetchParams, FetchParams } from './fetch-params';
import { StubData } from '../typings/api';

export const GET: string = 'GET';
export const POST: string = 'POST';
export const PUT: string = 'PUT';
export const PATCH: string = 'PATCH';
export const DELETE: string = 'DELETE';

export function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== '') {
    const cookies: Array<string> = document.cookie.split(';');
    for (let i: number = 0; i < cookies.length; i++) {
      const cookie: string = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function parseJsonOrReturnPlain(payload: string): {} | string {
  try {
    return JSON.parse(payload);
  } catch (err) {
    return payload;
  }
}

export function getBaseFetchParams(method: string): FetchParams {
  return createFetchParams({
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App': 1,
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'include',
  });
}

export function getFetchParams(method: string, payload?: {}): FetchParams {
  const fetchParams: FetchParams = getBaseFetchParams(method);
  const accessToken = localStorage.getItem('access_token');
  fetchParams.token = `Bearer ${accessToken}`;
  fetchParams.body = payload;
  return fetchParams;
}

export async function refreshTokens() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return undefined;
  } else {
    const fetchParams = getFetchParams(POST, {refresh_token: refreshToken});
    const refreshResponse = await fetch(urls.refreshToken, fetchParams);
    if (refreshResponse.status === 200) {
      const {refresh_token, access_token} = await refreshResponse.json();
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('access_token', access_token);
      return {refreshToken: refresh_token, accessToken: access_token};
    } else {
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
      return undefined;
    }
  }
}

export async function respondWithStub(stubData: StubData) {
  await setTimeout(1000);
  if (stubData.isError) {
    throw stubData;
  } else {
    return stubData;
  }
}

export async function sendRequestSafely(url: string, fetchParams: FetchParams) {
  const response = await fetch(url, fetchParams);
  if (response.status === 401) {
    const tokens = await refreshTokens();
    if (tokens) {
      fetchParams.token = tokens.accessToken;
      return await fetch(url, fetchParams);
    }
  }
  return response;
}