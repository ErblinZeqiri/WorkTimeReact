import React from 'react';
import './Menu.css';

const Menu = ({ openModal, logout }) => {
  return (
    <div className="menu-container">
      <input id="check" type="checkbox" className="menu-checkbox" />
      <label htmlFor="check" className="menuButton">
        <span className="top"></span>
        <span className="mid"></span>
        <span className="bot"></span>
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
              Deconnexion
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
