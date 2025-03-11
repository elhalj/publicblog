import React from 'react'
import { useNavigate } from 'react-router-dom'

function ButtonAdd() {
    const navigate = useNavigate()
    return (
        <div>
            <button
                onClick={() => navigate('/articles/new')}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Créer un nouvel article
            </button>
        </div>
    )
}

export default ButtonAdd
