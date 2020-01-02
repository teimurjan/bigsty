export const arePropsEqual = <T extends object>(
  prevProps: T,
  nextProps: T,
  pickedProps: Array<keyof T | { key: keyof T; compare: (prev: T[keyof T], next: T[keyof T]) => boolean }>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const deepEqual = require('fast-deep-equal/es6/react');

  return pickedProps.every(pickedProp => {
    const key = typeof pickedProp === 'object' ? pickedProp.key : pickedProp;

    const compare = (prev: T[keyof T], next: T[keyof T]) => {
      if (typeof pickedProp === 'object') {
        pickedProp.compare(prev, next);
      }

      if (typeof prevProps[key] === 'object') {
        return deepEqual(prev, next);
      }

      return prev === next;
    };

    return compare(prevProps[key], nextProps[key]);
  });
};

export const lengthCompare = <T>(prev: T[], next: T[]) => prev.length === next.length;
