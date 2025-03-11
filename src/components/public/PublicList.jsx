import React, { useEffect, useState } from 'react'
import ArticleCard from '../../ArticleCard';
import { Loader2, ShieldAlert } from 'lucide-react';
import AddForm from '../users/forms/ArticleForm';

const API_URL = import.meta.env.VITE_API_URL;

function AllPublicList() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/toutArticles`);
                const result = await response.json();
                if (!result.data && !Array.isArray(result)) {
                    throw new Error("pas un tableau");

                } else (
                    setData(result.data)
                )

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader2 />;
    if (error) return <ShieldAlert />;
    return (
        <div>
            <div className="container mx-auto ">

                <h1 className="text-3xl font-bold mb-6">Articles Récents</h1>

                {/* Debug: Afficher l'état des données */}
                {/* <div className="mb-4 text-sm">
                    <pre>Loading: {loading.toString()}</pre>
                    <pre>Error: {error || 'null'}</pre>
                    <pre>Articles count: {data.length}</pre>
                </div> */}

                {data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.map(article => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        {!loading && !error && "Aucun article disponible"}
                    </p>
                )}
            </div>
        </div>
    )
}

export default AllPublicList
