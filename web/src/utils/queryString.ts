export const buildQueryString = (queryObj: {
  [key: string]: string | number | undefined;
}) => {
  const queryArr = Object.keys(queryObj).reduce(
    (acc, k) =>
      typeof queryObj[k] !== "undefined"
        ? [
            ...acc,
            `${encodeURIComponent(k)}=${encodeURIComponent(queryObj[
              k
            ] as string)}`
          ]
        : acc,
    []
  );

  return queryArr.length > 0 ? `?${queryArr.join("&")}` : "";
};
