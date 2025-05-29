import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: t('nav.experiencias'), href: '/experiencias' },
    { name: t('nav.acomodacoes'), href: '/acomodacoes' },
    { name: t('nav.gastronomia'), href: '/gastronomia' },
    { name: t('nav.sustentabilidade'), href: '/sustentabilidade' },
    { name: t('nav.sobreNos'), href: '/sobre-nos' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTgwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSIxMCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJQbGF5ZmFpciUyMERpc3BsYXkiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiMxYTRkM2EiPklUQUlDWTwvdGV4dD4KPHR1eHQgeD0iMTAiIHk9IjM3IiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtd2VpZ2h0PSI0MDAiIGZpbGw9IiNiODk1NmIiPlBBTlRBTkFMIEVDTyBMT0RHRTI8L3RleHQ+Cjwvc3ZnPgo=" 
                alt="Itaicy Pantanal Eco Lodge" 
                className="h-10"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-200 ${
                  location === item.href
                    ? 'text-itaicy-primary'
                    : 'text-itaicy-charcoal hover:text-itaicy-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Language Switch & Reserve Button */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button className="bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white font-semibold">
              {t('nav.reservar')}
            </Button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors duration-200 ${
                          location === item.href
                            ? 'text-itaicy-primary'
                            : 'text-itaicy-charcoal hover:text-itaicy-primary'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="pt-4">
                      <Button className="w-full bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white font-semibold">
                        {t('nav.reservar')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
