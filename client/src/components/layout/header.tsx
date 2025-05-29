import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import logoPath from '@assets/itaicy-wordmark-secondary.png';

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
      ? 'bg-[#064737]/90 backdrop-blur-xl shadow-lg' 
      : 'bg-transparent'
  }`;

  const linkClasses = `text-sm font-light tracking-[0.08em] uppercase transition-colors duration-200 ${
    isSticky 
      ? 'text-white hover:text-[#D9CEB3]' 
      : 'text-white hover:text-[#D9CEB3]'
  }`;

  const isCurrentPage = (href: string) => {
    return location === href || (href !== '/' && location.startsWith(href));
  };

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Itaicy Pantanal Eco Lodge">
            <img 
              src={logoPath} 
              alt="Itaicy Pantanal Eco Lodge" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 xl:space-x-12" aria-label="Menu principal">
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
                    isCurrentPage(item.href) ? 'text-[#C8860D] border-b-2 border-[#C8860D]' : ''
                  } pb-1 flex items-center`}
                  aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                >
                  {item.name}
                  {item.megaMenu && <ChevronDown className="inline-block ml-1 h-3 w-3" />}
                </Link>

                {/* Mega Menu */}
                {item.megaMenu && activeDropdown === item.name && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-7xl mt-2 bg-[#faf9f6] shadow-2xl rounded-lg overflow-hidden animate-fade-in">
                    <div className="px-8 py-6">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <h3 className="text-base font-medium text-[#064737] mb-4 uppercase tracking-wide">
                            {item.name}
                          </h3>
                          <ul className="space-y-2">
                            {item.megaMenu.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block text-gray-700 hover:text-[#C8860D] transition-colors duration-150"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-[#064737] mb-4 uppercase tracking-wide">
                            Planeje-se
                          </h3>
                          <ul className="space-y-2">
                            <li><Link href="/como-chegar" className="block text-gray-700 hover:text-[#C8860D] transition-colors">Como Chegar</Link></li>
                            <li><Link href="/melhor-epoca" className="block text-gray-700 hover:text-[#C8860D] transition-colors">Melhor Época</Link></li>
                            <li><Link href="/faq" className="block text-gray-700 hover:text-[#C8860D] transition-colors">FAQ</Link></li>
                          </ul>
                        </div>
                        <div>
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <img 
                              src="https://images.unsplash.com/photo-1551969014-7d2c4786d7a6?q=80&w=240&h=160&auto=format&fit=crop" 
                              alt="Ver onças de perto"
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                            <h4 className="font-semibold text-[#064737] mb-1">Ver onças de perto</h4>
                            <p className="text-sm text-gray-600">Experiência única no Pantanal</p>
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
            {/* Chat button */}
            <button 
              className="text-white hover:text-[#D9CEB3] transition-colors"
              aria-label="Abrir chat de atendimento"
            >
              <MessageCircle className="h-6 w-6" />
            </button>

            {/* Reserve button */}
            <Link href="/reservar">
              <Button 
                variant={isSticky ? "default" : "ghost"}
                size="sm"
                className={`hidden sm:inline-flex font-light tracking-[0.08em] uppercase ${
                  isSticky 
                    ? 'bg-[#C8860D] hover:bg-[#C8860D]/90 text-white' 
                    : 'text-white border-white hover:bg-white hover:text-[#064737]'
                }`}
              >
                RESERVAR
              </Button>
            </Link>

            {/* Language switcher */}
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
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
