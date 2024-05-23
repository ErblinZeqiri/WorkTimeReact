import React, { useEffect, useState } from "react";
import { ref, get, child, getDatabase } from "firebase/database";

const SortInput = ({ user, month }) => {
  const [prestations, setPrestations] = useState({
    userId: user.uid,
    date: "",
    client: "",
    categorie: "",
    description: "",
    inter_de: "",
    inter_a: "",
    mois: "",
  });
  const [clients, setClients] = useState([]);
  const database = getDatabase(user.app);
  const [catPrestas, setCatPresat] = useState([]);

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
        console.log("No clients available");
      }
    };

    fetchcatPresta();
  }, [database, user.entrepriseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestations((prevPrestations) => ({
      ...prevPrestations,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (prestations) {
      console.log("Client sélectionné :", prestations);
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setPrestations((prevPrestations) => ({
      ...prevPrestations,
      date: value,
    }));
  };

  const handleResetFilters = () => {
    setPrestations({
      userId: user.uid,
      date: "",
      client: "", 
      categorie: "",
      description: "",
      inter_de: "",
      inter_a: "",
      mois: "",
    });
  };
  
  return (
    <>
      <label htmlFor="categorie">Par catégorie :</label>
      <br />
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

      <br />

      <label htmlFor="client">Par client :</label>
      <br />
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

      <br />

      <label htmlFor="mois">Par mois :</label>
      <br />
      <select
        id="mois"
        name="mois"
        value={prestations.mois}
        onChange={handleChange}
        className="form-add-data-input"
      >
        <option value="">Sélectionner un mois</option>
        {month.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="date">Par date :</label>
      <br />
      <input
        type="date"
        name="date"
        className="form-add-data-input"
        value={prestations.date}
        onChange={handleDateChange}
        placeholder="Sélectionner une date"
      />

      <br />

      <button onClick={handleSubmit}>Search</button>
      <button onClick={handleResetFilters}>Reset Filters</button>
    </>
  );
};

export default SortInput;
