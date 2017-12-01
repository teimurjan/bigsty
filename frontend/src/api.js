function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function parsePayload(payload) {
  try {
    return JSON.parse(payload);
  } catch (err) {
    return payload;
  }
}

async function makeRequest(method, url, data = null, stubData = null) {
  if (stubData) {
    await setTimeout(1000);
    if (stubData.isError) {
      throw stubData;
    } else {
      return stubData;
    }
  }

  let fetchParams = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    credentials: 'include'
  };
  const token = localStorage.getItem('token');
  if (token) {
    fetchParams.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    fetchParams.body = JSON.stringify(data);
  }

  const response = await fetch(url, fetchParams);
  const payload = await response.text();
  if (response.status >= 400) {
    throw parsePayload(payload);
  } else {
    return parsePayload(payload);
  }
}

export async function get(url, stubData = null) {
  return await makeRequest('GET', url, null, stubData);
}

export async function post(url, data, stubData = null) {
  return await makeRequest('POST', url, data, stubData);
}

export async function put(url, data, stubData = null) {
  return await makeRequest('PUT', url, data, stubData);
}

export async function patch(url, data, stubData = null) {
  return await makeRequest('PATCH', url, data, stubData);
}

export async function remove(url, stubData = null) {
  return await makeRequest('DELETE', url, null, stubData);
}