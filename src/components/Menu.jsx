import React from "react";
import "./Menu.css";
import { useSelector } from "react-redux";

const Menu = ({ openModal, logout }) => {
  const user = useSelector((state) => state.user.userData);

  return (
    <div className="menu-container">
      <input id="check" type="checkbox" className="menu-checkbox" />
      <label htmlFor="check" className="menuButton">
        <span>
          {user && <>{user.nom}</>}
          <img src="./src/assets/images/down-arrow.svg" />
        </span>
      </label>
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
    </div>
  );
};

export default Menu;
