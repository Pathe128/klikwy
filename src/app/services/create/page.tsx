"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, X, Plus, Save, ArrowLeft } from 'lucide-react'

const categories = [
  { value: 'WRITING', label: 'Rédaction' },
  { value: 'TRANSLATION', label: 'Traduction' },
  { value: 'DESIGN', label: 'Design graphique' },
  { value: 'LOGO', label: 'Logo & Branding' },
  { value: 'SOCIAL_MEDIA', label: 'Posts réseaux sociaux' },
  { value: 'WEB_DEV', label: 'Développement web' },
  { value: 'PHOTO', label: 'Retouche photo' },
  { value: 'VIDEO', label: 'Montage vidéo' }
]

export default function CreateServicePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    deliveryTime: '3',
    tags: [] as string[],
    image: ''
  })
  const [newTag, setNewTag] = useState('')
  const [imagePreview, setImagePreview] = useState('')

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          deliveryTime: parseInt(formData.deliveryTime),
          userId: session?.user?.id
        })
      })

      if (response.ok) {
        const service = await response.json()
        router.push(`/service/${service.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la création du service')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création du service')
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Créer un nouveau service</h1>
                  <p className="text-blue-100">Proposez vos compétences à la communauté Klikwy</p>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Titre du service */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du service *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Ex: Je vais créer votre logo professionnel en 24h"
                maxLength={80}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/80 caractères</p>
            </div>

            {/* Catégorie et Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de base (MAD) *
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  min="5"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                  placeholder="150"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description du service *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                placeholder="Décrivez en détail ce que vous proposez, votre processus de travail, ce qui est inclus..."
                maxLength={1200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1200 caractères</p>
            </div>

            {/* Délai de livraison */}
            <div>
              <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                Délai de livraison (jours) *
              </label>
              <select
                id="deliveryTime"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
              >
                <option value="1">1 jour (Express)</option>
                <option value="3">3 jours</option>
                <option value="7">7 jours</option>
                <option value="14">14 jours</option>
                <option value="30">30 jours</option>
              </select>
            </div>

            {/* Image du service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du service
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F72585] transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      width={200}
                      height={150}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setFormData({ ...formData, image: '' })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Cliquez pour télécharger une image</p>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés (tags)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                  placeholder="Ajouter un mot-clé"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-[#0D3B66] text-white rounded-lg hover:bg-[#F72585] transition-colors"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-[#0D3B66]/5 border border-[#0D3B66]/20 rounded-lg p-4">
              <h3 className="font-medium text-[#0D3B66] mb-2">💡 Conseils pour un service réussi</h3>
              <ul className="text-sm text-[#0D3B66] space-y-1">
                <li>• Utilisez un titre clair et accrocheur</li>
                <li>• Ajoutez une image de qualité représentative de votre travail</li>
                <li>• Décrivez précisément ce qui est inclus dans votre service</li>
                <li>• Fixez un prix compétitif mais juste</li>
                <li>• Utilisez des mots-clés pertinents pour être trouvé facilement</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
                {isLoading ? 'Publication...' : 'Publier le service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
