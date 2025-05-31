import React, { useState } from 'react'
import { useLocation } from 'wouter'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { CalendarDays, Users } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { Vibration } from '@/lib/vibration'

interface MobileBookingBarProps {
  className?: string
}

export function MobileBookingBar({ className }: MobileBookingBarProps) {
  const [, navigate] = useLocation()
  const { t } = useLanguage()
  const [selectedDates, setSelectedDates] = useState<DateRange>()
  const [guestsCount, setGuestsCount] = useState(2)

  const handleBookNow = () => {
    if (!selectedDates?.from || !selectedDates?.to) {
      Vibration.feedback('heavy')
      return
    }

    const searchParams = new URLSearchParams({
      checkIn: selectedDates.from.toISOString(),
      checkOut: selectedDates.to.toISOString(),
      guests: guestsCount.toString()
    })

    navigate(`/booking?${searchParams.toString()}`)
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-cloud-white-0 border-t border-river-slate-200",
        "shadow-lg px-4 py-3 md:hidden z-50",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <DatePickerWithRange
              value={selectedDates}
              onChange={setSelectedDates}
              className="w-full"
              minNights={2}
              maxNights={14}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-river-slate-200 rounded-md">
            <Users className="w-5 h-5 text-sunset-amber-600" />
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="flex-1 border-none bg-transparent focus:outline-none text-river-slate-900"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t('booking.guest') : t('booking.guests')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={handleBookNow}
          className="w-full text-lg py-6"
          disabled={!selectedDates?.from || !selectedDates?.to}
        >
          {t('booking.reserveNow')}
        </Button>
      </div>
    </div>
  )
}
