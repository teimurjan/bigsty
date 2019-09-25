import * as React from "react";

export const useClickOutside = (
  refs: React.RefObject<HTMLElement> | Array<React.RefObject<HTMLElement>>,
  callback: () => any
) => {
  React.useEffect(() => {
    const handleClick: EventListener = e => {
      // Checks if the element was not removed from the DOM
      // before getting to this handler
      if (e.target && document.body.contains(e.target as Node)) {
        if (Array.isArray(refs)) {
          const refsIncluded = refs.map(
            ref => ref.current && ref.current.contains(e.target as Node)
          );
          if (refsIncluded.every(i => !i)) {
            callback();
          }
        } else {
          if (
            refs &&
            refs.current &&
            !refs.current.contains(e.target as Node)
          ) {
            callback();
          }
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback, refs]);
};

export default useClickOutside;
