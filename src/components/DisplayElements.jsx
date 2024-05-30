import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, setClients } from "./store";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import {
  calculateTimeDifference,
  groupByMonth,
  totalHoursMinutes,
  compareMonthToPrevious,
  months,
} from "./Utils";
import "./DisplayElements.css";
import "./loading.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SortInput from "./SortInput";
import { useNavigate } from "react-router-dom";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import UpdatePresta from "./UpdatePresta.jsx";

const DisplayElements = () => {
  const dispatch = useDispatch();
  const [elements, setElements] = useState([]);
  const [filters, setFilters] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [month] = useState(months);
  const user = useSelector((state) => state.user.userData);
  const firebaseApp = useSelector((state) => state.firebase);
  const [form, setForm] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && firebaseApp) {
      dispatch(fetchUserData(user.uid)); // Fetch user data
    }
  }, [user, firebaseApp, dispatch]);

  // Fetch prestations data and user data when user is available
  useEffect(() => {
    if (user) {
      const database = getDatabase(firebaseApp);
      const prestationsRef = child(
        ref(database),
        `entreprises/${user.entrepriseId}/prestations`
      );
      const usersRef = child(ref(database), `users/`);

      // Écouteur en temps réel pour les prestations
      const prestaListener = onValue(prestationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const prestationsData = snapshot.val();
          const userPresta =
            user.role === "admin"
              ? Object.entries(prestationsData)
              : Object.entries(prestationsData).filter(
                  ([key, element]) => element && element.userId === user.uid
                );
          setElements(userPresta);
        }
      });

      // Fetch utilisateurs une seule fois
      get(usersRef).then((usersSnapshot) => {
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          setUsersData(usersData);
        }
      });

      // Nettoyage de l'écouteur en temps réel
      return () => prestaListener();
    }
  }, [user, firebaseApp]);

  useEffect(() => {
    if (filters.client) {
      dispatch(setClients(filters.client));
    }
  }, [filters.client, dispatch]);

  const applyFilters = (elements) => {
    if (!filters || Object.keys(filters).length === 0) {
      return elements;
    }

    return elements.filter(([key, element]) => {
      const { client, categorie, mois, date } = filters;

      const elementMonth = new Date(element.date)
        .toLocaleString("fr-FR", { month: "long" })
        .toLowerCase();

      return (
        (!client || element.client === client) &&
        (!categorie || element.categorie === categorie) &&
        (!mois || elementMonth === mois.toLowerCase()) &&
        (!date || element.date === date)
      );
    });
  };

  if (!user) {
    return (
      <div className="loader">
        <span>&lt;</span>
        <span>LOADING</span>
        <span>/&gt;</span>
      </div>
    );
  }

  const filteredElements = applyFilters(elements);
  const groupedElements = groupByMonth(filteredElements);

  const totalWorkTime = totalHoursMinutes(groupedElements);
  const monthComparisons = compareMonthToPrevious(groupedElements);

  const sortedMonths = Object.keys(groupedElements).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");

    const aDate = new Date(
      `${aYear}-${month.indexOf(aMonth.toLowerCase()) + 1}-01`
    );
    const bDate = new Date(
      `${bYear}-${month.indexOf(bMonth.toLowerCase()) + 1}-01`
    );

    return bDate - aDate;
  });

  const ficheDePaie = async (monthYear) => {
    const { uid, nom, prenom, entrepriseId, tarif_horaire } = user;

    const database = getDatabase(firebaseApp);
    const entrepriseData = (
      await get(child(ref(database), `entreprises/${entrepriseId}`))
    ).val();

    const nomEntreprise = entrepriseData.nom;

    const simpleUser = {
      uid,
      nom,
      prenom,
      entrepriseId,
      tarif_horaire,
      nomEntreprise,
    };
    navigate("/fiche-de-paie", { state: { monthYear, user: simpleUser } });
  };

  const facture = (monthYear) => {
    const {entrepriseId } = user
    const prestationsDuMois = groupedElements[monthYear];
    navigate("/dashboard/facture", { state: { prestationsDuMois, monthYear, entrepriseId } });
  };

  const pourcentCardDesign = (pourcent) => {
    if (pourcent > 0) {
      return (
        <Row gutter={1}>
          <Col span={20}>
            <Card bordered={false} className="stat-presta">
              <Statistic
                value={pourcent}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col span={20}>
            <Card bordered={false} className="stat-presta">
              <Statistic
                value={pourcent}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      );
    }
  };

  const toogleShowAddForm = (data) => {
    setSelectedData(data);
    setForm((prevShowForm) => !prevShowForm);
  };

  const closeModal = () => {
    setForm(false);
  };

  return (
    <>
      <SortInput month={month} setFilters={setFilters} />
      {sortedMonths.length > 0 ? (
        <div className="container accordion-presta">
          <div className="accordion">
            {sortedMonths.map((monthYear, index) => (
              <>
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <a
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      <span className="stat-presta">
                        {`Total des heures:`}
                        <br />
                        {`${totalWorkTime[monthYear].totalHours}h ${totalWorkTime[monthYear].totalMinutes}m`}
                      </span>
                      {monthComparisons[monthYear] !== null && (
                        <span>
                          {pourcentCardDesign(
                            monthComparisons[monthYear].toFixed(2)
                          )}
                        </span>
                      )}
                      <span className="stat-presta">
                        {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
                      </span>
                      {user.role === "admin" ? (
                        <>
                          <button
                            className="btn-link"
                            onClick={() => facture(monthYear)}
                          >
                            Facture
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-link"
                            onClick={() => ficheDePaie(monthYear)}
                          >
                            Fiche de paie
                          </button>
                        </>
                      )}
                    </a>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body text-start">
                      {groupedElements[monthYear]
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((element, idx) => {
                          const { differenceHours, differenceMinutes } =
                            calculateTimeDifference(
                              element.inter_de,
                              element.inter_a
                            );
                          const userData = usersData[element.userId];

                          return (
                            <div key={idx}>
                              <>
                                <div className="list-group">
                                  <a className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                      <h5 className="mb-1">
                                        {element.categorie}
                                      </h5>
                                      <small>{element.date}</small>
                                    </div>
                                    <div className="d-flex w-100 justify-content-between">
                                      <p className="mb-1">{element.client}</p>
                                      <p>
                                        Temps de travail: {differenceHours}h :{" "}
                                        {differenceMinutes}m
                                      </p>
                                    </div>
                                    <p>{element.description}</p>
                                    {user.role === "admin" && userData && (
                                      <div className="d-flex w-100 justify-content-between">
                                        <small>
                                          Nom de l'employé : {userData.prenom}{" "}
                                          {userData.nom}
                                        </small>
                                        <small>
                                          <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                              toogleShowAddForm(element)
                                            }
                                          >
                                            Editer
                                          </button>
                                        </small>
                                      </div>
                                    )}
                                  </a>
                                </div>
                              </>
                              {idx < elements.length - 1 && <hr />}
                            </div>
                          );
                        })}
                      {form && selectedData && (
                        <UpdatePresta
                          data={selectedData}
                          onClose={closeModal}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <h2>Pas d'heures enregistrées</h2>
      )}
    </>
  );
};

export default DisplayElements;
