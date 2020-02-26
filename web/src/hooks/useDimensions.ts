import * as React from 'react';

export const triggerDimensionsCorrect = () => window.dispatchEvent(new Event('resize'));

export const useDimensions = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  getElementDimensions: (el: T) => { width: number; height: number } = el => el.getBoundingClientRect(),
) => {
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | undefined>(undefined);

  const correctDimensions = React.useCallback(() => {
    if (ref.current) {
      const { width, height } = getElementDimensions(ref.current);
      if (!dimensions || width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
      }
    }
  }, [ref, getElementDimensions, dimensions]);

  React.useLayoutEffect(() => {
    if (ref.current) {
      correctDimensions();

      window.addEventListener('resize', correctDimensions);
      return () => window.removeEventListener('resize', correctDimensions);
    }

    return undefined;
  }, [ref, correctDimensions, dimensions]);

  return dimensions;
};
