import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const VITE_API_ARTICLE_URL = import.meta.env.VITE_API_URL;
export const useAuthArticleStore = create((set) => ({
  articles: [],
  userArticles: [],
  searchResults: {},
  isArticleLoading: false,

  getArticle: async () => {
    set({ isArticleLoading: true });
    try {
      const response = await axios.get(`${VITE_API_ARTICLE_URL}/toutArticles`);
      set({ articles: response.data || [] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isArticleLoading: false });
    }
  },

  // useAuthArticleStore.js (correction)
  getUserArticles: async () => {
    try {
      const response = await axios.get(`${VITE_API_ARTICLE_URL}/mesArticles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // ✅ Force le résultat à être un tableau
      console.log("Réponse API /mesArticles :", response.data);
      set({ userArticles: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      set({ userArticles: [] }); // Réinitialisation explicite
      toast.error("Erreur de récupération des articles");
      console.error("Erreur API /mesArticles :", error);
    }
  },

  addArticle: async (data) => {
    try {
      const response = await axios.post(
        `${VITE_API_ARTICLE_URL}/ajouterArticle`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      //   set({ articles: [response.data] });
      set((state) => ({
        articles: [response.data, ...state.articles],
        userArticles: [response.data, ...state.userArticles],
      }));
      toast.success("Ajouter avec succes");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  searchArticles: async (filters) => {
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...filters,
      }).toString();
      const response = await axios.get(
        `${VITE_API_ARTICLE_URL}/chercherArticle?${params}`
      );
      set({ searchArticles: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateArticle: async (articleId, updates) => {
    try {
      const response = await axios.put(
        `${VITE_API_ARTICLE_URL}/${articleId}`,
        updates,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      //   set({ articles: response.data });
      set((state) => ({
        articles: state.articles.map((article) =>
          article._id === articleId ? response.data : article
        ),
        userArticles: state.userArticles.map((userarticle) =>
          userarticle._id === articleId ? response.data : userarticle
        ),
      }));
      toast.success("Modifier avec success");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteArticle: async (articleId) => {
    try {
      await axios.delete(`${VITE_API_ARTICLE_URL}/${articleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      //   set({ articles: response.data });
      set((state) => ({
        articles: state.articles.filter((article) => article._id !== articleId),
        userArticles: state.userArticles.filter(
          (userArticle) => userArticle._id !== articleId
        ),
      }));
      toast.success("Supprimer avec succes");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
