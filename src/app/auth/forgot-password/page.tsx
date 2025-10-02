"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        console.log("Réponse du serveur:", data)
      } else {
        setError(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Vérifiez votre email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Si un compte existe avec cet email, un lien de récupération a été envoyé.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              (En développement, vérifiez les logs du serveur)
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/auth/login"
            className="flex items-center text-blue-600 hover:text-blue-500 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Link>
          
          <div className="text-center">
            <Mail className="mx-auto h-16 w-16 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Mot de passe oublié ?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}