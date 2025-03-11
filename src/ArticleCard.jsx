const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
        return "Date inconnue";
    }
};
export default function ArticleCard({ article }) {

    return (
        <div className="article-card">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <div className="meta gap-1">
                <span>Auteur : {article.author?.name || "Anonyme"}</span>{ }
                <span> Publié le🚷 : {formatDate(article.createdAt)}</span>
            </div>
        </div>
    );
};
