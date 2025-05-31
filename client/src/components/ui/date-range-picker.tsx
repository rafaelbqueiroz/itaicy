"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { enUS } from "date-fns/locale/en-US" 
import { es } from "date-fns/locale/es"
import { Calendar as CalendarIcon } from "lucide-react"
import { Vibration } from "../../lib/vibration"
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
} as const;

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

interface DatePickerProps extends BaseProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  isDisabled?: boolean;
  minNights?: number;
  maxNights?: number;
}

export function DatePickerWithRange({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  disabledDates,
  isDisabled,
  minNights,
  maxNights,
  className,
  ...props
}: DatePickerProps) {
  const { language, t } = useLanguage();
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const saved = localStorage.getItem('selectedDateRange');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        from: parsed.from ? new Date(parsed.from) : undefined,
        to: parsed.to ? new Date(parsed.to) : undefined
      };
    }
    return value;
  });
  
  const locale = localeMap[language] || ptBR;
  const defaultPlaceholder = placeholder || t('booking.selectPeriod');

  // Sincroniza com prop value quando muda
  React.useEffect(() => {
    setRange(value);
  }, [value]);

  // Gerencia localStorage
  React.useEffect(() => {
    if (range) {
      localStorage.setItem('selectedDateRange', JSON.stringify({
        from: range.from?.toISOString(),
        to: range.to?.toISOString()
      }));
    } else {
      localStorage.removeItem('selectedDateRange');
    }
  }, [range]);

  // Limpa localStorage na desmontagem
  React.useEffect(() => {
    return () => {
      if (!value) {
        localStorage.removeItem('selectedDateRange');
      }
    };
  }, [value]);

  const [validationError, setValidationError] = React.useState<string | null>(null);

  const validateRange = (range: DateRange | undefined): string | null => {
    if (!range?.from || !range?.to) return null;

    const nights = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    
    if (minNights && nights < minNights) {
      return t('booking.errors.minNights');
    }
    
    if (maxNights && nights > maxNights) {
      return t('booking.errors.maxNights');
    }

    return null;
  };

  const handleSelect = (newRange: DateRange | undefined) => {
    if (isDisabled) return;

    // Limpa validação ao começar nova seleção
    if (!newRange?.from) {
      setValidationError(null);
    }

    // Valida o intervalo completo
    const error = newRange?.to ? validateRange(newRange) : null;
    setValidationError(error);

    if (error) {
      Vibration.feedback('heavy');
      return;
    }

    try {
      if (newRange?.from && !newRange.to) {
        Vibration.feedback('light');
      } else if (newRange?.to) {
        Vibration.feedback('medium');
        setTimeout(() => {
          const trigger = document.querySelector('[aria-expanded="true"]') as HTMLElement;
          if (trigger) trigger.click();
        }, 500);
      }

      setRange(newRange);
      onChange?.(newRange);
    } catch (error) {
      console.error('Error handling date selection:', error);
      setValidationError(t('booking.errors.generic'));
      Vibration.feedback('heavy');
    }
  };

  const formatDate = (date: Date) => {
    const formatString = language === 'en-US' ? 'MMM dd, yyyy' : 'dd/MM/yyyy';
    return format(date, formatString, { locale });
  };

  const getDaysCount = (from: Date, to: Date): string => {
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)).toString();
  };

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            aria-label={
              range?.from
                ? range.to
                  ? `${t('booking.selected')}: ${formatDate(range.from)} - ${formatDate(range.to)}`
                  : `${t('booking.startSelected')}: ${formatDate(range.from)}`
                : t('booking.select')
            }
            disabled={isDisabled}
            variant="outline"
            className={cn(
              "w-full bg-cloud-white-0 border border-river-slate-700/30 rounded px-4 py-3",
              "text-base font-lato min-h-[56px] justify-start text-left font-normal",
              "transition-colors duration-200",
              "hover:bg-river-slate-50 focus:outline-none focus:ring-2 focus:ring-sunset-amber-600/50",
              !range && "text-river-slate-800"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-sunset-amber-600 flex-shrink-0" />
            {range?.from ? (
              range.to ? (
                <>
                  {formatDate(range.from)} – {formatDate(range.to)}
                </>
              ) : (
                formatDate(range.from)
              )
            ) : (
              <span className="text-river-slate-800" aria-hidden="true">{defaultPlaceholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white rounded-lg shadow-lg border border-river-slate-200" 
          align="start"
          side="bottom"
          sideOffset={8}
          role="dialog"
          aria-label={t('booking.calendar')}
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={locale}
            numberOfMonths={typeof window !== 'undefined' && window.innerWidth > 768 ? 2 : 1}
            fromDate={new Date()}
            disabled={[
              { before: minDate || new Date() },
              ...(maxDate ? [{ after: maxDate }] : []),
              ...(disabledDates || []),
            ]}
            footer={
              <div className="p-3 space-y-2">
                <p 
                  role="status" 
                  aria-live="polite"
                  className={cn(
                    "text-sm",
                    validationError ? "text-red-600" : "text-river-slate-600"
                  )}
                >
                  {validationError || (
                    range?.from && !range.to
                      ? t('booking.selectEndDate')
                      : range?.from && range.to
                      ? t('booking.selectedDays') + ` (${getDaysCount(range.from, range.to)})`
                      : t('booking.selectStartDate')
                  )}
                </p>
                {!validationError && disabledDates && disabledDates.length > 0 && (
                  <p className="text-xs text-river-slate-500">
                    {t('booking.unavailableDates')}
                  </p>
                )}
                {(minNights || maxNights) && (
                  <p className="text-xs text-river-slate-500">
                    {t('booking.stayLimits')} ({minNights || 1}-{maxNights || 30})
                  </p>
                )}
              </div>
            }
            modifiersClassNames={{
              selected: "bg-sunset-amber-600 text-cloud-white-0",
              today: "bg-river-slate-100",
              disabled: "opacity-50 cursor-not-allowed",
            }}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-river-slate-500 rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-sunset-amber-100",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_range_start: "day-range-start",
              day_selected: "bg-sunset-amber-600 text-cloud-white-0 hover:bg-sunset-amber-600 hover:text-cloud-white-0 focus:bg-sunset-amber-600 focus:text-cloud-white-0",
              day_today: "bg-river-slate-100",
              day_outside: "text-river-slate-400 opacity-50",
              day_disabled: "text-river-slate-400 opacity-50 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-sunset-amber-100 aria-selected:text-sunset-amber-900",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
