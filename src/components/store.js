import { configureStore, createSlice } from "@reduxjs/toolkit";
import firebaseApp from "../providers/firebaseConfig";

// Création du slice pour l'état de l'utilisateur
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: () => null,
  },
});

// Création du slice pour l'état de Firebase
const firebaseSlice = createSlice({
  name: "firebase",
  initialState: firebaseApp, // Utilisation de l'état initial de Firebase
  reducers: {
    setFirebase: (state, action) => action.payload,
  },
});

// Export des actions du slice utilisateur
export const { setUser, clearUser } = userSlice.actions;

// Export des actions du slice Firebase
export const { setFirebase } = firebaseSlice.actions;

// Configuration du store Redux
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    firebase: firebaseSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer ces types d'actions
        ignoredActions: ["user/setUser", "firebase/setFirebase"],
        // Ignorer ces champs d'action dans tous les actions
        ignoredActionPaths: ["payload"],
        // Ignorer ces chemins dans l'état
        ignoredPaths: ["user", "firebase"],
      },
    }),
});

export default store;
