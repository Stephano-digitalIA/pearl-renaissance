import { useLocale, Locale, Currency } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const currencies: { code: Currency; label: string }[] = [
  { code: 'XPF', label: 'XPF' },
  { code: 'EUR', label: 'EUR €' },
  { code: 'USD', label: 'USD $' },
];

export const LanguageSwitcher = () => {
  const { locale, setLocale, currency, setCurrency } = useLocale();
  const current = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm px-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{current.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background z-50 max-h-80 overflow-y-auto">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={locale === lang.code ? 'bg-accent' : ''}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-sm px-2">
            {currency}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background z-50">
          {currencies.map((cur) => (
            <DropdownMenuItem
              key={cur.code}
              onClick={() => setCurrency(cur.code)}
              className={currency === cur.code ? 'bg-accent' : ''}
            >
              {cur.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
