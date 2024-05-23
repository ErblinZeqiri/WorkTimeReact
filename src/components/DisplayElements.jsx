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

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase(user.app);
      const collectionRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/prestations`
      );

      try {
        const snapshot = await get(collectionRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setElements(Object.entries(data));
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.app, user.uid]);

  const applyFilters = (elements) => {
    if (!filters || Object.keys(filters).length === 0) {
      return elements;
    }

    return elements.filter(([key, element]) => {
      const {
        client,
        categorie,
        mois,
        date,
      } = filters;

      const elementMonth = new Date(element.date).toLocaleString('fr-FR', { month: 'long' }).toLowerCase();
      
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
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-start" style={{ backgroundColor: "#77B0AA" }}>
                  {groupedElements[monthYear].map((element, idx) => {
                    const { differenceHours, differenceMinutes } =
                      calculateTimeDifference(
                        element.inter_de,
                        element.inter_a
                      );
                    return (
                      <div key={idx}>
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
