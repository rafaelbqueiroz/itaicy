import { Link } from 'wouter'
import { useLanguage } from '@/hooks/use-language'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const navigation = {
  'pt-BR': {
    sections: [
      {
        title: 'Sobre',
        links: [
          { name: 'O Lodge', href: '/lodge' },
          { name: 'Experiências', href: '/experiencias' },
          { name: 'Contato', href: '/contato' },
        ],
      },
      {
        title: 'Reservas',
        links: [
          { name: 'Disponibilidade', href: '/booking' },
          { name: 'Política de cancelamento', href: '/politica-cancelamento' },
          { name: 'FAQ', href: '/faq' },
        ],
      },
    ],
    contact: {
      title: 'Contato',
      email: 'contato@itaicy.com.br',
      phone: '+55 67 99999-9999',
      address: 'Estrada do Pantanal, KM 42, Miranda - MS',
    },
  },
  'en-US': {
    sections: [
      {
        title: 'About',
        links: [
          { name: 'The Lodge', href: '/lodge' },
          { name: 'Experiences', href: '/experiences' },
          { name: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Bookings',
        links: [
          { name: 'Availability', href: '/booking' },
          { name: 'Cancellation Policy', href: '/cancellation-policy' },
          { name: 'FAQ', href: '/faq' },
        ],
      },
    ],
    contact: {
      title: 'Contact',
      email: 'contact@itaicy.com.br',
      phone: '+55 67 99999-9999',
      address: 'Pantanal Road, KM 42, Miranda - MS',
    },
  },
  'es-ES': {
    sections: [
      {
        title: 'Acerca',
        links: [
          { name: 'El Lodge', href: '/lodge' },
          { name: 'Experiencias', href: '/experiencias' },
          { name: 'Contacto', href: '/contacto' },
        ],
      },
      {
        title: 'Reservas',
        links: [
          { name: 'Disponibilidad', href: '/booking' },
          { name: 'Política de cancelación', href: '/politica-cancelacion' },
          { name: 'FAQ', href: '/faq' },
        ],
      },
    ],
    contact: {
      title: 'Contacto',
      email: 'contacto@itaicy.com.br',
      phone: '+55 67 99999-9999',
      address: 'Carretera del Pantanal, KM 42, Miranda - MS',
    },
  },
}

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: Twitter,
  },
]

export function Footer() {
  const { language } = useLanguage()
  const content = navigation[language] || navigation['pt-BR']
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-river-slate-900 text-cloud-white-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <Link href="/">
              <a className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo-white.svg"
                  alt="Itaicy Eco Lodge"
                />
              </a>
            </Link>
          </div>

          {/* Navigation Sections */}
          {content.sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-playfair text-lg font-medium mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <a className="text-river-slate-300 hover:text-cloud-white-0 text-sm">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-lg font-medium mb-4">
              {content.contact.title}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="text-river-slate-300 hover:text-cloud-white-0"
                >
                  {content.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${content.contact.phone}`}
                  className="text-river-slate-300 hover:text-cloud-white-0"
                >
                  {content.contact.phone}
                </a>
              </li>
              <li className="text-river-slate-300">{content.contact.address}</li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-12 pt-8 border-t border-river-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-river-slate-300 hover:text-cloud-white-0"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-river-slate-400 text-sm">
              &copy; {currentYear} Itaicy Eco Lodge. {language === 'pt-BR' ? 'Todos os direitos reservados.' : language === 'es-ES' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
