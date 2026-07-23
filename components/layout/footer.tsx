'use client'

import Link from 'next/link'
import { Send } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'

const footerLinks = {
  explorar: [
    { name: 'Todos los proveedores', href: '/search' },
    { name: 'Categorías', href: '/search' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Ciudades', href: '/search' },
  ],
  recursos: [
    { name: 'Blog', href: '#' },
    { name: 'Guías', href: '#' },
    { name: 'Consejos', href: '#' },
    { name: 'Centro de ayuda', href: '#' },
  ],
  empresa: [
    { name: 'Sobre nosotros', href: '#' },
    { name: 'Trabaja con nosotros', href: '#' },
    { name: 'Contacto', href: '#' },
    { name: 'Prensa', href: '#' },
  ],
  legal: [
    { name: 'Términos y condiciones', href: '#' },
    { name: 'Política de privacidad', href: '#' },
    { name: 'Política de cookies', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: FaInstagram, href: '#' },
  { name: 'Facebook', icon: FaFacebook, href: '#' },
  { name: 'TikTok', icon: FaTwitter, href: '#' },
  { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-[#0F2318] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-bold text-xl">NearU</span>
            </div>
            <p className="text-white/70 text-sm max-w-xs">
              La plataforma que conecta los mejores proveedores con los eventos más increíbles.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns - hidden on mobile, show on sm+ */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="hidden sm:block">
              <h4 className="text-white font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="text-white font-semibold mb-4">Suscríbete</h4>
            <p className="text-white/70 text-sm mb-4">
              Recibe tips y novedades para organizar eventos increíbles.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
              <button className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center hover:bg-brand-light transition-colors shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-white/50 text-xs sm:text-sm">
            © 2024 NearU. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
