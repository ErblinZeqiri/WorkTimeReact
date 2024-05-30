import React, { useState } from "react";
import "../../styles/Menu.css";
import { useSelector } from "react-redux";
import { useOutsideClick } from "../utils/useOutsideClick";

const Menu = ({ openModal, onClose, logout }) => {
  const user = useSelector((state) => state.user.userData);
  const [showDropdown, setShowDropdown] = useState(false);

  const ref = useOutsideClick(() => {
    setShowDropdown(false);
  });

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleMenuClick = () => {
    toggleDropdown();
    onClose();
  };

  return (
    <div className={`menu-container dropdown`} ref={ref}>
      <input
        id="check"
        type="checkbox"
        className="menu-checkbox"
        onClick={handleMenuClick}
      />
      <label htmlFor="check" className="menuButton">
        <span>
          {user && <>{user.nom}</>}
          <img src="/WorkTimeReact/src/assets/images/down-arrow.svg" alt="Down Arrow" />
        </span>
      </label>
      {showDropdown && (
        <div className="menu-options">
          <ul>
            <li>
              <a href="#" onClick={openModal}>
                Ouvrir le formulaire
              </a>
            </li>
            <li>
              <a href="#" onClick={logout}>
                Déconnexion
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
