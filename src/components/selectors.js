import { createSelector } from "@reduxjs/toolkit";

// Sélecteur mémorisé pour l'utilisateur
const selectUser = createSelector(
  (state) => state.user,
  (user) => user
);

// Sélecteur mémorisé pour Firebase
const selectFirebase = createSelector(
  (state) => state.firebase,
  (firebase) => firebase
);

export { selectUser, selectFirebase };
