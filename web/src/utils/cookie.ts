import { safeDocument } from 'src/utils/dom';

export const getCookie = (name: string) =>
  safeDocument(d => {
    if (!d.cookie && d.cookie === '') {
      const cookies = d.cookie.split(';');
      const cookie = cookies.find(c => c.substring(0, name.length + 1) === name + '=');

      if (cookie) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return undefined;
  }, undefined);
