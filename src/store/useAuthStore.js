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
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/checkAuth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ authUser: response.data.user });
    } catch (error) {
      localStorage.removeItem("token");
      set({ authUser: null });
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
      set({ isSignup: false });
    }
  },

  login: async (data) => {
    set({ isLogin: true });
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      localStorage.setItem("token", response.data.token); // Ajoutez cette ligne
      set({ authUser: response.data.user }); // Supposons que le backend renvoie { user, token }
      toast.success("Connecte avec succes");
    } catch (error) {
      set({ authUser: null });
      const errorMessage =
        error.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    set({ isLogout: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ authUser: null });
      toast.success("Deconnecte avec success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur de déconnexion";
      toast.error(errorMessage);
    } finally {
      set({ isLogout: false });
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
