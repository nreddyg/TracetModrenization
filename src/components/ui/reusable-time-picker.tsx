


import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

// Time parsing and formatting utilities
const parseTime = (str, format = "HH:mm:ss") => {
  if (!str) return null;
  
  // Handle different time formats
  const timeRegex = {
    'HH:mm:ss': /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/,
    'HH:mm': /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
    'h:mm:ss A': /^(1[0-2]|[1-9]):([0-5]?[0-9]):([0-5]?[0-9])\s?(AM|PM)$/i,
    'h:mm A': /^(1[0-2]|[1-9]):([0-5]?[0-9])\s?(AM|PM)$/i
  };
  
  const regex = timeRegex[format];
  if (!regex) return null;
  
  const match = str.match(regex);
  if (!match) return null;
  
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const second = format.includes('ss') ? parseInt(match[3] || '0', 10) : 0;
  const isPM = format.includes('A') ? (match[match.length - 1]?.toUpperCase() === 'PM') : false;
  
  // Convert 12-hour to 24-hour format
  if (format.includes('A')) {
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  }
  
  // Validate ranges
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return null;
  }
  
  return {
    hour: () => hour,
    minute: () => minute,
    second: () => second,
    format: (fmt) => formatTime(hour, minute, second, fmt)
  };
};

const formatTime = (hour, minute, second, format) => {
  let h = hour;
  let suffix = '';
  
  if (format.includes('A')) {
    suffix = hour >= 12 ? ' PM' : ' AM';
    h = hour % 12 || 12;
  }
  
  const parts = [];
  
  if (format.includes('HH')) {
    parts.push(pad(hour));
  } else if (format.includes('h')) {
    parts.push(h.toString());
  }
  
  parts.push(pad(minute));
  
  if (format.includes('ss')) {
    parts.push(pad(second));
  }
  
  return parts.join(':') + suffix;
};

// Auto-format input with colons and validate values
const autoFormatTimeInput = (value, format, use12Hours, cursorPosition, previousValue) => {
  if (!value) return { formatted: '', shouldAddColon: false };
  
  // Check if user is adding content (not deleting)
  const isAdding = value.length > (previousValue?.length || 0);
  
  // Handle AM/PM input
  const hasAmPm = value.match(/(AM|PM|am|pm)/i);
  let amPmSuffix = '';
  let cleanValue = value;
  
  if (hasAmPm) {
    amPmSuffix = ' ' + hasAmPm[0].toUpperCase();
    cleanValue = value.replace(/(AM|PM|am|pm)/gi, '').trim();
  }
  
  // Don't auto-format if user has manually added colons or is editing existing content
  if (cleanValue.includes(':') && !isAdding) {
    return { formatted: value, shouldAddColon: false };
  }
  
  // Remove colons for processing
  const digitsOnly = cleanValue.replace(/[^0-9]/g, '');
  
  if (!digitsOnly) {
    return { formatted: amPmSuffix ? amPmSuffix : '', shouldAddColon: false };
  }
  
  let formatted = '';
  let shouldAddColon = false;
  
  // Determine expected segments based on format
  const hasSeconds = format.includes('ss');
  const maxSegments = hasSeconds ? 3 : 2;
  
  // Auto-format only when adding digits and no colons present
  if (isAdding && !cleanValue.includes(':')) {
    if (digitsOnly.length === 2) {
      // After 2 digits, add colon for hours
      formatted = digitsOnly + ':';
      shouldAddColon = true;
    } else if (digitsOnly.length === 4 && hasSeconds) {
      // After 4 digits with seconds format, add second colon
      formatted = digitsOnly.slice(0, 2) + ':' + digitsOnly.slice(2, 4) + ':';
      shouldAddColon = true;
    } else if (digitsOnly.length === 4 && !hasSeconds) {
      // After 4 digits without seconds, format as HH:MM
      formatted = digitsOnly.slice(0, 2) + ':' + digitsOnly.slice(2, 4);
    } else if (digitsOnly.length > 4 && hasSeconds) {
      // More than 4 digits, format as HH:MM:SS
      const hours = digitsOnly.slice(0, 2);
      const minutes = digitsOnly.slice(2, 4);
      const seconds = digitsOnly.slice(4, 6);
      formatted = hours + ':' + minutes + ':' + seconds;
    } else {
      formatted = digitsOnly;
    }
  } else {
    // Don't auto-format, just clean up
    formatted = cleanValue;
  }
  
  return { 
    formatted: formatted + amPmSuffix, 
    shouldAddColon 
  };
};

