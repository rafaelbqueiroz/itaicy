import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TabsProps {
  title?: string;
  subtitle?: string;
  tabs: {
    label: string;
    content: any; // Conteúdo rich text do Lexical
    image?: {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    cta?: {
      label?: string;
      href?: string;
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    };
  }[];
  settings?: {
    orientation?: 'horizontal' | 'vertical';
    tabsPosition?: 'top' | 'bottom' | 'left' | 'right';
    variant?: 'default' | 'cards' | 'underline';
    contentLayout?: 'text-only' | 'image-left' | 'image-right' | 'image-top' | 'image-background';
    backgroundColor?: 'white' | 'light' | 'primary' | 'secondary';
  };
}

const Tabs: React.FC<TabsProps> = ({
  title,
  subtitle,
  tabs = [],
  settings = {},
}) => {
  const {
    orientation = 'horizontal',
    tabsPosition = orientation === 'horizontal' ? 'top' : 'left',
    variant = 'default',
    contentLayout = 'text-only',
    backgroundColor = 'white',
  } = settings || {};

  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Se não houver abas, não renderizar nada
  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Função para lidar com navegação por teclado
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    if (orientation === 'horizontal') {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
      }
    } else {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        newIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(index);
    }

    if (newIndex !== index) {
      setActiveTab(newIndex);
      tabRefs.current[newIndex]?.focus();
    }

    // Home e End keys
    if (event.key === 'Home') {
      event.preventDefault();
      setActiveTab(0);
      tabRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const lastIndex = tabs.length - 1;
      setActiveTab(lastIndex);
      tabRefs.current[lastIndex]?.focus();
    }
  };

  // Classes para o container principal baseado nas configurações
  const containerClasses = cn(
    "w-full py-12",
    backgroundColor === 'white' && "bg-white",
    backgroundColor === 'light' && "bg-gray-50",
    backgroundColor === 'primary' && "bg-primary text-primary-foreground",
    backgroundColor === 'secondary' && "bg-secondary text-secondary-foreground"
  );

  // Classes para o layout das abas e conteúdo
  const layoutClasses = cn(
    "container mx-auto px-4",
    orientation === 'vertical' && "flex flex-col md:flex-row gap-8",
    orientation === 'horizontal' && "flex flex-col"
  );

  // Classes para a lista de abas
  const tabListClasses = cn(
    "flex",
    orientation === 'horizontal' && "flex-row border-b border-gray-200",
    orientation === 'vertical' && "flex-col md:w-1/4 border-r border-gray-200",
    tabsPosition === 'bottom' && "order-1 border-t border-b-0",
    tabsPosition === 'right' && "order-1 md:order-1 border-l border-r-0"
  );

  // Classes para cada aba
  const tabClasses = (index: number) => cn(
    "px-4 py-3 text-sm font-medium cursor-pointer transition-colors",
    variant === 'default' && "hover:bg-gray-100",
    variant === 'cards' && "rounded-t-lg mx-1 hover:bg-gray-100",
    variant === 'underline' && "border-b-2 border-transparent hover:border-gray-300",
    activeTab === index && [
      variant === 'default' && "bg-white border-b-2 border-primary",
      variant === 'cards' && "bg-white border border-gray-200 border-b-0",
      variant === 'underline' && "border-b-2 border-primary"
    ],
    backgroundColor !== 'white' && "text-white hover:text-black"
  );

  // Classes para o conteúdo
  const contentClasses = cn(
    "py-6",
    orientation === 'vertical' && "md:w-3/4",
    contentLayout === 'image-background' && "relative rounded-lg overflow-hidden"
  );

  // Classes para o layout de conteúdo com imagem
  const contentLayoutClasses = cn(
    contentLayout === 'text-only' && "block",
    contentLayout === 'image-left' && "flex flex-col md:flex-row gap-6",
    contentLayout === 'image-right' && "flex flex-col md:flex-row-reverse gap-6",
    contentLayout === 'image-top' && "flex flex-col gap-6"
  );

  return (
    <section className={containerClasses}>
      {/* Título e subtítulo da seção */}
      {(title || subtitle) && (
        <div className="container mx-auto px-4 mb-8 text-center">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      {/* Container das abas */}
      <div className={layoutClasses}>
        {/* Lista de abas */}
        <div 
          className={tabListClasses}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab, index) => (
            <button
              key={`tab-${index}`}
              ref={el => tabRefs.current[index] = el}
              className={tabClasses(index)}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-selected={activeTab === index}
              role="tab"
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Conteúdo da aba ativa */}
        <div className={contentClasses}>
          {tabs.map((tab, index) => (
            <div
              key={`content-${index}`}
              id={`tabpanel-${index}`}
              className={cn(
                "transition-opacity duration-300",
                activeTab === index ? "block opacity-100" : "hidden opacity-0"
              )}
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
              aria-hidden={activeTab !== index}
              tabIndex={0}
            >
              {/* Layout baseado na configuração */}
              <div className={contentLayoutClasses}>
                {/* Imagem (se existir e não for background) */}
                {tab.image && contentLayout !== 'text-only' && contentLayout !== 'image-background' && (
                  <div className={cn(
                    "relative",
                    contentLayout === 'image-left' || contentLayout === 'image-right' 
                      ? "md:w-1/2" 
                      : "w-full h-64"
                  )}>
                    <Image
                      src={tab.image.url}
                      alt={tab.image.alt || ''}
                      width={tab.image.width || 800}
                      height={tab.image.height || 600}
                      className={cn(
                        "rounded-lg",
                        contentLayout === 'image-left' || contentLayout === 'image-right' 
                          ? "w-full h-auto" 
                          : "w-full h-full object-cover"
                      )}
                    />
                  </div>
                )}
                
                {/* Imagem de fundo (se for layout de background) */}
                {tab.image && contentLayout === 'image-background' && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={tab.image.url}
                      alt={tab.image.alt || ''}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                )}
                
                {/* Conteúdo */}
                <div className={cn(
                  contentLayout === 'image-left' || contentLayout === 'image-right' 
                    ? "md:w-1/2" 
                    : "w-full",
                  contentLayout === 'image-background' && "relative z-10 text-white p-8"
                )}>
                  {/* Renderizar o conteúdo rich text com sanitização */}
                  <div className="prose max-w-none">
                    {typeof tab.content === 'string' 
                      ? <div dangerouslySetInnerHTML={{ 
                          __html: DOMPurify.sanitize(tab.content, {
                            ADD_TAGS: ['iframe'],
                            ADD_ATTR: ['target', 'rel']
                          }) 
                        }} /> 
                      : tab.content
                    }
                  </div>
                  
                  {/* CTA com Link do React Router */}
                  {tab.cta?.label && tab.cta.href && (
                    <div className="mt-6">
                      <Button
                        variant={tab.cta.variant || 'primary'}
                        asChild
                      >
                        <Link to={tab.cta.href}>{tab.cta.label}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tabs; 