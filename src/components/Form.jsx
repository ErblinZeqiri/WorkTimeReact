import React from "react";
import "./Form.css"; // Fichier CSS pour le style du formulaire modal

const Form = ({ onClose }) => {
  return (
    <>
      <div className="form-overlay" onClick={onClose}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <div className="form-box">
            <form className="form-add-data">
              <a class="closeButton">
                <span class="X"></span>
                <span class="Y"></span>
                <div class="close">Close</div>
              </a>
              <span className="form-add-data-title">Ajout</span>
              <span className="subtitle">Ajouter une heure de travail.</span>
              <div className="form-add-data-container">
                <input
                  type="text"
                  className="form-add-data-input"
                  placeholder="Titre"
                />
                <input
                  type="text"
                  className="form-add-data-input"
                  placeholder="Client"
                />
                <input
                  type="text"
                  className="form-add-data-input"
                  placeholder="Lieu"
                />
                <input
                  type="text"
                  className="form-add-data-input"
                  placeholder="Description"
                />
              </div>
              <button onClick={(e) => e.stopPropagation()}>Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
