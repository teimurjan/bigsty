function playWithResponsePromise(response) {
  return new Promise((resolve, reject) => response.json().then(response.status < 400 ? resolve : reject));
}

function makeRequest(method, url, token, data = null) {
  let fetchParams = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  if (data)
    fetchParams.body = JSON.stringify(data);
  return fetch(url, fetchParams).then(playWithResponsePromise);
}

export function get(url, token) {
  return makeRequest('GET', url, token);
}

export function post(url, data, token) {
  return makeRequest('POST', url, token, data);
}

export function update(url, data, token) {
  return makeRequest('PUT', url, token, data);
}

export function patch(url, data, token) {
  return makeRequest('PATCH', url, token, data);
}

export function remove(url, token, data = null) {
  return makeRequest('DELETE', url, token, data);
}