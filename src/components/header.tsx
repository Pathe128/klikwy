'use client'

import Image from "next/image"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Menu, X, User, Settings, Briefcase, CreditCard, LayoutDashboard, Search, Bell } from "lucide-react"

export default function Header() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0
      setIsScrolled(scrolled)
      setShowMegaMenu(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Header principal */}
      <header className={`bg-white transition-all duration-300 z-50 ${
        isScrolled ? 'fixed top-0 left-0 right-0 shadow-lg' : 'relative'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo + barre de recherche */}
          <div className="flex items-center gap-6 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 h-14">
              <div className="relative h-full w-48">
                <Image
                  src="/klikwylog.png"
                  alt="Klikwy"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Barre de recherche */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un service…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[#F72585] 
                             focus:border-[#F72585] text-gray-900 placeholder-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                   bg-gradient-to-r from-[#4C1D95] via-[#9333EA] to-[#F72585] 
                                   hover:from-[#F72585] hover:via-[#9333EA] hover:to-[#4C1D95] 
                                   text-white px-4 py-2 rounded-full transition-all duration-300">
                  Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* Navigation + User section */}
          <div className="flex items-center gap-4 ml-6">
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/services" className="text-[#0D3B66] hover:text-[#F72585] font-medium transition-colors whitespace-nowrap">
                Services
              </Link>
              <Link href="/features/devenir-freelance" className="text-[#0D3B66] hover:text-[#F72585] font-medium transition-colors whitespace-nowrap">
                Devenir freelance
              </Link>
            </nav>

            {!session ? (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-[#0D3B66] hover:text-[#F72585] font-medium transition-colors whitespace-nowrap">
                  Connexion
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-gradient-to-r from-[#4C1D95] via-[#9333EA] to-[#F72585] 
                             hover:from-[#F72585] hover:via-[#9333EA] hover:to-[#4C1D95] 
                             text-white px-6 py-2 rounded-full font-medium 
                             transition-all duration-300 whitespace-nowrap"
                >
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 relative">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Profil'}
                        width={36}
                        height={36}
                        className="rounded-full w-9 h-9 object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {session.user?.name?.split(' ')[0] || 'Mon compte'}
                    </span>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-[#0D3B66] hover:text-[#F72585]" />
                  </button>
                </div>

                <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  {showUserMenu ? <X size={20} className="text-[#0D3B66]" /> : <Menu size={20} className="text-[#0D3B66]" />}
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-[#0D3B66]">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                    
                    <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#F72585] transition-colors text-[#0D3B66]" onClick={() => setShowUserMenu(false)}>
                      <User size={16} /><span>Profil</span>
                    </Link>

                    <Link href="/account/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#F72585] transition-colors text-[#0D3B66]" onClick={() => setShowUserMenu(false)}>
                      <LayoutDashboard size={16} /><span>Tableau de bord</span>
                    </Link>

                    <Link href="/account/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#F72585] transition-colors text-[#0D3B66]" onClick={() => setShowUserMenu(false)}>
                      <Briefcase size={16} /><span>Publier un brief projet</span>
                    </Link>

                    <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#F72585] transition-colors text-[#0D3B66]" onClick={() => setShowUserMenu(false)}>
                      <Settings size={16} /><span>Paramètres du compte</span>
                    </Link>

                    <Link href="/account/billing" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#F72585] transition-colors text-[#0D3B66]" onClick={() => setShowUserMenu(false)}>
                      <CreditCard size={16} /><span>Facturation et paiement</span>
                    </Link>

                    <hr className="my-2" />

                    <button 
                      onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: "/" }) }} 
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trait de séparation */}
        <div className="border-b border-gray-200"></div>
      </header>

      {/* Méga-menu scroll */}
      {showMegaMenu && session && (
        <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center justify-center space-x-8">
              {["Rédaction","Traduction","Design","Logo","Social media","Web dev","Photo","Vidéo"].map((service) => (
                <Link 
                  key={service} 
                  href={`/services/${service.toLowerCase().replace(" ", "-")}`} 
                  className="text-[#0D3B66] hover:text-[#F72585] font-medium transition-colors text-sm capitalize"
                >
                  {service}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer */}
      {isScrolled && <div className="h-20"></div>}
      {showMegaMenu && session && <div className="h-12"></div>}
    </>
  )
}
