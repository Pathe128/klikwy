"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CreditCard, Plus, Download, Receipt, CheckCircle } from 'lucide-react'

type Plan = {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  isCurrent: boolean
  isPopular?: boolean
}

type PaymentMethod = {
  id: string
  type: 'visa' | 'mastercard' | 'paypal'
  last4: string
  expDate: string
  isDefault: boolean
}

type Invoice = {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  downloadUrl: string
}

const BillingPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'plans' | 'payment-methods' | 'invoices'>('plans')
  const [isLoading, setIsLoading] = useState(true)

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basique',
      price: '0',
      period: 'par mois',
      features: [
        '5 projets actifs',
        '3 Go de stockage',
        'Support de base',
        'Accès aux fonctionnalités essentielles'
      ],
      isCurrent: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '19',
      period: 'par mois',
      features: [
        'Projets illimités',
        '50 Go de stockage',
        'Support prioritaire',
        'Analyses avancées',
        'Fonctionnalités premium'
      ],
      isCurrent: false,
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: '49',
      period: 'par mois',
      features: [
        'Tout inclus dans Pro',
        'Stockage illimité',
        'Support 24/7',
        'Intégrations personnalisées',
        'Compte dédié',
        'Formation en ligne'
      ],
      isCurrent: false
    }
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expDate: '10/24',
      isDefault: false
    }
  ]

  const invoices: Invoice[] = [
    {
      id: 'INV-2023-09',
      date: '15 Sept. 2023',
      amount: '19,99 €',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-08',
      date: '15 Août 2023',
      amount: '19,99 €',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-07',
      date: '15 Juil. 2023',
      amount: '19,99 €',
      status: 'paid',
      downloadUrl: '#'
    }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const renderPlanCard = (plan: Plan) => (
    <div 
      key={plan.id}
      className={`relative p-6 rounded-lg border ${
        plan.isPopular 
          ? 'border-blue-500 bg-blue-50' 
          : plan.isCurrent 
            ? 'border-green-500' 
            : 'border-gray-200'
      }`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          POPULAIRE
        </div>
      )}
      {plan.isCurrent && !plan.isPopular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          ACTUEL
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
      
      <div className="mt-4">
        <span className="text-4xl font-bold">
          {plan.price === '0' ? 'Gratuit' : `$${plan.price}`}
        </span>
        {plan.price !== '0' && <span className="text-gray-500 ml-1">/mois</span>}
      </div>
      
      <p className="mt-2 text-sm text-gray-500">{plan.period}</p>
      
      <ul className="mt-6 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        {plan.isCurrent ? (
          <button
            disabled
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
          >
            Plan actuel
          </button>
        ) : (
          <button
            className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              plan.isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {plan.price === '0' ? 'Commencer' : 'Changer de plan'}
          </button>
        )}
      </div>
    </div>
  )

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center">
        <div className="h-10 w-16 bg-white border border-gray-200 rounded-md flex items-center justify-center mr-4">
          {method.type === 'visa' ? (
            <span className="text-blue-800 font-bold text-lg">VISA</span>
          ) : method.type === 'mastercard' ? (
            <span className="text-orange-500 font-bold text-sm">mastercard</span>
          ) : (
            <span className="text-blue-500 font-bold">PayPal</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
          </p>
          <p className="text-sm text-gray-500">Expire le {method.expDate}</p>
          {method.isDefault && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
              Par défaut
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Modifier
        </button>
        {!method.isDefault && (
          <button className="text-sm font-medium text-red-600 hover:text-red-800">
            Supprimer
          </button>
        )}
      </div>
    </div>
  )

  const renderInvoice = (invoice: Invoice) => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }

    const statusText = {
      paid: 'Payé',
      pending: 'En attente',
      failed: 'Échoué'
    }

    return (
      <div key={invoice.id} className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Receipt className="h-5 w-5 text-gray-400 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-900">Facture #{invoice.id}</p>
            <p className="text-sm text-gray-500">{invoice.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
            {statusText[invoice.status]}
          </span>
          <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
          <a
            href={invoice.downloadUrl}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facturation et abonnements</h1>
          <p className="mt-2 text-gray-600">
            Gérez votre abonnement, vos méthodes de paiement et consultez votre historique de facturation.
          </p>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plans')}
              className={`${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Plans et tarification
            </button>
            <button
              onClick={() => setActiveTab('payment-methods')}
              className={`${
                activeTab === 'payment-methods'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Méthodes de paiement
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Factures
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {activeTab === 'plans' && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Choisissez votre plan</h2>
                <p className="text-gray-600">
                  Sélectionnez le forfait qui correspond le mieux à vos besoins.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(renderPlanCard)}
              </div>
              
              <div className="mt-12 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Questions fréquentes</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Puis-je changer de plan à tout moment ?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Oui, vous pouvez passer d'un plan à l'autre à tout moment. Le changement prendra effet à la fin de votre période de facturation actuelle.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Quels modes de paiement acceptez-vous ?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Nous acceptons les cartes de crédit Visa, Mastercard et American Express, ainsi que PayPal.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Puis-je annuler mon abonnement à tout moment ?</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités payantes jusqu'à la fin de votre période de facturation actuelle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment-methods' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Méthodes de paiement</h2>
                  <p className="mt-1 text-gray-600">
                    Gérez vos méthodes de paiement pour des transactions rapides et sécurisées.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Ajouter une méthode
                </button>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map(renderPaymentMethod)}
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une nouvelle carte</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Numéro de carte
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="card-number"
                        id="card-number"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                      Date d'expiration
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="expiration-date"
                        id="expiration-date"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="MM/AA"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      Code de sécurité
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cvv"
                        id="cvv"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                      Nom sur la carte
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="card-name"
                        id="card-name"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Nom tel qu'il apparaît sur la carte"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="save-card"
                          name="save-card"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="save-card" className="font-medium text-gray-700">
                          Enregistrer cette carte pour les paiements futurs
                        </label>
                        <p className="text-gray-500">Vos informations de paiement sont sécurisées et cryptées.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ajouter la carte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Historique des factures</h2>
                <p className="mt-1 text-gray-600">
                  Consultez et téléchargez vos factures précédentes.
                </p>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {invoices.map(renderInvoice)}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <p>Affichage des 3 dernières factures</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir tout l'historique
                </button>
              </div>
              
              <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Besoin d'aide ?</h3>
                <p className="text-gray-600 mb-4">
                  Si vous avez des questions concernant vos factures ou votre abonnement, n'hésitez pas à nous contacter.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Contacter le support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BillingPage
