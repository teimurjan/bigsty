import Mousetrap from 'mousetrap';
import React from 'react';

export const useMousetrap = (keys: string | string[], callback: () => void) => {
  React.useEffect(() => {
    const mousetrapInstance = Mousetrap.bind(keys, callback);
    return () => {
      mousetrapInstance.unbind(keys);
    };
  }, [keys, callback]);
};
