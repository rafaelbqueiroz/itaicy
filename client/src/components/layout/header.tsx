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
    <header className={`${headerClasses} relative`} style={stickyStyles}>
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
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-t border-pantanal-green-900/10">
                    <div className="max-w-[1440px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-8">
                      {/* Coluna 1: Lodge */}
                      <div>
                        <h3 className="font-playfair text-xl text-pantanal-green-900 mb-4">Lodge</h3>
                        <ul className="space-y-3">
                          <li>
                            <Link 
                              href="/acomodacoes" 
                              className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                              onClick={() => setActiveDropdown(null)}
                            >
                              Acomodações
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/gastronomia" 
                              className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                              onClick={() => setActiveDropdown(null)}
                            >
                              Gastronomia
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Coluna 2: Experiências */}
                      <div>
                        <h3 className="font-playfair text-xl text-pantanal-green-900 mb-6">Experiências</h3>
                        <ul className="space-y-3">
                          <li>
                            <Link 
                              href="/experiencias/pesca" 
                              className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                              onClick={() => setActiveDropdown(null)}
                            >
                              Pesca Esportiva
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/experiencias/safari" 
                              className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                              onClick={() => setActiveDropdown(null)}
                            >
                              Safáris & Birdwatching
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/experiencias/pacotes" 
                              className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                              onClick={() => setActiveDropdown(null)}
                            >
                              Pacotes & Tarifas
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Coluna 3: Planejamento + Card */}
                      <div className="flex flex-col gap-8">
                        <div>
                          <h3 className="font-playfair text-xl text-pantanal-green-900 mb-6">Planejamento</h3>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-pantanal-green-900" />
                              <Link 
                                href="/como-chegar" 
                                className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Como chegar
                              </Link>
                            </li>
                            <li className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-pantanal-green-900" />
                              <Link 
                                href="/melhor-epoca" 
                                className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                Melhor época
                              </Link>
                            </li>
                            <li className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-pantanal-green-900" />
                              <Link 
                                href="/faq" 
                                className="text-river-slate-800 hover:text-pantanal-green-700 transition-colors" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                FAQ
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Card Destaque */}
                        <Link
                          href="/experiencias/safari"
                          className="relative overflow-hidden rounded-md shadow-md group block"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="h-36 w-full bg-gradient-to-br from-pantanal-green-900 to-pantanal-green-800 p-4 flex flex-col justify-end">
                            <h4 className="text-white text-lg font-semibold mb-2">
                              Ver onças de perto
                            </h4>
                            <span className="inline-flex items-center text-white/90 text-sm font-medium group-hover:underline">
                              Saiba mais →
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
                variant="outline"
                className={`${
                  isSticky 
                    ? 'border-pantanal-green-900 text-pantanal-green-900 hover:bg-pantanal-green-900 hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-pantanal-green-900'
                } font-light tracking-[0.08em] uppercase transition-all duration-200`}
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-pantanal-green-900 shadow-lg rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-white hover:bg-pantanal-green-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              <div className="px-3 py-2">
                <Link href="/booking">
                  <Button
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