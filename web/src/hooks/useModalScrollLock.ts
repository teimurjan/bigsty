import * as React from 'react';

export const useModalScrollLock = () => {
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevMaxHeight = document.body.style.maxHeight;

    document.body.style.overflow = 'hidden';
    document.body.style.maxHeight = '100vh';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.maxHeight = prevMaxHeight;
    };
  }, []);
};
