import React, { useEffect, useState } from 'react'
import AllPublicList from '../components/public/PublicList'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

function Acceuil() {

    const { authUser, userInfo } = useAuthStore()
    const navigate = useNavigate()
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (authUser?._id) { // Vérification sécurisée de l'ID utilisateur
                    const userData = await userInfo(authUser._id)
                    setInfo(userData)
                }
            } catch (error) {
                console.log("Erreur de connexion :", error.message) // Message d'erreur amélioré
                navigate('/login') // Redirection en cas d'erreur
            } finally {
                setLoading(false)
            }
        }

        if (authUser) fetchUserData()
        else setLoading(false)
    }, [authUser, userInfo, navigate, info])

    if (loading) {
        return <div>Chargement en cours...</div> // Feedback visuel pendant le chargement
    }

    return (
        <>


            <div className="auth-buttons">
                <h1>Accueil</h1>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                >
                    Se connecter
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                >
                    S'inscrire
                </button>
            </div>
            {/* <div>{authUser && (<div>Bonjour {info.name}</div>)}</div> */}
            <AllPublicList />
        </>
    )
}

export default Acceuil
