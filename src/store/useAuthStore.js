import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL_AUTH;

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignup: false,
  isLogin: false,
  isLogout: false,
  isCheckingAuth: true,

  // Dans useAuthStore.js
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check`, {
        withCredentials: true, // Nécessaire pour les cookies
      });

      set({ authUser: response.data });
    } catch (error) {
      console.error(
        "Erreur checkAuth:",
        error.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
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
      const response = await axios.post(`${API_URL}/login`, data, {
        withCredentials: true, // Envoie les cookies
      });
      // Appel checkAuth après login réussi
      await useAuthStore.getState().checkAuth();
      set({ authUser: response.data }); // Supposons que le backend renvoie { user, token }
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
