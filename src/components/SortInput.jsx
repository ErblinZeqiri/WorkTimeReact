import React, { useEffect } from "react";
import { ref, get, child, getDatabase } from "firebase/database";
import { setClients, setPrestations, setCategories } from "./store";
import { useSelector, useDispatch } from "react-redux";

const SortInput = ({ month, setFilters }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const firebaseApp = useSelector((state) => state.firebase);
  const clients = useSelector((state) => state.clients);
  const prestations = useSelector((state) => state.prestations);
  const categories = useSelector((state) => state.categories);
  const database = getDatabase(firebaseApp);

  useEffect(() => {
    const fetchClients = async () => {
      const entrepriseRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/clients`
      );
      const snapshot = await get(entrepriseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(setClients(data.nom));
      } else {
        console.log("No clients available");
      }
    };

    if (user?.entrepriseId) {
      fetchClients();
    }
  }, [database, user.entrepriseId, dispatch]);

  useEffect(() => {
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
        console.log("No categories available");
      }
    };

    if (user?.entrepriseId) {
      fetchCategories();
    }
  }, [database, user?.entrepriseId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPrestations({ [name]: value }));
  };

  const handleSubmit = () => {
    setFilters(prestations);
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    dispatch(setPrestations({ date: value }));
  };

  const handleResetFilters = () => {
    const resetState = {
      userId: user.uid,
      date: "",
      client: "",
      categorie: "",
      description: "",
      inter_de: "",
      inter_a: "",
      mois: "",
    };
    dispatch(setPrestations(resetState));
    setFilters(resetState);
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
        {categories.flatMap((catPresta, index) => (
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
        {clients.flatMap((client, index) => (
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
        {month.flatMap((month, index) => (
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
