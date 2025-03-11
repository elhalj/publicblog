import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const navigate = useNavigate()
    const { signUp, isSignup } = useAuthStore()
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        role: ""
    })

    const validateForm = () => {
        if (!formData.email.trim()) {
            toast.error("L'email est obligatoire")
            return false
        }
        if (!formData.name.trim()) {
            toast.error("Le nom est obligatoire")
            return false
        }
        const minLength = 6
        if (formData.password.length < minLength) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères")
            return false
        }
        return true
    }

    const handleChange = (e) => {
        const { name, value } = e.target // Correction de la faute de frappe 'tatget'
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            await signUp(formData)
            navigate("/login")
            // setFormData({ email: "", name: "", password: "" }) // Réinitialisation du formulaire
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

                <label htmlFor="name">
                    Nom:
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
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
                <label htmlFor="role">
                    Role:
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={isSignup} // Désactivation pendant le chargement
                >
                    {isSignup ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Chargement...
                        </>
                    ) : "S'INSCRIRE"}
                </button>
            </form>
        </div>
    )
}

export default SignUp