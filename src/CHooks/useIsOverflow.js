import * as React from "react";

export const useIsOverflow = (ref, callback, callbackHoriz) => {
  const [isOverflow, setIsOverflow] = React.useState(undefined);
  const [isOverflowHoriz, setIsOverflowHoriz] = React.useState(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    const triggerHoriz = () => {
      console.log(current.scrollWidth, current.clientWidth);
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflowHoriz(hasOverflow);

      if (callbackHoriz) callback(hasOverflow);
    };

    if (current) {
      if ("ResizeObserver" in window) {
        new ResizeObserver(trigger).observe(current);
        new ResizeObserver(triggerHoriz).observe(current);
      }

      trigger();
      triggerHoriz();
    }
  }, [callback, ref, callbackHoriz]);

  return { isOverflow, isOverflowHoriz };
};
