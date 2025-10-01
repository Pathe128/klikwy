"use client"

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Lock, Bell, Globe, CreditCard, Shield, Plus } from 'lucide-react';

type TabType = 'profil' | 'securite' | 'notifications' | 'preferences' | 'paiement' | 'confidentialite';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
};

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: ''
  });

  // Charger les données du profil
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Simuler un chargement de profil
      setTimeout(() => {
        setProfile({
          name: session.user?.name || 'Utilisateur',
          email: session.user?.email || '',
          phone: '+33 6 12 34 56 78',
          address: '123 Rue de la Paix, 75001 Paris',
          bio: 'Développeur web passionné par la création d\'expériences utilisateur exceptionnelles.',
          avatar: session.user?.image || '/default-avatar.png'
        });
        setIsLoading(false);
      }, 500);
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, session, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      // Ici, vous pourriez ajouter un appel à votre API
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'profil', icon: <User className="h-5 w-5" />, label: 'Profil' },
    { id: 'securite', icon: <Lock className="h-5 w-5" />, label: 'Sécurité' },
    { id: 'notifications', icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
    { id: 'preferences', icon: <Globe className="h-5 w-5" />, label: 'Préférences' },
    { id: 'paiement', icon: <CreditCard className="h-5 w-5" />, label: 'Paiement' },
    { id: 'confidentialite', icon: <Shield className="h-5 w-5" />, label: 'Confidentialité' },
  ]

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                      : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                  } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full`}
                >
                  <div className={`${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}>
                    {tab.icon}
                  </div>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {activeTab === 'profil' ? 'Profil' : 
                     activeTab === 'securite' ? 'Sécurité' : 
                     activeTab === 'notifications' ? 'Notifications' : 
                     activeTab === 'preferences' ? 'Préférences' : 
                     activeTab === 'paiement' ? 'Paiement' : 'Confidentialité'}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Gérer vos paramètres {activeTab === 'profil' ? 'de profil' : `de ${activeTab}`}.
                  </p>
                </div>
                {activeTab === 'profil' && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditing ? 'Annuler' : 'Modifier'}
                  </button>
                )}
              </div>
              
              {/* Main Content */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {/* Profile Tab */}
                {activeTab === 'profil' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-full"
                          src={profile.avatar}
                          alt={profile.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                      {isEditing && (
                        <div className="ml-auto">
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <span>Changer de photo</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setProfile({
                                      ...profile,
                                      avatar: event.target?.result as string
                                    });
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }} 
                            />
                          </label>
                          <p className="mt-2 text-xs text-gray-500">
                            JPG, GIF ou PNG. Taille maximale : 2MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                        )}
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Adresse email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                        )}
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Adresse
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={profile.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          À propos de moi
                        </label>
                        {isEditing ? (
                          <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={profile.bio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Décrivez-vous en quelques mots..."
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{profile.bio}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'securite' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Changer de mot de passe</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Mettez à jour votre mot de passe pour sécuriser votre compte.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Mot de passe actuel
                        </label>
                        <div className="mt-1">
                          <input
                            id="current-password"
                            name="current-password"
                            type="password"
                            autoComplete="current-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          Nouveau mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            autoComplete="new-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Mettre à jour le mot de passe
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Paramètres de notification</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Contrôlez la façon dont vous recevez les notifications.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Préférences de notification</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Personnalisez vos préférences de notification.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Notifications par email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="email-notifications"
                                  name="email-notifications"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                                  Recevoir des notifications par email
                                </label>
                              </div>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Notifications push</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="push-notifications"
                                  name="push-notifications"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                                  Activer les notifications push
                                </label>
                              </div>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">SMS</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="sms-notifications"
                                  name="sms-notifications"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                                  Recevoir des notifications par SMS
                                </label>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enregistrer les préférences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Personnalisez vos préférences d'application.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                            <h3 className="text-lg font-medium text-gray-900">Langue</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Sélectionnez votre langue préférée.
                            </p>
                            <div className="mt-4">
                              <select
                                id="language"
                                name="language"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              >
                                <option>Français</option>
                                <option>English</option>
                                <option>Español</option>
                                <option>Deutsch</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Fuseau horaire</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Définissez votre fuseau horaire local.
                            </p>
                            <div className="mt-4">
                              <select
                                id="timezone"
                                name="timezone"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              >
                                <option>Europe/Paris (UTC+02:00)</option>
                                <option>UTC</option>
                                <option>America/New_York (UTC-04:00)</option>
                                <option>Asia/Tokyo (UTC+09:00)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Thème</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Personnalisez l'apparence de l'application.
                            </p>
                            <div className="mt-4 space-y-4">
                              <div className="flex items-center">
                                <input
                                  id="theme-light"
                                  name="theme"
                                  type="radio"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                                  Clair
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="theme-dark"
                                  name="theme"
                                  type="radio"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                                  Sombre
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="theme-system"
                                  name="theme"
                                  type="radio"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  defaultChecked
                                />
                                <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700">
                                  Système
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-5">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Enregistrer les préférences
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Tab */}
                    {activeTab === 'paiement' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Méthodes de paiement</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Gérez vos méthodes de paiement et vos abonnements.
                          </p>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                          <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Cartes enregistrées</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              Vos méthodes de paiement enregistrées.
                            </p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Carte Visa</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                •••• •••• •••• 4242
                              </dd>
                              <dd className="mt-1 text-sm text-gray-500 sm:col-start-2 sm:col-span-2">
                                Expire le 12/25
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-200">
                              <dt className="text-sm font-medium text-gray-500">Carte Mastercard</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                •••• •••• •••• 5555
                              </dd>
                              <dd className="mt-1 text-sm text-gray-500 sm:col-start-2 sm:col-span-2">
                                Expire le 10/24
                              </dd>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Plus className="-ml-1 mr-2 h-5 w-5" />
                              Ajouter une carte
                            </button>
                          </div>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
                          <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Abonnement actuel</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              Détails de votre forfait actuel.
                            </p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Forfait</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  Premium
                                </dd>
                              </div>
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Prix</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  9,99€ / mois
                                </dd>
                              </div>
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Prochain paiement</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  15 mars 2024
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                              type="button"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Résilier l'abonnement
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'confidentialite' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Confidentialité</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Contrôlez comment vos données sont partagées et utilisées.
                          </p>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Paramètres de confidentialité</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Gérez vos préférences de confidentialité.
                            </p>
                            <div className="mt-6 space-y-4">
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="share-profile"
                                    name="share-profile"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="share-profile" className="font-medium text-gray-700">Partager mon profil avec des partenaires de confiance</label>
                                  <p className="text-gray-500">Permettez à nos partenaires de vous contacter avec des offres personnalisées.</p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="data-analytics"
                                    name="data-analytics"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="data-analytics" className="font-medium text-gray-700">Partager des données d'analyse</label>
                                  <p className="text-gray-500">Aidez-nous à améliorer nos services en partageant des données d'utilisation anonymes.</p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="show-online"
                                    name="show-online"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="show-online" className="font-medium text-gray-700">Afficher mon statut en ligne</label>
                                  <p className="text-gray-500">Permettez aux autres utilisateurs de voir quand vous êtes en ligne.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Téléchargement de vos données</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Téléchargez une copie de vos données personnelles.
                            </p>
                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Télécharger mes données
                              </button>
                            </div>
                          </div>

                          <div className="pt-5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Enregistrer les paramètres
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
                                  name="email-notifications"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                                  Activer les notifications par email
                                </label>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences générales</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Personnalisez votre expérience utilisateur.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres d'affichage</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Personnalisez l'apparence de votre tableau de bord.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Thème</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select
                                id="theme"
                                name="theme"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                defaultValue="system"
                              >
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                                <option value="system">Système</option>
                              </select>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'paiement' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Méthodes de paiement</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gérez vos méthodes de paiement et consultez votre historique.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Cartes enregistrées</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Gérez vos cartes de paiement enregistrées.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <div className="px-4 py-5 sm:px-6">
                          <p className="text-sm text-gray-500">Aucune carte enregistrée.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'confidentialite' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Confidentialité et données</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Contrôlez comment vos données sont utilisées et partagées.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de confidentialité</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Gérez vos préférences de confidentialité.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Partage de données</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="data-sharing"
                                  name="data-sharing"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="data-sharing" className="ml-3 block text-sm font-medium text-gray-700">
                                  Autoriser le partage de données anonymisées
                                </label>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Télécharger vos données</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Téléchargez une copie de toutes vos données personnelles.
                        </p>
                      </div>
                      <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Télécharger mes données
                        </button>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer votre compte</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Supprimez définitivement votre compte et toutes vos données.
                        </p>
                      </div>
                      <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                              // Handle account deletion
                              signOut({ callbackUrl: '/' });
                            }
                          }}
                        >
                          Supprimer mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
              
              {/* Contenu principal */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {activeTab === 'profil' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-full"
                          src={profile.avatar}
                          alt={profile.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                      {isEditing && (
                        <div className="ml-auto">
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <span>Changer de photo</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setProfile({
                                      ...profile,
                                      avatar: event.target?.result as string
                                    });
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }} 
                            />
                          </label>
                          <p className="mt-2 text-xs text-gray-500">
                            JPG, GIF ou PNG. Taille maximale : 2MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                        )}
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Adresse email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                        )}
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Adresse
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={profile.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          À propos de moi
                        </label>
                        {isEditing ? (
                          <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={profile.bio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Décrivez-vous en quelques mots..."
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{profile.bio}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'securite' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Changer de mot de passe</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Mettez à jour votre mot de passe pour sécuriser votre compte.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Mot de passe actuel
                        </label>
                        <div className="mt-1">
                          <input
                            id="current-password"
                            name="current-password"
                            type="password"
                            autoComplete="current-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          Nouveau mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            autoComplete="new-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Mettre à jour le mot de passe
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences de notification</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Contrôlez comment vous recevez les notifications par e-mail et sur le site.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">E-mails</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Contrôlez les e-mails que vous recevez de notre part.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Nouvelles fonctionnalités</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="push-everything"
                                    name="push-notifications"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                  <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                    Recevoir des e-mails sur les nouvelles fonctionnalités et mises à jour
                                  </label>
                                </div>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Offres spéciales</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="push-email"
                                    name="push-notifications"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                  <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                    Recevoir des offres spéciales et des réductions
                                  </label>
                                </div>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Notifications de sécurité</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="push-nothing"
                                    name="push-notifications"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                  <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                    Recevoir des alertes de sécurité importantes
                                  </label>
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Enregistrer les préférences
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences générales</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Personnalisez l'apparence et le comportement de votre compte.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Langue et région</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Choisissez votre langue et votre fuseau horaire préférés.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Langue</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select
                                id="language"
                                name="language"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                defaultValue="fr"
                              >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                              </select>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Fuseau horaire</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select
                                id="timezone"
                                name="timezone"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                defaultValue="Europe/Paris"
                              >
                                <option value="Europe/Paris">(GMT+01:00) Paris</option>
                                <option value="Europe/London">(GMT+00:00) London</option>
                                <option value="America/New_York">(GMT-05:00) New York</option>
                                <option value="Asia/Tokyo">(GMT+09:00) Tokyo</option>
                              </select>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enregistrer les préférences
                        </button>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Thème</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Personnalisez l'apparence de votre tableau de bord.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Mode d'affichage</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <fieldset className="space-y-4">
                                <legend className="sr-only">Mode d'affichage</legend>
                                <div className="flex items-center">
                                  <input
                                    id="theme-light"
                                    name="theme"
                                    type="radio"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    defaultChecked
                                  />
                                  <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                                    Clair
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="theme-dark"
                                    name="theme"
                                    type="radio"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                                    Sombre
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="theme-system"
                                    name="theme"
                                    type="radio"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700">
                                    Système
                                  </label>
                                </div>
                              </fieldset>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enregistrer les préférences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'paiement' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Méthodes de paiement</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gérer vos méthodes de paiement et vos abonnements.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Cartes enregistrées</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Gérez vos cartes de paiement enregistrées.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Carte principale</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1h-5V4a3 3 0 00-3-3zm1 15a1 1 0 11-2 0v-4a1 1 0 112 0v4zm-1-9a1 1 0 01-2 0V4a1 1 0 112 0v3z" />
                                </svg>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">Visa se terminant par 4242</div>
                                  <div className="text-sm text-gray-500">Date d'expiration: 12/24</div>
                                </div>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
                        <p className="text-sm text-gray-500">Ajoutez une nouvelle carte de paiement.</p>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Ajouter une carte
                        </button>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Historique des paiements</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Consultez l'historique de vos transactions.
                        </p>
                      </div>
                      <div className="border-t border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 sept. 2023</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Abonnement Mensuel</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">29,99 €</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Payé
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 août 2023</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Abonnement Mensuel</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">29,99 €</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Payé
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'confidentialite' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Confidentialité et données</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Contrôlez comment vos informations sont utilisées et partagées.
                      </p>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de confidentialité</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Gérez vos préférences de confidentialité.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Profil public</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="public-profile"
                                  name="public-profile"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label htmlFor="public-profile" className="ml-3 block text-sm font-medium text-gray-700">
                                  Rendre mon profil visible par les autres utilisateurs
                                </label>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Votre profil sera visible par les autres utilisateurs de la plateforme.
                              </p>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Partage de données</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="data-sharing"
                                  name="data-sharing"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label htmlFor="data-sharing" className="ml-3 block text-sm font-medium text-gray-700">
                                  Partager des données d'utilisation anonymes
                                </label>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Aidez-nous à améliorer nos services en partageant des données d'utilisation anonymes.
                              </p>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Publicité personnalisée</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="personalized-ads"
                                  name="personalized-ads"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="personalized-ads" className="ml-3 block text-sm font-medium text-gray-700">
                                  Autoriser la publicité personnalisée
                                </label>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Recevez des publicités personnalisées en fonction de vos centres d'intérêt.
                              </p>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enregistrer les préférences
                        </button>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Télécharger vos données</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Téléchargez une copie de toutes vos données personnelles que nous détenons.
                        </p>
                      </div>
                      <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Données personnelles</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <p className="text-sm text-gray-500 mb-4">
                                Vous pouvez demander un fichier contenant les données personnelles que nous détenons à votre sujet.
                              </p>
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Télécharger mes données
                              </button>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer votre compte</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Supprimez définitivement votre compte et toutes vos données personnelles.
                        </p>
                      </div>
                      <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Suppression du compte</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <p className="text-sm text-gray-500 mb-4">
                                Une fois votre compte supprimé, toutes vos données seront définitivement effacées. Cette action est irréversible.
                              </p>
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() => {
                                  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.')) {
                                    // Logique de suppression du compte
                                    signOut({ callbackUrl: '/' });
                                  }
                                }}
                              >
                                Supprimer mon compte
                              </button>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  {activeTab === 'profil' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-full"
                            src={profile.avatar}
                            alt={profile.name}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                          <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                        {isEditing && (
                          <div className="ml-auto">
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              <span>Changer de photo</span>
                              <input type="file" className="sr-only" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setProfile({
                                      ...profile,
                                      avatar: event.target?.result as string
                                    });
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }} />
                            </label>
                            <p className="mt-2 text-xs text-gray-500">
                              JPG, GIF ou PNG. Taille maximale : 2MB
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom complet
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={profile.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adresse email
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                            </span>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={profile.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Adresse
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </span>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={profile.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            À propos de moi
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="bio"
                              name="bio"
                              rows={3}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md disabled:bg-gray-100"
                              value={profile.bio}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Une brève description de vous-même pour votre profil public.
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'securite' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Sécurité du compte</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Mot de passe</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Mettez à jour votre mot de passe pour sécuriser votre compte.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Changer le mot de passe
                        </button>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Authentification à deux facteurs</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Ajoutez une couche de sécurité supplémentaire à votre compte.
                        </p>
                        <div className="mt-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Lock className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Authentification à deux facteurs</div>
                              <div className="text-sm text-gray-500">Non activée</div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Activer l'authentification à deux facteurs
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Zone de danger</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              La suppression de votre compte est une action permanente et ne peut pas être annulée.
                            </p>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() => signOut({ callbackUrl: '/' })}
                            >
                              Se déconnecter
                            </button>
                            <button
                              type="button"
                              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Supprimer mon compte
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences de notification</h2>
                  <p className="text-gray-600 mb-6">
                    Contrôlez comment vous recevez les notifications par e-mail et sur le site.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">E-mails</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Recevez des mises à jour par e-mail concernant votre compte.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Messages</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="push-everything"
                                  name="push-notifications"
                                  type="checkbox"
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                  Recevoir des e-mails pour les nouveaux messages
                                </label>
                              </div>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Offres spéciales</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="push-email"
                                  name="push-notifications"
                                  type="checkbox"
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  defaultChecked
                                />
                                <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                                  Recevoir des offres spéciales et des mises à jour
                                </label>
                              </div>
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Nouvelles fonctionnalités</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <input
                                  id="push-nothing"
                                  name="push-notifications"
                                  type="checkbox"
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                                  Être informé des nouvelles fonctionnalités
                                </label>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications push</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Recevez des notifications directement sur votre appareil.
                        </p>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Toutes les notifications</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  role="switch"
                                  aria-checked="false"
                                  aria-labelledby="push-everything-label"
                                >
                                  <span className="sr-only">Activer les notifications push</span>
                                  <span
                                    aria-hidden="true"
                                    className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                  ></span>
                                </button>
                                <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                                  Activer les notifications push
                                </label>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'paiement' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Méthodes de paiement</h2>
                  <p className="text-gray-600 mb-6">
                        Gérer vos méthodes de paiement et vos abonnements.
                      </p>
                      
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Carte de crédit</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              Ajoutez ou modifiez vos informations de paiement.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            Ajouter une carte
                          </button>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Carte principale</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <div className="h-8 w-12 rounded bg-gray-200 flex items-center justify-center mr-3">
                                    <CreditCard className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <span>•••• •••• •••• 4242</span>
                                  <span className="ml-2 text-sm text-gray-500">Expire le 12/25</span>
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Historique des transactions</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Consultez l'historique de vos paiements et factures.
                          </p>
                        </div>
                        <div className="border-t border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            <div className="grid grid-cols-4">
                              <div>Date</div>
                              <div>Description</div>
                              <div>Montant</div>
                              <div>Statut</div>
                            </div>
                          </div>
                          <div className="px-4 py-3 text-sm border-b border-gray-200">
                            <div className="grid grid-cols-4">
                              <div>15/09/2023</div>
                              <div>Abonnement Premium</div>
                              <div>19,99 €</div>
                              <div className="text-green-600">Payé</div>
                            </div>
                          </div>
                          <div className="px-4 py-3 text-sm border-b border-gray-200">
                            <div className="grid grid-cols-4">
                              <div>15/08/2023</div>
                              <div>Abonnement Premium</div>
                              <div>19,99 €</div>
                              <div className="text-green-600">Payé</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:text-blue-800">
                            Voir tout l'historique
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'confidentialite' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Confidentialité</h2>
                      <p className="text-gray-600 mb-6">
                        Contrôlez comment vos informations sont partagées et utilisées.
                      </p>
                      
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de confidentialité</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Gérez qui peut voir vos informations personnelles.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Profil public</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="public-profile"
                                    name="public-profile"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    defaultChecked
                                  />
                                  <label htmlFor="public-profile" className="ml-3 block text-sm font-medium text-gray-700">
                                    Rendre mon profil visible par les autres utilisateurs
                                  </label>
                                </div>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Adresse e-mail</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="show-email"
                                    name="show-email"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor="show-email" className="ml-3 block text-sm font-medium text-gray-700">
                                    Afficher mon adresse eemail sur mon profil public
                                  </label>
                                </div>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="show-phone"
                                    name="show-phone"
                                    type="checkbox"
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor="show-phone" className="ml-3 block text-sm font-medium text-gray-700">
                                    Afficher mon numéro de téléphone sur mon profil public
                                  </label>
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Données personnelles</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Gérez vos données personnelles et vos préférences de confidentialité.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Télécharger vos données</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <p className="text-gray-600">Téléchargez une copie de vos données personnelles.</p>
                                <button
                                  type="button"
                                  className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Télécharger mes données
                                </button>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Supprimer votre compte</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <p className="text-gray-600">
                                  La suppression de votre compte est définitive. Toutes vos données seront supprimées et ne pourront pas être récupérées.
                                </p>
                                <button
                                  type="button"
                                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Supprimer mon compte
                                </button>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences</h2>
                      <p className="text-gray-600 mb-6">
                        Personnalisez votre expérience sur notre plateforme.
                      </p>
                      
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Préférences générales</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Personnalisez l'apparence et le comportement de votre compte.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Langue</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <select
                                  id="language"
                                  name="language"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  defaultValue="fr"
                                >
                                  <option value="fr">Français</option>
                                  <option value="en">English</option>
                                  <option value="es">Español</option>
                                  <option value="de">Deutsch</option>
                                </select>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Fuseau horaire</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <select
                                  id="timezone"
                                  name="timezone"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  defaultValue="Europe/Paris"
                                >
                                  <option value="Europe/Paris">(GMT+1) Paris, France</option>
                                  <option value="Europe/London">(GMT+0) London, UK</option>
                                  <option value="America/New_York">(GMT-4) New York, USA</option>
                                  <option value="Asia/Tokyo">(GMT+9) Tokyo, Japan</option>
                                </select>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Thème</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex space-x-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name="theme"
                                      value="light"
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                      defaultChecked
                                    />
                                    <span className="ml-2">Clair</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name="theme"
                                      value="dark"
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2">Sombre</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name="theme"
                                      value="system"
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2">Système</span>
                                  </label>
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Enregistrer les préférences
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
