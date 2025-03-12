import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

function Login() {
    // const navigate = useNavigate()
    const { login, isLogin } = useAuthStore()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })



    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        if (!formData.email.trim()) {
            toast.error("L'email est obligatoire")
            return false
        }
        if (formData.password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return false
        }
        return true
    }

    // useEffect(() => {
    //     if (authUser) {
    //         navigate('/dashboard/user');
    //     }
    // }, [authUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            await login(formData)
            // navigate('/dashboard/user');
            setFormData(prev => ({ ...prev, password: "" })) // Réinitialisation du mot de passe
        } catch (error) {
            console.error(error.message)
        }
    }



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">
                    Email:
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label htmlFor="password">
                    Mot de passe:
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={isLogin}
                >
                    {isLogin ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Connexion en cours...
                        </>
                    ) : "SE CONNECTER"}
                </button>
            </form>
        </div>
    )
}

export default Login