// Validate and correct time values
const validateAndCorrectTime = (timeStr, format, use12Hours) => {
  if (!timeStr) return timeStr;
  
  const parts = timeStr.split(/[:\s]/);
  const correctedParts = [];
  
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) { // Hours
      let hour = parseInt(parts[i]) || 0;
      if (use12Hours) {
        if (hour < 1) hour = 1;
        if (hour > 12) hour = 12;
      } else {
        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;
      }
      correctedParts.push(hour);
    } else if (i === 1 || i === 2) { // Minutes/Seconds
      let value = parseInt(parts[i]) || 0;
      if (value < 0) value = 0;
      if (value > 59) value = 59;
      correctedParts.push(value);
    } else if (parts[i] && (parts[i].toUpperCase() === 'AM' || parts[i].toUpperCase() === 'PM')) {
      // Keep AM/PM as is
      correctedParts.push(parts[i].toUpperCase());
    }
  }
  
  // Reconstruct the time string
  let result = '';
  for (let i = 0; i < correctedParts.length; i++) {
    if (i === 0) {
      result = correctedParts[i].toString();
    } else if (typeof correctedParts[i] === 'number') {
      result += ':' + pad(correctedParts[i]);
    } else {
      result += ' ' + correctedParts[i];
    }
  }
  
  return result;
};

const pad = (n) => n.toString().padStart(2, '0');

