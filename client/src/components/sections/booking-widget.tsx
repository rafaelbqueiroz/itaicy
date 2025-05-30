import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Calendar, Users, MapPin } from 'lucide-react';

interface BookingWidgetProps {
  variant?: 'section' | 'floating';
}

export function BookingWidget({ variant = 'section' }: BookingWidgetProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: '2',
    children: '0',
    childAges: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.checkIn || !formData.checkOut) {
      alert('Por favor, selecione as datas de check-in e check-out.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const bookingUrl = `https://booking.itaicy.com/?ci=${formData.checkIn}&co=${formData.checkOut}&adults=${formData.adults}&children=${formData.children}&ages=${formData.childAges.join(',')}`;
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
          <form 
            onSubmit={handleSubmit} 
            className="overflow-x-auto lg:overflow-x-visible"
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(8rem, 1fr)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr)) max-content',
              gap: '1rem',
              alignItems: 'end'
            }}
          >
            {/* Check-in */}
            <div className="space-y-1">
              <Label htmlFor="checkin-floating" className="font-lato text-xs text-river-slate-800">
                Check-in
              </Label>
              <Input
                id="checkin-floating"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[8rem]"
              />
            </div>
            
            {/* Check-out */}
            <div className="space-y-1">
              <Label htmlFor="checkout-floating" className="font-lato text-xs text-river-slate-800">
                Check-out
              </Label>
              <Input
                id="checkout-floating"
                type="date"
                value={formData.checkOut}
                min={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[8rem]"
              />
            </div>
            
            {/* Adultos */}
            <div className="space-y-1">
              <Label className="font-lato text-xs text-river-slate-800">Adultos</Label>
              <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
                <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[8rem]">
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
              <Label className="font-lato text-xs text-river-slate-800">Crianças</Label>
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
                <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[8rem]">
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

            {/* Children Ages - renderizados individualmente como colunas do grid */}
            {Array.from({ length: parseInt(formData.children) }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">
                  Idade {i + 1}
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
                  <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[6rem]">
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

            {/* Submit Button - sempre na última coluna */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150 whitespace-nowrap"
              style={{ gridColumn: '-1' }}
            >
              {isLoading ? 'VERIFICANDO...' : 'RESERVAR'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section id="booking-widget" className={sectionClasses}>
      <div className={containerClasses}>
        <div className="bg-cloud-white-0 border border-river-slate-700/30 shadow-sm rounded-lg w-full max-w-[1016px] mx-auto py-6 px-8" aria-label="Formulário de reserva">
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-6">
            {/* Date Range */}
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label htmlFor="checkin" className="font-lato text-xs text-river-slate-800">
                  Check-in
                </Label>
                <Input
                  id="checkin"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout" className="font-lato text-xs text-river-slate-800">
                  Check-out
                </Label>
                <Input
                  id="checkout"
                  type="date"
                  value={formData.checkOut}
                  min={formData.checkIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato"
                />
              </div>
            </div>
            
            {/* Guest Selection */}
            <div className="guest-select flex gap-6">
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">Adultos</Label>
                <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
                  <SelectTrigger className="w-24 bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
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
              
              <div className="space-y-1">
                <Label className="font-lato text-xs text-river-slate-800">Crianças</Label>
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
                  <SelectTrigger className="w-24 bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
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
            </div>

            {/* Children Ages */}
            {parseInt(formData.children) > 0 && (
              <div className="children-ages flex gap-4">
                {Array.from({ length: parseInt(formData.children) }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="font-lato text-xs text-river-slate-800">
                      Idade criança {i + 1}
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
                      <SelectTrigger className="w-20 bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato">
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
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150"
            >
              {isLoading ? 'VERIFICANDO...' : 'RESERVAR'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
