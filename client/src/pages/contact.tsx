import React from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Hero } from '@/components/sections/hero'
import { ContactForm } from '@/components/sections/contact-form'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from 'lucide-react'

const translations = {
  'pt-BR': {
    title: 'Contato',
    description: 'Estamos aqui para ajudar',
    address: {
      title: 'Endereço',
      text: 'Estrada do Pantanal, KM 42 Miranda - MS, Brasil'
    },
    phone: {
      title: 'Telefone',
      text: '+55 (67) 99999-9999'
    },
    email: {
      title: 'E-mail',
      text: 'contato@itaicy.com.br'
    }
  },
  'en-US': {
    title: 'Contact',
    description: 'We are here to help',
    address: {
      title: 'Address',
      text: 'Pantanal Road, KM 42 Miranda - MS, Brazil'
    },
    phone: {
      title: 'Phone',
      text: '+55 (67) 99999-9999'
    },
    email: {
      title: 'Email',
      text: 'contact@itaicy.com.br'
    }
  },
  'es-ES': {
    title: 'Contacto',
    description: 'Estamos aquí para ayudar',
    address: {
      title: 'Dirección',
      text: 'Carretera del Pantanal, KM 42 Miranda - MS, Brasil'
    },
    phone: {
      title: 'Teléfono',
      text: '+55 (67) 99999-9999'
    },
    email: {
      title: 'Correo',
      text: 'contacto@itaicy.com.br'
    }
  }
}

export default function ContactPage() {
  const { language } = useLanguage()
  const content = translations[language] || translations['pt-BR']

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: content.address.title,
      text: content.address.text,
      link: 'https://maps.google.com/?q=Itaicy+Eco+Lodge'
    },
    {
      icon: PhoneIcon,
      title: content.phone.title,
      text: content.phone.text,
      link: 'tel:+556799999999'
    },
    {
      icon: EnvelopeIcon,
      title: content.email.title,
      text: content.email.text,
      link: 'mailto:contato@itaicy.com.br'
    }
  ]

  return (
    <div className="bg-cloud-white-0">
      <Hero
        title={content.title}
        description={content.description}
        image="/images/hero/contact.jpg"
        overlayColor="bg-pantanal-green-900/40"
      />
      
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-6 rounded-lg bg-sand-beige-50 hover:bg-sand-beige-100 transition-colors"
              >
                <item.icon className="w-6 h-6 text-sunset-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-playfair text-lg font-semibold text-pantanal-green-900">
                    {item.title}
                  </h3>
                  <p className="text-river-slate-600 mt-1">
                    {item.text}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <ContactForm className="bg-cloud-white-0 rounded-lg shadow-lg p-8" />
        </div>
      </section>
    </div>
  )
}
