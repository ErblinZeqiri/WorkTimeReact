import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../providers/firebaseConfig";
import Form from "./Form";
import { getDatabase, ref, get } from "firebase/database";
import DisplayElements from "./DisplayElements";
import Menu from "./Menu";

const Dashboard = () => {
  const firebase = new firebaseConfig();
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(firebase.getApp());
  const [form, setForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getDatabase(app);
    let unsubscribe = null; 
    const fetchData = async () => {
      try {
        const user = await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              unsubscribe();
              resolve(user);
            },
            reject
          );
        });

        if (user) {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser(userData);
          } else {
            // Gérer le cas où aucune donnée utilisateur n'est trouvée
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        // Gérer les erreurs d'authentification ou de récupération des données utilisateur
        console.error(
          "Une erreur s'est produite lors de la récupération des données utilisateur:",
          error
        );
        // Afficher un message d'erreur à l'utilisateur ou effectuer une action appropriée
      }
    };

    fetchData(); // Appel de la fonction fetchData pour récupérer les données utilisateur
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [app, navigate]);

  const openModal = () => {
    setForm(true); // Affiche le formulaire
  };

  const closeModal = () => {
    setForm(false); // Cache le formulaire
  };

  const logout = () => {
    const auth = getAuth(app);
    auth.signOut().then(() => {
      navigate("/"); // Redirection après déconnexion
    });
  };

  return (
    <>
      <div className="displayElements">
        {user && (
          <h1>
            Bonjour {user.nom} {user.prenom}
          </h1>
        )}
        <Menu openModal={openModal} logout={logout} />
        <br />
        {form && <Form user={user} onClose={closeModal} />}
        <br />
        {user && <DisplayElements user={user} />}
      </div>
    </>
  );
};

export default Dashboard;
