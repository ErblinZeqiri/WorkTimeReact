import React, { useState } from "react";
import "./Form.css";
import { ref, update, get, child, getDatabase } from "firebase/database";

const Form = ({ user, onClose }) => {
  const [work, setWork] = useState({
    titre: "",
    client: "",
    lieu: "",
    description: "",
  });
  const database = getDatabase(user.app);

  const validateForm = () => {
    for (let key in work) {
      if (work[key].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userRef = child(ref(database), `Users/${user.uid}`);

    // Vérifie si l'entrée pour cette date existe déjà
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      if (validateForm()) {
        const data = snapshot.val();
        let updateData = {};

        // Récupérer les clés existantes
        const keys = Object.keys(data);

        // Trouver l'index maximum parmi les clés existantes
        const maxIndex =
          keys.length > 0 ? Math.max(...keys.map((key) => parseInt(key))) : -1; // Initialiser à -1 au lieu de 0

        // Déterminer le prochain index
        const nextIndex = maxIndex === -1 ? 0 : maxIndex + 1; // Utiliser 0 si maxIndex est -1

        // Créer la nouvelle clé avec l'index incrémenté
        const newKey = nextIndex.toString();

        // Ajouter la nouvelle clé avec l'heure d'entrée à l'objet de mise à jour
        updateData[newKey] = work;
        console.log(userRef, updateData)

        // Mettre à jour la base de données
        await update(userRef, updateData);
      } else {
        alert("Veuillez remplir tous les champs du formulaire");
      }
    } else {
      // Si l'entrée n'existe pas encore, initialiser avec le premier index
      await update(userRef, { 0: work });
    }
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => ({
      ...prevWork,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="form-overlay" onClick={onClose}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <div className="form-box">
            <form className="form-add-data">
              <a className="closeButton" onClick={onClose}>
                <span className="X"></span>
                <span className="Y"></span>
                <div className="close">Close</div>
              </a>
              <span className="form-add-data-title">Ajout</span>
              <span className="subtitle">Ajouter une heure de travail.</span>
              <div className="form-add-data-container">
                <input
                  type="text"
                  name="titre" // Ajout de l'attribut name
                  className="form-add-data-input"
                  placeholder="Titre"
                  value={work.titre}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="client" // Ajout de l'attribut name
                  className="form-add-data-input"
                  placeholder="Client"
                  value={work.client}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lieu" // Ajout de l'attribut name
                  className="form-add-data-input"
                  placeholder="Lieu"
                  value={work.lieu}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="description" // Ajout de l'attribut name
                  className="form-add-data-input"
                  placeholder="Description"
                  value={work.description}
                  onChange={handleChange}
                />
              </div>
              <button onClick={handleSubmit}>Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
