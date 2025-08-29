 
import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
 
dayjs.extend(customParseFormat);
 
interface DateRangePickerProps {
  label?: string;
  tooltip?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  rangeplaceholder?: [string, string];
  placeholder?: [string, string] ;
  error?: string;
  allowClear?: boolean;
  format?: string; // <-- format like "DD/MM/YYYY"
  disabled?: boolean,
}
 
const ReusableRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  tooltip,
  value,
  onChange,
  className,
  rangeplaceholder = ["Start Date", "End Date"],
  allowClear = false,
  error,
  format = "DD/MM/YYYY",
  disabled
}) => {
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);
  const [fromInput, setFromInput] = React.useState("");
  const [toInput, setToInput] = React.useState("");
  const [lastValidFromDate, setLastValidFromDate] = React.useState<string>("");
  const [lastValidToDate, setLastValidToDate] = React.useState<string>("");
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
  const inputId = React.useId();
 
  const isValidFormat = (text: string): boolean =>
    dayjs(text, format, true).isValid();
 
  const isValidInput = (text: string): boolean => {
    const validChars = /^[\d\/\-\.]*$/;
    return validChars.test(text) && text.length <= 10;
  };
 
  const formatDate = (date?: Date): string =>
    date ? dayjs(date).format(format) : "";
 
  const parseInput = (text: string): Date | undefined => {
    const parsed = dayjs(text, format, true);
    return parsed.isValid() ? parsed.toDate() : undefined;
  };
 
  React.useEffect(() => {
    setInternalValue(value);
    const fromFormatted = formatDate(value?.from);
    const toFormatted = formatDate(value?.to);
    setFromInput(fromFormatted);
    setToInput(toFormatted);
    setLastValidFromDate(fromFormatted);
    setLastValidToDate(toFormatted);
 
    if (value?.from) {
      setCalendarMonth(value.from);
    }
  }, [value, format]);
 
  const handleChange = (range: DateRange | undefined) => {
    setInternalValue(range);
    const fromFormatted = formatDate(range?.from);
    const toFormatted = formatDate(range?.to);
    setFromInput(fromFormatted);
    setToInput(toFormatted);
    setLastValidFromDate(fromFormatted);
    setLastValidToDate(toFormatted);
 
    if (range?.from) {
      setCalendarMonth(range.from);
    }
 
    onChange?.(range);
  };
 
  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (!isValidInput(text)) {
      setFromInput("");
      return;
    }
 
    setFromInput(text);
 
    if (isValidFormat(text)) {
      const parsed = parseInput(text);
      const to = internalValue?.to;
 
      if (parsed && (!to || parsed <= to)) {
        const newRange = { from: parsed, to };
        setInternalValue(newRange);
        setLastValidFromDate(text);
        setCalendarMonth(parsed);
        onChange?.(newRange);
      } else {
        setFromInput(lastValidFromDate);
      }
    }
  };
 
  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (!isValidInput(text)) {
      setToInput("");
      return;
    }
 
    setToInput(text);
 
    if (isValidFormat(text)) {
      const parsed = parseInput(text);
      const from = internalValue?.from;
 
      if (parsed && (!from || from <= parsed)) {
        const newRange = { from, to: parsed };
        setInternalValue(newRange);
        setLastValidToDate(text);
        setCalendarMonth(parsed);
        onChange?.(newRange);
      } else {
        setToInput(lastValidToDate);
      }
    }
  };
 
  // const handleFromInputBlur = () => {
  //   if (fromInput && !isValidFormat(fromInput)) {
  //     setFromInput(lastValidFromDate);
  //   }
  // };
 
  // const handleToInputBlur = () => {
  //   if (toInput && !isValidFormat(toInput)) {
  //     setToInput(lastValidToDate);
  //   }
  // };
 
  const handleFromInputBlur = () => {
    if (fromInput === "" && internalValue?.from) {
      const restored = formatDate(internalValue.from);
      setFromInput(restored);
      setLastValidFromDate(restored);
      return;
    }
 
    if (!isValidFormat(fromInput)) {
      setFromInput(lastValidFromDate);
    }
  };
 
  const handleToInputBlur = () => {
    if (toInput === "" && internalValue?.to) {
      const restored = formatDate(internalValue.to);
      setToInput(restored);
      setLastValidToDate(restored);
      return;
    }
 
    if (!isValidFormat(toInput)) {
      setToInput(lastValidToDate);
    }
  };
 
 
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFromInput("");
    setToInput("");
    setLastValidFromDate("");
    setLastValidToDate("");
    setInternalValue(undefined);
    setCalendarMonth(new Date());
    onChange?.(undefined);
    setOpen(false);
  };
 
  const showError = error && (!internalValue?.from || !internalValue?.to);
 
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
 
      {/* <Popover open={open} onOpenChange={setOpen}> */}
      <Popover open={!disabled && open} onOpenChange={(val) => !disabled && setOpen(val)}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <div
              className={cn(
                "flex items-center justify-between gap-2 border border-input rounded-md px-3 py-2 text-sm",
                "bg-background",              // Set background like the first field
                "w-full",                     // Make it full width of the container
                // !internalValue && "text-muted-foreground",
                disabled && "opacity-50 bg-muted cursor-not-allowed"
              )}
            >
              <input
                id={inputId}
                type="text"
                placeholder={rangeplaceholder[0]}
                className={`w-full bg-transparent outline-none ${disabled && "opacity-50 bg-muted cursor-not-allowed"}`}
                value={fromInput}
                onChange={handleFromInputChange}
                onBlur={handleFromInputBlur}
                disabled={disabled}
                readOnly={disabled}
                // className=""
              />
              <span className="px-1">–</span>
              <input
                type="text"
                placeholder={rangeplaceholder[1]}
                className={`w-full bg-transparent outline-none ${disabled && "opacity-50 bg-muted cursor-not-allowed"}`}
                // className="w-full bg-transparent outline-none"
                value={toInput}
                onChange={handleToInputChange}
                onBlur={handleToInputBlur}
                disabled={disabled}
                readOnly={disabled}
              />
              {allowClear && (fromInput || toInput) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-2 flex items-center justify-center rounded-full hover:bg-muted "
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-black" />
                </button>
              )}
            </div>
          </div>
        </PopoverTrigger>
 
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={internalValue}
            onSelect={handleChange}
            defaultMonth={calendarMonth}
            key={calendarMonth.getTime()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
 
      {showError && <p className="text-red-600 text-sm mb-1">{error}</p>}
    </div>
 
  );
};
export default ReusableRangePicker;
 
 