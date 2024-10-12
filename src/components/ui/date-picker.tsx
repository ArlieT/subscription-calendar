'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DatePicker({
  date,
  setDate,
  className,
  ...props
}: ButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      setOpen(false);
    },
    []
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={
            (cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            ),
            className)
          }
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
