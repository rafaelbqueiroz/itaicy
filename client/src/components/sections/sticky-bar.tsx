import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Link } from 'wouter';

interface StickyBarProps {
  variant?: 'booking' | 'availability';
  ctaLabel?: string;
  ctaHref?: string;
}

export function StickyBar({ 
  variant = 'booking', 
  ctaLabel = 'Ver Disponibilidade',
  ctaHref = '/booking'
}: StickyBarProps) {
  const [formData, setFormData] = useState({
    dateRange: undefined as DateRange | undefined,
    adults: '2',
    children: '0'
  });

  if (variant === 'availability') {
    return (
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-river-slate-700/20 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center">
            <Link href={ctaHref}>
              <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-8 rounded-md transition-colors duration-150">
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-river-slate-700/20 shadow-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-end gap-3 sm:gap-4 justify-center">
          {/* Date Range */}
          <div className="min-w-[220px] space-y-1">
            <Label className="font-lato text-xs text-river-slate-800">Período</Label>
            <DatePickerWithRange 
              value={formData.dateRange}
              onChange={(range: DateRange | undefined) => setFormData(prev => ({ ...prev, dateRange: range }))}
              className="w-full"
            />
          </div>
          
          {/* Adults */}
          <div className="min-w-[120px] space-y-1">
            <Label className="font-lato text-xs text-river-slate-800">Adultos</Label>
            <Select value={formData.adults} onValueChange={(value) => setFormData(prev => ({ ...prev, adults: value }))}>
              <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato w-full">
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
          <div className="min-w-[120px] space-y-1">
            <Label className="font-lato text-xs text-river-slate-800">Crianças</Label>
            <Select value={formData.children} onValueChange={(value) => setFormData(prev => ({ ...prev, children: value }))}>
              <SelectTrigger className="bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato w-full">
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

          {/* CTA Button */}
          <Link href={ctaHref}>
            <Button className="font-lato font-medium text-sm uppercase tracking-wide bg-sunset-amber-600 hover:bg-sunset-amber-700 text-cloud-white-0 py-3 px-6 rounded-md transition-colors duration-150 whitespace-nowrap">
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}