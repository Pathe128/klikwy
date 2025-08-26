"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera } from 'lucide-react'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  skills: string | null
  phone: string | null
  location: string | null
  role: string
  isFreelancer: boolean
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    phone: '',
    location: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          skills: data.skills ? JSON.parse(data.skills).join(', ') : '',
          phone: data.phone || '',
          location: data.location || ''
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const skillsArray = formData.skills 
        ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : []

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          skills: JSON.stringify(skillsArray)
        })
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      skills: profile?.skills ? JSON.parse(profile.skills).join(', ') : '',
      phone: profile?.phone || '',
      location: profile?.location || ''
    })
    setIsEditing(false)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erreur lors du chargement du profil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name || 'Profil'}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{profile.name || 'Utilisateur'}</h1>
                  <p className="text-blue-100">{profile.email}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profile.isFreelancer 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {profile.isFreelancer ? 'Freelance' : 'Client'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                  <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                      placeholder="+212 6 XX XX XX XX"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Localisation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                      placeholder="Ville, Pays"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location || 'Non renseigné'}</p>
                  )}
                </div>
              </div>

              {/* Bio et compétences */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">À propos</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{profile.bio || 'Aucune biographie renseignée'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                      placeholder="React, Design, Rédaction... (séparées par des virgules)"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills ? (
                        JSON.parse(profile.skills).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#0D3B66]/10 text-[#0D3B66] rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">Aucune compétence renseignée</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#0D3B66] text-white rounded-lg hover:bg-[#F72585] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
