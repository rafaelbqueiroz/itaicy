import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  isSticky?: boolean;
}

const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher({ isSticky = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLang = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, langCode?: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (langCode) {
        handleSelect(langCode);
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        className={`flex items-center gap-1 p-1 transition-all duration-240 bg-transparent hover:underline focus-visible:outline-2 focus-visible:outline-pantanal-green-700 ${
          isSticky 
            ? 'text-pantanal-green-900 hover:text-sunset-amber-600' 
            : 'text-cloud-white-0 hover:text-sunset-amber-600'
        }`}
        aria-label="Seleção de idioma"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className={`w-4 h-4 ${isSticky ? 'text-pantanal-green-900' : 'text-cloud-white-0'}`} />
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-240 ${
            isSticky ? 'text-pantanal-green-900' : 'text-cloud-white-0'
          } ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <ul 
          role="listbox"
          className="absolute right-0 mt-2 w-36 bg-cloud-white-0 rounded-lg shadow-lg py-2 z-50 border border-pantanal-green-200 animate-fade-in"
          aria-label="Lista de idiomas"
        >
          {LANGUAGES.map((lang) => (
            <li 
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentLang.code}
              onClick={() => handleSelect(lang.code)}
              onKeyDown={(e) => handleKeyDown(e, lang.code)}
              tabIndex={0}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-sand-beige-400/20 focus:bg-sand-beige-400/20 focus:outline-none transition-colors duration-240 ${
                lang.code === currentLang.code ? 'border-l-4 border-pantanal-green-600' : ''
              }`}
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <span className="text-sm" aria-hidden="true">
                {lang.flag}
              </span>
              <span className={`text-[0.875rem] ${
                lang.code === currentLang.code ? 'text-pantanal-green-900 font-medium' : 'text-river-slate-800 font-normal'
              }`}>
                {lang.code.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}