import React from 'react'
import { Hero } from '@/components/sections/hero'
import { FeatureBlocks } from '@/components/sections/feature-blocks'
import { Testimonials } from '@/components/sections/testimonials'
import { useLanguage } from '@/hooks/use-language'

const content = {
  'pt-BR': {
    hero: {
      title: 'Bem-vindo ao Itaicy Eco Lodge',
      description: 'Uma experiência única no coração do Pantanal',
      image: '/images/hero/home.jpg'
    },
    features: {
      title: 'Experiências Únicas',
      description: 'Descubra o que torna o Itaicy Eco Lodge especial',
      items: [
        {
          title: 'Localização Privilegiada',
          description: 'Situado em uma das regiões mais preservadas do Pantanal',
          image: '/images/features/location.jpg'
        },
        {
          title: 'Experiências Autênticas',
          description: 'Safari fotográfico, passeios de barco e observação de aves',
          image: '/images/features/experiences.jpg'
        },
        {
          title: 'Gastronomia Regional',
          description: 'Sabores autênticos da culinária pantaneira',
          image: '/images/features/cuisine.jpg'
        }
      ]
    }
  },
  'en-US': {
    hero: {
      title: 'Welcome to Itaicy Eco Lodge',
      description: 'A unique experience in the heart of the Pantanal',
      image: '/images/hero/home.jpg'
    },
    features: {
      title: 'Unique Experiences',
      description: 'Discover what makes Itaicy Eco Lodge special',
      items: [
        {
          title: 'Prime Location',
          description: 'Located in one of the most preserved regions of the Pantanal',
          image: '/images/features/location.jpg'
        },
        {
          title: 'Authentic Experiences',
          description: 'Photo safari, boat trips and birdwatching',
          image: '/images/features/experiences.jpg'
        },
        {
          title: 'Regional Gastronomy',
          description: 'Authentic flavors of Pantanal cuisine',
          image: '/images/features/cuisine.jpg'
        }
      ]
    }
  },
  'es-ES': {
    hero: {
      title: 'Bienvenido a Itaicy Eco Lodge',
      description: 'Una experiencia única en el corazón del Pantanal',
      image: '/images/hero/home.jpg'
    },
    features: {
      title: 'Experiencias Únicas',
      description: 'Descubre lo que hace especial a Itaicy Eco Lodge',
      items: [
        {
          title: 'Ubicación Privilegiada',
          description: 'Ubicado en una de las regiones más preservadas del Pantanal',
          image: '/images/features/location.jpg'
        },
        {
          title: 'Experiencias Auténticas',
          description: 'Safari fotográfico, paseos en barco y observación de aves',
          image: '/images/features/experiences.jpg'
        },
        {
          title: 'Gastronomía Regional',
          description: 'Sabores auténticos de la cocina del Pantanal',
          image: '/images/features/cuisine.jpg'
        }
      ]
    }
  }
}

export default function HomePage() {
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

      <Testimonials className="py-24 bg-sand-beige-50" />
    </div>
  )
}
