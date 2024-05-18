import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Form from "./Form"; // Importe le composant de formulaire modal

const Dashboard = (props) => {
    const [user, setUser] = useState(null);
    const [app, setApp] = useState(props.app);
    const [form, setform] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth(props.app);
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
                });
            } else {
                navigate("/");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [props.app, navigate]);

    const openModal = () => {
        setform(true);
    };

    const closeModal = () => {
        setform(false);
    };

    return (
        <>
            {user && <h1>{user.uid} {user.capitalizedName} {user.capitalizedFirstName}</h1>}
            <button onClick={openModal}>Ouvrir le formulaire</button>
            {form && <Form onClose={closeModal} />}
        </>
    );
}

export default Dashboard;
