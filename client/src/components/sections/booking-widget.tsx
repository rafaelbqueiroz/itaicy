import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useLanguage } from '@/hooks/use-language';
import { Calendar, Users, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface BookingWidgetProps {
  variant?: 'section' | 'floating';
}

export function BookingWidget({ variant = 'section' }: BookingWidgetProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateRange: undefined as DateRange | undefined,
    adults: '2',
    children: '0',
    childAges: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dateRange?.from || !formData.dateRange?.to) {
      alert('Por favor, selecione as datas de check-in e check-out.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const checkIn = formData.dateRange?.from?.toISOString().split('T')[0];
      const checkOut = formData.dateRange?.to?.toISOString().split('T')[0];
      const bookingUrl = `https://booking.itaicy.com/?ci=${checkIn}&co=${checkOut}&adults=${formData.adults}&children=${formData.children}&ages=${formData.childAges.join(',')}`;
      console.log('Redirecting to:', bookingUrl);
      alert('Redirecionando para o sistema de reservas...');
      setIsLoading(false);
    }, 2000);
  };

  const adultOptions = [
    { value: '1', label: '1 Adulto' },
    { value: '2', label: '2 Adultos' },
    { value: '3', label: '3 Adultos' },
    { value: '4', label: '4 Adultos' },
  ];

  const childrenOptions = [
    { value: '0', label: '0 Crianças' },
    { value: '1', label: '1 Criança' },
    { value: '2', label: '2 Crianças' },
    { value: '3', label: '3 Crianças' },
  ];

  const ageOptions = [...Array(10)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1} ano${i > 0 ? 's' : ''}`
  }));

  const containerClasses = variant === 'floating' 
    ? '-mt-22 md:-mt-16 relative z-30 max-w-4xl mx-auto px-4'
    : 'max-w-4xl mx-auto px-4';

  const sectionClasses = variant === 'floating'
    ? ''
    : 'bg-itaicy-cream py-24';

  if (variant === 'floating') {
    return (
      <div className={containerClasses}>
        <div className="bg-cloud-white-0 border border-river-slate-700/30 shadow-sm rounded-lg w-full max-w-[1016px] mx-auto py-6 px-8" aria-label="Formulário de reserva">
          <form onSubmit={handleSubmit} className="flex items-end gap-4 overflow-x-auto max-w-full">
            
            {/* Botão sempre à direita */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="ml-auto order-last font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150 whitespace-nowrap"
            >
              {isLoading ? 'VERIFICANDO...' : t('booking.reserve')}
            </Button>

            {/* Container dos campos com order menor */}
            <div className="flex items-end gap-4 order-1">
              {/* Date Range Picker */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.period')}</Label>
                <DatePickerWithRange 
                  value={formData.dateRange}
                  onChange={(range) => setFormData(prev => ({ ...prev, dateRange: range }))}
                />
              </div>
              
              {/* Adultos */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.adults')}</Label>
                <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
                  <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adultOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Crianças */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.children')}</Label>
                <Select 
                  value={formData.children} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      children: value,
                      childAges: value === '0' ? [] : new Array(parseInt(value)).fill(1)
                    }));
                  }}
                >
                  <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Idades das crianças */}
              {Array.from({ length: parseInt(formData.children) }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Label className="font-lato text-xs text-river-slate-800">
                    {t('booking.age')} {i + 1}
                  </Label>
                  <Select 
                    value={formData.childAges[i]?.toString() || '1'}
                    onValueChange={(value) => {
                      setFormData(prev => {
                        const newAges = [...prev.childAges];
                        newAges[i] = parseInt(value);
                        return { ...prev, childAges: newAges };
                      });
                    }}
                  >
                    <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section id="booking-widget" className={sectionClasses}>
      <div className={containerClasses}>
        <div className="bg-cloud-white-0 border border-river-slate-700/30 shadow-sm rounded-lg w-full max-w-[1016px] mx-auto py-6 px-8" aria-label="Formulário de reserva">
          <form onSubmit={handleSubmit} className="flex items-end gap-4 overflow-x-auto max-w-full">
            
            {/* Botão sempre à direita */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="ml-auto order-last font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150 whitespace-nowrap"
            >
              {isLoading ? 'VERIFICANDO...' : t('booking.reserve')}
            </Button>

            {/* Container dos campos com order menor */}
            <div className="flex items-end gap-4 order-1">
              {/* Date Range Picker */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.period')}</Label>
                <DatePickerWithRange 
                  value={formData.dateRange}
                  onChange={(range) => setFormData(prev => ({ ...prev, dateRange: range }))}
                  className="min-w-[240px]"
                />
              </div>
              
              {/* Adultos */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.adults')}</Label>
                <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
                  <SelectTrigger className="form-select min-w-[120px] bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adultOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Crianças */}
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">{t('booking.children')}</Label>
                <Select 
                  value={formData.children} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      children: value,
                      childAges: value === '0' ? [] : new Array(parseInt(value)).fill(1)
                    }));
                  }}
                >
                  <SelectTrigger className="form-select min-w-[120px] bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Idades das crianças */}
              {Array.from({ length: parseInt(formData.children) }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Label className="font-lato text-xs text-river-slate-800">
                    {t('booking.age')} {i + 1}
                  </Label>
                  <Select 
                    value={formData.childAges[i]?.toString() || '1'}
                    onValueChange={(value) => {
                      setFormData(prev => {
                        const newAges = [...prev.childAges];
                        newAges[i] = parseInt(value);
                        return { ...prev, childAges: newAges };
                      });
                    }}
                  >
                    <SelectTrigger className="form-select w-20 bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
