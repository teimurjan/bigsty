import urls from './urls';

const GET: string = 'GET';
const POST: string = 'POST';
const PUT: string = 'PUT';
const PATCH: string = 'PATCH';
const DELETE: string = 'DELETE';

type StubData = { isError?: boolean } | null;

function getCookie(name: string): string | null {
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

function parseJsonOrReturnPlain(payload: string): {} | string {
  try {
    return JSON.parse(payload);
  } catch (err) {
    return payload;
  }
}

function getFetchParams(method: string, payload?: {}): RequestInit {
  const fetchParams: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-App': 1,
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'include'
  };
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    fetchParams.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (payload) {
    fetchParams.body = JSON.stringify(payload);
  }
  return fetchParams;
}

async function handle401(onRefresh: Function) {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken !== undefined) {
    const fetchParams = getFetchParams(POST, {refresh_token: refreshToken});
    const refreshResponse = await fetch(urls.refreshToken, fetchParams);
    if (refreshResponse.status !== 401) {
      const parsedBody = await refreshResponse.json();
      const {refresh_token, access_token} = parsedBody;
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('access_token', access_token);
      return await onRefresh();
    }
  }
}

async function makeRequest(method: string, url: string, payload?: {}, stubData: StubData = null) {
  if (stubData) {
    await setTimeout(1000);
    if (stubData.isError) {
      throw stubData;
    } else {
      return stubData;
    }
  }

  const sendRequest = fetch.bind(undefined, url, getFetchParams(method, payload));
  let response = await sendRequest();
  const body = await response.text();
  if (response.status === 401) {
    response = await handle401(sendRequest);
    if (response === undefined) {
      return console.log('unable to refresh');
    }
  }
  if (response.status >= 400) {
    throw parseJsonOrReturnPlain(body);
  } else {
    return parseJsonOrReturnPlain(body);
  }
}

export async function get(url: string, stubData: StubData = null) {
  return await makeRequest(GET, url, undefined, stubData);
}

export async function post(url: string, payload: {}, stubData: StubData = null) {
  return await makeRequest(POST, url, payload, stubData);
}

export async function put(url: string, payload: {}, stubData: StubData = null) {
  return await makeRequest(PUT, url, payload, stubData);
}

export async function patch(url: string, payload: {}, stubData: StubData = null) {
  return await makeRequest(PATCH, url, payload, stubData);
}

export async function remove(url: string, stubData: StubData = null) {
  return await makeRequest(DELETE, url, undefined, stubData);
}