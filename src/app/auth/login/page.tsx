"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        // Redirection vers le dashboard
        router.push("/account/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion")
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
            Bon retour !
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte Klikwy
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-blue-900 hover:text-pink-500 transition-colors">
                Mot de passe oublié ?
              </Link>
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
                "Connexion en cours..."
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Vous n'avez pas encore de compte ?{" "}
              <Link href="/auth/register" className="font-medium text-blue-900 hover:text-pink-500 transition-colors">
                S'inscrire gratuitement
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}