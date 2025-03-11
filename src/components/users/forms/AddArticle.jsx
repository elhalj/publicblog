import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleForm from './ArticleForm'

function AddArticle() {
    const navigate = useNavigate()
    return (
        <div>
            <div><h1>nouvelle article</h1></div>
            <ArticleForm onSuccess={(newArticle) => navigate(`articles/${newArticle._id}`)} />
        </div>
    )
}

export default AddArticle
