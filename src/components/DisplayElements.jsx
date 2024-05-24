import React, { useState, useEffect } from "react";
import { ref, get, child, getDatabase } from "firebase/database";
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

const DisplayElements = ({ user }) => {
  const [elements, setElements] = useState([]);
  const [filters, setFilters] = useState({});
  const [month, setMonth] = useState([
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
  const [userNames, setUserNames] = useState({});
  const navigate = useNavigate();
  const database = getDatabase(user.app);

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/prestations`
      );

      try {
        const snapshot = await get(collectionRef);
        if (snapshot.exists()) {
          const data = snapshot.val();

          if (user.role === "admin") {
            setElements(Object.entries(data));
          } else {
            const userPresta = Object.entries(data).filter(
              ([key, element]) => element.userId === user.uid
            );
            setElements(userPresta);
          }
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.app, user.uid, user.role]);

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

  const filteredElements = applyFilters(elements);
  const groupedElements = groupByMonth(filteredElements);

  useEffect(() => {
    const prestaUserIdsMap = {};

    for (const month in groupedElements) {
      if (groupedElements.hasOwnProperty(month)) {
        groupedElements[month].forEach((element) => {
          prestaUserIdsMap[element.userId] = true;
        });
      }
    }

    const userIds = Object.keys(prestaUserIdsMap);

    const fetchUserNames = async () => {
      for (const userId of userIds) {
        try {
          const userSnapshot = await get(
            child(ref(database), `users/${userId}`)
          );
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUserNames((prevUserNames) => ({
              ...prevUserNames,
              [userId]: {
                nom: userData.nom,
                prenom: userData.prenom,
              },
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserNames();
  }, [database, groupedElements]);

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
    const {
      uid,
      capitalizedName,
      capitalizedFirstName,
      entrepriseId,
      tarif_horaire,
    } = user;

    const entrepriseData = (
      await get(child(ref(database), `entreprises/${user.entrepriseId}`))
    ).val();

    const nomEntreprise = entrepriseData.nom;

    const simpleUser = {
      uid,
      capitalizedName,
      capitalizedFirstName,
      entrepriseId,
      tarif_horaire,
      nomEntreprise,
    };
    navigate("/fiche-de-paie", { state: { monthYear, user: simpleUser } });
  };

  return (
    <>
      <h1>Listes des heures</h1>
      <SortInput user={user} month={month} setFilters={setFilters} />
      {sortedMonths.length > 0 ? (
        <div className="accordion">
          {sortedMonths.map((monthYear, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
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
                  <a href="#" onClick={() => ficheDePaie(monthYear)}>
                    Fiche de paie
                  </a>
                </button>
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
                    const userName = userNames[element.userId] || {
                      nom: "Nom",
                      prenom: "inconnu",
                    };

                    return (
                      <div key={idx}>
                        {user.role === "admin" && (
                          <p>
                            Nom de l'employé : {userName.nom} {userName.prenom}
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
