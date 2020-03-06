import * as React from 'react';

export interface State {
  x: number;
  y: number;
}

export const useWindowScroll = (): State => {
  const [state, setState] = React.useState<State>({
    x: window ? window.pageXOffset : 0,
    y: window ? window.pageYOffset : 0,
  });

  React.useEffect(() => {
    const handler = () => {
      setState({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return state;
};
