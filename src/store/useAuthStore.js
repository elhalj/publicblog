import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL_AUTH;
const LOCAL_STORAGE_KEY = "authToken";

// Intercepteur pour gérer les erreurs 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expirée, veuillez vous reconnecter");
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create((set, get) => ({
  // État initial
  authUser: null,
  token: localStorage.getItem(LOCAL_STORAGE_KEY) || null,
  isCheckingAuth: false,
  isSignup: false,
  isLogin: false,

  // Méthode générique pour gérer les erreurs
  handleError: (error, defaultMessage) => {
    const message =
      error.response?.data?.message || error.message || defaultMessage;
    toast.error(message);
    return message;
  },

  // Vérification de l'authentification
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const response = await axios.get(`${API_URL}/check`, {
        headers: { "x-token": get().token },
        withCredentials: true,
      });

      set({
        authUser: response.data,
        token: response.headers["x-token"],
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, response.headers["x-token"]);
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({ authUser: null, token: null });
      get().handleError(error, "Échec de vérification de l'authentification");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Inscription
  signUp: async (data) => {
    set({ isSignup: true });

    try {
      const response = await axios.post(`${API_URL}/signUp`, data, {
        withCredentials: true,
      });

      set({
        authUser: response.data,
        token: response.headers["x-token"],
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, response.headers["x-token"]);
      toast.success("Compte créé avec succès !");
    } catch (error) {
      set({ authUser: null, token: null });
      get().handleError(error, "Échec de la création du compte");
    } finally {
      set({ isSignup: false });
    }
  },

  // Connexion
  login: async (data) => {
    set({ isLogin: true });

    try {
      const response = await axios.post(`${API_URL}/login`, data, {
        withCredentials: true,
      });

      set({
        authUser: response.data,
        token: response.headers["x-token"],
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, response.headers["x-token"]);
      toast.success("Connexion réussie !");
    } catch (error) {
      set({ authUser: null, token: null });
      get().handleError(error, "Identifiants incorrects");
    } finally {
      set({ isLogin: false });
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, null, {
        headers: { "x-token": get().token },
        withCredentials: true,
      });
    } catch (error) {
      get().handleError(error, "Problème lors de la déconnexion");
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      set({ authUser: null, token: null });
      toast.success("Déconnexion réussie !");
    }
  },

  // Récupération des informations utilisateur
  fetchUserInfo: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: { "x-token": get().token },
      });

      set({ authUser: response.data });
    } catch (error) {
      get().handleError(error, "Échec du chargement du profil");
      throw error;
    }
  },

  // Reset du state (pour les tests)
  reset: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({
      authUser: null,
      token: null,
      loadingStates: {
        isCheckingAuth: false,
        isSignup: false,
        isLogin: false,
      },
    });
  },
}));
