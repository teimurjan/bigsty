import { match } from 'react-router';

export const getNumberParam = <T extends { [key: string]: string }>(
  m: match<T>,
  paramKey: keyof T,
): number | undefined => {
  const paramStr = m.params[paramKey];

  return paramStr ? parseInt(paramStr, 10) : undefined;
};

export const formatMediaURL = (url: string) =>
  url.startsWith('/') ? `${process.env.REACT_APP_SERVER_URL}${url}` : url;

export const formatStaticURL = (url: string) => `${process.env.PUBLIC_URL || ''}/${url}`;
