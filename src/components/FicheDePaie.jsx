import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { groupByMonth } from "./Utils";
import { ref, get, child, getDatabase } from "firebase/database";

const FicheDePaie = () => {
  const [elements, setElements] = useState([]);
  const location = useLocation();
  const { monthYear, user } = location.state || {};
  const navigate = useNavigate();

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

  const groupedElements = groupByMonth(elements);

  if (!monthYear || !user || !groupedElements) {
    return <div>Les données nécessaires ne sont pas disponibles.</div>;
  }

  const elementsForMonth = groupedElements[monthYear] || [];
  const totalHours = elementsForMonth.reduce((total, element) => {
    const hours = parseFloat(element.total_inter);
    return total + hours;
  }, 0);

  const salaireBrut = totalHours * user.tarif_horaire;
  const avs = (salaireBrut * 5) / 100;
  return (
    <>
      <div style={{textAlign: "center"}}>
        <button onClick={() => navigate("/dashboard")}>Retour</button>
        <h1>Fiche de Paie</h1>
        <h2>Mois de {monthYear}</h2>
        <p>
          {user.capitalizedName} {user.capitalizedFirstName}
        </p>
        <p>{user.nomEntreprise}</p>
        <h2>Détails des heures:</h2>
        {elementsForMonth.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Catégorie</th>
                  <th>Nombre d'heures</th>
                </tr>
              </thead>
              <tbody>
                {elementsForMonth.map((element, idx) => (
                  <tr key={idx}>
                    <td className="border">{element.date}</td>
                    <td className="border">{element.client}</td>
                    <td className="border">{element.categorie}</td>
                    <td className="border">{element.total_inter}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Total des heures ce mois: {totalHours}h
              <br />
              Tarif par heure : {user.tarif_horaire}
              <br />
              Salaire brut : {salaireBrut} CHF
              <br />
              AVS : {avs}
              <br />
              Salaire net : {salaireBrut - avs} CHF
            </p>
          </>
        ) : (
          <p>Pas d'heures enregistrées pour ce mois.</p>
        )}
      </div>
    </>
  );
};

export default FicheDePaie;
