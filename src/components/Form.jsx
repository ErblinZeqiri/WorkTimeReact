import React, { useState, useEffect } from "react";
import "./Form.css";
import { ref, update, get, child, getDatabase } from "firebase/database";
import { calculateTimeDifference } from "./Utils";

const Form = ({ user, onClose }) => {
  const [prestations, setPrestations] = useState({
    userId: user.uid,
    date: "",
    client: "",
    categorie: "",
    description: "",
    inter_de: "",
    inter_a: "",
    total_inter: 0,
  });

  const [clients, setClients] = useState([]);
  const [catPrestas, setCatPresat] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const database = getDatabase(user.app);

  useEffect(() => {
    const fetchClients = async () => {
      const entrepriseRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/clients`
      );
      const snapshot = await get(entrepriseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setClients(Object.values(data));
      } else {
        console.log("No clients available");
      }
    };

    fetchClients();
  }, [database, user.entrepriseId]);

  useEffect(() => {
    const fetchcatPresta = async () => {
      const entrepriseRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/categories_prestations`
      );
      const snapshot = await get(entrepriseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCatPresat(Object.values(data));
      } else {
        console.log("No categories available");
      }
    };

    fetchcatPresta();
  }, [database, user.entrepriseId]);

  const handleDateChange = (event) => {
    const { value } = event.target;
    setPrestations((prevPrestations) => ({
      ...prevPrestations,
      date: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestations((prevPrestations) => ({
      ...prevPrestations,
      [name]: value,
    }));
  };

  const validateForm = () => {
    for (let key in prestations) {
      if (key !== "total_inter" && prestations[key].trim() === "") {
        return false;
      }
    }
    if (prestations.inter_de > prestations.inter_a) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      const { differenceHours, differenceMinutes } = calculateTimeDifference(
        prestations.inter_de,
        prestations.inter_a
      );
    
      const total_inter = `${differenceHours}:${differenceMinutes < 10 ? '0' : ''}${differenceMinutes}`;
    

      const updatedPrestations = {
        ...prestations,
        total_inter,
      };

      const userRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/prestations`
      );
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let updateData = {};

        const keys = Object.keys(data);

        const maxIndex =
          keys.length > 0 ? Math.max(...keys.map((key) => parseInt(key))) : -1;

        const nextIndex = maxIndex === -1 ? 0 : maxIndex + 1;

        const newKey = nextIndex.toString();
        updateData[newKey] = updatedPrestations;

        await update(userRef, updateData);
      } else {
        await update(userRef, { 0: updatedPrestations });
      }
      onClose();
    } else {
      if (prestations["inter_de"] > prestations["inter_a"]) {
        setErrorMessage("Mauvaise saisie des intervalles.");
      } else {
        setErrorMessage("Veuillez remplir tous les champs.");
      }
    }
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
                  value={prestations.date}
                  onChange={handleDateChange}
                  dateformat="yyyy-MM-dd"
                  placeholder="Select a date"
                />
                <select
                  name="client"
                  className="form-add-data-input"
                  value={prestations.client}
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
                  value={prestations.categorie}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {catPrestas.map((catPresta, index) => (
                    <option key={index} value={catPresta}>
                      {catPresta}
                    </option>
                  ))}
                </select>
                <textarea
                  type="textarea"
                  name="description"
                  className="form-add-data-input form-add-data-input-textarea"
                  placeholder="Description"
                  value={prestations.description}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="inter_de"
                  className="form-add-data-input"
                  placeholder="Intervalle de prestation"
                  value={prestations.inter_de}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="inter_a"
                  className="form-add-data-input"
                  placeholder="Intervalle de prestation"
                  value={prestations.inter_a}
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
