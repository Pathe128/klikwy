"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // Rediriger automatiquement après 5 secondes
    const timer = setTimeout(() => {
      router.push(callbackUrl)
    }, 5000)

    return () => clearTimeout(timer)
  }, [callbackUrl, router])

  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'Ce compte est déjà associé à un autre fournisseur de connexion. Veuillez vous connecter avec la méthode que vous avez utilisée précédemment.'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
      case 'OAuthAccountNotLinked':
        return 'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer.'
      case 'EmailSignin':
        return 'Échec de l\'envoi de l\'e-mail de connexion. Veuillez réessayer.'
      case 'CredentialsSignin':
        return 'Échec de la connexion. Vérifiez vos identifiants.'
      case 'SessionRequired':
        return 'Veuillez vous connecter pour accéder à cette page.'
      case 'Default':
      default:
        return 'Une erreur inattendue est survenue. Veuillez réessayer.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Erreur de connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage()}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour à la page de connexion
          </Link>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Vous serez redirigé automatiquement vers la page d'accueil dans quelques secondes...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
