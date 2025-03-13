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

  getUserArticles: async () => {
    set({ isArticleLoading: true });
    try {
      const response = await axios.get(`${VITE_API_ARTICLE_URL}/mesArticles`);
      set({
        userArticles: Array.isArray(response.data) ? response.data.data : [],
      });
    } catch (error) {
      console.error("Échec de la récupération:", error);
      toast.error(error.response?.data?.message || error.message);
      set({ userArticles: [] });
    } finally {
      set({ isArticleLoading: false });
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

  updateArticle: async (articleId) => {
    set({ isArticleLoading: true });
    try {
      const response = await axios.put(`${VITE_API_ARTICLE_URL}/${articleId}`);
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
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isArticleLoading: false });
    }
  },

  deleteArticle: async (articleId) => {
    try {
      await axios.delete(`${VITE_API_ARTICLE_URL}/${articleId}`);
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
