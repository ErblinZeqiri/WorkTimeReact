import React, { useState, useEffect } from "react";
import { ref, get, child, getDatabase } from "firebase/database";
import "./DisplayElements.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const DisplayElements = ({ user }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const database = getDatabase(user.app);
    const collectionRef = child(
      ref(database),
      "entreprises/" + user.entrepriseId + "/prestations"
    );

    const fetchData = async () => {
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

  const calculateTimeDifference = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startMilliseconds =
      startHours * 60 * 60 * 1000 + startMinutes * 60 * 1000;
    const endMilliseconds = endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000;

    const differenceMilliseconds = endMilliseconds - startMilliseconds;

    const differenceHours = Math.floor(
      differenceMilliseconds / (60 * 60 * 1000)
    );
    const differenceMinutes = Math.floor(
      (differenceMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
    );

    return `${differenceHours}h ${differenceMinutes}m`;
  };

  return (
    <>
      <h1>Listes des heures</h1>
      {elements.length > 0 ? (
        <div className="accordion" id="accordionExample">
          {elements.map(([key, element], index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed bg-primary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {element.date || "No Title"}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-start bg-primary-subtle">
                  <p>Client: {element.client}</p>
                  <p>Date: {element.date}</p>
                  <p>Catégorie: {element.categorie}</p>
                  <p>Description: {element.description}</p>
                  <p>
                    Temps de travail:{" "}
                    {calculateTimeDifference(element.inter_de, element.inter_a)}
                  </p>
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
