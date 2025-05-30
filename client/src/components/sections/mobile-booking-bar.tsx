import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Users } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useLanguage } from '@/hooks/use-language';

export function MobileBookingBar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    dateRange: undefined as DateRange | undefined,
    adults: '2',
    children: '0'
  });

  const handleBooking = () => {
    if (!formData.dateRange?.from || !formData.dateRange?.to) {
      alert('Por favor, selecione as datas de check-in e check-out.');
      return;
    }
    
    const checkIn = formData.dateRange?.from?.toISOString().split('T')[0];
    const checkOut = formData.dateRange?.to?.toISOString().split('T')[0];
    const bookingUrl = `https://booking.itaicy.com/?ci=${checkIn}&co=${checkOut}&adults=${formData.adults}&children=${formData.children}`;
    console.log('Redirecting to:', bookingUrl);
    alert('Redirecionando para o sistema de reservas...');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="px-4 py-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="w-full font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-4 px-6 rounded-md transition-colors duration-150">
              <Calendar className="w-4 h-4 mr-2" />
              Verificar Disponibilidade
            </Button>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-playfair text-xl text-center">
                Verificar Disponibilidade
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="font-lato text-sm font-medium text-river-slate-800">
                  Período da Estadia
                </Label>
                <DatePickerWithRange 
                  value={formData.dateRange}
                  onChange={(range: DateRange | undefined) => setFormData(prev => ({ ...prev, dateRange: range }))}
                  className="w-full"
                />
              </div>
              
              {/* Adults */}
              <div className="space-y-2">
                <Label className="font-lato text-sm font-medium text-river-slate-800">
                  Adultos
                </Label>
                <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
                  <SelectTrigger className="w-full h-12">
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Adulto</SelectItem>
                    <SelectItem value="2">2 Adultos</SelectItem>
                    <SelectItem value="3">3 Adultos</SelectItem>
                    <SelectItem value="4">4 Adultos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Children */}
              <div className="space-y-2">
                <Label className="font-lato text-sm font-medium text-river-slate-800">
                  Crianças
                </Label>
                <Select value={formData.children} onValueChange={(value) => setFormData(prev => ({ ...prev, children: value }))}>
                  <SelectTrigger className="w-full h-12">
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 Crianças</SelectItem>
                    <SelectItem value="1">1 Criança</SelectItem>
                    <SelectItem value="2">2 Crianças</SelectItem>
                    <SelectItem value="3">3 Crianças</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleBooking}
                  className="w-full font-lato font-medium text-base uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-4 px-6 rounded-md transition-colors duration-150"
                >
                  Reservar Agora
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}