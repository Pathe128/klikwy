import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + description + social */}
        <div>
          <div className="relative w-36 h-10">
            <Image
              src="/klikwylog.png"
              alt="Klikwy"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-4 text-sm text-gray-600 max-w-xs">
            Klikwy est la marketplace qui connecte les jeunes freelances
            talentueux avec les clients à la recherche de services digitaux de qualité.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-[#9333EA]">
              <Facebook size={20} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-[#9333EA]">
              <Twitter size={20} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-[#9333EA]">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-gray-800">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services/design" className="hover:text-[#9333EA]">Design graphique</Link></li>
            <li><Link href="/services/web-dev" className="hover:text-[#9333EA]">Développement web</Link></li>
            <li><Link href="/services/redaction" className="hover:text-[#9333EA]">Rédaction</Link></li>
            <li><Link href="/services/traduction" className="hover:text-[#9333EA]">Traduction</Link></li>
            <li><Link href="/services/photo" className="hover:text-[#9333EA]">Retouche photo</Link></li>
            <li><Link href="/services/video" className="hover:text-[#9333EA]">Montage vidéo</Link></li>
            <li><Link href="/services/marketing" className="hover:text-[#9333EA]">Marketing digital</Link></li>
          </ul>
        </div>

        {/* Liens utiles */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-gray-800">Liens utiles</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/features/devenir-freelance" className="hover:text-[#9333EA]">Devenir freelance</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[#9333EA]">Comment ça marche</Link></li>
            <li><Link href="/help" className="hover:text-[#9333EA]">Centre d’aide</Link></li>
            <li><Link href="/contact" className="hover:text-[#9333EA]">Nous contacter</Link></li>
            <li><Link href="/blog" className="hover:text-[#9333EA]">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-[#9333EA]">Carrières</Link></li>
          </ul>
        </div>
      </div>

      {/* Mentions légales + Copyright */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 flex flex-col md:flex-row md:justify-between md:items-center max-w-7xl mx-auto px-6">
        <div className="space-x-4 mb-2 md:mb-0">
          <Link href="/mentions" className="hover:text-[#9333EA]">Mentions légales</Link>
          <Link href="/privacy" className="hover:text-[#9333EA]">Politique de confidentialité</Link>
          <Link href="/cgu" className="hover:text-[#9333EA]">CGU</Link>
        </div>
        <p>© 2025 Klikwy. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
