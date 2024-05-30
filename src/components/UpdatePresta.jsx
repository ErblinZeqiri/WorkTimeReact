import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDatabase,
  ref,
  child,
  get,
  update,
  onValue,
} from "firebase/database";
import { calculateTimeDifference } from "./Utils";
import "./DisplayElements.css";
import "./loading.css";
import { addPrestation } from "./store";

const UpdatePresta = ({ onClose, data }) => {
  const user = useSelector((state) => state.user.userData);
  const clients = useSelector((state) => state.clients);
  const firebaseApp = useSelector((state) => state.firebase);
  const categories = useSelector((state) => state.categories);
  const database = getDatabase(firebaseApp);
  const dispatch = useDispatch();

  const [currentPrestation, setCurrentPrestation] = useState(data);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (event) => {
    const { value } = event.target;
    setCurrentPrestation((prevPrestation) => ({
      ...prevPrestation,
      date: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPrestation((prevPrestation) => ({
      ...prevPrestation,
      [name]: value,
    }));
  };

  const validateForm = () => {
    for (let key in currentPrestation) {
      if (
        key !== "total_inter" &&
        (!currentPrestation[key] || currentPrestation[key].trim() === "")
      ) {
        return false;
      }
    }
    if (currentPrestation.inter_de > currentPrestation.inter_a) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      const { differenceHours, differenceMinutes } = calculateTimeDifference(
        currentPrestation.inter_de,
        currentPrestation.inter_a
      );

      const total_inter = `${differenceHours}:${
        differenceMinutes < 10 ? "0" : ""
      }${differenceMinutes}`;

      const updatedPrestation = {
        ...currentPrestation,
        total_inter,
      };

      const userRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/prestations`
      );
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let prestationId = null;

        // Vérifiez si la prestation existe déjà
        for (const [key, value] of Object.entries(data)) {
          if (value.id === currentPrestation.id) {
            prestationId = key;
            break;
          }
        }

        if (prestationId !== null) {
          // Mettre à jour la prestation existante
          const updates = {};
          updates[prestationId] = updatedPrestation;
          await update(userRef, updates);
        } else {
          // Ajouter une nouvelle prestation
          const maxIndex =
            Math.max(...Object.keys(data).map((key) => parseInt(key, 10)), -1) +
            1;
          const updates = {};
          updates[maxIndex] = updatedPrestation;
          await update(userRef, updates);
        }
      }
      dispatch(addPrestation(updatedPrestation));
      onClose();
    } else {
      if (currentPrestation.inter_de > currentPrestation.inter_a) {
        setErrorMessage("Mauvaise saisie des intervalles.");
      } else {
        setErrorMessage("Veuillez remplir tous les champs.");
      }
    }
  };

  // const reloadPrestations = async () => {
  //   const userRef = child(ref(database), `entreprises/${user.entrepriseId}/prestations`);
  //   const snapshot = await get(userRef);

  //   if (snapshot.exists()) {
  //     const data = snapshot.val();
  //     // Mettre à jour l'état local avec les données rechargées
  //     dispatch(setPrestations(Object.values(data)));
  //   }
  // };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-box">
          <form className="form-add-data" onSubmit={handleSubmit}>
            <a className="closeButton" onClick={onClose}>
              <span className="X"></span>
              <span className="Y"></span>
              <div className="close">Close</div>
            </a>
            <span className="form-add-data-title">Ajout</span>
            <span className="subtitle">Ajouter une heure de travail.</span>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="form-add-data-container">
              <input
                type="date"
                name="date"
                className="form-add-data-input"
                value={currentPrestation.date}
                onChange={handleDateChange}
                dateformat="yyyy-MM-dd"
                placeholder="Select a date"
              />
              <select
                name="client"
                className="form-add-data-input"
                value={currentPrestation.client}
                onChange={handleChange}
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client, index) => (
                  <option key={index} value={client.nom}>
                    {client.nom}
                  </option>
                ))}
              </select>
              <select
                name="categorie"
                className="form-add-data-input"
                value={currentPrestation.categorie}
                onChange={handleChange}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((catPresta, index) => (
                  <option key={index} value={catPresta}>
                    {catPresta}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                className="form-add-data-input form-add-data-input-textarea"
                placeholder="Description"
                value={currentPrestation.description}
                onChange={handleChange}
              />
              <input
                type="time"
                name="inter_de"
                className="form-add-data-input"
                placeholder="Intervalle de prestation"
                value={currentPrestation.inter_de}
                onChange={handleChange}
              />
              <input
                type="time"
                name="inter_a"
                className="form-add-data-input"
                placeholder="Intervalle de prestation"
                value={currentPrestation.inter_a}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePresta;
