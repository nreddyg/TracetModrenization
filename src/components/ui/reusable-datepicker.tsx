import React, { useId, useState, useEffect, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { DayPicker, DateRange } from "react-day-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Calendar, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

dayjs.extend(customParseFormat);

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isRequired?:boolean;
  format?: string;
  mode?: "single" | "range" | "multiple" | "year";
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  yearRange?: [number, number];
  showFooter?: boolean;
  footerText?: string;
  showTodayButton?: boolean;
  allowClear?: boolean;
  size?: "sm" | "md" | "lg";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  rangeValue?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  multipleValue?: Date[];
  onMultipleChange?: (dates: Date[] | undefined) => void;
  usePortal?: boolean;
  // New props for label and tooltip
  label?: string;
  required?: boolean;
  tooltip?: string | React.ReactNode;
  tooltipPlacement?: "top" | "right" | "bottom" | "left";
  error?: string;
  errorMessage?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

interface PopupPosition {
  top: number;
  left: number;
  transform?: string;
}

interface TooltipProps {
  content: string | React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

// Simple Tooltip component
const Tooltip: React.FC<TooltipProps> = ({ content, placement = "top", children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = trigger.top - tooltip.height - 8;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case "bottom":
        top = trigger.bottom + 8;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case "left":
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.left - tooltip.width - 8;
        break;
      case "right":
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.right + 8;
        break;
    }

    setPosition({ top, left });
  }, [isVisible, placement]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-[10000] px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none"
          style={{ top: position.top, left: position.left }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

// Helper function to normalize format for dayjs
const normalizeDateFormat = (format: string): string => {
  return format
    .replace(/dd/gi, 'DD')    // day with leading zero
    .replace(/d/gi, 'D')      // day without leading zero
    .replace(/mm/g, 'MM')     // month with leading zero (case sensitive to avoid conflict with minutes)
    .replace(/m(?!m)/gi, 'M') // month without leading zero
    .replace(/yyyy/gi, 'YYYY') // 4-digit year
    .replace(/yy/gi, 'YY');   // 2-digit year
};

// Helper function to validate date string against format
const isValidDateString = (dateString: string, format: string): boolean => {
  if (!dateString.trim()) return false;
  
  const normalizedFormat = normalizeDateFormat(format);
  const parsed = dayjs(dateString, normalizedFormat, true);
  return parsed.isValid() && parsed.format(normalizedFormat) === dateString;
};

export const ReusableDatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      disabled = false,
      isRequired=false,
      className,
      format: dateFormat = "MM/DD/YYYY",
      mode = "single",
      minDate,
      maxDate,
      disabledDates,
      yearRange,
      showFooter = true,
      footerText,
      showTodayButton = true,
      allowClear = true,
      size = "md",
      open: controlledOpen,
      onOpenChange,
      rangeValue,
      onRangeChange,
      multipleValue,
      onMultipleChange,
      usePortal = true,
      label,
      required = false,
      tooltip,
      tooltipPlacement = "top",
      error = false,
      errorMessage,
      labelClassName,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [lastValidValue, setLastValidValue] = useState(""); // Track last valid input
    const [month, setMonth] = useState<Date>(value || new Date());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [popupPosition, setPopupPosition] = useState<PopupPosition>({
      top: 0,
      left: 0,
    });

    const wrapperRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const actualOpen = controlledOpen ?? isOpen;
    const setActualOpen = (open: boolean) => {
      if (controlledOpen === undefined) setIsOpen(open);
      onOpenChange?.(open);
    };

    const sizeClasses = {
      sm: "h-8 text-sm",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    };

    const inputPaddingClasses = {
      sm: "pl-3 pr-8",
      md: "pl-3 pr-10",
      lg: "pl-4 pr-12",
    };

    const iconSizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4", 
      lg: "h-5 w-5",
    };

    const iconContainerClasses = {
      sm: "right-2 gap-1",
      md: "right-3 gap-1.5",
      lg: "right-4 gap-2",
    };

    // Get normalized format for dayjs
    const normalizedFormat = normalizeDateFormat(dateFormat);

    // Calculate optimal popup position
    const calculatePopupPosition = (): PopupPosition => {
      if (!wrapperRef.current) {
        return { top: 0, left: 0 };
      }

      const inputRect = wrapperRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const popupWidth = mode === "range" ? 600 : 320;
      const popupHeight = mode === "year" ? 350 : mode === "range" ? 420 : 380;
      
      const margin = 16;
      const inputSpacing = 4;
      const navbarHeight = 60;

      let top = inputRect.bottom + inputSpacing;
      let left = inputRect.left;
      let transform = "";

      const spaceBelow = viewportHeight - inputRect.bottom - margin;
      const spaceAbove = inputRect.top - navbarHeight - margin;

      if (spaceBelow >= 250) {
        top = inputRect.bottom + inputSpacing;
      } else if (spaceAbove >= 250) {
        top = Math.max(navbarHeight + margin, inputRect.top - inputSpacing - Math.min(popupHeight, spaceAbove));
      } else {
        if (spaceBelow >= spaceAbove && spaceBelow >= 150) {
          top = inputRect.bottom + inputSpacing;
        } else if (spaceAbove >= 150) {
          top = Math.max(navbarHeight + margin, inputRect.top - inputSpacing - Math.min(200, spaceAbove));
        } else {
          top = inputRect.bottom + inputSpacing;
        }
      }

      const inputTop = inputRect.top;
      const inputBottom = inputRect.bottom;
      const popupBottom = top + Math.min(popupHeight, 300);
      
      if (top < inputBottom + inputSpacing && popupBottom > inputTop - inputSpacing) {
        top = inputBottom + inputSpacing;
      }

      if (left + popupWidth > viewportWidth - margin) {
        if (inputRect.right - popupWidth >= margin) {
          left = inputRect.right - popupWidth;
        } else {
          left = Math.max(margin, (viewportWidth - popupWidth) / 2);
        }
      }

      left = Math.max(margin, left);

      return { top, left, transform };
    };

    useEffect(() => {
      if (actualOpen) {
        const timer = setTimeout(() => {
          setPopupPosition(calculatePopupPosition());
        }, 10);
        return () => clearTimeout(timer);
      }
    }, [actualOpen, mode]);

    useEffect(() => {
      if (!actualOpen) return;

      const updatePosition = () => {
        setPopupPosition(calculatePopupPosition());
      };

      const handleResize = () => updatePosition();
      const handleScroll = (e: Event) => {
        if (e.target === document || e.target === document.documentElement || e.target === document.body) {
          updatePosition();
        }
      };

      window.addEventListener('resize', handleResize);
      document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, [actualOpen, mode]);

    // Update input value when props change
    useEffect(() => {
      let newInputValue = "";
      
      if (mode === "single" && value) {
        newInputValue = dayjs(value).format(normalizedFormat);
        setMonth(value);
      } else if (mode === "range" && rangeValue?.from) {
        if (rangeValue.to) {
          newInputValue = `${dayjs(rangeValue.from).format(normalizedFormat)} - ${dayjs(rangeValue.to).format(normalizedFormat)}`;
        } else {
          newInputValue = dayjs(rangeValue.from).format(normalizedFormat);
        }
      } else if (mode === "multiple" && multipleValue?.length) {
        newInputValue = `${multipleValue.length} dates selected`;
      } else if (mode === "year" && value) {
        newInputValue = value.getFullYear().toString();
        setSelectedYear(value.getFullYear());
        setMonth(new Date(value.getFullYear(), 0, 1));
      }
      
      setInputValue(newInputValue);
      setLastValidValue(newInputValue); // Update last valid value when props change
    }, [value, rangeValue, multipleValue, mode, normalizedFormat]);

    // Add popup close handler to validate input
    const handlePopupClose = () => {
      setActualOpen(false);
      
      // Validate input when popup closes - similar to Ant Design behavior
      let isValid = false;
      
      if (mode === "single") {
        if (inputValue.trim() === "") {
          isValid = true;
          if (value) {
            onChange?.(undefined);
            setLastValidValue("");
          }
        } else if (isValidDateString(inputValue, dateFormat)) {
          const parsed = dayjs(inputValue, normalizedFormat, true);
          if (parsed.isValid() && !isDateDisabled(parsed.toDate())) {
            isValid = true;
            if (!value || !dayjs(value).isSame(parsed, 'day')) {
              onChange?.(parsed.toDate());
              setMonth(parsed.toDate());
            }
            const formattedValue = parsed.format(normalizedFormat);
            setInputValue(formattedValue);
            setLastValidValue(formattedValue);
          }
        }
      } else if (mode === "year") {
        if (inputValue.trim() === "") {
          isValid = true;
          if (value) {
            onChange?.(undefined);
            setLastValidValue("");
          }
        } else {
          const year = parseInt(inputValue);
          if (!isNaN(year) && year >= 1000 && year <= 9999) {
            isValid = true;
            if (!value || value.getFullYear() !== year) {
              onChange?.(new Date(year, 0, 1));
            }
            const formattedValue = year.toString();
            setInputValue(formattedValue);
            setLastValidValue(formattedValue);
          }
        }
      } else if (mode === "range") {
        if (inputValue.trim() === "") {
          isValid = true;
          if (rangeValue?.from || rangeValue?.to) {
            onRangeChange?.(undefined);
            setLastValidValue("");
          }
        } else {
          const rangeParts = inputValue.split(' - ');
          if (rangeParts.length === 1 && isValidDateString(inputValue, dateFormat)) {
            const fromDate = dayjs(inputValue, normalizedFormat, true);
            if (fromDate.isValid() && !isDateDisabled(fromDate.toDate())) {
              isValid = true;
              onRangeChange?.({ from: fromDate.toDate(), to: undefined });
              const formattedValue = fromDate.format(normalizedFormat);
              setInputValue(formattedValue);
              setLastValidValue(formattedValue);
            }
          } else if (rangeParts.length === 2) {
            const fromStr = rangeParts[0].trim();
            const toStr = rangeParts[1].trim();
            
            if (isValidDateString(fromStr, dateFormat) && isValidDateString(toStr, dateFormat)) {
              const fromDate = dayjs(fromStr, normalizedFormat, true);
              const toDate = dayjs(toStr, normalizedFormat, true);
              
              if (fromDate.isValid() && toDate.isValid() && 
                  !isDateDisabled(fromDate.toDate()) && !isDateDisabled(toDate.toDate())) {
                isValid = true;
                onRangeChange?.({ from: fromDate.toDate(), to: toDate.toDate() });
                const formattedValue = `${fromDate.format(normalizedFormat)} - ${toDate.format(normalizedFormat)}`;
                setInputValue(formattedValue);
                setLastValidValue(formattedValue);
              }
            }
          }
        }
      }
      
      // If input is invalid, restore last valid value
      if (!isValid) {
        setInputValue(lastValidValue);
      }
    };

    // Close on escape key
    useEffect(() => {
      if (!actualOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handlePopupClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [actualOpen, inputValue, lastValidValue, mode, value, rangeValue, dateFormat, normalizedFormat]);

    const isDateDisabled = (date: Date): boolean => {
      // Check min/max date boundaries
      if (minDate && dayjs(date).startOf('day').isBefore(dayjs(minDate).startOf('day'))) return true;
      if (maxDate && dayjs(date).startOf('day').isAfter(dayjs(maxDate).startOf('day'))) return true;

      // Check disabled dates
      if (Array.isArray(disabledDates)) {
        return disabledDates.some((d) => dayjs(d).isSame(date, 'day'));
      } else if (typeof disabledDates === "function") {
        return disabledDates(date);
      }

      return false;
    };

    const handleSingleSelect = (date?: Date) => {
      if (!date) {
        setInputValue("");
        setLastValidValue("");
        onChange?.(undefined);
        return;
      }

      // Prevent selection of disabled dates
      if (isDateDisabled(date)) {
        return;
      }

      const formattedValue = dayjs(date).format(normalizedFormat);
      setInputValue(formattedValue);
      setLastValidValue(formattedValue);
      setMonth(date);
      onChange?.(date);
      setActualOpen(false);
    };

    const handleRangeSelect = (range?: DateRange) => {
      // Check if any selected date is disabled
      if (range?.from && isDateDisabled(range.from)) {
        return;
      }
      if (range?.to && isDateDisabled(range.to)) {
        return;
      }

      if (range?.from && range?.to) {
        const formattedValue = `${dayjs(range.from).format(normalizedFormat)} - ${dayjs(range.to).format(normalizedFormat)}`;
        setInputValue(formattedValue);
        setLastValidValue(formattedValue);
        setActualOpen(false);
      } else if (range?.from) {
        const formattedValue = dayjs(range.from).format(normalizedFormat);
        setInputValue(formattedValue);
        setLastValidValue(formattedValue);
      } else {
        setInputValue("");
        setLastValidValue("");
      }
      
      onRangeChange?.(range);
    };

    const handleMultipleSelect = (dates?: Date[]) => {
      onMultipleChange?.(dates);
    };

    const handleYearSelect = (year: number) => {
      const newDate = new Date(year, 0, 1);
      
      // Check if the first day of the year is disabled
      if (isDateDisabled(newDate)) {
        return;
      }

      const formattedValue = year.toString();
      setSelectedYear(year);
      setInputValue(formattedValue);
      setLastValidValue(formattedValue);
      onChange?.(newDate);
      setActualOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Only validate and update if the input is complete and valid
      if (mode === "single") {
        if (isValidDateString(newValue, dateFormat)) {
          const parsed = dayjs(newValue, normalizedFormat, true);
          if (parsed.isValid() && !isDateDisabled(parsed.toDate())) {
            onChange?.(parsed.toDate());
            setMonth(parsed.toDate());
            setLastValidValue(newValue);
          }
        }
      } else if (mode === "year") {
        const year = parseInt(newValue);
        if (!isNaN(year) && year >= 1000 && year <= 9999) {
          const newDate = new Date(year, 0, 1);
          onChange?.(newDate);
          setLastValidValue(newValue);
        }
      } else if (mode === "range") {
        // Handle range input parsing
        const rangeParts = newValue.split(' - ');
        if (rangeParts.length === 2) {
          const fromStr = rangeParts[0].trim();
          const toStr = rangeParts[1].trim();
          
          if (isValidDateString(fromStr, dateFormat) && isValidDateString(toStr, dateFormat)) {
            const fromDate = dayjs(fromStr, normalizedFormat, true);
            const toDate = dayjs(toStr, normalizedFormat, true);
            
            if (fromDate.isValid() && toDate.isValid() && 
                !isDateDisabled(fromDate.toDate()) && !isDateDisabled(toDate.toDate())) {
              onRangeChange?.({ from: fromDate.toDate(), to: toDate.toDate() });
              setLastValidValue(newValue);
            }
          }
        } else if (rangeParts.length === 1 && isValidDateString(newValue, dateFormat)) {
          const fromDate = dayjs(newValue, normalizedFormat, true);
          if (fromDate.isValid() && !isDateDisabled(fromDate.toDate())) {
            onRangeChange?.({ from: fromDate.toDate(), to: undefined });
            setLastValidValue(newValue);
          }
        }
      }
    };

    const handleInputBlur = () => {
      // Validate input on blur - if invalid, restore last valid value
      let isValid = false;
      
      if (mode === "single") {
        if (inputValue.trim() === "") {
          // Empty input is valid - clear the value
          isValid = true;
          onChange?.(undefined);
          setLastValidValue("");
        } else if (isValidDateString(inputValue, dateFormat)) {
          const parsed = dayjs(inputValue, normalizedFormat, true);
          if (parsed.isValid() && !isDateDisabled(parsed.toDate())) {
            isValid = true;
            const formattedValue = parsed.format(normalizedFormat);
            setInputValue(formattedValue);
            setLastValidValue(formattedValue);
          }
        }
      } else if (mode === "year") {
        if (inputValue.trim() === "") {
          isValid = true;
          onChange?.(undefined);
          setLastValidValue("");
        } else {
          const year = parseInt(inputValue);
          if (!isNaN(year) && year >= 1000 && year <= 9999) {
            isValid = true;
            const formattedValue = year.toString();
            setInputValue(formattedValue);
            setLastValidValue(formattedValue);
          }
        }
      } else if (mode === "range") {
        if (inputValue.trim() === "") {
          isValid = true;
          onRangeChange?.(undefined);
          setLastValidValue("");
        } else {
          const rangeParts = inputValue.split(' - ');
          if (rangeParts.length === 1 && isValidDateString(inputValue, dateFormat)) {
            const fromDate = dayjs(inputValue, normalizedFormat, true);
            if (fromDate.isValid() && !isDateDisabled(fromDate.toDate())) {
              isValid = true;
              const formattedValue = fromDate.format(normalizedFormat);
              setInputValue(formattedValue);
              setLastValidValue(formattedValue);
            }
          } else if (rangeParts.length === 2) {
            const fromStr = rangeParts[0].trim();
            const toStr = rangeParts[1].trim();
            
            if (isValidDateString(fromStr, dateFormat) && isValidDateString(toStr, dateFormat)) {
              const fromDate = dayjs(fromStr, normalizedFormat, true);
              const toDate = dayjs(toStr, normalizedFormat, true);
              
              if (fromDate.isValid() && toDate.isValid() && 
                  !isDateDisabled(fromDate.toDate()) && !isDateDisabled(toDate.toDate())) {
                isValid = true;
                const formattedValue = `${fromDate.format(normalizedFormat)} - ${toDate.format(normalizedFormat)}`;
                setInputValue(formattedValue);
                setLastValidValue(formattedValue);
              }
            }
          }
        }
      }
      
      // If input is invalid, restore last valid value
      if (!isValid) {
        setInputValue(lastValidValue);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue("");
      setLastValidValue("");
      if (mode === "single" || mode === "year") onChange?.(undefined);
      else if (mode === "range") onRangeChange?.(undefined);
      else if (mode === "multiple") onMultipleChange?.(undefined);
    };

    const getFooterText = () => {
      if (footerText) return footerText;

      switch (mode) {
        case "single":
          return value ? `Selected: ${dayjs(value).format(normalizedFormat)}` : "No date selected";
        case "range":
          if (rangeValue?.from && rangeValue?.to)
            return `Range: ${dayjs(rangeValue.from).format(normalizedFormat)} - ${dayjs(rangeValue.to).format(normalizedFormat)}`;
          else if (rangeValue?.from) return `Start: ${dayjs(rangeValue.from).format(normalizedFormat)}`;
          return "No range selected";
        case "multiple":
          return multipleValue?.length ? `${multipleValue.length} dates selected` : "No dates selected";
        case "year":
          return value ? `Selected year: ${value.getFullYear()}` : "No year selected";
        default:
          return "";
      }
    };

    const handleTodayClick = () => {
      const today = new Date();
      
      // Check if today is disabled
      if (isDateDisabled(today)) {
        return;
      }

      if (mode === "single") {
        handleSingleSelect(today);
      } else if (mode === "range") {
        // For range mode, set today as the start date
        handleRangeSelect({ from: today, to: undefined });
      } else if (mode === "multiple") {
        // For multiple mode, toggle today's selection
        const currentDates = multipleValue || [];
        const isTodaySelected = currentDates.some(date => dayjs(date).isSame(today, 'day'));
        
        if (isTodaySelected) {
          // Remove today from selection
          const newDates = currentDates.filter(date => !dayjs(date).isSame(today, 'day'));
          handleMultipleSelect(newDates);
        } else {
          // Add today to selection
          handleMultipleSelect([...currentDates, today]);
        }
      } else if (mode === "year") {
        handleYearSelect(today.getFullYear());
      }

      // Update the calendar view to show today's month
      setMonth(today);
    };

    const renderFooter = () => {
      const today = new Date();
      const isTodayDisabled = isDateDisabled(today);
      const todayFormatted = dayjs(today).format(normalizedFormat);
      
      return (
        <div className="border-t">
          <div className={cn(
            "flex items-center text-sm px-3 pt-3 pb-2",
            showTodayButton ? "justify-between" : "justify-center"
          )}>
            {showTodayButton && (
              <button
                type="button"
                onClick={handleTodayClick}
                disabled={isTodayDisabled}
                className={cn(
                  "text-primary hover:text-primary/80 hover:bg-accent/50 font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-3 py-1.5",
                  "active:scale-95", // Add click animation
                  "-ml-1", // Align with calendar content
                  isTodayDisabled && "opacity-50 cursor-not-allowed hover:text-primary hover:bg-transparent"
                )}
                title={`Select today (${todayFormatted})`}
              >
                Today
              </button>
            )}
            <div className={cn(
              "text-xs text-muted-foreground",
              !showTodayButton && "text-center"
            )}>
              {getFooterText()}
            </div>
          </div>
        </div>
      );
    };

    const renderYearPicker = () => {
      const currentYear = new Date().getFullYear();
      const startYear = yearRange?.[0] ?? currentYear - 100;
      const endYear = yearRange?.[1] ?? currentYear + 10;
      const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

      return (
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => {
              const yearDate = new Date(year, 0, 1);
              const isYearDisabled = isDateDisabled(yearDate);
              
              return (
                <button
                  key={year}
                  type="button"
                  className={cn(
                    "p-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors",
                    selectedYear === year && "bg-primary text-primary-foreground",
                    disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                    isYearDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground line-through"
                  )}
                  onClick={() => !disabled && !isYearDisabled && handleYearSelect(year)}
                  disabled={disabled || isYearDisabled}
                >
                  {year}
                </button>
              );
            })}
          </div>
          {showFooter && (
            <div className="mt-4 -mx-4 border-t-0">
              {renderFooter()}
            </div>
          )}
        </div>
      );
    };

    const commonDayPickerProps = {
      month,
      onMonthChange: setMonth,
      disabled: (date: Date) => isDateDisabled(date),
      className: "p-3",
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
          "hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          disabled && "cursor-not-allowed opacity-30 hover:bg-transparent hover:opacity-30"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors",
          "hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          disabled && "hover:bg-transparent cursor-not-allowed"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent line-through",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      },
      footer: showFooter && mode !== "year" ? renderFooter() : undefined,
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (!disabled) {
        e.stopPropagation();
        setActualOpen(true);
      }
    };

    const handleWrapperClick = () => {
      if (!disabled) {
        setActualOpen(true);
      }
    };

    const renderPopupContent = () => {
      const inputRect = wrapperRef.current?.getBoundingClientRect();
      
      let availableHeight = window.innerHeight - popupPosition.top - 32;
      const inputBottom = inputRect?.bottom || 0;
      const inputTop = inputRect?.top || 0;
      
      if (popupPosition.top < inputTop) {
        availableHeight = inputTop - popupPosition.top - 4;
      }
      
      const idealHeight = mode === "range" ? 420 : mode === "year" ? 400 : 380;
      const minHeight = 200;
      const maxHeight = Math.max(minHeight, Math.min(idealHeight, availableHeight));
      const needsScroll = idealHeight > availableHeight;

      return (
        <div
          ref={popupRef}
          className={cn(
            "bg-popover border border-border rounded-md shadow-lg max-w-[calc(100vw-32px)]",
            disabled && "pointer-events-none opacity-50"
          )}
          style={{
            position: 'fixed',
            top: popupPosition.top,
            left: popupPosition.left,
            zIndex: 9999,
            transform: popupPosition.transform,
            maxHeight: `${maxHeight}px`,
          }}
        >
          <div 
            className={needsScroll ? "overflow-y-auto overflow-x-hidden" : ""}
            style={{ 
              maxHeight: `${maxHeight}px`,
            }}
          >
            {mode === "year"
              ? renderYearPicker()
              : mode === "single"
              ? <DayPicker 
                  mode="single" 
                  selected={value} 
                  onSelect={handleSingleSelect}
                  modifiers={{ disabled: isDateDisabled }}
                  {...commonDayPickerProps} 
                />
              : mode === "range"
              ? <DayPicker 
                  mode="range" 
                  selected={rangeValue} 
                  onSelect={handleRangeSelect}
                  modifiers={{ disabled: isDateDisabled }}
                  {...commonDayPickerProps} 
                />
              : mode === "multiple"
              ? <DayPicker 
                  mode="multiple" 
                  selected={multipleValue} 
                  onSelect={handleMultipleSelect}
                  modifiers={{ disabled: isDateDisabled }}
                  {...commonDayPickerProps} 
                />
              : null}
          </div>
        </div>
      );
    };

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        {label && (
          <div className={cn("flex items-center gap-1 mb-2", labelClassName)}>
            <label htmlFor={inputId} className="text-sm font-medium">
              {label}{isRequired ?<span className='text-red-500'> *</span>:''}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {tooltip && (
              <Tooltip content={tooltip} placement={tooltipPlacement}>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </Tooltip>
            )}
          </div>
        )}
        
        <div className="relative" ref={wrapperRef}>
          <div
            className={cn(
              "relative flex items-center w-full border border-input bg-background rounded-md transition-colors",
              sizeClasses[size],
              disabled && "opacity-50 cursor-not-allowed bg-muted",
              !disabled && "cursor-pointer hover:border-gray-400",
              actualOpen && !disabled && "ring-2 ring-ring ring-offset-2",
              error && "border-red-500",
              className
            )}
            onClick={handleWrapperClick}
          >
            <input
              ref={ref}
              id={inputId}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onClick={handleInputClick}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={disabled}
              className={cn(
                "w-full bg-transparent border-none outline-none placeholder:text-muted-foreground",
                inputPaddingClasses[size],
                disabled && "cursor-not-allowed"
              )}
              {...props}
            />

            <div className={cn(
              "absolute flex items-center pointer-events-none",
              iconContainerClasses[size]
            )}>
              {allowClear && inputValue && !disabled && (
                <button 
                  type="button" 
                  onClick={handleClear} 
                  className={cn(
                    "p-0.5 hover:bg-accent rounded-sm pointer-events-auto",
                    "transition-colors duration-200"
                  )}
                  aria-label="Clear date"
                >
                  <X className={iconSizeClasses[size]} />
                </button>
              )}
              <Calendar className={cn(
                "text-muted-foreground",
                iconSizeClasses[size],
                disabled && "opacity-50"
              )} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          {actualOpen && !disabled && (
            <>
              <div 
                className="fixed inset-0 z-[9998]" 
                onClick={handlePopupClose} 
              />
              
              {usePortal ? (
                createPortal(renderPopupContent(), document.body)
              ) : (
                <div className="absolute z-[9999] top-full left-0 mt-1">
                  {renderPopupContent()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

ReusableDatePicker.displayName = "ReusableDatePicker";