import React, { useId, useState, useEffect, useRef, forwardRef } from "react";
import { createPortal } from 'react-dom';
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
  usePortal?: boolean;
  dropdownClassName?: string;
}

interface TooltipProps {
  content: string | React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

interface PopupPosition {
  top: number;
  left: number;
  width: number;
  maxHeight?: number;
  showAbove: boolean;
  transform?: string;
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
            "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            isToday && !isSelected && "bg-gray-100 font-medium",
            isDisabled && "text-gray-400 cursor-not-allowed hover:bg-transparent line-through"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="py-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </div>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2 px-3">
        {dayNames.map(day => (
          <div key={day} className="h-9 w-9 text-xs font-medium text-gray-600 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 px-3">
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
      usePortal = true,
      dropdownClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [lastValidValue, setLastValidValue] = useState("");
    const [popupPosition, setPopupPosition] = useState<PopupPosition>({
      top: 0,
      left: 0,
      width: 0,
      showAbove: false,
    });
    
    // Normalize initial values
    const normalizedValue = normalizeToDate(value, dateFormat);
    const normalizedDefaultValue = normalizeToDate(defaultValue, dateFormat);
    
    const [month, setMonth] = useState<Date>(normalizedValue || normalizedDefaultValue || new Date());
    const [internalValue, setInternalValue] = useState<Date | undefined>(normalizedValue || normalizedDefaultValue);

    const datePickerRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const actualOpen = controlledOpen ?? isOpen;
    const setActualOpen = (open: boolean) => {
      if (controlledOpen === undefined) setIsOpen(open);
      onOpenChange?.(open);
    };

    const sizeClasses = {
      sm: "min-h-[24px] text-sm",
      md: "min-h-[32px] text-sm",
      lg: "min-h-[40px] text-base",
    };

    const iconSizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4", 
      lg: "h-5 w-5",
    };

    // Smart position calculation with responsive maxHeight - similar to first component
    const calculatePopupPosition = (): PopupPosition => {
      if (!datePickerRef.current) {
        return { top: 0, left: 0, width: 0, showAbove: false };
      }

      const inputRect = datePickerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calendar popup dimensions
      const popupHeight = 380; // Approximate height of calendar popup
      const popupWidth = Math.max(320, inputRect.width); // Minimum width for calendar, or input width
      const margin = 16;
      const spacing = 4;

      // Calculate available space
      const spaceBelow = viewportHeight - inputRect.bottom - margin;
      const spaceAbove = inputRect.top - margin;
      const spaceLeft = inputRect.left;
      const spaceRight = viewportWidth - inputRect.right;

      // Determine if popup should show above or below
      const showAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow && spaceAbove >= 200;

      // Calculate horizontal position
      let left = inputRect.left;
      if (spaceRight >= popupWidth) {
        // Align with left edge of input
        left = inputRect.left;
      } else if (spaceLeft >= popupWidth) {
        // Align with right edge of input
        left = inputRect.right - popupWidth;
      } else {
        // Center in available space
        const availableWidth = Math.min(viewportWidth - 2 * margin, popupWidth);
        left = Math.max(margin, inputRect.left + (inputRect.width - availableWidth) / 2);
      }

      // Calculate vertical position and max height
      let top: number;
      let maxHeight: number;
      
      if (showAbove) {
        const availableHeight = Math.min(spaceAbove - spacing, popupHeight);
        top = inputRect.top - spacing - Math.min(availableHeight, popupHeight);
        maxHeight = availableHeight;
      } else {
        const availableHeight = Math.min(spaceBelow - spacing, popupHeight);
        top = inputRect.bottom + spacing;
        maxHeight = availableHeight;
      }

      return { 
        top, 
        left, 
        width: popupWidth,
        maxHeight,
        showAbove
      };
    };

    // Update position when dropdown opens
    useEffect(() => {
      if (actualOpen && datePickerRef.current) {
        // Calculate position immediately
        setPopupPosition(calculatePopupPosition());
        
        // Also recalculate after a tiny delay to handle any layout shifts
        const timer = setTimeout(() => {
          setPopupPosition(calculatePopupPosition());
        }, 10);
        
        return () => clearTimeout(timer);
      }
    }, [actualOpen]);

    // Enhanced scroll and resize handlers with responsive positioning
    useEffect(() => {
      if (!actualOpen) return;

      let rafId: number;
      
      const updatePosition = () => {
        // Use requestAnimationFrame for smooth updates
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setPopupPosition(calculatePopupPosition());
        });
      };

      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      // Add listeners
      window.addEventListener('resize', handleResize);
      document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      document.addEventListener('wheel', handleScroll, { passive: true });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('scroll', handleScroll, true);
        document.removeEventListener('wheel', handleScroll);
      };
    }, [actualOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!actualOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const isOutsideDatePicker = datePickerRef.current && !datePickerRef.current.contains(target);
        const isOutsideCalendar = calendarRef.current && !calendarRef.current.contains(target);
        
        if (isOutsideDatePicker && isOutsideCalendar) {
          handlePopupClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
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
          datePickerRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [actualOpen, inputValue, lastValidValue]);

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
        <div className="border-t pt-3 px-3">
          <div className={cn(
            "flex items-center text-sm",
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
              "text-xs text-gray-600",
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

    const getPlaceholder = () => {
      if (placeholder && placeholder !== "Select date") return placeholder;
      return `Select date (${dateFormat.toUpperCase()})`;
    };

    const getStatusClasses = () => {
      if (error || errorMessage) return 'border-red-500 focus-within:border-red-500 ring-red-200';
      return 'border-gray-300 focus-within:border-blue-500 ring-blue-200';
    };

    const renderCalendarContent = () => (
      <CustomCalendar
        selected={normalizeToDate(value, dateFormat) || internalValue}
        onSelect={handleDateSelect}
        month={month}
        onMonthChange={setMonth}
        disabled={isDateDisabled}
        footer={showFooter ? renderFooter() : undefined}
      />
    );

    const renderPopup = () => (
      <div
        ref={calendarRef}
        className={cn(
          "bg-white border border-gray-300 rounded-md shadow-lg",
          // Add smooth transition for position changes
          "transition-all duration-200 ease-out",
          dropdownClassName,
          disabled && "pointer-events-none opacity-50"
        )}
        style={{
          position: "fixed",
          top: popupPosition.top,
          left: popupPosition.left,
          zIndex: 9999,
          width: popupPosition.width,
          maxHeight: popupPosition.maxHeight ? `${popupPosition.maxHeight}px` : "380px",
        }}
      >
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ 
            maxHeight: popupPosition.maxHeight ? `${popupPosition.maxHeight}px` : "380px"
          }}
        >
          {renderCalendarContent()}
        </div>
      </div>
    );

    return (
      <div className={cn("space-y-2", wrapperClassName)} ref={datePickerRef}>
        {label && (
          <div className="text-sm font-medium">
            <div className={cn("flex items-center gap-1", labelClassName)}>
              <label htmlFor={inputId} className="text-sm font-medium">
                {label}{(isRequired || required) && <span className='text-red-500'> *</span>}
              </label>
              {tooltip && (
                <Tooltip content={tooltip} placement={tooltipPlacement}>
                  <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                </Tooltip>
              )}
            </div>
          </div>
        )}
        
        <div className="relative">
          <div
            className={cn(
              "flex items-center rounded border transition-colors relative overflow-hidden",
              sizeClasses[size],
              disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-blue-400",
              actualOpen && !disabled && "ring-2 ring-blue-500 border-blue-500",
              getStatusClasses(),
              className
            )}
            style={{ 
              backgroundColor: disabled ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)', 
              borderColor: disabled ? undefined : 'hsl(214.29deg 31.82% 91.37%)' 
            }}
            onClick={handleWrapperClick}
          >
            <div className="flex items-center w-full min-w-0">
              <div className="flex-1 min-w-0 relative pr-16">
                <input
                  ref={ref}
                  id={inputId}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={handleInputClick}
                  placeholder={getPlaceholder()}
                  disabled={disabled}
                  className={cn(
                    "w-full bg-transparent outline-none text-sm px-3 py-2 truncate",
                    "placeholder:text-gray-400",
                    disabled && "cursor-not-allowed"
                  )}
                  {...props}
                />
              </div>
            </div>

            <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-3 bg-inherit">
              {allowClear && inputValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:bg-gray-200 rounded p-1 text-gray-500 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              )}
              <div className="text-gray-400 flex-shrink-0 pointer-events-none">
                <Calendar className={cn(
                  iconSizeClasses[size],
                  disabled && "opacity-50"
                )} />
              </div>
            </div>
          </div>

          {(error || errorMessage) && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {typeof error === "string" ? error : errorMessage}
            </p>
          )}

          {actualOpen && !disabled && (
            <>
              {usePortal ? (
                createPortal(renderPopup(), document.body)
              ) : (
                <div 
                  className="absolute z-[9999] top-full left-0 mt-1" 
                  style={{ width: '100%' }}
                >
                  <div
                    className={cn(
                      "bg-white border border-gray-300 rounded-md shadow-lg",
                      // Add smooth transition for position changes
                      "transition-all duration-200 ease-out",
                      dropdownClassName
                    )}
                    style={{
                      minHeight: '200px',
                      maxHeight: popupPosition.maxHeight ? `${popupPosition.maxHeight}px` : '380px',
                      overflowY: 'auto',
                      width: '100%'
                    }}
                  >
                    <div
                      className="overflow-y-auto overflow-x-hidden"
                      style={{ 
                        maxHeight: popupPosition.maxHeight ? `${popupPosition.maxHeight}px` : '380px'
                      }}
                    >
                      {renderCalendarContent()}
                    </div>
                  </div>
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