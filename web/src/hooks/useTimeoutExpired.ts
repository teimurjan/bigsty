import * as React from "react";

export const useTimeoutExpired = (
  delay: number = 100 // milliseconds
) => {
  const [isTimeoutExpired, setTimeoutExpired] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setTimeoutExpired(true), delay);

    return () => clearTimeout(t);
  }, []);

  return isTimeoutExpired;
};
