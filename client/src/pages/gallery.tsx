import React, { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Hero } from '@/components/sections/hero'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
  {
    src: '/images/gallery/wildlife-1.jpg',
    alt: 'Onça-pintada no Pantanal',
    category: 'wildlife'
  },
  {
    src: '/images/gallery/lodge-1.jpg',
    alt: 'Vista aérea do Lodge',
    category: 'lodge'
  },
  {
    src: '/images/gallery/experience-1.jpg',
    alt: 'Safari fotográfico',
    category: 'experiences'
  },
  // Adicione mais imagens aqui
]

const translations = {
  'pt-BR': {
    title: 'Galeria',
    description: 'Explore nossos momentos mais especiais',
    categories: {
      all: 'Todas',
      wildlife: 'Vida Selvagem',
      lodge: 'Lodge',
      experiences: 'Experiências'
    }
  },
  'en-US': {
    title: 'Gallery',
    description: 'Explore our most special moments',
    categories: {
      all: 'All',
      wildlife: 'Wildlife',
      lodge: 'Lodge',
      experiences: 'Experiences'
    }
  },
  'es-ES': {
    title: 'Galería',
    description: 'Explora nuestros momentos más especiales',
    categories: {
      all: 'Todas',
      wildlife: 'Vida Silvestre',
      lodge: 'Lodge',
      experiences: 'Experiencias'
    }
  }
}

export default function GalleryPage() {
  const { language } = useLanguage()
  const content = translations[language] || translations['pt-BR']
  const [filter, setFilter] = useState('all')

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter)

  return (
    <div className="bg-cloud-white-0">
      <Hero
        title={content.title}
        description={content.description}
        image="/images/hero/gallery.jpg"
        overlayColor="bg-pantanal-green-900/40"
      />
      
      <section className="container mx-auto px-4 py-16">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {Object.entries(content.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === key
                  ? 'bg-sunset-amber-600 text-cloud-white-0'
                  : 'bg-sand-beige-100 text-river-slate-600 hover:bg-sand-beige-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grade de imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.3 },
                  layout: { duration: 0.3 }
                }}
                className="aspect-square relative overflow-hidden rounded-lg group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
