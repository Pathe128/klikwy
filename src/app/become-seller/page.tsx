"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Star, DollarSign, FileText, Image as ImageIcon, Save } from 'lucide-react'

export default function BecomeSellerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    portfolio: '',
    hourlyRate: '',
    availability: 'FULL_TIME'
  })

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
    setIsLoading(true)

    try {
      const response = await fetch('/api/become-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: parseFloat(formData.hourlyRate),
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        })
      })

      if (response.ok) {
        router.push('/dashboard?tab=seller')
      } else {
        console.error('Erreur lors de l\'activation du statut vendeur')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] px-6 py-8">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Devenir vendeur</h1>
                <p className="text-blue-100">Complétez votre profil pour commencer à proposer vos services</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Bio professionnelle */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Biographie professionnelle *
              </label>
              <textarea
                id="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Présentez-vous en tant que professionnel : votre parcours, vos spécialités, ce qui vous différencie..."
              />
            </div>

            {/* Compétences */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Compétences principales *
              </label>
              <input
                type="text"
                id="skills"
                required
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="React, Photoshop, Rédaction web, SEO... (séparées par des virgules)"
              />
            </div>

            {/* Expérience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Expérience professionnelle *
              </label>
              <textarea
                id="experience"
                required
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Décrivez votre expérience : années d'expérience, projets marquants, clients précédents..."
              />
            </div>

            {/* Portfolio */}
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Portfolio / Exemples de travaux
              </label>
              <textarea
                id="portfolio"
                rows={3}
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Liens vers vos réalisations, portfolio en ligne, ou descriptions de projets réussis..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarif horaire */}
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Tarif horaire (MAD) *
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  required
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                  placeholder="150"
                />
              </div>

              {/* Disponibilité */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                >
                  <option value="FULL_TIME">Temps plein</option>
                  <option value="PART_TIME">Temps partiel</option>
                  <option value="WEEKENDS">Week-ends uniquement</option>
                  <option value="EVENINGS">Soirées uniquement</option>
                </select>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-[#0D3B66]/5 border border-[#0D3B66]/20 rounded-lg p-4">
              <h3 className="font-medium text-[#0D3B66] mb-2">🌟 Conseils pour réussir</h3>
              <ul className="text-sm text-[#0D3B66] space-y-1">
                <li>• Soyez authentique et professionnel dans votre présentation</li>
                <li>• Mettez en avant vos réalisations concrètes</li>
                <li>• Fixez un tarif compétitif mais juste pour votre expertise</li>
                <li>• Répondez rapidement aux demandes des clients</li>
                <li>• Livrez toujours dans les délais convenus</li>
              </ul>
            </div>

            {/* Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📋 Conditions pour devenir vendeur</h3>
              <div className="space-y-2">
                <label className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span className="text-sm text-gray-700">
                    J'accepte les <a href="/terms" className="text-[#0D3B66] hover:text-[#F72585] hover:underline">conditions générales</a> de Klikwy
                  </span>
                </label>
                <label className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span className="text-sm text-gray-700">
                    Je m'engage à fournir des services de qualité et à respecter les délais convenus
                  </span>
                </label>
                <label className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span className="text-sm text-gray-700">
                    Je comprends que Klikwy prélève une commission sur chaque vente
                  </span>
                </label>
              </div>
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
                <Save className="w-4 h-4" />
                {isLoading ? 'Activation...' : 'Devenir vendeur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
