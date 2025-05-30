import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { Menu, X, ChevronDown, Fish, TreePine, Bird, Utensils, History, Leaf } from 'lucide-react';
import logoSecondary from '@assets/itaicy-wordmark-secondary.png';
import logoPrimary from '@assets/itaicy-wordmark-primary.png';

export function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  // Sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 64);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'LODGE', 
      href: '/lodge',
      megaMenu: [
        { name: 'Estrutura & Conforto', href: '/lodge#estrutura' },
        { name: 'História & Sustentabilidade', href: '/lodge#historia-sustentabilidade' },
      ]
    },
    { 
      name: 'EXPERIÊNCIAS', 
      href: '/experiencias',
      megaMenu: [
        { name: 'Pesca Esportiva', href: '/experiencias/pesca-esportiva' },
        { name: 'Ecoturismo & Birdwatching', href: '/experiencias/ecoturismo-birdwatching' },
        { name: 'Pacotes & Tarifas', href: '/experiencias/pacotes-tarifas' },
      ]
    },
    { name: 'GALERIA', href: '/galeria' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTATO', href: '/contato' },
  ];

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isSticky 
      ? 'bg-[#D9CEB3]' 
      : 'bg-transparent backdrop-blur-[90%]'
  }`;
  
  const stickyStyles = isSticky ? { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } : {};

  const linkClasses = `text-sm font-medium tracking-[0.05em] uppercase transition-colors duration-200 px-6 ${
    isSticky 
      ? 'text-[#064737] hover:text-[#064737] hover:underline' 
      : 'text-[#FAF9F6] hover:text-[#D9CEB3] hover:underline'
  }`;

  const isCurrentPage = (href: string) => {
    return location === href || (href !== '/' && location.startsWith(href));
  };

  return (
    <header className={headerClasses} style={stickyStyles}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mt-2 mr-10" aria-label="Itaicy Pantanal Eco Lodge">
            <img 
              src={isSticky ? logoPrimary : logoSecondary} 
              alt="Itaicy Pantanal Eco Lodge" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Menu principal">
            {navigation.map((item) => (
              <div 
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.megaMenu && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`${linkClasses} ${
                    isCurrentPage(item.href) ? 'text-[#C97A2C] border-b-2 border-[#C97A2C]' : ''
                  } pb-1 flex items-center`}
                  aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                >
                  {item.name}
                  {item.megaMenu && <ChevronDown className="inline-block ml-1 h-2 w-2 align-middle" />}
                </Link>

                {/* Mega Menu */}
                {item.megaMenu && activeDropdown === item.name && (
                  <div className="fixed left-0 right-0 top-20 w-screen bg-cloud-white-0 shadow-lg z-40 animate-fade-in transition-opacity duration-300">
                    <div className="max-w-[1440px] mx-auto px-8 py-6">
                      <div className="grid grid-cols-3 gap-8 max-h-[300px]" role="navigation">
                        {/* Coluna 1: Lodge */}
                        <div className="py-6" aria-label="Lodge">
                          <h3 className="font-playfair font-bold text-[1.75rem] text-pantanal-green-900 mb-4">
                            LODGE
                          </h3>
                          <ul className="space-y-2">
                            <li>
                              <Link 
                                href="/acomodacoes" 
                                className="block text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal" 
                                style={{ fontFamily: 'Lato, sans-serif' }} 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Acomodações
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/gastronomia" 
                                className="block text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal" 
                                style={{ fontFamily: 'Lato, sans-serif' }} 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Gastronomia
                              </Link>
                            </li>
                          </ul>
                        </div>
                        {/* Coluna 2: Experiências */}
                        <div className="py-6" aria-label="Experiências">
                          <h3 className="font-playfair font-bold text-[1.75rem] text-pantanal-green-900 mb-4">
                            EXPERIÊNCIAS
                          </h3>
                          <ul className="space-y-2">
                            {item.megaMenu && item.megaMenu.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal"
                                  style={{ fontFamily: 'Lato, sans-serif' }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Coluna 3: Planejamento + Card Destaque */}
                        <div className="py-6 relative" aria-label="Planejamento">
                          <h3 className="font-playfair font-bold text-[1.75rem] text-pantanal-green-900 mb-4">
                            PLANEJAMENTO
                          </h3>
                          <ul className="space-y-2 mb-6">
                            <li>
                              <Link
                                href="/como-chegar"
                                className="flex items-baseline text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal focus:outline-2 focus:outline-pantanal-green-700"
                                style={{ fontFamily: 'Lato, sans-serif' }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                <svg className="w-4 h-4 mr-2 text-pantanal-green-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Como Chegar
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/melhor-epoca"
                                className="block text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal focus:outline-2 focus:outline-pantanal-green-700"
                                style={{ fontFamily: 'Lato, sans-serif' }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                Melhor Época
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/faq"
                                className="flex items-baseline text-[0.9375rem] text-river-slate-800 hover:text-pantanal-green-900 hover:underline hover:decoration-sunset-amber-600 hover:decoration-2 transition-all duration-200 font-normal focus:outline-2 focus:outline-pantanal-green-700"
                                style={{ fontFamily: 'Lato, sans-serif' }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                <svg className="w-4 h-4 mr-2 text-pantanal-green-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                FAQ
                              </Link>
                            </li>
                          </ul>

                          {/* Card Destaque Flutuante */}
                          <div className="bg-cloud-white-0/90 rounded-lg p-4 shadow-sm border border-sand-beige-400/20">
                            <h4 className="font-playfair font-semibold text-lg text-pantanal-green-900 mb-2">
                              Ver onças de perto
                            </h4>
                            <p className="text-[0.875rem] text-river-slate-800 mb-3 font-lato">
                              Experiência única no Pantanal
                            </p>
                            <Link
                              href="/experiencias/safari"
                              className="inline-block bg-sunset-amber-600 hover:bg-sunset-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-[0.875rem] font-lato"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Saiba mais →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            {/* WhatsApp button */}
            <a 
              href="https://wa.me/5565999999999"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                isSticky 
                  ? 'text-[#064737] hover:text-[#064737]/80' 
                  : 'text-[#FAF9F6] hover:text-[#D9CEB3]'
              }`}
              aria-label="Falar no WhatsApp"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.097"/>
              </svg>
            </a>

            {/* Language switcher */}
            <LanguageSwitcher isSticky={isSticky} />

            {/* Reserve button */}
            <Link href="/reservar">
              <Button 
                className={`hidden lg:inline-flex items-center font-lato font-medium text-sm uppercase tracking-wide py-3 px-6 rounded-md transition-colors duration-150 ${
                  isSticky 
                    ? 'bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0' 
                    : 'bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0'
                }`}
              >
                RESERVAR
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                isSticky 
                  ? 'text-pantanal-green-900 hover:bg-pantanal-green-900/10' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="space-y-1">
                  <span className="block w-5 h-0.5 bg-current"></span>
                  <span className="block w-5 h-0.5 bg-current"></span>
                  <span className="block w-5 h-0.5 bg-current"></span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#064737]/95 backdrop-blur-md border-t border-white/10">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-white hover:bg-white/10 rounded-md font-light tracking-[0.08em] uppercase"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.megaMenu && (
                    <div className="pl-6 space-y-1">
                      {item.megaMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-gray-300 hover:text-white text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-4 py-2">
                <Link href="/reservar">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full border-white text-white hover:bg-white hover:text-[#064737] font-light tracking-[0.08em] uppercase"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    RESERVAR
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
