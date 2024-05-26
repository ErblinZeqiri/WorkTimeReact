import React, { useEffect, useState } from "react";
import "./Form.css";
import { ref, update, child, get, getDatabase } from "firebase/database";
import { calculateTimeDifference } from "./Utils";
import { useDispatch, useSelector } from "react-redux";
import { addPrestation, setClients, setCategories } from "./store";

const Form = ({ onClose }) => {
  const user = useSelector((state) => state.user);
  const clients = useSelector((state) => state.clients);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const initialPrestationState = {
    userId: user.uid,
    date: "",
    client: "",
    categorie: "",
    description: "",
    inter_de: "",
    inter_a: "",
    total_inter: 0,
  };

  const [currentPrestation, setCurrentPrestation] = useState(
    initialPrestationState
  );
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
        dispatch(setClients(Object.values(data)));
      } else {
        console.log("Aucun client disponible");
      }
    };

    const fetchCategories = async () => {
      const entrepriseRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/categories_prestations`
      );
      const snapshot = await get(entrepriseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(setCategories(Object.values(data)));
      } else {
        console.log("Aucune catégorie disponible");
      }
    };

    fetchClients();
    fetchCategories();
  }, [database, user.entrepriseId, dispatch]);

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
      if (key !== "total_inter" && currentPrestation[key].trim() === "") {
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
        let updateData = {};

        const keys = Object.keys(data);
        const maxIndex =
          keys.length > 0 ? Math.max(...keys.map((key) => parseInt(key))) : -1;
        const nextIndex = maxIndex === -1 ? 0 : maxIndex + 1;
        const newKey = nextIndex.toString();
        updateData[newKey] = updatedPrestation;

        await update(userRef, updateData);
      } else {
        await update(userRef, { 0: updatedPrestation });
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
                  type="textarea"
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
              <button onClick={handleSubmit}>Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
