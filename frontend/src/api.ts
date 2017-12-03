const GET: string = 'GET';
const POST: string = 'POST';
const PUT: string = 'PUT';
const PATCH: string = 'PATCH';
const DELETE: string = 'DELETE';

type StubData = { isError?: boolean } | null

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

async function makeRequest(method: string, url: string, payload: {} | null = null, stubData: StubData = null) {
    if (stubData) {
        await setTimeout(1000);
        if (stubData.isError) {
            throw stubData;
        } else {
            return stubData;
        }
    }

    const fetchParams: RequestInit = {
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
    if (payload) {
        fetchParams.body = JSON.stringify(payload);
    }

    const response = await fetch(url, fetchParams);
    const body = await response.text();
    if (response.status >= 400) {
        throw parseJsonOrReturnPlain(body);
    } else {
        return parseJsonOrReturnPlain(body);
    }
}

export async function get(url: string, stubData: StubData = null) {
    return await makeRequest(GET, url, null, stubData);
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
    return await makeRequest(DELETE, url, null, stubData);
}