import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getDatabase, ref, get } from "firebase/database";
import firebaseApp from "../providers/firebaseConfig";

// Création du slice pour l'état de l'utilisateur
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Création du slice pour l'état de Firebase
const firebaseSlice = createSlice({
  name: "firebase",
  initialState: firebaseApp,
  reducers: {
    setFirebase: (state, action) => action.payload,
  },
});

// Création du slice pour l'état des prestations
const prestationsSlice = createSlice({
  name: "prestations",
  initialState: {
    initialState: {
      userId: "",
      date: "",
      client: "",
      categorie: "",
      description: "",
      inter_de: "",
      inter_a: "",
      mois: "",
    },
  },
  reducers: {
    setPrestations: (state, action) => ({ ...state, ...action.payload }),
    addPrestation: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userId, thunkAPI) => {
    try {
    const response = user.userId
    return response.data
    }
    catch{
      return thunkAPI.rejectWithValue("Erreur lors de la récupération des données utilisateur")
    }
  },
);

// Slice for clients
const clientsSlice = createSlice({
  name: "clients",
  initialState: [],
  reducers: {
    setClients: (state, action) => {
      if (action.payload && action.payload.entrepriseId) {
        return action.payload.entrepriseId.clients;
      }
      return state; // Return the existing state if action.payload is undefined
    },
  },
});

// Slice for categories
const categoriesSlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    setCategories: (state, action) => {
      if (action.payload && action.payload.entrepriseId) {
        return action.payload.entrepriseId.categories_prestations;
      }
      return state; // Return the existing state if action.payload is undefined
    },
  },
});

// Exporting actions
export const { setUser, clearUser } = userSlice.actions;
export const { setFirebase } = firebaseSlice.actions;
export const { setPrestations, addPrestation } = prestationsSlice.actions;
export const { setClients } = clientsSlice.actions;
export const { setCategories } = categoriesSlice.actions;
export { fetchUserData };

// Configure the store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    firebase: firebaseSlice.reducer,
    prestations: prestationsSlice.reducer,
    clients: clientsSlice.reducer,
    categories: categoriesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setUser", "firebase/setFirebase"],
        ignoredActionPaths: ["payload"],
        ignoredPaths: ["user", "firebase"],
      },
    }),
});

export default store;
