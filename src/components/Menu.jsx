import React from 'react';
import './Menu.css';

const Menu = ({ openModal, logout }) => {
  return (
    <div className="menu-container">
      {/* Case à cocher pour le bouton de menu */}
      <input id="check" type="checkbox" className="menu-checkbox" />
      {/* Bouton de menu déroulant */}
      <label htmlFor="check" className="menuButton">
        {/* Trois lignes pour simuler un hamburger menu */}
        <span className="top"></span>
        <span className="mid"></span>
        <span className="bot"></span>
      </label>
      {/* Options de menu */}
      <div className="menu-options">
        <ul>
          {/* Option pour ouvrir le formulaire */}
          <li>
            <a href="#" onClick={openModal}>
              Ouvrir le formulaire
            </a>
          </li>
          {/* Option pour se déconnecter */}
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
