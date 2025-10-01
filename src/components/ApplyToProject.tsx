'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, Paperclip, Clock, User, MessageSquare } from 'lucide-react'

type Application = {
  id: string
  projectId: string
  freelancerId: string
  freelancerName: string
  freelancerImage: string
  message: string
  attachments: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
  status: 'en_attente' | 'acceptee' | 'refusee'
  createdAt: string
}

type Props = {
  projectId: string
  onApplicationSubmit?: () => void
}

export default function ApplyToProject({ projectId, onApplicationSubmit }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<Array<{name: string, url: string, type: string, size: number}>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      const filePreviews = await Promise.all(
        files.map(file => {
          return new Promise<{ name: string; url: string; type: string; size: number }>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              resolve({
                name: file.name,
                url: reader.result as string,
                type: file.type,
                size: file.size
              })
            }
            reader.readAsDataURL(file)
          })
        })
      )
      
      setAttachments(prev => [...prev, ...filePreviews])
    }
  }

  const removeFile = (index: number) => {
    // Libérer l'URL de l'objet Blob pour éviter les fuites de mémoire
    if (attachments[index]?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachments[index].url)
    }
    
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!session) {
      setError('Veuillez vous connecter pour postuler à ce projet')
      return
    }

    if (!message.trim()) {
      setError('Veuillez rédiger un message de motivation')
      return
    }

    setIsSubmitting(true)

    try {
      // Récupérer les candidatures existantes
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]')
      
      // Créer une nouvelle candidature
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        projectId,
        freelancerId: session.user?.email || 'unknown',
        freelancerName: session.user?.name || 'Freelance anonyme',
        freelancerImage: session.user?.image || '/default-avatar.png',
        message: message.trim(),
        attachments,
        status: 'en_attente',
        createdAt: new Date().toISOString()
      }
      
      // Ajouter la nouvelle candidature
      const updatedApplications = [newApplication, ...existingApplications]
      
      // Mettre à jour le stockage local
      localStorage.setItem('applications', JSON.stringify(updatedApplications))
      
      // Réinitialiser le formulaire
      setMessage('')
      setAttachments([])
      setSuccess(true)
      
      // Appeler le callback si fourni
      if (onApplicationSubmit) {
        onApplicationSubmit()
      }
      
      // Rediriger après un court délai
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
      
    } catch (err) {
      console.error('Erreur lors de la soumission de la candidature:', err)
      setError('Une erreur est survenue lors de la soumission de votre candidature')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Nettoyage des URLs d'objets Blob lors du démontage du composant
  useEffect(() => {
    return () => {
      attachments.forEach(file => {
        if (file?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [attachments])

  if (!session) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Postuler à ce projet</h3>
        <p className="text-gray-600 mb-4">Connectez-vous pour postuler à ce projet.</p>
        <button
          onClick={() => router.push(`/auth/login?callbackUrl=/projets/${projectId}`)}
          className="w-full bg-[#0D3B66] text-white py-2 px-4 rounded-md hover:bg-[#0a2e4d] transition-colors"
        >
          Se connecter
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg shadow">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Candidature envoyée !</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Votre candidature a bien été envoyée au client.</p>
              <p className="mt-1">Vous serez notifié(e) lorsque le client aura pris une décision.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Postuler à ce projet</h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message de motivation <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
            placeholder="Présentez-vous et expliquez pourquoi vous êtes le/la freelance idéal(e) pour ce projet..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pièces jointes (optionnel)
          </label>
          <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Paperclip className="mx-auto h-8 w-8 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#0D3B66] hover:text-[#F72585] focus-within:outline-none"
                >
                  <span>Téléverser un fichier</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">
                CV, portfolio, références... (PDF, DOC, JPG, PNG jusqu'à 10MB)
              </p>
            </div>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D3B66] hover:bg-[#0a2e4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F72585] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </div>
      </form>
    </div>
  )
}
