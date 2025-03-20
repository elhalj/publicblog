import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthArticleStore } from "../../../store/useAuthArticleStore";
import { Loader, Loader2 } from "lucide-react";

// const VITE_API_ADD = import.meta.env.VITE_API_URL

function ArticleForm({ article }) {
    const { addArticle, updateArticle, isArticleLoading } = useAuthArticleStore();

    const [formData, setFormData] = useState(
        article || {
            title: "",
            description: "",
            author: "",
            category: [],
            tags: [],
            content: "",
            imageUrl: "",
            statut: "brouillon", // Valeur par défaut plus logique
            slug: "",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category" || name === "tags") {
            const arrayValue = value.split(/,\s*/); // Gère les espaces après les virgules
            setFormData((prev) => ({ ...prev, [name]: arrayValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.post(`${VITE_API_ADD}/ajouterArticle`, formData)
            // setFormData(response.data)
            const data = {
                ...formData,
                tags: Array.isArray(formData.tags)
                    ? formData.tags
                    : formData.tags.split(",").map(tag => tag.trim()),
            };

            if (article) {
                await updateArticle(article._id, data);
            } else {
                addArticle(data);
            }
            toast.success("Article ajouté avec succès");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Titre:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        cols={30}
                        rows={4}
                    />
                </label>

                <label>
                    Auteur:
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Catégorie:
                    <input
                        type="text"
                        name="category"
                        value={Array.isArray(formData.category) ? formData.category.join(", ") : ""}
                        onChange={handleChange}
                    />
                    <span>*"Technologie", "Santé", "Éducation", "Voyage"*</span>
                </label>

                <label>
                    Tags:
                    <input
                        type="text"
                        name="tags"
                        value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Contenu:
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        cols={30}
                        rows={10}
                    />
                </label>

                <label>
                    Image URL:
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Statut:
                    <select name="statut" value={formData.statut} onChange={handleChange}>
                        {["brouillon", "publie", "archive"].map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Slug:
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" disabled={isArticleLoading}>
                    {isArticleLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : article ? (
                        "Modifier l'article"
                    ) : (
                        "Ajouter article"
                    )}
                </button>
            </form>
        </div>
    );
}

export default ArticleForm;
