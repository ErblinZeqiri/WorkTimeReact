import React from "react";

const AEUser = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className="form-overlay" onClick={onClose}>
        <div className="form-content" onClick={(e) => e.stopPropagation()}>
          <div className="form-box">
            <form className="form-add-data" onSubmit={handleSubmit}>
              <a className="closeButton" onClick={onClose}>
                <span className="X"></span>
                <span className="Y"></span>
                <div className="close">Close</div>
              </a>
              <span className="form-add-data-title">Ajout</span>
              <span className="subtitle">Ajouter une heure de travail.</span>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="form-add-data-container">
                <input
                  type="date"
                  name="date"
                  className="form-add-data-input"
                  value={currentPrestation.date}
                  onChange={handleDateChange}
                  dateformat="yyyy-MM-dd"
                  placeholder="Select a date"
                />
                <select
                  name="client"
                  className="form-add-data-input"
                  value={currentPrestation.client}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client, index) => (
                    <option key={index} value={client.nom}>
                      {client.nom}
                    </option>
                  ))}
                </select>
                <select
                  name="categorie"
                  className="form-add-data-input"
                  value={currentPrestation.categorie}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((catPresta, index) => (
                    <option key={index} value={catPresta}>
                      {catPresta}
                    </option>
                  ))}
                </select>
                <textarea
                  name="description"
                  className="form-add-data-input form-add-data-input-textarea"
                  placeholder="Description"
                  value={currentPrestation.description}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="inter_de"
                  className="form-add-data-input"
                  placeholder="Intervalle de prestation"
                  value={currentPrestation.inter_de}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="inter_a"
                  className="form-add-data-input"
                  placeholder="Intervalle de prestation"
                  value={currentPrestation.inter_a}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AEUser;
