import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { Menu, X, ChevronDown, MapPin, CalendarDays, HelpCircle } from 'lucide-react';
import logoSecondary from '@assets/itaicy-wordmark-secondary.png';
import logoPrimary from '@assets/itaicy-wordmark-primary.png';

export function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  // Pages that should start with sticky header (no full-width background image)
  const pagesWithStickyStart = ['/experiencias', '/galeria', '/blog', '/contato', '/sobre-nos', '/gastronomia', '/sustentabilidade'];
  const shouldStartSticky = pagesWithStickyStart.some(path => location.startsWith(path));

  // Sticky header behavior
  useEffect(() => {
    if (shouldStartSticky) {
      setIsSticky(true);
    } else {
      const handleScroll = () => {
        setIsSticky(window.scrollY > 64);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location, shouldStartSticky]);

  const navigation = [
    { 
      name: 'LODGE', 
      href: '/lodge',
      megaMenu: true
    },
    { 
      name: 'EXPERIÊNCIAS', 
      href: '/experiencias',
      megaMenu: true
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
    <header className={headerClasses} style={stickyStyles} id="site-header">
      <div className="max-w-7xl mx-auto px-6 relative">
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
                onMouseLeave={() => !item.megaMenu && setActiveDropdown(null)}
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
                  <div 
                    className="fixed top-20 left-0 right-0 w-full shadow-lg z-50 bg-black/80 backdrop-blur-sm border-t border-white/20"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-x-12 gap-y-8 py-12 items-stretch">
                      {/* Coluna 1: Lodge */}
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-playfair text-xl text-white mb-4">Lodge</h3>
                          <ul className="space-y-3 mb-8">
                            <li>
                              <Link 
                                href="/acomodacoes" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Acomodações
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/gastronomia" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Gastronomia
                              </Link>
                            </li>
                          </ul>
                        </div>
                        
                        {/* Card Lodge */}
                        <Link
                          href="/acomodacoes"
                          className="relative overflow-hidden rounded-md shadow-md group block"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="h-32 w-full bg-gradient-to-br from-sunset-amber-600 to-sunset-amber-700 p-4 flex flex-col justify-end">
                            <h4 className="text-white text-lg font-semibold mb-2">
                              Conforto na natureza
                            </h4>
                            <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:underline">
                              Ver quartos →
                            </span>
                          </div>
                        </Link>
                      </div>

                      {/* Coluna 2: Experiências */}
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-playfair text-xl text-white mb-4">Experiências</h3>
                          <ul className="space-y-3 mb-8">
                            <li>
                              <Link 
                                href="/experiencias/pesca" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Pesca Esportiva
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/experiencias/safari" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Safáris & Birdwatching
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/experiencias/pacotes" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Pacotes & Tarifas
                              </Link>
                            </li>
                          </ul>
                        </div>
                        
                        {/* Card Experiências */}
                        <Link
                          href="/experiencias/safari"
                          className="relative overflow-hidden rounded-md shadow-md group block"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="h-32 w-full bg-gradient-to-br from-pantanal-green-900 to-pantanal-green-800 p-4 flex flex-col justify-end">
                            <h4 className="text-white text-lg font-semibold mb-2">
                              Ver onças de perto
                            </h4>
                            <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:underline">
                              Saiba mais →
                            </span>
                          </div>
                        </Link>
                      </div>

                      {/* Coluna 3: Blog */}
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-playfair text-xl text-white mb-4">Blog</h3>
                          <ul className="space-y-3 mb-8">
                            <li>
                              <Link 
                                href="/blog/natureza" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Natureza
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/blog/aventura" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Aventura
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/blog/sustentabilidade" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Sustentabilidade
                              </Link>
                            </li>
                          </ul>
                        </div>
                        
                        {/* Card Blog */}
                        <Link
                          href="/blog"
                          className="relative overflow-hidden rounded-md shadow-md group block"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="h-32 w-full bg-gradient-to-br from-river-slate-700 to-river-slate-800 p-4 flex flex-col justify-end">
                            <h4 className="text-white text-lg font-semibold mb-2">
                              Histórias do Pantanal
                            </h4>
                            <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:underline">
                              Ler posts →
                            </span>
                          </div>
                        </Link>
                      </div>

                      {/* Coluna 4: Planejamento */}
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-playfair text-xl text-white mb-4">Planejamento</h3>
                          <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-white" />
                              <Link 
                                href="/como-chegar" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Como chegar
                              </Link>
                            </li>
                            <li className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-white" />
                              <Link 
                                href="/melhor-epoca" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Melhor época
                              </Link>
                            </li>
                            <li className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-white" />
                              <Link 
                                href="/faq" 
                                className="text-white/80 hover:text-sunset-amber-400 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                FAQ
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Card Planejamento */}
                        <Link
                          href="/como-chegar"
                          className="relative overflow-hidden rounded-md shadow-md group block"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="h-32 w-full bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 flex flex-col justify-end">
                            <h4 className="text-white text-lg font-semibold mb-2">
                              Planeje sua viagem
                            </h4>
                            <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:underline">
                              Ver guia →
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Language Switcher + CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/booking">
              <Button
                className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150 whitespace-nowrap"
              >
                RESERVAR
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${linkClasses} p-2`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-black/95 backdrop-blur-sm shadow-lg rounded-lg mt-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-white hover:text-sunset-amber-400 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.megaMenu && (
                    <div className="ml-4 mt-2 space-y-2 pb-3 border-b border-white/20">
                      {item.name === 'LODGE' && (
                        <>
                          <Link href="/acomodacoes" className="block py-2 text-white/80 hover:text-sunset-amber-400 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                            Acomodações
                          </Link>
                          <Link href="/gastronomia" className="block py-2 text-white/80 hover:text-sunset-amber-400 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                            Gastronomia
                          </Link>
                        </>
                      )}
                      {item.name === 'EXPERIÊNCIAS' && (
                        <>
                          <Link href="/experiencias/pesca" className="block py-2 text-white/80 hover:text-sunset-amber-400 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                            Pesca Esportiva
                          </Link>
                          <Link href="/experiencias/safari" className="block py-2 text-white/80 hover:text-sunset-amber-400 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                            Safáris & Birdwatching
                          </Link>
                          <Link href="/experiencias/pacotes" className="block py-2 text-white/80 hover:text-sunset-amber-400 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                            Pacotes & Tarifas
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-4 py-3 border-t border-white/20">
                <LanguageSwitcher />
              </div>
              <div className="px-4">
                <Link href="/booking">
                  <Button
                    className="w-full font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150"
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