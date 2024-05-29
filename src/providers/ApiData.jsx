import React, { useState, useEffect } from "react";
import { useOutsideClick } from "../components/useOutsideClick";

const ApiData = () => {
  const [lien, setLien] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [nomEntreprises, setNomEntreprises] = useState([]);
  const [option, setOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchLien = async () => {
      try {
        const response = await fetch(
          "https://vector.sitg.ge.ch/arcgis/rest/services/Hosted/REG_ENTREPRISE_ETABLISSEMENT/FeatureServer/0/query"
        );
        setLien(response.url);
      } catch (erreur) {
        console.warn(erreur);
      }
    };

    fetchLien();
  }, []);

  useEffect(() => {
    const fetchEntreprise = async () => {
      if (!lien) return;

      const params = {
        where: "1=1",
        outFields: "*",
        f: "json",
      };

      const url = new URL(lien);
      url.search = new URLSearchParams(params).toString();

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données : " +
              response.statusText
          );
        }
        const data = await response.json();
        setEntreprise(data);
      } catch (error) {
        console.warn(error);
      }
    };

    fetchEntreprise();
  }, [lien]);

  useEffect(() => {
    if (entreprise) {
      entreprise.features.sort((a, b) => {
        const textA = a.attributes.raison_sociale.toUpperCase();
        const textB = b.attributes.raison_sociale.toUpperCase();
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
      });
      const noms = entreprise.features.map(
        (element) => element.attributes.raison_sociale
      );
      setNomEntreprises(noms);
    }
  }, [entreprise]);

  const handleOptionClick = (nom) => {
    setOption(nom);
    setShowDropdown(false);
  };
  
  const ref = useOutsideClick(() => {
    setShowDropdown(false)
  });

  return (
    <>
      <div ref={ref} className={`dropdown ${showDropdown ? "show" : ""}`}>
        <input
          type="text"
          className="input"
          id="searchInput"
          placeholder="Entreprise"
          value={option}
          onFocus={() => setShowDropdown(true)}
          onChange={(evt) => {
            setOption(evt.target.value);
            setShowDropdown(true);
          }}
        />
        <div className="dropdown-content input">
          {nomEntreprises.map((nom, index) => (
            <a
              href="#"
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(nom)}
            >
              {nom}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApiData;
