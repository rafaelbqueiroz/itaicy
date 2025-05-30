import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { Menu, X, MessageCircle, ChevronDown, Fish, TreePine, Bird, Utensils, History, Leaf } from 'lucide-react';
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
                  <div className="fixed left-0 right-0 top-20 w-screen bg-[#faf9f6] shadow-lg z-40 animate-fade-in">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <div className="grid grid-cols-12 gap-10" role="navigation">
                        <div className="col-span-3" aria-label="Experiências">
                          <h3 className="text-[0.875rem] font-medium text-[#064737] mb-4 uppercase tracking-wide" style={{ fontFamily: 'Lato, sans-serif' }}>
                            {item.name}
                          </h3>
                          <ul className="space-y-3">
                            {item.megaMenu.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block text-[1rem] text-[#64748B] hover:text-[#064737] hover:bg-[#D9CEB3] hover:rounded px-2 py-1 transition-all duration-150 font-medium"
                                  style={{ fontFamily: 'Lato, sans-serif' }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-span-3" aria-label="Planeje sua visita">
                          <h3 className="text-[0.875rem] font-medium text-[#064737] mb-4 uppercase tracking-wide" style={{ fontFamily: 'Lato, sans-serif' }}>
                            Planeje-se
                          </h3>
                          <ul className="space-y-3">
                            <li><Link href="/como-chegar" className="block text-[0.9375rem] text-[#64748B] hover:text-[#064737] hover:bg-[#D9CEB3] hover:rounded px-2 py-1 transition-all duration-150 font-normal" style={{ fontFamily: 'Lato, sans-serif' }}>Como Chegar</Link></li>
                            <li><Link href="/melhor-epoca" className="block text-[0.9375rem] text-[#64748B] hover:text-[#064737] hover:bg-[#D9CEB3] hover:rounded px-2 py-1 transition-all duration-150 font-normal" style={{ fontFamily: 'Lato, sans-serif' }}>Melhor Época</Link></li>
                            <li><Link href="/faq" className="block text-[0.9375rem] text-[#64748B] hover:text-[#064737] hover:bg-[#D9CEB3] hover:rounded px-2 py-1 transition-all duration-150 font-normal" style={{ fontFamily: 'Lato, sans-serif' }}>FAQ</Link></li>
                          </ul>
                        </div>
                        <div className="col-span-6">
                          <div className="bg-white rounded-lg p-6 shadow-md h-full relative overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1551969014-7d2c4786d7a6?q=80&w=320&h=210&auto=format&fit=crop" 
                              alt="Safari Fotográfico no Pantanal"
                              className="w-full h-[210px] object-cover rounded-md mb-4"
                            />
                            <span className="inline-block bg-[#C97A2C] text-white text-xs font-medium px-2 py-1 rounded mb-2 uppercase tracking-wide">Destaque</span>
                            <h4 className="text-lg font-bold text-[#064737] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Safari Fotográfico</h4>
                            <p className="text-sm text-[#64748B] mb-4 leading-relaxed">Capture momentos únicos da vida selvagem do Pantanal com guias especializados</p>
                            <Link 
                              href="/experiencias/safari-fotografico" 
                              className="inline-flex items-center text-[#C97A2C] text-sm font-medium hover:underline"
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
            {/* Chat button */}
            <button 
              className={`transition-colors ${
                isSticky 
                  ? 'text-[#064737] hover:text-[#064737]/80' 
                  : 'text-[#FAF9F6] hover:text-[#D9CEB3]'
              }`}
              aria-label="Abrir chat de atendimento"
            >
              <MessageCircle className="h-6 w-6" />
            </button>

            {/* Reserve button */}
            <Link href="/reservar">
              <Button 
                variant={isSticky ? "default" : "ghost"}
                size="sm"
                className={`hidden lg:inline-flex items-center font-semibold tracking-widest uppercase py-2 px-5 rounded-md shadow-md transition-colors duration-150 ${
                  isSticky 
                    ? 'bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 shadow-xl' 
                    : 'bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0'
                }`}
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                RESERVAR
              </Button>
            </Link>

            {/* Language switcher */}
            <LanguageSwitcher isSticky={isSticky} />
            
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
