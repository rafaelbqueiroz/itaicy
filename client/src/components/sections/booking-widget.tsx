import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { BOOKING_EXPERIENCES, GUEST_OPTIONS } from '@/lib/constants';
import { Calendar, Users, MapPin } from 'lucide-react';

export function BookingWidget() {
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

  return (
    <section id="booking-widget" className="bg-itaicy-primary py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <h3 className="playfair text-2xl font-semibold text-center mb-8 text-itaicy-charcoal">
              {t('booking.title')}
            </h3>
            
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
                className="w-full bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white py-4 text-lg font-semibold transition-colors duration-200"
              >
                {isLoading ? 'Pesquisando...' : t('booking.search')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
