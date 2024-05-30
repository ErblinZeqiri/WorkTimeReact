import React, { useEffect, useState } from "react";
import { ref, get, child, getDatabase } from "firebase/database";
import { setClients, setCategories } from "../utils/store";
import { useSelector, useDispatch } from "react-redux";

const SortInput = ({ month, setFilters }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const firebaseApp = useSelector((state) => state.firebase);
  const clients = useSelector((state) => state.clients);
  const [prestations, setPrestations] = useState({});
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
        dispatch(
          setClients({ entrepriseId: { clients: Object.values(data) } })
        );
      } else {
        console.log("No clients available");
      }
    };

    if (user?.entrepriseId) {
      fetchClients();
    }
  }, [database, user?.entrepriseId, dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      const entrepriseRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/categories_prestations`
      );
      const snapshot = await get(entrepriseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(
          setCategories({
            entrepriseId: { categories_prestations: Object.values(data) },
          })
        );
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
    setFilters(resetState);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <select
              name="categorie"
              className="form-select"
              aria-label="Default select example"
              value={prestations.categorie}
              onChange={handleChange}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((catPresta, index) => (
                <option key={index} value={catPresta}>
                  {catPresta}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              name="client"
              className="form-select"
              aria-label="Default select example"
              value={prestations.client}
              onChange={handleChange}
            >
              <option value="">Sélectionner un client</option>
              {Array.isArray(clients)
                ? clients.map((client, index) => (
                    <option key={index} value={client.nom}>
                      {client.nom}
                    </option>
                  ))
                : null}
            </select>
          </div>
          <div className="col">
            <select
              id="mois"
              name="mois"
              className="form-select"
              aria-label="Default select example"
              value={prestations.mois}
              onChange={handleChange}
            >
              <option value="">Sélectionner un mois</option>
              {month.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="date"
              name="date"
              className="form-select"
              value={prestations.date}
              onChange={handleDateChange}
              placeholder="Sélectionner une date"
            />
          </div>
          <div className="col">
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleSubmit}
            >
              Search
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortInput;
