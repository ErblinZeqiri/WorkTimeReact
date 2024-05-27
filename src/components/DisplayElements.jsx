import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, setClients } from "./store";
import { getDatabase, ref, child, get } from "firebase/database";
import {
  calculateTimeDifference,
  groupByMonth,
  totalHoursMinutes,
  compareMonthToPrevious,
} from "./Utils";
import "./DisplayElements.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SortInput from "./SortInput";
import { useNavigate } from "react-router-dom";

const DisplayElements = () => {
  const dispatch = useDispatch();
  const [elements, setElements] = useState([]);
  const [filters, setFilters] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [month] = useState([
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ]);
  const user = useSelector((state) => state.user.userData);
  const firebaseApp = useSelector((state) => state.firebase);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && firebaseApp) {
      dispatch(fetchUserData(user.uid)); // Fetch user data
    }
  }, [user, firebaseApp, dispatch]);

  // Fetch prestations data and user data when user is available
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const database = getDatabase(firebaseApp);
        const prestationsRef = child(
          ref(database),
          `entreprises/${user.entrepriseId}/prestations`
        );
        const usersRef = child(ref(database), `users`);

        try {
          const [prestationsSnapshot, usersSnapshot] = await Promise.all([
            get(prestationsRef),
            get(usersRef)
          ]);

          if (prestationsSnapshot.exists() && usersSnapshot.exists()) {
            const prestationsData = prestationsSnapshot.val();
            const usersData = usersSnapshot.val();

            const userPresta = user.role === "admin"
              ? Object.entries(prestationsData)
              : Object.entries(prestationsData).filter(
                  ([key, element]) => element.userId === user.uid
                );

            setElements(userPresta);
            setUsersData(usersData);
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [user, firebaseApp]);

  useEffect(() => {
    if (filters.client) {
      dispatch(setClients(filters.client));
    }
  }, [filters.client, dispatch]);

  const applyFilters = (elements) => {
    if (!filters || Object.keys(filters).length === 0) {
      return elements;
    }

    return elements.filter(([key, element]) => {
      const { client, categorie, mois, date } = filters;

      const elementMonth = new Date(element.date)
        .toLocaleString("fr-FR", { month: "long" })
        .toLowerCase();

      return (
        (!client || element.client === client) &&
        (!categorie || element.categorie === categorie) &&
        (!mois || elementMonth === mois.toLowerCase()) &&
        (!date || element.date === date)
      );
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredElements = applyFilters(elements);
  const groupedElements = groupByMonth(filteredElements);

  const totalWorkTime = totalHoursMinutes(groupedElements);
  const monthComparisons = compareMonthToPrevious(groupedElements);

  const sortedMonths = Object.keys(groupedElements).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");

    const aDate = new Date(
      `${aYear}-${month.indexOf(aMonth.toLowerCase()) + 1}-01`
    );
    const bDate = new Date(
      `${bYear}-${month.indexOf(bMonth.toLowerCase()) + 1}-01`
    );

    return bDate - aDate;
  });

  const ficheDePaie = async (monthYear) => {
    const { uid, nom, prenom, entrepriseId, tarif_horaire } = user;

    const database = getDatabase(firebaseApp);
    const entrepriseData = (
      await get(child(ref(database), `entreprises/${entrepriseId}`))
    ).val();

    const nomEntreprise = entrepriseData.nom;

    const simpleUser = {
      uid,
      nom,
      prenom,
      entrepriseId,
      tarif_horaire,
      nomEntreprise,
    };
    navigate("/fiche-de-paie", { state: { monthYear, user: simpleUser } });
  };

  return (
    <>
      <h1>Listes des heures</h1>
      <SortInput month={month} setFilters={setFilters} />
      {sortedMonths.length > 0 ? (
        <div className="accordion">
          {sortedMonths.map((monthYear, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <a
                  className="accordion-button collapsed bg-gradient"
                  style={{ backgroundColor: "#003C43", color: "white" }}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {`${monthYear} | ${totalWorkTime[monthYear].totalHours}h ${totalWorkTime[monthYear].totalMinutes}m `}
                  {monthComparisons[monthYear] !== null && (
                    <span> | {monthComparisons[monthYear].toFixed(2)}%</span>
                  )}

                  <button
                    className="btn-link"
                    onClick={() => ficheDePaie(monthYear)}
                  >
                    Fiche de paie
                  </button>
                </a>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#accordionExample"
              >
                <div
                  className="accordion-body text-start"
                  style={{ backgroundColor: "#77B0AA" }}
                >
                  {groupedElements[monthYear].map((element, idx) => {
                    const { differenceHours, differenceMinutes } =
                      calculateTimeDifference(
                        element.inter_de,
                        element.inter_a
                      );

                    const userData = usersData[element.userId];

                    return (
                      <div key={idx}>
                        {user.role === "admin" && userData && (
                          <p>
                            Nom de l'employé : {userData.prenom} {userData.nom}
                          </p>
                        )}
                        <p>Client: {element.client}</p>
                        <p>Date: {element.date}</p>
                        <p>Catégorie: {element.categorie}</p>
                        <p>Description: {element.description}</p>
                        <p>
                          Temps de travail: {differenceHours}h :{" "}
                          {differenceMinutes}m
                        </p>
                        {idx < elements.length - 1 && <hr />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2>Pas d'heures enregistrées</h2>
      )}
    </>
  );
};

export default DisplayElements;
