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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const { entrepriseId, tarif_horaire } = userData;
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
            tarif_horaire: tarif_horaire,
          });
        } else {
          return (
            <>
              <h1>Aucune données</h1>
            </>
          );
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
