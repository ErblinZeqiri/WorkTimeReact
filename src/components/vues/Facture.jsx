import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import "../../styles/loading.css";
import "../../styles/Facture.css";

const Facture = () => {
  const location = useLocation();
  const { prestationsDuMois, monthYear, entrepriseId } = location.state;
  const firebaseApp = useSelector((state) => state.firebase);
  const [clients, setClients] = useState({});
  const [tarifHoraire, setTarifHoraire] = useState(0);
  const [loading, setLoading] = useState(true);
  const totalHours = prestationsDuMois.reduce((total, element) => {
    const [hours, minutes] = element.total_inter.split(":").map(Number);
    return total + hours + minutes / 60;
  }, 0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase(firebaseApp);
      if (database._instanceStarted) {
        const entrepriseRef = ref(database, `entreprises/${entrepriseId}`);
        const snapshot = await get(entrepriseRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setClients(data.clients || {});
          setTarifHoraire(data.prix_prestation_heure || 0);
        } else {
          console.log("No data available");
        }
      }

      setLoading(false);
    };
    fetchData();
  }, [firebaseApp]);

  if (loading) {
    return (
      <div className="loader">
        <span>&lt;</span>
        <span>LOADING</span>
        <span>/&gt;</span>
      </div>
    );
  }

  const client = Object.values(clients).find(
    (c) => c.nom === prestationsDuMois[0].client
  );

  if (!client) {
    return <div>Client not found</div>;
  }

  const rabais = client.rabais;
  const prixBrut = totalHours * tarifHoraire;
  const prixNet = prixBrut - (prixBrut * rabais) / 100;

  return (
    <>
      <div className="resultat">
        <div className="titre">
          <h1>Facture</h1>
          <button onClick={() => navigate("/dashboard")}>Retour</button>
        </div>
        <h2>Mois de {monthYear}</h2>
        <p>{client.nom}</p>
        <h2>Détails des préstations:</h2>
        <div className="content">
          <table>
            <tr>
              <td>Date</td>
              <td>Catégorie</td>
              <td className="right-align">Temps de travail</td>
            </tr>
            <tbody>
              {prestationsDuMois.flatMap((element, index) => (
                <tr key={index}>
                  <td>{element.date}</td>
                  <td>{element.categorie}</td>
                  <td className="right-align">{element.total_inter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="total">
          <table>
            <tr>
              <td>Total des heures ce mois :</td>
              <td className="right-align">{totalHours.toFixed(2)}h</td>
            </tr>
            <tr>
              <td>Tarif par heure :</td>
              <td className="right-align">{tarifHoraire} CHF</td>
            </tr>
            <tr>
              <td>Prix brut :</td>
              <td className="right-align">{prixBrut.toFixed(2)} CHF</td>
            </tr>
            <tr>
              <td>Rabais :</td>
              <td className="right-align">
                - {rabais}% ({((prixBrut * rabais) / 100).toFixed(2)} CHF)
              </td>
            </tr>
            <tr>
              <td>
                <strong>Prix net :</strong>
              </td>
              <td className="right-align">
                <strong>{prixNet.toFixed(2)} CHF</strong>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default Facture;
