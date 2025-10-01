"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Briefcase, DollarSign, Calendar, FileText, Send } from 'lucide-react'

export default function PublishProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: ''
  })

  const categories = [
    { value: 'REDACTION', label: 'Rédaction' },
    { value: 'TRADUCTION', label: 'Traduction' },
    { value: 'DESIGN_GRAPHIQUE', label: 'Design graphique' },
    { value: 'LOGO_BRANDING', label: 'Logo & Branding' },
    { value: 'POSTS_RESEAUX_SOCIAUX', label: 'Posts réseaux sociaux' },
    { value: 'DEVELOPPEMENT_WEB', label: 'Développement web' },
    { value: 'RETOUCHE_PHOTO', label: 'Retouche photo' },
    { value: 'MONTAGE_VIDEO', label: 'Montage vidéo' },
    { value: 'MARKETING_DIGITAL', label: 'Marketing digital' },
    { value: 'AUTRES', label: 'Autres' }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66]"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des champs requis
    if (!formData.title || !formData.description || !formData.budget) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          budget: parseFloat(formData.budget),
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          category: formData.category || 'AUTRES'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la publication du projet')
      }
      
      // Réinitialisation du formulaire
      setFormData({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        category: ''
      })
      
      // Redirection vers le tableau de bord avec un message de succès
      router.push('/dashboard?tab=projects&success=project_created')
      
    } catch (error) {
      console.error('Erreur lors de la publication du projet:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] px-6 py-8">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Publier un brief projet</h1>
                <p className="text-blue-100">Décrivez votre projet pour trouver le freelance parfait</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Titre du projet */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Titre du projet *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Ex: Création d'un logo pour ma startup"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Décrivez votre projet en détail : objectifs, style souhaité, livrables attendus, contraintes particulières..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Plus votre description est détaillée, mieux les freelances pourront vous proposer leurs services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Budget (MAD) *
                </label>
                <input
                  type="number"
                  id="budget"
                  required
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                  placeholder="1000"
                />
              </div>

              {/* Délai */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                />
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-[#0D3B66]/5 border border-[#0D3B66]/20 rounded-lg p-4">
              <h3 className="font-medium text-[#0D3B66] mb-2">💡 Conseils pour un projet réussi</h3>
              <ul className="text-sm text-[#0D3B66] space-y-1">
                <li>• Soyez précis dans votre description</li>
                <li>• Mentionnez vos préférences de style ou d'approche</li>
                <li>• Indiquez les formats de livraison souhaités</li>
                <li>• Fixez un budget réaliste pour attirer les meilleurs freelances</li>
              </ul>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#0D3B66] text-white rounded-lg hover:bg-[#F72585] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Publication...' : 'Publier le projet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
