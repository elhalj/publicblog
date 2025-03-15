import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL_AUTH;
// Dans Axios (frontend)
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  authUser: null,
  isSignup: false,
  isLogin: false,
  isLogout: false,
  isCheckingAuth: true,

  // Dans useAuthStore.js
  // Modifiez la fonction checkAuth
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/check`, {
        withCredentials: true, // Ajout crucial
      });

      if (response.data?.user) {
        set({ authUser: response.data.user });
      }
    } catch (error) {
      set({ authUser: null });
      console.log(error.message);
    }
  },

  signUp: async (data) => {
    set({ isSignup: true });
    try {
      const response = await axios.post(`${API_URL}/signUp`, data);
      set({ authUser: response.data });
      toast.success("Compte créé avec succès");
    } catch (error) {
      set({ authUser: null });
      const errorMessage = error.response?.data?.message || "Erreur inconnue";
      toast.error(errorMessage);
    } finally {
      set({ isCheckingAuth: false, isSignup: false });
    }
  },

  login: async (data) => {
    set({ isLogin: true });
    try {
      await axios.post(`${API_URL}/login`, data, {
        withCredentials: true,
      });

      // Force la vérification de l'authentification
      await useAuthStore.getState().checkAuth();

      toast.success("Connecte avec succes");
    } catch (error) {
      set({ authUser: null });
      const errorMessage =
        error.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage);
    } finally {
      set({ isCheckingAuth: false, isLogin: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ authUser: null });
      toast.success("Deconnecte avec success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur de déconnexion";
      toast.error(errorMessage);
    }
  },

  userInfo: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error de token:", error.message);
    }
  },
}));
