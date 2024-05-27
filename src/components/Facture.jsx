import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

const Facture = () => {
  const location = useLocation();
  const { prestationsDuMois } = location.state;
  const firebaseApp = useSelector((state) => state.firebase);

  const [clients, setClients] = useState({});
  const [tarifHoraire, setTarifHoraire] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalHours = prestationsDuMois.reduce((total, element) => {
    const [hours, minutes] = element.total_inter.split(':').map(Number);
    return total + hours + minutes / 60;
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase(firebaseApp);
      const entrepriseRef = ref(database, `entreprises/entreprise1`);
      const snapshot = await get(entrepriseRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setClients(data.clients || {});
        setTarifHoraire(data.prix_prestation_heure || 0);
      } else {
        console.log("No data available");
      }
      setLoading(false);
    };
    fetchData();
  }, [firebaseApp]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const client = Object.values(clients).find(
    (c) => c.nom === prestationsDuMois[0].client
  );

  if (!client) {
    return <div>Client not found</div>;
  }

  const rabais = client.rabais;
  const prixBrut = totalHours * tarifHoraire;
  const prixNet = prixBrut - (prixBrut * rabais / 100);

  return (
    <>
      <h1>Facture</h1>
      <h2>{client.nom}</h2>
      <br />
      {prestationsDuMois.flatMap((element) => (
        <div key={element.date + element.client}>
          <p>
            {element.categorie}
            <br />
            {element.date}
            <br />
            {element.total_inter}
          </p>
          <br />
        </div>
      ))}

      <p>
        Total des heures ce mois : {totalHours.toFixed(2)}h
        <br />
        Tarif par heure : {tarifHoraire} CHF
        <br />
        Prix brut : {prixBrut.toFixed(2)} CHF
        <br />
        Rabais : - {rabais}% ({(prixBrut * rabais / 100).toFixed(2)} CHF)
        <br />
        <strong>Prix net : {prixNet.toFixed(2)} CHF</strong>
      </p>
    </>
  );
};

export default Facture;