export function ReusableTimePicker({
  label = "Select Time",
  placeholder = "HH:mm:ss",
  isRequired = false,
  isDisabled = false,
  value = null,
  onChange,
  format = "HH:mm:ss",
  className = "",
  labelClassName = "",
  errorMsgClass = "",
  disableHours = [],
  disableMinutes = [],
  disableSeconds = [],
  showSeconds = true,
  use12Hours = false
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [isPM, setIsPM] = useState(false);
  const inputRef = useRef(null);
  const isUpdatingFromPopup = useRef(false);
  const previousValue = useRef('');

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const parsed = parseTime(value, format);
      if (parsed) {
        setInputValue(parsed.format(format));
        setError(false);
        updateSelectionStates(parsed);
      } else {
        setInputValue("");
        setError(true);
        resetSelectionStates();
      }
    } else {
      setInputValue("");
      setError(false);
      resetSelectionStates();
    }
  }, [value, format, use12Hours]);

  // Update selection states when input changes manually
  useEffect(() => {
    if (isUpdatingFromPopup.current) {
      isUpdatingFromPopup.current = false;
      return;
    }

    if (inputValue) {
      const parsed = parseTime(inputValue, format);
      if (parsed) {
        updateSelectionStates(parsed);
        setError(false);
      } else {
        setError(true);
      }
    } else {
      resetSelectionStates();
      setError(false);
    }
  }, [inputValue, format, use12Hours]);

  const updateSelectionStates = (parsed) => {
    let hour = parsed.hour();
    if (use12Hours) {
      setIsPM(hour >= 12);
      hour = hour % 12 || 12;
    }
    setSelectedHour(hour);
    setSelectedMinute(parsed.minute());
    setSelectedSecond(parsed.second());
  };

  const resetSelectionStates = () => {
    setSelectedHour(null);
    setSelectedMinute(null);
    setSelectedSecond(null);
    setIsPM(false);
  };

  // Handle popup selection changes
  useEffect(() => {
    if (
      selectedHour !== null &&
      selectedMinute !== null &&
      (!showSeconds || selectedSecond !== null) &&
      open
    ) {
      let hour = selectedHour;
      if (use12Hours) {
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
      }
      const formatted = formatTime(hour, selectedMinute, showSeconds ? selectedSecond : 0, format);
      
      isUpdatingFromPopup.current = true;
      setInputValue(formatted);
      setError(false);
      onChange?.(formatted);
    }
  }, [selectedHour, selectedMinute, selectedSecond, isPM, showSeconds, use12Hours, format, onChange, open]);

  const handleManualInput = (e) => {
    const rawValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // Store cursor position
    const currentCursorPos = cursorPosition;
    
    // Get auto-formatted value
    const result = autoFormatTimeInput(rawValue, format, use12Hours, cursorPosition, previousValue.current);
    const formattedValue = result.formatted;
    
    setInputValue(formattedValue);
    previousValue.current = formattedValue;
    
    // Restore cursor position after state update
    setTimeout(() => {
      if (inputRef.current) {
        let newCursorPos = currentCursorPos;
        
        // If a colon was auto-added, move cursor after it
        if (result.shouldAddColon) {
          newCursorPos = formattedValue.length;
        } else if (formattedValue.length > rawValue.length && !result.shouldAddColon) {
          // If formatting changed but not due to colon addition, maintain relative position
          newCursorPos = Math.min(currentCursorPos + (formattedValue.length - rawValue.length), formattedValue.length);
        }
        
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
    
    if (formattedValue) {
      const parsed = parseTime(formattedValue, format);
      if (parsed) {
        setError(false);
        onChange?.(parsed.format(format));
      } else {
        setError(true);
      }
    } else {
      setError(false);
      onChange?.(null);
    }
  };

  const handleInputBlur = () => {
    // Validate and correct the time when input loses focus
    if (inputValue) {
      const corrected = validateAndCorrectTime(inputValue, format, use12Hours);
      if (corrected !== inputValue) {
        setInputValue(corrected);
        const parsed = parseTime(corrected, format);
        if (parsed) {
          setError(false);
          onChange?.(parsed.format(format));
        }
      }
    }
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    setOpen(true);
    // Maintain focus on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    resetSelectionStates();
    setError(false);
    setOpen(false);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClockClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
  };

  const handleSecondSelect = (second) => {
    setSelectedSecond(second);
  };

  const handlePeriodSelect = (pm) => {
    setIsPM(pm);
  };

  const hours = use12Hours ? [...Array(12).keys()].map(i => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = [...Array(60).keys()];
  const seconds = [...Array(60).keys()];

  return (
    <div className="space-y-2">
      {label && (
        <label className={labelClassName}>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                disabled={isDisabled}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleManualInput}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                className={`${className} ${error ? 'border-red-500' : ''}`}
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClockClick}
              disabled={isDisabled}
              className="px-3"
            >
              <Clock size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClear} 
              disabled={isDisabled}
              className="text-red-500 px-2 hover:text-red-600"
            >
              <X size={16} />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-auto" align="start">
          <div className="flex gap-4">
            {/* Hours Column */}
            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-medium text-gray-700">Hours</span>
              <div className="h-40 w-16 overflow-y-auto border rounded-md bg-white">
                {hours.map(h => {
                  if (disableHours.includes(h)) return null;
                  return (
                    <button
                      key={h}
                      onClick={() => handleHourSelect(h)}
                      className={`w-full text-center px-2 py-1 text-sm hover:bg-blue-50 transition-colors ${
                        selectedHour === h 
                          ? 'bg-blue-100 text-blue-600 font-semibold' 
                          : 'text-gray-700'
                      }`}
                    >
                      {pad(h)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col items-center">
              <span className="mb-2 text-sm font-medium text-gray-700">Minutes</span>
              <div className="h-40 w-16 overflow-y-auto border rounded-md bg-white">
                {minutes.map(m => {
                  if (disableMinutes.includes(m)) return null;
                  return (
                    <button
                      key={m}
                      onClick={() => handleMinuteSelect(m)}
                      className={`w-full text-center px-2 py-1 text-sm hover:bg-blue-50 transition-colors ${
                        selectedMinute === m 
                          ? 'bg-blue-100 text-blue-600 font-semibold' 
                          : 'text-gray-700'
                      }`}
                    >
                      {pad(m)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seconds Column */}
            {showSeconds && (
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-medium text-gray-700">Seconds</span>
                <div className="h-40 w-16 overflow-y-auto border rounded-md bg-white">
                  {seconds.map(s => {
                    if (disableSeconds.includes(s)) return null;
                    return (
                      <button
                        key={s}
                        onClick={() => handleSecondSelect(s)}
                        className={`w-full text-center px-2 py-1 text-sm hover:bg-blue-50 transition-colors ${
                          selectedSecond === s 
                            ? 'bg-blue-100 text-blue-600 font-semibold' 
                            : 'text-gray-700'
                        }`}
                      >
                        {pad(s)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AM/PM Column */}
            {use12Hours && (
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm font-medium text-gray-700">Period</span>
                <div className="h-40 w-16 border rounded-md bg-white flex flex-col">
                  {['AM', 'PM'].map(period => (
                    <button
                      key={period}
                      onClick={() => handlePeriodSelect(period === 'PM')}
                      className={`flex-1 px-2 py-1 text-sm hover:bg-blue-50 transition-colors ${
                        isPM === (period === 'PM') 
                          ? 'bg-blue-100 text-blue-600 font-semibold' 
                          : 'text-gray-700'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className={`${errorMsgClass} text-red-500 text-sm mt-1`}>
          {label || 'Time'} format is invalid
        </p>
      )}
    </div>
  );
}

// Demo component to test the TimePicker
// function TimePickerDemo() {
//   const [time1, setTime1] = useState("14:30:00");
//   const [time2, setTime2] = useState("");
//   const [time3, setTime3] = useState("2:30:45 PM");

//   return (
//     <div className="p-8 space-y-8 max-w-md">
//       <h2 className="text-2xl font-bold mb-6">Enhanced Time Picker Demo</h2>
//       <TimePicker
//         label="24-hour format with seconds"
//         value={time1}
//         onChange={setTime1}
//         format="HH:mm:ss"
//         showSeconds={true}
//         placeholder="HH:mm:ss"
//       />
      
//       <TimePicker
//         label="24-hour format without seconds"
//         value={time2}
//         onChange={setTime2}
//         format="HH:mm"
//         showSeconds={false}
//         placeholder="HH:mm"
//       />
      
//       <TimePicker
//         label="12-hour format with AM/PM"
//         value={time3}
//         onChange={setTime3}
//         format="h:mm:ss A"
//         use12Hours={true}
//         showSeconds={true}
//         placeholder="h:mm:ss A"
//       />
      
  
//     </div>
//   );
// }
ReusableTimePicker.displayName = "ReusableTimePicker";