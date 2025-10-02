"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Connexion automatique après inscription
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        })
        
        if (result?.ok) {
          router.push("/account/dashboard")
          router.refresh()
        }
      } else {
        setError(data.message || "Une erreur est survenue lors de l'inscription")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <Image
              src="/klikwylog.png"
              alt="Klikwy logo"
              width={150}
              height={50}
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-blue-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez la communauté Klikwy dès aujourd'hui
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Type d'utilisateur */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Je souhaite
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: "client"})}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.userType === "client"
                      ? "border-blue-900 bg-blue-50 text-blue-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Trouver des services
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: "freelancer"})}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.userType === "freelancer"
                      ? "border-pink-500 bg-pink-50 text-pink-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Vendre mes services
                </button>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="name" className="sr-only">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Nom complet"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Adresse email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-900 to-pink-500 hover:from-blue-800 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                "Création en cours..."
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="font-medium text-blue-900 hover:text-pink-500 transition-colors">
                Se connecter
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}