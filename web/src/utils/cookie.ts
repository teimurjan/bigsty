import { safeDocument } from 'src/utils/dom';

export const getCookie = (name: string) =>
  safeDocument(d => {
    if (d.cookie && d.cookie !== '') {
      return getCookieFrom(d.cookie, name);
    }
    return undefined;
  }, undefined);

export const getCookieFrom = (cookiesStr: string, name: string) => {
  const cookies = cookiesStr.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  if (cookie) {
    return decodeURIComponent(cookie.trim().replace(`${name}=`, ''));
  }

  return undefined;
};

export const setCookie = (name: string, value: string) =>
  safeDocument(d => {
    d.cookie = `${name}=${value}`;
  }, undefined);

export const setCookieTo = (cookiesStr: string, name: string, value: string) => {
  const cookies = cookiesStr.split(';');
  const newCookies = cookies.map(c => {
    if (c.trim().startsWith(`${name}=`)) {
      return `${name}=${value}`;
    }

    return c;
  });

  return newCookies.join(';');
};

export const removeCookie = (name: string) =>
  safeDocument(d => {
    if (d.cookie && d.cookie !== '') {
      d.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }, undefined);
