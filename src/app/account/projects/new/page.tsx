'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Upload, X } from 'lucide-react'

type ProjectFormData = {
  title: string
  description: string
  category: string
  budget: string
  deadline: string
  skills: string[]
  attachments: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
}

export default function NewProjectPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    skills: [],
    attachments: []
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault()
      if (!formData.skills.includes(currentSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, currentSkill.trim()]
        }))
        setCurrentSkill('')
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      // Créer des URLs pour l'aperçu des images
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
      
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...filePreviews]
      }))
    }
  }

  const removeFile = (index: number) => {
    // Libérer l'URL de l'objet Blob pour éviter les fuites de mémoire
    if (formData.attachments[index]?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(formData.attachments[index].url)
    }
    
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // Nettoyage des URLs d'objets Blob lors du démontage du composant
  useEffect(() => {
    return () => {
      formData.attachments.forEach(file => {
        if (file?.url?.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [formData.attachments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!session) {
      setError('Veuillez vous connecter pour publier un projet')
      return
    }

    if (!formData.title || !formData.description || !formData.category) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)

    try {
      // Récupérer les projets existants
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]')
      
      // Créer un nouvel objet projet
      const newProject = {
        id: `proj-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: formData.budget,
        deadline: formData.deadline,
        status: 'en_attente',
        client: session.user?.name || 'Utilisateur anonyme',
        clientImage: session.user?.image || '/default-avatar.png',
        createdAt: new Date().toISOString(),
        progress: 0,
        skills: formData.skills,
        attachments: formData.attachments
      }

      // Ajouter le nouveau projet au tableau
      const updatedProjects = [newProject, ...existingProjects]
      
      // Mettre à jour le stockage local
      localStorage.setItem('projects', JSON.stringify(updatedProjects))
      
      // Rediriger vers la page du tableau de bord
      router.push('/account/dashboard')
      
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err)
      setError('Une erreur est survenue lors de la création du projet')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-[#0D3B66] hover:text-[#F72585] mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Publier un nouveau projet</h1>
          <p className="mt-2 text-gray-600">
            Remplissez les détails de votre projet pour trouver le freelance idéal.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre du projet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                placeholder="Ex: Développement d'un site web e-commerce"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                placeholder="Décrivez votre projet en détail, vos attentes, vos besoins spécifiques..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="developpement-web">Développement Web</option>
                  <option value="design">Design</option>
                  <option value="redaction">Rédaction</option>
                  <option value="marketing">Marketing</option>
                  <option value="video-animation">Vidéo & Animation</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget (optionnel)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Compétences requises (optionnel)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="skills"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 block w-full rounded-md border-gray-300 focus:ring-[#F72585] focus:border-[#F72585] sm:text-sm"
                  placeholder="Ajoutez des compétences (appuyez sur Entrée pour ajouter)"
                />
              </div>
              {formData.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      >
                        <span className="sr-only">Supprimer {skill}</span>
                        <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                          <path fillRule="evenodd" d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pièces jointes (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
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
                    PNG, JPG, PDF jusqu'à 10MB
                  </p>
                </div>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/account/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F72585]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0D3B66] hover:bg-[#0a2e4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F72585] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Publication en cours...' : 'Publier le projet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
