import React, { useId, useState, useEffect, useRef, forwardRef } from "react";
import { Calendar, X, Info, ChevronLeft, ChevronRight } from "lucide-react";

// Simple utility function to replace @/lib/utils cn
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface DatePickerProps {
  value?: Date | string;
  defaultValue?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isRequired?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  showFooter?: boolean;
  footerText?: string;
  showTodayButton?: boolean;
  allowClear?: boolean;
  size?: "sm" | "md" | "lg";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  required?: boolean;
  tooltip?: string | React.ReactNode;
  tooltipPlacement?: "top" | "right" | "bottom" | "left";
  error?: string | boolean;
  errorMessage?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

interface TooltipProps {
  content: string | React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

// Simple Tooltip component without createPortal
const Tooltip: React.FC<TooltipProps> = ({ content, placement = "top", children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getTooltipPosition = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap",
            getTooltipPosition()
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Date utility functions
const formatDate = (date: Date | string, format: string): string => {
  // Handle string input by parsing it first
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Try to parse the string using the provided format
    dateObj = parseDate(date, format) || new Date(date);
    
    // If parsing failed, return the original string
    if (isNaN(dateObj.getTime())) {
      return date;
    }
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    // If it's neither string nor Date, return empty string
    return '';
  }

  // Ensure we have a valid date
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  const shortYear = year.slice(-2);

  return format
    .replace(/YYYY/g, year)
    .replace(/YY/g, shortYear)
    .replace(/MM/g, month)
    .replace(/DD/g, day);
};

const parseDate = (dateString: string, format: string): Date | null => {
  if (!dateString.trim()) return null;

  // Create a regex pattern from the format
  let pattern = format
    .replace(/YYYY/g, '(\\d{4})')
    .replace(/YY/g, '(\\d{2})')
    .replace(/MM/g, '(\\d{1,2})')
    .replace(/DD/g, '(\\d{1,2})')
    .replace(/[-\/]/g, '[-\\/]');

  const regex = new RegExp(`^${pattern}$`);
  const match = dateString.match(regex);

  if (!match) return null;

  // Extract parts based on format structure
  const formatParts = format.split(/[-\/]/);
  const values = match.slice(1);
  
  let year = 0, month = 0, day = 0;

  formatParts.forEach((part, index) => {
    const value = parseInt(values[index]);
    if (part.includes('Y')) {
      year = part.length === 2 && value < 50 ? 2000 + value : 
             part.length === 2 ? 1900 + value : value;
    } else if (part.includes('M')) {
      month = value - 1; // JavaScript months are 0-indexed
    } else if (part.includes('D')) {
      day = value;
    }
  });

  const parsedDate = new Date(year, month, day);
  
  // Validate the parsed date
  if (parsedDate.getFullYear() !== year || 
      parsedDate.getMonth() !== month || 
      parsedDate.getDate() !== day) {
    return null;
  }

  return parsedDate;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isValidDateString = (dateString: string, format: string): boolean => {
  return parseDate(dateString, format) !== null;
};

// Helper function to normalize string or Date to Date object
const normalizeToDate = (value: Date | string | undefined, format: string): Date | undefined => {
  if (!value) return undefined;
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }
  
  if (typeof value === 'string') {
    // Try to parse with the provided format first
    const parsedWithFormat = parseDate(value, format);
    if (parsedWithFormat) return parsedWithFormat;
    
    // Fallback to native Date parsing
    const parsedNative = new Date(value);
    return isNaN(parsedNative.getTime()) ? undefined : parsedNative;
  }
  
  return undefined;
};

// Custom Calendar Component
interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  footer?: React.ReactNode;
}

const CustomCalendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  month,
  onMonthChange,
  disabled,
  footer
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    onMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    onMonthChange(newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const today = new Date();
    
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const isSelected = selected && isSameDay(date, selected);
      const isToday = isSameDay(date, today);
      const isDisabled = disabled?.(date) || false;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && onSelect(date)}
          disabled={isDisabled}
          className={cn(
            "h-9 w-9 text-sm rounded-md font-normal transition-colors",
            "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            isToday && !isSelected && "bg-slate-100 font-medium",
            isDisabled && "text-slate-400 cursor-not-allowed hover:bg-transparent line-through"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-3 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </div>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-9 w-9 text-xs font-medium text-slate-600 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export const ReusableDatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      isRequired = false,
      className,
      format: dateFormat = "DD/MM/YYYY",
      minDate,
      maxDate,
      disabledDates,
      showFooter = true,
      footerText,
      showTodayButton = true,
      allowClear = true,
      size = "md",
      open: controlledOpen,
      onOpenChange,
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
    const [lastValidValue, setLastValidValue] = useState("");
    
    // Normalize initial values
    const normalizedValue = normalizeToDate(value, dateFormat);
    const normalizedDefaultValue = normalizeToDate(defaultValue, dateFormat);
    
    const [month, setMonth] = useState<Date>(normalizedValue || normalizedDefaultValue || new Date());
    const [internalValue, setInternalValue] = useState<Date | undefined>(normalizedValue || normalizedDefaultValue);
    const [popupPosition, setPopupPosition] = useState<{
      top?: number;
      bottom?: number;
      left: number;
      maxHeight?: number;
      showAbove: boolean;
    }>({ left: 0, showAbove: false });

    const wrapperRef = useRef<HTMLDivElement>(null);

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

    const getPlaceholder = () => {
      if (placeholder && placeholder !== "Select date") return placeholder;
      return `Select date (${dateFormat.toUpperCase()})`;
    };

    // Calculate responsive popup position
    const calculatePopupPosition = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const popupHeight = 380; // Approximate height of calendar popup
      const popupWidth = 320;
      const margin = 16;
      const spacing = 4;

      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom - margin;
      const spaceAbove = rect.top - margin;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      // Determine if popup should show above or below
      const showAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow && spaceAbove >= 200;

      // Calculate horizontal position
      let left = 0;
      if (spaceRight >= popupWidth) {
        // Align with left edge of input
        left = 0;
      } else if (spaceLeft >= popupWidth) {
        // Align with right edge of input
        left = rect.width - popupWidth;
      } else {
        // Center in available space
        const availableWidth = Math.min(viewportWidth - 2 * margin, popupWidth);
        left = Math.max(margin - rect.left, (rect.width - availableWidth) / 2);
      }

      // Calculate vertical position and max height
      let position: typeof popupPosition;
      
      if (showAbove) {
        const availableHeight = Math.min(spaceAbove - spacing, popupHeight);
        position = {
          bottom: rect.height + spacing,
          left,
          maxHeight: availableHeight,
          showAbove: true
        };
      } else {
        const availableHeight = Math.min(spaceBelow - spacing, popupHeight);
        position = {
          top: rect.height + spacing,
          left,
          maxHeight: availableHeight,
          showAbove: false
        };
      }

      setPopupPosition(position);
    };

    // Update position when popup opens
    useEffect(() => {
      if (actualOpen) {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(calculatePopupPosition, 10);
        return () => clearTimeout(timer);
      }
    }, [actualOpen]);

    // Update position on scroll and resize
    useEffect(() => {
      if (!actualOpen) return;

      const handlePositionUpdate = () => {
        calculatePopupPosition();
      };

      window.addEventListener('scroll', handlePositionUpdate, { passive: true });
      window.addEventListener('resize', handlePositionUpdate);

      return () => {
        window.removeEventListener('scroll', handlePositionUpdate);
        window.removeEventListener('resize', handlePositionUpdate);
      };
    }, [actualOpen]);

    // Handle internal value and external value coordination
    useEffect(() => {
      const normalizedValue = normalizeToDate(value, dateFormat);
      const normalizedDefaultValue = normalizeToDate(defaultValue, dateFormat);
      
      if (normalizedValue !== undefined) {
        setInternalValue(normalizedValue);
      } else if (normalizedDefaultValue && internalValue === undefined) {
        setInternalValue(normalizedDefaultValue);
      }
    }, [value, defaultValue, dateFormat]);

    // Update input value when props change
    useEffect(() => {
      const currentValue = normalizeToDate(value, dateFormat) || internalValue;
      
      if (currentValue) {
        const formattedValue = formatDate(currentValue, dateFormat);
        setInputValue(formattedValue);
        setLastValidValue(formattedValue);
        setMonth(currentValue);
      } else {
        setInputValue("");
        setLastValidValue("");
      }
    }, [value, internalValue, dateFormat]);

    const handlePopupClose = () => {
      setActualOpen(false);
      
      // Validate input when popup closes
      if (inputValue.trim() === "") {
        setInternalValue(undefined);
        onChange?.(undefined);
        setLastValidValue("");
      } else if (isValidDateString(inputValue, dateFormat)) {
        const parsed = parseDate(inputValue, dateFormat);
        if (parsed && !isDateDisabled(parsed)) {
          setInternalValue(parsed);
          onChange?.(parsed);
          setMonth(parsed);
          const formattedValue = formatDate(parsed, dateFormat);
          setInputValue(formattedValue);
          setLastValidValue(formattedValue);
        } else {
          // Invalid date, restore last valid value
          setInputValue(lastValidValue);
        }
      } else {
        // Invalid format, restore last valid value
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
    }, [actualOpen, inputValue, lastValidValue]);

    // Close when clicking outside
    useEffect(() => {
      if (!actualOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          handlePopupClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [actualOpen]);

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;

      if (Array.isArray(disabledDates)) {
        return disabledDates.some((d) => isSameDay(d, date));
      } else if (typeof disabledDates === "function") {
        return disabledDates(date);
      }

      return false;
    };

    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date)) return;

      const formattedValue = formatDate(date, dateFormat);
      setInputValue(formattedValue);
      setLastValidValue(formattedValue);
      setMonth(date);
      setInternalValue(date);
      onChange?.(date);
      setActualOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (isValidDateString(newValue, dateFormat)) {
        const parsed = parseDate(newValue, dateFormat);
        if (parsed && !isDateDisabled(parsed)) {
          setInternalValue(parsed);
          onChange?.(parsed);
          setMonth(parsed);
          setLastValidValue(newValue);
        }
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue("");
      setLastValidValue("");
      setInternalValue(undefined);
      onChange?.(undefined);
    };

    const getFooterText = () => {
      if (footerText) return footerText;
      const currentValue = normalizeToDate(value, dateFormat) || internalValue;
      return currentValue ? `Selected: ${formatDate(currentValue, dateFormat)}` : "No date selected";
    };

    const handleTodayClick = () => {
      const today = new Date();
      
      if (isDateDisabled(today)) return;

      handleDateSelect(today);
    };

    const renderFooter = () => {
      const today = new Date();
      const isTodayDisabled = isDateDisabled(today);
      const todayFormatted = formatDate(today, dateFormat);
      
      return (
        <div className="border-t pt-3">
          <div className={cn(
            "flex items-center text-sm px-3",
            showTodayButton ? "justify-between" : "justify-center"
          )}>
            {showTodayButton && (
              <button
                type="button"
                onClick={handleTodayClick}
                disabled={isTodayDisabled}
                className={cn(
                  "text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-1.5",
                  "active:scale-95",
                  isTodayDisabled && "opacity-50 cursor-not-allowed hover:text-blue-600 hover:bg-transparent"
                )}
                title={`Select today (${todayFormatted})`}
              >
                Today
              </button>
            )}
            <div className={cn(
              "text-xs text-slate-600",
              !showTodayButton && "text-center"
            )}>
              {getFooterText()}
            </div>
          </div>
        </div>
      );
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

    return (
      <div className={cn("relative w-full", wrapperClassName)} ref={wrapperRef}>
        {label && (
          <div className={cn("flex items-center gap-1 mb-2", labelClassName)}>
            <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
              {label}{(isRequired || required) && <span className='text-red-500'> *</span>}
            </label>
            {tooltip && (
              <Tooltip content={tooltip} placement={tooltipPlacement}>
                <Info className="h-3.5 w-3.5 text-slate-500 cursor-help" />
              </Tooltip>
            )}
          </div>
        )}
        
        <div className="relative">
          <div
            className={cn(
              "relative flex items-center w-full border border-slate-300 bg-white rounded-md transition-colors",
              sizeClasses[size],
              disabled && "opacity-50 cursor-not-allowed bg-slate-50",
              !disabled && "cursor-pointer hover:border-slate-400",
              actualOpen && !disabled && "ring-2 ring-blue-500 border-blue-500",
              (error || errorMessage) && "border-red-500",
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
              onClick={handleInputClick}
              placeholder={getPlaceholder()}
              disabled={disabled}
              readOnly={disabled}
              className={cn(
                "w-full bg-transparent border-none outline-none placeholder:text-slate-400",
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
                    "p-0.5 hover:bg-slate-100 rounded-sm pointer-events-auto",
                    "transition-colors duration-200"
                  )}
                  aria-label="Clear date"
                >
                  <X className={iconSizeClasses[size]} />
                </button>
              )}
              <Calendar className={cn(
                "text-slate-500",
                iconSizeClasses[size],
                disabled && "opacity-50"
              )} />
            </div>
          </div>

          {(error || errorMessage) && (
            <p className="text-sm text-red-500 mt-1">
              {typeof error === "string" ? error : errorMessage}
            </p>
          )}

          {/* Calendar popup - positioned responsively */}
          {actualOpen && !disabled && (
            <div 
              className={cn(
                "absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg",
                "w-80 max-w-[calc(100vw-2rem)]",
                // Add smooth transition for position changes
                "transition-all duration-200 ease-out"
              )}
              style={{
                ...(popupPosition.showAbove 
                  ? { bottom: popupPosition.bottom } 
                  : { top: popupPosition.top }
                ),
                left: popupPosition.left,
                maxHeight: popupPosition.maxHeight,
              }}
            >
              <div 
                className="overflow-y-auto overflow-x-hidden"
                style={{ 
                  maxHeight: popupPosition.maxHeight ? `${popupPosition.maxHeight}px` : 'auto'
                }}
              >
                <CustomCalendar
                  selected={normalizeToDate(value, dateFormat) || internalValue}
                  onSelect={handleDateSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={isDateDisabled}
                  footer={showFooter ? renderFooter() : undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReusableDatePicker.displayName = "ReusableDatePicker";

// Demo component to show usage
// const DatePickerDemo = () => {
//   const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
//   const [stringDate, setStringDate] = useState<string>("29/08/2025"); // Test string value
//   const [formatType, setFormatType] = useState("DD/MM/YYYY");
  
//   const formats = [
//     "DD/MM/YYYY",
//     "DD-MM-YYYY", 
//     "YYYY-MM-DD",
//     "YYYY/MM/DD",
//     "MM/DD/YYYY"
//   ];

//   return (
//     <div className="p-6 max-w-md mx-auto space-y-6 bg-gray-50 min-h-screen">
//       <h2 className="text-xl font-semibold text-gray-900">Enhanced Date Picker Demo</h2>
      
//       {/* Format selector */}
//       <div>
//         <label className="block text-sm font-medium mb-2 text-gray-700">Select Format:</label>
//         <select 
//           value={formatType} 
//           onChange={(e) => setFormatType(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           {formats.map(format => (
//             <option key={format} value={format}>{format}</option>
//           ))}
//         </select>
//       </div>

//       {/* Date picker with Date object */}
//       <ReusableDatePicker
//         label="Date Object Input"
//         value={singleDate}
//         defaultValue={new Date()}
//         onChange={setSingleDate}
//         format={formatType}
//         isRequired={true}
//         placeholder="Select Date"
//         tooltip="Using Date object as value"
//         allowClear={true}
//       />

//       {/* Date picker with string value */}
//       <ReusableDatePicker
//         label="String Value Input"
//         value={stringDate}
//         onChange={(date) => setStringDate(date ? formatDate(date, formatType) : "")}
//         format={formatType}
//         placeholder="Select Date"
//         tooltip="Using string value like '29/08/2025'"
//         allowClear={true}
//       />

//       {/* Display selected values */}
//       <div className="text-sm text-gray-600 bg-white p-3 rounded-md border space-y-2">
//         <div><strong>Date Object:</strong> {singleDate ? singleDate.toLocaleDateString() : 'None'}</div>
//         <div><strong>String Value:</strong> {stringDate || 'None'}</div>
//         <div><strong>Formatted Display:</strong> {singleDate ? formatDate(singleDate, formatType) : 'None'}</div>
//       </div>
      
//       {/* Test different formats */}
//       <div className="space-y-3">
//         <h3 className="text-lg font-medium">Test Different Formats:</h3>
//         {formats.map(format => (
//           <ReusableDatePicker
//             key={format}
//             label={`Format: ${format}`}
//             format={format}
//             defaultValue="29/08/2025" // Test string default value
//             placeholder={`Enter date as ${format}`}
//             size="sm"
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DatePickerDemo;