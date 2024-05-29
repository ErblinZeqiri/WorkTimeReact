import { useEffect, useRef } from "react";

export const useOutsideClick = () => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event, func) => {
      if (ref.current && !ref.current.contains(event.target)) {
        func();
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  });

  return ref;
};
