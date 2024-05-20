import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../providers/firebaseConfig";
import Form from "./Form";

const Dashboard = () => {
    const firebase = new firebaseConfig();
    const [user, setUser] = useState(null);
    const [app, setApp] = useState(firebase.getApp());
    const [form, setform] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth(app);
        console.log(app)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const name = user.displayName.split(" ")[0];
                const firstname = user.displayName.split(" ")[1];

                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                const capitalizedFirstName = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

                setUser({
                    uid: user.uid,
                    capitalizedName,
                    capitalizedFirstName,
                    app: app
                });
            } else {
                navigate("/");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [app, navigate]);

    const openModal = () => {
        setform(true);
    };

    const closeModal = () => {
        setform(false);
    };

    return (
        <>
            {user && <h1>Bonjour {user.capitalizedName} {user.capitalizedFirstName}</h1>}
            <br />
            <button onClick={openModal}>Ouvrir le formulaire</button>
            {form && <Form user={user} onClose={closeModal} />}
        </>
    );
}

export default Dashboard;
