"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { enUS } from "date-fns/locale/en-US" 
import { es } from "date-fns/locale/es"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
          <DayPicker
            mode="range"
            selected={date}
            onSelect={handleSelect}
            locale={locale}
            numberOfMonths={2}
            fromDate={new Date()}
            disabled={{ before: new Date() }}
            modifiers={{
              start: date?.from,
              end: date?.to,
            }}
            modifiersClassNames={{
              start: "rdp-start",
              end: "rdp-end",
            }}
            styles={{
              day_range_middle: {
                backgroundColor: "#D9CEB3", // sand-beige-400
                color: "#64748B", // river-slate-800
              },
              day_selected: {
                backgroundColor: "#C97A2C", // sunset-amber-600
                color: "#FAF9F6", // cloud-white-0
              },
              day_range_start: {
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
              },
              day_range_end: {
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}