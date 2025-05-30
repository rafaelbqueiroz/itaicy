import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { BOOKING_EXPERIENCES, GUEST_OPTIONS } from '@/lib/constants';
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
    guests: '',
    experience: '',
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
      const bookingUrl = `https://booking.itaicy.com/?ci=${formData.checkIn}&co=${formData.checkOut}&guests=${encodeURIComponent(formData.guests)}&exp=${encodeURIComponent(formData.experience)}`;
      console.log('Redirecting to:', bookingUrl);
      alert('Redirecionando para o sistema de reservas...');
      setIsLoading(false);
    }, 2000);
  };

  const containerClasses = variant === 'floating' 
    ? '-mt-22 md:-mt-16 relative z-30 max-w-4xl mx-auto px-4'
    : 'max-w-4xl mx-auto px-4';

  const sectionClasses = variant === 'floating'
    ? ''
    : 'bg-itaicy-cream py-24';

  if (variant === 'floating') {
    return (
      <div className={containerClasses}>
        <div className="bg-[#FAF9F6] shadow-xl rounded-lg w-full max-w-[1016px] mx-auto p-6" aria-label="Formulário de reserva">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkin-floating" className="text-sm font-medium text-[#64748B]" style={{ fontFamily: 'Lato, sans-serif' }}>
                Check-in
              </Label>
              <Input
                id="checkin-floating"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                className="border border-[#64748B]/30 rounded-md py-3 px-4 text-sm text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#064737]"
              />
            </div>
            
            {/* Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkout-floating" className="text-sm font-medium text-[#64748B]" style={{ fontFamily: 'Lato, sans-serif' }}>
                Check-out
              </Label>
              <Input
                id="checkout-floating"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                className="border border-[#64748B]/30 rounded-md py-3 px-4 text-sm text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#064737]"
              />
            </div>
            
            {/* Adults */}
            <div className="space-y-2">
              <Label htmlFor="adults-floating" className="text-sm font-medium text-[#64748B]" style={{ fontFamily: 'Lato, sans-serif' }}>
                Adultos
              </Label>
              <select
                id="adults-floating"
                value={formData.guests}
                onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                className="w-full border border-[#64748B]/30 rounded-md py-3 px-4 text-sm text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#064737]"
              >
                {GUEST_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience-floating" className="text-sm font-medium text-[#64748B]" style={{ fontFamily: 'Lato, sans-serif' }}>
                Experiência
              </Label>
              <select
                id="experience-floating"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full border border-[#64748B]/30 rounded-md py-3 px-4 text-sm text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#064737]"
              >
                {BOOKING_EXPERIENCES.map(exp => (
                  <option key={exp.value} value={exp.label}>{exp.label}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#C97A2C] hover:bg-[#C97A2C]/90 text-[#FAF9F6] font-semibold uppercase py-3 px-6 rounded-md shadow-md transition-colors duration-150"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {isLoading ? 'Verificando...' : 'Ver disponibilidade'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section id="booking-widget" className={sectionClasses}>
      <div className={containerClasses}>
        <Card className="shadow-2xl max-w-[840px] mx-auto">
          <div className="bg-[#D4B896] p-6 text-center">
            <h3 className="playfair text-2xl font-semibold text-[#064737]">
              Reserve Sua Experiência
            </h3>
          </div>
          <CardContent className="p-8">
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Check-in */}
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-sm font-medium text-gray-700">
                    {t('booking.checkIn')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="checkin"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Check-out */}
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-sm font-medium text-gray-700">
                    {t('booking.checkOut')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="checkout"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Guests */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t('booking.guests')}
                  </Label>
                  <Select value={formData.guests} onValueChange={(value) => setFormData(prev => ({ ...prev, guests: value }))}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-itaicy-primary focus:border-transparent">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {GUEST_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Experience */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t('booking.experience')}
                  </Label>
                  <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-itaicy-primary focus:border-transparent">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_EXPERIENCES.map((experience) => (
                        <SelectItem key={experience.value} value={experience.value}>
                          {experience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C8860D] hover:bg-[#C8860D]/90 text-white py-4 text-lg font-semibold transition-colors duration-200"
              >
                {isLoading ? 'Pesquisando Disponibilidade...' : 'Pesquisar Disponibilidade'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
