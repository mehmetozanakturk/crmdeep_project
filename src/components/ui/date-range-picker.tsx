'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(dateRange);

  React.useEffect(() => {
    setDate(dateRange);
  }, [dateRange]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onDateRangeChange(range);
  };

  // Quick select options
  const quickSelects = [
    {
      label: 'Son 7 Gün',
      getValue: () => ({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: 'Son 30 Gün',
      getValue: () => ({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: 'Son 90 Gün',
      getValue: () => ({
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      }),
    },
    {
      label: 'Bu Ay',
      getValue: () => {
        const now = new Date();
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        };
      },
    },
    {
      label: 'Geçen Ay',
      getValue: () => {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          from: lastMonth,
          to: lastDayOfMonth,
        };
      },
    },
  ];

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {date.from.toLocaleDateString('tr-TR', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {date.to.toLocaleDateString('tr-TR', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </>
              ) : (
                date.from.toLocaleDateString('tr-TR')
              )
            ) : (
              <span>Tarih seç</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="border-b p-3">
            <div className="grid grid-cols-2 gap-2">
              {quickSelects.map((quick) => (
                <Button
                  key={quick.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(quick.getValue())}
                  className="text-xs"
                >
                  {quick.label}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
