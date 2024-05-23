import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../providers/firebaseConfig";
import Form from "./Form";
import { getDatabase, ref, get } from "firebase/database";
import DisplayElements from "./DisplayElements";
import "./Dashboard.css";

const Dashboard = () => {
  const firebase = new firebaseConfig();
  const [user, setUser] = useState(null);
  const [app, setApp] = useState(firebase.getApp());
  const [form, setForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getDatabase(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const { entrepriseId } = userData;
          const [name, firstname] = user.displayName.split(" ");

          const capitalizedName =
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          const capitalizedFirstName =
            firstname.charAt(0).toUpperCase() +
            firstname.slice(1).toLowerCase();

          setUser({
            uid: user.uid,
            capitalizedName,
            capitalizedFirstName,
            entrepriseId,
            app: app,
          });
        } else {
          console.log("No data available");
        }
      } else {
        navigate("/");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [app, navigate]);

  const openModal = () => {
    setForm(true);
  };

  const closeModal = () => {
    setForm(false);
  };

  const logout = () => {
    const auth = getAuth(app);
    auth.signOut().then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <div className="displayElements">
        {user && (
          <h1>
            Bonjour {user.capitalizedName} {user.capitalizedFirstName}
          </h1>
        )}
        <div className="menu-container">
          <input id="check" type="checkbox" className="menu-checkbox" />
          <label htmlFor="check" className="menuButton">
            <span className="top"></span>
            <span className="mid"></span>
            <span className="bot"></span>
          </label>
          <div className="menu-options">
            <ul>
              <li>
                <a href="#option3">Fiche de salaire</a>
              </li>
              <li>
                <a href="#" onClick={openModal}>
                  Ouvrir le formulaire
                </a>
              </li>
              <li>
                <a href="#" onClick={logout}>
                  Deconnexion
                </a>
              </li>
            </ul>
          </div>
        </div>
        <br />
        {form && <Form user={user} onClose={closeModal} />}
        <br />
        {user && <DisplayElements user={user} />}
      </div>
    </>
  );
};

export default Dashboard;
