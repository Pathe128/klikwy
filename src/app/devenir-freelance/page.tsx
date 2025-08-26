import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Star, Users, TrendingUp, ArrowRight, Zap, Shield, Clock } from "lucide-react"

export default function DevenirFreelancePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transformez vos <span className="text-pink-200">talents</span> en revenus
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
            Rejoignez des milliers de freelances qui font confiance à Klikwy pour développer leur activité et trouver des clients de qualité
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-colors flex items-center gap-2"
            >
              Commencer gratuitement <ArrowRight size={20} />
            </Link>
            <Link
              href="#avantages"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Découvrir les avantages
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques freelances */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Pourquoi choisir Klikwy ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Users className="text-blue-900 mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">500+</h3>
              <p className="text-gray-600">Freelances actifs</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <TrendingUp className="text-pink-500 mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">85%</h3>
              <p className="text-gray-600">Taux de satisfaction</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Clock className="text-green-500 mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">24h</h3>
              <p className="text-gray-600">Délai moyen de réponse</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Star className="text-yellow-500 mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">4.8/5</h3>
              <p className="text-gray-600">Note moyenne clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section id="avantages" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            Les avantages d'être freelance sur Klikwy
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Une plateforme pensée pour maximiser vos revenus et simplifier votre quotidien de freelance
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-pink-500" size={48} />,
                title: "Commissions réduites",
                description: "Seulement 10-15% de commission sur vos ventes, parmi les plus bas du marché"
              },
              {
                icon: <Shield className="text-blue-900" size={48} />,
                title: "Paiements sécurisés",
                description: "Vos paiements sont protégés et versés automatiquement après livraison"
              },
              {
                icon: <Users className="text-green-500" size={48} />,
                title: "Clients de qualité",
                description: "Accédez à une base de clients vérifiés et sérieux"
              },
              {
                icon: <TrendingUp className="text-purple-500" size={48} />,
                title: "Outils de croissance",
                description: "Statistiques détaillées pour optimiser vos performances"
              },
              {
                icon: <Clock className="text-orange-500" size={48} />,
                title: "Support réactif",
                description: "Une équipe dédiée pour vous accompagner 7j/7"
              },
              {
                icon: <Star className="text-yellow-500" size={48} />,
                title: "Visibilité accrue",
                description: "Système de recommandation intelligent pour plus de visibilité"
              }
            ].map((avantage, index) => (
              <div key={index} className="gradient-card p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">{avantage.icon}</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">{avantage.title}</h3>
                <p className="text-gray-600">{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services populaires pour freelances */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            Services les plus demandés
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Découvrez les services qui génèrent le plus de revenus sur notre plateforme
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Design graphique", icon: "🎨", revenue: "500-2000€/mois", demand: "Très forte" },
              { title: "Développement web", icon: "💻", revenue: "800-3000€/mois", demand: "Forte" },
              { title: "Rédaction", icon: "✍️", revenue: "300-1500€/mois", demand: "Très forte" },
              { title: "Marketing digital", icon: "📈", revenue: "600-2500€/mois", demand: "Forte" },
              { title: "Traduction", icon: "🌍", revenue: "400-1800€/mois", demand: "Moyenne" },
              { title: "Retouche photo", icon: "📸", revenue: "200-1000€/mois", demand: "Forte" },
              { title: "Montage vidéo", icon: "🎬", revenue: "700-2800€/mois", demand: "Croissante" },
              { title: "Logo & Branding", icon: "🏷️", revenue: "400-2000€/mois", demand: "Forte" }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{service.title}</h3>
                <p className="text-pink-500 font-semibold mb-1">{service.revenue}</p>
                <p className="text-sm text-gray-600">Demande: {service.demand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment commencer */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            Comment commencer ?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Lancez votre activité de freelance en quelques minutes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Créez votre compte",
                description: "Inscription gratuite en 2 minutes"
              },
              {
                step: "2", 
                title: "Complétez votre profil",
                description: "Ajoutez vos compétences et portfolio"
              },
              {
                step: "3",
                title: "Publiez vos services",
                description: "Créez vos offres avec prix et délais"
              },
              {
                step: "4",
                title: "Recevez vos commandes",
                description: "Commencez à gagner de l'argent !"
              }
            ].map((etape, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-900 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {etape.step}
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">{etape.title}</h3>
                <p className="text-gray-600">{etape.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
            Ce que disent nos freelances
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                service: "Designer graphique",
                avatar: "👩‍🎨",
                testimonial: "Grâce à Klikwy, j'ai pu doubler mes revenus en 6 mois. La plateforme est intuitive et les clients sont sérieux.",
                rating: 5
              },
              {
                name: "Thomas L.",
                service: "Développeur web",
                avatar: "👨‍💻",
                testimonial: "Excellente plateforme ! Les commissions sont justes et le support client est très réactif. Je recommande !",
                rating: 5
              },
              {
                name: "Marie K.",
                service: "Rédactrice",
                avatar: "✍️",
                testimonial: "Interface claire, paiements rapides, clients de qualité. Tout ce qu'il faut pour bien démarrer en freelance.",
                rating: 5
              }
            ].map((temoignage, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{temoignage.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-blue-900">{temoignage.name}</h4>
                    <p className="text-gray-600 text-sm">{temoignage.service}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(temoignage.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{temoignage.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à lancer votre carrière de freelance ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez Klikwy aujourd'hui et commencez à monétiser vos talents dès maintenant
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-colors flex items-center gap-2"
            >
              Créer mon compte freelance <ArrowRight size={20} />
            </Link>
            <Link
              href="/auth/login"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              J'ai déjà un compte
            </Link>
          </div>
          
          <p className="text-blue-100 text-sm mt-6">
            ✓ Inscription gratuite • ✓ Aucun frais cachés • ✓ Support 7j/7
          </p>
        </div>
      </section>
    </div>
  )
}
