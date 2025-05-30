"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { enUS } from "date-fns/locale/en-US" 
import { es } from "date-fns/locale/es"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from "@/hooks/use-language"

const localeMap = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": es
}

interface DatePickerWithRangeProps {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
  placeholder,
  ...props
}: DatePickerWithRangeProps) {
  const { language, t } = useLanguage()
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  
  const locale = localeMap[language] || ptBR
  const defaultPlaceholder = placeholder || t('selectPeriod')

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onChange?.(newDate)
  }

  const formatDate = (date: Date) => {
    const formatString = language === 'en-US' ? 'MMM dd, yyyy' : 'dd/MM/yyyy'
    return format(date, formatString, { locale })
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "bg-cloud-white-0 border border-river-slate-700/30 rounded px-3 py-2 text-sm font-lato min-w-[280px] justify-start text-left font-normal",
              !date && "text-river-slate-800"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from)} – {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span className="text-river-slate-800">{t('booking.selectPeriod')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={locale}
            disabled={(date) => date < new Date()}
            className="border-0"
            classNames={{
              day_selected: "bg-sunset-amber-600 text-cloud-white-0 rounded-md",
              day_range_start: "bg-sunset-amber-600 text-cloud-white-0 rounded-l-md rounded-r-none",
              day_range_end: "bg-sunset-amber-600 text-cloud-white-0 rounded-r-md rounded-l-none", 
              day_range_middle: "bg-sand-beige-400 text-river-slate-800 rounded-none",
              day: "hover:bg-sand-beige-300 transition-colors",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}