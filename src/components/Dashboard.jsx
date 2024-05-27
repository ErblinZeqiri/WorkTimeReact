import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, setFirebase, setUser } from "./store";
import { getDatabase, ref, get } from "firebase/database";
import DisplayElements from "./DisplayElements";
import Menu from "./Menu";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const firebaseApp = useSelector((state) => state.firebase);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
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
            dispatch(setUser({ uid: user.uid, ...userData }));
            dispatch(fetchUserData(user.uid));
          } else {
            dispatch(fetchUserData(user.uid));
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
    dispatch(setFirebase(firebaseApp)); // Mettre à jour les informations Firebase dans le store
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch, navigate, firebaseApp]);

  const openModal = () => {
    setForm(true); // Affiche le formulaire
  };

  const closeModal = () => {
    setForm(false); // Cache le formulaire
  };

  const logout = () => {
    const auth = getAuth();
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
        {form && <Form onClose={closeModal} />}
        <br />
        <DisplayElements />
      </div>
    </>
  );
};

export default Dashboard;
