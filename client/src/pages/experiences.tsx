import React from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Hero } from '@/components/sections/hero'
import { FeatureBlocks } from '@/components/sections/feature-blocks'
import { Testimonials } from '@/components/sections/testimonials'

const experiences = {
  'pt-BR': {
    title: 'Experiências Únicas',
    description: 'Descubra aventuras inesquecíveis no coração do Pantanal',
    activities: [
      {
        title: 'Safari Fotográfico',
        description: 'Observe a vida selvagem em seu habitat natural',
        image: '/images/experiences/safari.jpg'
      },
      {
        title: 'Pesca Esportiva',
        description: 'As melhores experiências de pesca no Pantanal',
        image: '/images/experiences/fishing.jpg'
      }
    ]
  },
  'en-US': {
    title: 'Unique Experiences',
    description: 'Discover unforgettable adventures in the heart of the Pantanal',
    activities: [
      {
        title: 'Photo Safari',
        description: 'Observe wildlife in their natural habitat',
        image: '/images/experiences/safari.jpg'
      },
      {
        title: 'Sport Fishing',
        description: 'The best fishing experiences in the Pantanal',
        image: '/images/experiences/fishing.jpg'
      }
    ]
  },
  'es-ES': {
    title: 'Experiencias Únicas',
    description: 'Descubre aventuras inolvidables en el corazón del Pantanal',
    activities: [
      {
        title: 'Safari Fotográfico',
        description: 'Observa la vida silvestre en su hábitat natural',
        image: '/images/experiences/safari.jpg'
      },
      {
        title: 'Pesca Deportiva',
        description: 'Las mejores experiencias de pesca en el Pantanal',
        image: '/images/experiences/fishing.jpg'
      }
    ]
  }
}

export default function ExperiencesPage() {
  const { language } = useLanguage()
  const content = experiences[language] || experiences['pt-BR']

  return (
    <div className="bg-cloud-white-0">
      <Hero
        title={content.title}
        description={content.description}
        image="/images/hero/experiences.jpg"
        overlayColor="bg-pantanal-green-900/40"
      />
      
      <FeatureBlocks
        title={content.title}
        description={content.description}
        features={content.activities}
        className="py-24"
      />

      <Testimonials className="py-24 bg-sand-beige-50" />
    </div>
  )
}
