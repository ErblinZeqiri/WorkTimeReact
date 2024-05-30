import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { groupByMonth } from "../utils/Utils";
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
      <div className="resultat">
        <div className="titre">
          <h1>Fiche de Paie</h1>
          <button onClick={() => navigate("/dashboard")}>Retour</button>
        </div>
        <h2>Mois de {monthYear}</h2>
        <p>
          {user.nom} {user.prenom}
        </p>
        <p>{user.nomEntreprise}</p>
        <h2>Détails des préstations:</h2>

        {elementsForMonth.length > 0 ? (
          <>
            <div className="content">
              <table>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Client</td>
                    <td>Catégorie</td>
                    <td className="right-align">Nombre d'heures</td>
                  </tr>
                </thead>
                <tbody>
                  {elementsForMonth.map((element, idx) => (
                    <tr key={idx}>
                      <td>{element.date}</td>
                      <td>{element.client}</td>
                      <td>{element.categorie}</td>
                      <td className="right-align">{element.total_inter}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total">
              <table>
                <tr>
                  <td>Total des heures ce mois:</td>
                  <td className="right-align">{totalHours}h</td>
                </tr>
                <tr>
                  <td>Tarif par heure :</td>
                  <td className="right-align">{user.tarif_horaire} CHF</td>
                </tr>
                <tr>
                  <td>Salaire brut :</td>
                  <td className="right-align">{salaireBrut} CHF</td>
                </tr>
                <tr>
                  <td>AVS :</td>
                  <td className="right-align">- {avs} CHF</td>
                </tr>
                <tr>
                  <td>
                    <strong>Salaire net :</strong>
                  </td>
                  <td className="right-align">
                    <strong>{salaireBrut - avs} CHF</strong>
                  </td>
                </tr>
              </table>
            </div>
          </>
        ) : (
          <p>Pas d'heures enregistrées pour ce mois.</p>
        )}
      </div>
    </>
  );
};

export default FicheDePaie;
