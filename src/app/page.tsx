import Image from "next/image"
import Link from "next/link"
import { Search, Star, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import ServicesSection from "@/components/ServicesSection"
import RecentProjects from "@/components/RecentProjects"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D3B66] to-[#F72585] text-white py-20  mt-6 ">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Trouvez le <span className="text-pink-200">freelance</span> parfait
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Klikwy connecte les jeunes talents avec les clients qui recherchent des services digitaux de qualité à prix abordable
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-full p-2 max-w-2xl mx-auto mb-8 shadow-2xl">
            <div className="flex items-center">
              <Search className="text-gray-400 ml-4 mr-3" size={24} />
              <input
                type="text"
                placeholder="Rechercher un service (design, développement, rédaction...)"
                className="flex-1 text-gray-800 text-lg py-3 px-2 bg-transparent outline-none focus:ring-2 focus:ring-[#F72585] focus:shadow-lg focus:shadow-[#F72585]/20 rounded-l-full transition-all duration-200"
              />
              <button className="bg-[#F72585] hover:bg-[#0D3B66] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200">
                Rechercher
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/features/devenir-freelance"
              className="bg-[#F72585] hover:bg-white hover:text-[#0D3B66] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 flex items-center gap-2"
            >
              Devenir freelance <ArrowRight size={20} />
            </Link>
            <Link
              href="/services"
              className="bg-white/20 hover:bg-white hover:text-[#0D3B66] text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Parcourir les services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Users className="text-[#0D3B66] mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold text-[#0D3B66] mb-2">500+</h3>
              <p className="text-gray-600">Freelances actifs</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <CheckCircle className="text-[#F72585] mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold text-[#0D3B66] mb-2">1200+</h3>
              <p className="text-gray-600">Projets réalisés</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Star className="text-yellow-500 mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold text-[#0D3B66] mb-2">4.8/5</h3>
              <p className="text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services dynamiques */}
      <ServicesSection />

      {/* Projets récents */}
      <RecentProjects />

      {/* Comment ça marche */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#0D3B66] mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Trois étapes simples pour commencer
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#0D3B66] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-[#0D3B66] mb-4">Trouvez votre service</h3>
              <p className="text-gray-600">
                Parcourez notre catalogue de services ou utilisez notre moteur de recherche pour trouver exactement ce dont vous avez besoin.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#F72585] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-[#0D3B66] mb-4">Passez commande</h3>
              <p className="text-gray-600">
                Sélectionnez votre freelance, décrivez votre projet et effectuez le paiement sécurisé. Simple et rapide !
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#0D3B66] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-[#0D3B66] mb-4">Recevez votre livrable</h3>
              <p className="text-gray-600">
                Communiquez avec votre freelance via notre messagerie et recevez votre projet terminé dans les délais convenus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-[#0D3B66] to-[#F72585] text-white py-20 px-6 mx-6 mb-6 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers d'utilisateurs qui font confiance à Klikwy pour leurs projets digitaux
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-white text-[#0D3B66] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 flex items-center gap-2"
            >
              S'inscrire gratuitement <ArrowRight size={20} />
            </Link>
            <Link
              href="/features/devenir-freelance"
              className="bg-[#F72585] hover:bg-white hover:text-[#0D3B66] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Devenir freelance
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

