import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
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
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#D9CEB3]/20 focus-visible:outline-2 focus-visible:outline-[#064737] transition-colors duration-150"
        aria-label="Seleção de idioma"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-5 h-5" />
        <div className="flex items-center gap-1">
          <span 
            className="w-4 h-4 rounded-full border border-[#D9CEB3]/40 flex items-center justify-center text-xs"
            aria-hidden="true"
          >
            {currentLang.flag}
          </span>
          <span 
            className="text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            {currentLang.code}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <ul 
          role="listbox"
          className="absolute right-0 mt-2 w-44 bg-[#FAF9F6] rounded-lg shadow-xl py-1 z-50 border border-[#D9CEB3]/20 animate-fade-in"
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
              className="flex items-center gap-3 px-3 h-8 cursor-pointer hover:bg-[#D9CEB3]/20 focus:bg-[#D9CEB3]/20 focus:outline-none transition-colors duration-150"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <span 
                className="w-4 h-4 rounded-full border border-[#D9CEB3]/40 flex items-center justify-center text-xs"
                aria-hidden="true"
              >
                {lang.flag}
              </span>
              <span className="text-sm text-[#064737]">{lang.name}</span>
              {lang.code === currentLang.code && (
                <span className="ml-auto text-[#C97A2C] text-xs">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}