import { StubData } from '../../typings/api';

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

export function getBaseFetchParams(method: string): RequestInit {
  return {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App': 1,
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'include',
  };
}

export function getFetchParams(method: string, payload?: {}): RequestInit {
  const fetchParams = getBaseFetchParams(method);
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    fetchParams.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (typeof payload === 'string') {
    fetchParams.body = payload;
  } else if (typeof payload === 'object') {
    fetchParams.body = JSON.stringify(payload);
  }
  return fetchParams;
}

export function makeResponseFromStub({status = 200, ...stubData}: StubData) {
  return new Response(JSON.stringify(stubData), {status: status});
}