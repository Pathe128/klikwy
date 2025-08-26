"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Settings, User, Mail, Lock, Bell, Shield, Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('account')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    notifications: {
      email: true,
      push: true,
      marketing: false
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66]"></div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Success feedback
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
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
              <Settings className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Paramètres du compte</h1>
                <p className="text-blue-100">Gérez vos préférences et paramètres de sécurité</p>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Navigation latérale */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === 'account' 
                      ? 'bg-[#0D3B66]/10 text-[#0D3B66]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Compte</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === 'security' 
                      ? 'bg-[#0D3B66]/10 text-[#0D3B66]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Sécurité</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                    activeTab === 'notifications' 
                      ? 'bg-[#0D3B66]/10 text-[#0D3B66]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>
              </nav>
            </div>

            {/* Contenu */}
            <div className="flex-1 p-6">
              {/* Onglet Compte */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Informations du compte</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="+212 6 XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="Ville, Pays"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <h3 className="font-medium text-yellow-800">Connexion via Google</h3>
                        <p className="text-sm text-yellow-700">
                          Votre compte est sécurisé par Google OAuth. Vous pouvez gérer votre mot de passe depuis votre compte Google.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                        <p className="text-sm text-gray-500">Sécurisez votre compte avec une couche de protection supplémentaire</p>
                      </div>
                      <button className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg hover:bg-[#F72585] transition-colors text-sm">
                        Activer
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Sessions actives</h3>
                        <p className="text-sm text-gray-500">Gérez les appareils connectés à votre compte</p>
                      </div>
                      <button className="text-[#0D3B66] hover:text-[#F72585] font-medium text-sm">
                        Voir les sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Préférences de notification</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Notifications par email</h3>
                        <p className="text-sm text-gray-500">Recevez des notifications importantes par email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              email: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F72585]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D3B66]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Notifications push</h3>
                        <p className="text-sm text-gray-500">Recevez des notifications dans votre navigateur</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.push}
                          onChange={(e) => setFormData({
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              push: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F72585]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D3B66]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Emails marketing</h3>
                        <p className="text-sm text-gray-500">Recevez des offres et actualités de Klikwy</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.marketing}
                          onChange={(e) => setFormData({
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              marketing: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F72585]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D3B66]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#0D3B66] text-white rounded-lg hover:bg-[#F72585] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
