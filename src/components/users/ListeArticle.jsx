
import { useNavigate } from 'react-router-dom'

function ListeArticle({ userArticles }) {
    const navigate = useNavigate()
    return (
        <div>
            {userArticles.map(article => (
                <div key={article._id}>
                    <h1>{article.title}</h1>
                    <p>{article.statut}</p>
                    <button onClick={() => navigate(`/articles/${article._id}/edit`)}>
                        Modifier
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ListeArticle
