import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthArticleStore } from "../../../store/useAuthArticleStore";
import { Loader2 } from "lucide-react";
import ArticleForm from "./ArticleForm";

function EditArticle() {
    const { id } = useParams();
    const { updateArticle } = useAuthArticleStore();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const getArticle = async () => {
            try {
                const data = await updateArticle(id);
                setArticle(data);
            } catch (error) {
                console.log("Erreur de chargement: ", error);
            } finally {
                setLoading(false);
            }
        };
        getArticle();
    }, [id, updateArticle]);

    if (loading) {
        return (
            <div>
                <Loader2 />
            </div>
        );
    }

    if (!article) {
        return (
            <div>
                <h2>Article non trouver</h2>
            </div>
        );
    }

    return (
        <div>
            <h1>Modifier l'article</h1>
            <ArticleForm
                article={article}
                onSuccess={() => window.location.reload()} //rafraichir les donnees
            />
        </div>
    );
}

export default EditArticle;
