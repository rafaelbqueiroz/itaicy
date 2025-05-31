import React from 'react'
import { Hero } from '@/components/sections/hero'
import { FeatureBlocks } from '@/components/sections/feature-blocks'
import { useLanguage } from '@/hooks/use-language'

const content = {
  'pt-BR': {
    hero: {
      title: 'O Lodge',
      description: 'Conforto e luxo em harmonia com a natureza',
      image: '/images/hero/lodge.jpg'
    },
    features: {
      title: 'Nossa Estrutura',
      description: 'Conheça os detalhes que tornam sua estadia especial',
      items: [
        {
          title: 'Suítes Luxuosas',
          description: 'Acomodações espaçosas com vista panorâmica para o Pantanal',
          image: '/images/features/suites.jpg'
        },
        {
          title: 'Restaurante',
          description: 'Gastronomia requintada com ingredientes locais',
          image: '/images/features/restaurant.jpg'
        },
        {
          title: 'Área de Lazer',
          description: 'Piscina, deck e áreas de convivência integradas à natureza',
          image: '/images/features/leisure.jpg'
        }
      ]
    }
  },
  'en-US': {
    hero: {
      title: 'The Lodge',
      description: 'Comfort and luxury in harmony with nature',
      image: '/images/hero/lodge.jpg'
    },
    features: {
      title: 'Our Structure',
      description: 'Discover the details that make your stay special',
      items: [
        {
          title: 'Luxurious Suites',
          description: 'Spacious accommodations with panoramic views of the Pantanal',
          image: '/images/features/suites.jpg'
        },
        {
          title: 'Restaurant',
          description: 'Refined cuisine with local ingredients',
          image: '/images/features/restaurant.jpg'
        },
        {
          title: 'Leisure Area',
          description: 'Pool, deck and common areas integrated with nature',
          image: '/images/features/leisure.jpg'
        }
      ]
    }
  },
  'es-ES': {
    hero: {
      title: 'El Lodge',
      description: 'Confort y lujo en armonía con la naturaleza',
      image: '/images/hero/lodge.jpg'
    },
    features: {
      title: 'Nuestra Estructura',
      description: 'Descubre los detalles que hacen tu estadía especial',
      items: [
        {
          title: 'Suites Lujosas',
          description: 'Alojamientos espaciosos con vista panorámica al Pantanal',
          image: '/images/features/suites.jpg'
        },
        {
          title: 'Restaurante',
          description: 'Gastronomía refinada con ingredientes locales',
          image: '/images/features/restaurant.jpg'
        },
        {
          title: 'Área de Ocio',
          description: 'Piscina, deck y áreas comunes integradas con la naturaleza',
          image: '/images/features/leisure.jpg'
        }
      ]
    }
  }
}

export default function LodgePage() {
  const { language } = useLanguage()
  const pageContent = content[language] || content['pt-BR']

  return (
    <div>
      <Hero
        title={pageContent.hero.title}
        description={pageContent.hero.description}
        image={pageContent.hero.image}
        overlayColor="bg-pantanal-green-900/40"
      />

      <FeatureBlocks
        title={pageContent.features.title}
        description={pageContent.features.description}
        features={pageContent.features.items}
        className="py-24"
      />
    </div>
  )
}
