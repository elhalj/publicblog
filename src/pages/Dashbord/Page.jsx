import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import ListeArticle from '../../components/users/ListeArticle';
import { useAuthArticleStore } from '../../store/useAuthArticleStore';
import ButtonAdd from '../../components/users/ButtonAdd';
// import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function Page() {
    // const navigate = useNavigate()
    const { authUser } = useAuthStore();
    const { userArticles, getUserArticles, isArticleLoading } = useAuthArticleStore()
    const [error, setError] = useState(null)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // verification de l'authentification
    //             await checkAuth()

    //             // recuperer des article si l'utilisateur est connecte
    //             await getUserArticles()

    //         } catch (error) {
    //             setError("Erreur de chargement du dashbord")
    //             console.log("Erreur Dashbord: ", error)
    //         } finally {
    //             setLoading(false); // Ajoutez cette ligne
    //         }
    //     }
    //     fetchData()

    // }, [checkAuth, getUserArticles])
    useEffect(() => {
        const fetchData = async () => {
            try {


                if (!authUser?._id) { // Vérification explicite
                    throw new Error('erreur authentification')
                } else {
                    await getUserArticles();
                }


            } catch (error) {
                setError("Erreur de chargement");
                console.error("Erreur:", error);
            }
        };

        fetchData();
    }, [authUser?._id, getUserArticles]);
    console.log(userArticles)

    if (isArticleLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 text-center">
                {error}
            </div>
        )
    }

    return (
        <div className='container'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">
                    Bienvenue, {authUser.name || 'Utilisateur'}
                </h1>
                <ButtonAdd />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Vos Articles</h2>
                {userArticles?.length ? (
                    <ListeArticle userArticles={userArticles} />
                ) : (
                    <div className="text-center py-8">
                        <img src="/empty-state.svg" alt="Aucun article" className="mx-auto w-48" />
                        <p className="mt-4 text-gray-500">
                            Commencez par créer votre premier article !
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
