import { Link } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import logoPrimary from '@assets/itaicy-wordmark-primary.png';

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('nav.experiencias'), href: '/experiencias' },
    { name: t('nav.acomodacoes'), href: '/acomodacoes' },
    { name: t('nav.galeria'), href: '/galeria' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contato'), href: '/contato' },
  ];

  return (
    <footer className="bg-itaicy-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <img 
              src={logoPrimary} 
              alt="Itaicy Pantanal Eco Lodge" 
              className="h-14 w-auto mb-6"
            />
            <p className="max-w-md leading-relaxed mb-6 text-river-slate-800">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-river-slate-800 rounded-full flex items-center justify-center hover:bg-pantanal-green-700 transition-colors duration-200 text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-river-slate-800 rounded-full flex items-center justify-center hover:bg-pantanal-green-700 transition-colors duration-200 text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-river-slate-800 rounded-full flex items-center justify-center hover:bg-pantanal-green-700 transition-colors duration-200 text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 playfair text-river-slate-800">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="hover:text-pantanal-green-700 transition-colors duration-200 text-river-slate-800"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 playfair text-river-slate-800">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-river-slate-800">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>+55 (65) 3000-0000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>contato@itaicy.com.br</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Estrada do Itaicy, s/n<br />
                  Pantanal, MT - Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-river-slate-800">
            {t('footer.rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/termos" 
              className="hover:text-pantanal-green-700 text-sm transition-colors duration-200 text-river-slate-800"
            >
              {t('footer.terms')}
            </Link>
            <Link 
              href="/privacidade" 
              className="hover:text-pantanal-green-700 text-sm transition-colors duration-200 text-river-slate-800"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
