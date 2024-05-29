import React, { useState } from "react";
import "./Menu.css";
import { useSelector } from "react-redux";
import { useOutsideClick } from "./useOutsideClick";

const Menu = ({ openModal, logout }) => {
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
  };

  return (
    <div
      ref={ref}
      className={`menu-container dropdown ${showDropdown ? "show" : ""}`}
    >
      <input id="check" type="checkbox" className="menu-checkbox" />
      <label htmlFor="check" className="menuButton" onClick={handleMenuClick}>
        <span>
          {user && <>{user.nom}</>}
          <img src="./src/assets/images/down-arrow.svg" alt="Down Arrow" />
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
