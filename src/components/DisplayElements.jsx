import React, { useState, useEffect } from "react";
import { ref, get, child, getDatabase } from "firebase/database";
import "./DisplayElements.css"
const DisplayElements = ({ app, uid }) => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const database = getDatabase(app);
        const collectionRef = child(ref(database), "Users/" + uid);

        const fetchData = async () => {
            try {
                const snapshot = await get(collectionRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setElements(data);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [app, uid]);

    return (
        <>
            <h1>Listes des heures</h1>
            {elements.length > 0 ? (
                elements.flatMap((element, index) => (
                    <div className="separation">
                        <span key={index}>
                            <h2>{element.titre}</h2>
                            <p>Client: {element.client}</p>
                            <p>Description: {element.description}</p>
                            <p>Lieu: {element.lieu}</p>
                        </span>
                    </div>
                ))
            ) : (
                <h2>Pas d'heures enregistrés</h2>
            )}
        </>
    );
};

export default DisplayElements;
