"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CreditCard, Download, Calendar, DollarSign, FileText, Plus } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string | null
  createdAt: string
  order: {
    title: string
    service?: {
      title: string
    }
  }
}

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('history')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user?.id) {
      fetchPayments()
    }
  }, [session, status, router])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66]"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'PENDING': 'En attente',
      'COMPLETED': 'Terminé',
      'FAILED': 'Échoué',
      'REFUNDED': 'Remboursé'
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] px-6 py-8">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Facturation et paiement</h1>
                <p className="text-blue-100">Gérez vos paiements et moyens de paiement</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-[#F72585] text-[#0D3B66]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Historique
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'methods'
                    ? 'border-[#F72585] text-[#0D3B66]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Moyens de paiement
              </button>
            </nav>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {/* Onglet Historique */}
            {activeTab === 'history' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Historique des paiements</h2>
                  <button className="text-[#0D3B66] hover:text-[#F72585] font-medium text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D3B66] mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement de l'historique...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun paiement pour le moment</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {payment.order.title}
                                </div>
                                {payment.order.service && (
                                  <div className="text-sm text-gray-500">
                                    Service: {payment.order.service.title}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.amount} {payment.currency}
                              </div>
                              {payment.paymentMethod && (
                                <div className="text-sm text-gray-500">
                                  {payment.paymentMethod}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                {getStatusLabel(payment.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-[#0D3B66] hover:text-[#F72585] flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                Facture
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Moyens de paiement */}
            {activeTab === 'methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Moyens de paiement</h2>
                  <button className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg hover:bg-[#F72585] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une carte
                  </button>
                </div>

                {/* Cartes sauvegardées */}
                <div className="space-y-4 mb-8">
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-[#0D3B66] to-[#F72585] rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                        <div className="text-sm text-gray-500">Expire 12/25</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Par défaut
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informations de facturation */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de facturation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom sur la facture
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="Nom complet ou nom de l'entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de facturation
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="Adresse complète"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
                        placeholder="Code postal"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="bg-[#0D3B66] text-white px-6 py-2 rounded-lg hover:bg-[#F72585] transition-colors">
                      Sauvegarder les informations
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
