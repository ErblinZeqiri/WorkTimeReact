import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const dureeSecondes = 5;
  const [secondes, setSecondes] = useState(dureeSecondes);
  const navigate = useNavigate();
  const tm = setInterval(() => {
    setSecondes(secondes - 1);
  }, 1000);
  setTimeout(() => {
    clearInterval(tm);
    navigate("/");
  }, dureeSecondes * 1000);
  return (
    <>
      <div style={{ display: "block", textAlign: "center" }}>
        <h1>La page n'existe pas!</h1>
        <br />
        <p>
          Vous allez être redirigé dans {secondes} seconde
          {secondes > 1 ? "s" : ""}
        </p>
      </div>
    </>
  );
};

export default Page404;
