import React from "react";
const useMutationObserver = (
  ref,
  callback,
  options = {
    characterData: true,
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  }
) => {
  React.useEffect(() => {
    if (ref.current.firstChild) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [ref]);
};

export default useMutationObserver;
