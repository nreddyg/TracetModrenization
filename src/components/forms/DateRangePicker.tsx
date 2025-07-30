
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, HelpCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  label?: string;
  tooltip?: string;
  placeholder?: string;
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  tooltip,
  placeholder = "Pick a date range",
  value,
  onChange,
  disabled = false,
  className = "",
  required = false,
  error,
  minDate,
  maxDate,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-8 text-sm",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DateRangePicker;
