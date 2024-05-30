import { useEffect, useRef } from "react";

export const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Modifiez la vérification pour exclure le formulaire
    const handleClickOutsideExceptForm = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.closest(".form-add-data")
      ) {
        callback();
      }
    };

    document.addEventListener("mouseup", handleClickOutsideExceptForm);
    document.addEventListener("touchend", handleClickOutsideExceptForm);

    return () => {
      document.removeEventListener("mouseup", handleClickOutsideExceptForm);
      document.removeEventListener("touchend", handleClickOutsideExceptForm);
    };
  }, [callback]);

  return ref;
};
