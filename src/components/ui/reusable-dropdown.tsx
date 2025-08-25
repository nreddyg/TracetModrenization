
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options?: SelectOption[];
  label?: string;
  tooltip?: string;
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  multiple?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  error?: string;
  maxTagCount?: number;
  containerClassName?:string
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  notFoundContent?: React.ReactNode;
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
  onSearch?: (value: string) => void;
  onChange?: (value: string | number | (string | number)[], option?: SelectOption | SelectOption[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  className?: string;
  dropdownClassName?: string;
  usePortal?: boolean; // New prop to control portal rendering
}

interface PopupPosition {
  top: number;
  left: number;
  transform?: string;
}

export const ReusableDropdown: React.FC<SelectProps> = ({
  options = [],
  label,
  tooltip,
  value,
  defaultValue,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  allowClear = false,
  showSearch = true,
  multiple = false,
  size = 'middle',
  status,
  containerClassName,
  isRequired = false,
  error,
  maxTagCount,
  filterOption = true,
  notFoundContent = 'No data',
  dropdownRender,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  onDropdownVisibleChange,
  className = '',
  dropdownClassName = '',
  usePortal = true, // Default to true for better positioning
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [internalValue, setInternalValue] = useState(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return multiple ? [] : '';
  });
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({
    top: 0,
    left: 0,
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentValue = value !== undefined ? value : internalValue;

  // Calculate optimal popup position - similar to DatePicker logic
  const calculatePopupPosition = (): PopupPosition => {
    if (!selectRef.current) {
      return { top: 0, left: 0 };
    }

    const inputRect = selectRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const dropdownWidth = inputRect.width; // Use exact input width
    const dropdownMaxHeight = 300; // Maximum height for dropdown
    
    const margin = 16;
    const inputSpacing = 4;
    const navbarHeight = 60; // Assume navbar height

    let top = inputRect.bottom + inputSpacing;
    let left = inputRect.left;
    let transform = "";

    // Calculate available space
    const spaceBelow = viewportHeight - inputRect.bottom - margin;
    const spaceAbove = inputRect.top - navbarHeight - margin;

    // Determine vertical position
    if (spaceBelow >= 150) {
      // Enough space below
      top = inputRect.bottom + inputSpacing;
    } else if (spaceAbove >= 150) {
      // More space above
      top = Math.max(navbarHeight + margin, inputRect.top - inputSpacing - Math.min(dropdownMaxHeight, spaceAbove));
    } else {
      // Limited space, use below but constrain height
      top = inputRect.bottom + inputSpacing;
    }

    // Ensure popup doesn't overlap with input
    const inputTop = inputRect.top;
    const inputBottom = inputRect.bottom;
    const popupBottom = top + Math.min(dropdownMaxHeight, 200);
    
    if (top < inputBottom + inputSpacing && popupBottom > inputTop - inputSpacing) {
      top = inputBottom + inputSpacing;
    }

    // Determine horizontal position
    if (left + dropdownWidth > viewportWidth - margin) {
      if (inputRect.right - dropdownWidth >= margin) {
        // Align to right edge of input
        left = inputRect.right - dropdownWidth;
      } else {
        // Keep left alignment but ensure it fits in viewport
        left = Math.max(margin, Math.min(left, viewportWidth - dropdownWidth - margin));
      }
    }

    // Ensure minimum margin from viewport edges
    left = Math.max(margin, left);

    return { top, left, transform };
  };

  // Update popup position when it opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setPopupPosition(calculatePopupPosition());
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Add scroll and resize listeners for dynamic positioning
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if (!dropdownRef.current || !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchValue('');
          onDropdownVisibleChange?.(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onDropdownVisibleChange]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchValue('');
        onDropdownVisibleChange?.(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onDropdownVisibleChange]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchValue) return options;
    if (typeof filterOption === 'function') {
      return options.filter(option => filterOption(searchValue, option));
    }
    if (filterOption) {
      return options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return options;
  }, [options, searchValue, filterOption, showSearch]);

  const groupedOptions = useMemo(() => {
    const grouped: { [key: string]: SelectOption[] } = {};
    const ungrouped: SelectOption[] = [];
    filteredOptions.forEach(option => {
      if (option.group) {
        if (!grouped[option.group]) grouped[option.group] = [];
        grouped[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });
    return { grouped, ungrouped };
  }, [filteredOptions]);

  const getSelectedOptions = (): SelectOption[] => {
    if (multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      return options.filter(option => values.includes(option.value));
    }
    return options.filter(option => option.value === currentValue);
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    let newValue: any;
    let selectedOption: any;

    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentArray.includes(option.value);
      newValue = isSelected
        ? currentArray.filter(v => v !== option.value)
        : [...currentArray, option.value];
      selectedOption = options.filter(opt => newValue.includes(opt.value));
    } else {
      newValue = option.value;
      selectedOption = option;
      setIsOpen(false);
      setSearchValue('');
      onDropdownVisibleChange?.(false);
    }

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, selectedOption);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = multiple ? [] : '';
    if (value === undefined) setInternalValue(newValue);
    onChange?.(newValue, multiple ? [] : undefined);
    setSearchValue('');
  };

  const handleRemoveTag = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!multiple) return;
    const newValue = (currentValue as (string | number)[]).filter(v => v !== val);
    const selectedOption = options.filter(opt => newValue.includes(opt.value));
    if (value === undefined) setInternalValue(newValue);
    onChange?.(newValue, selectedOption);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch?.(val);
    if (!isOpen) {
      setIsOpen(true);
      onDropdownVisibleChange?.(true);
    }
  };

  const handleInputClick = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      onDropdownVisibleChange?.(true);
      onFocus?.();
    }
  };

  const handleInputFocus = () => {
    if (disabled) return;
    onFocus?.();
    if (!isOpen) {
      setIsOpen(true);
      onDropdownVisibleChange?.(true);
    }
  };

  const handleInputBlur = () => {
    // Don't close immediately on blur, let click outside handle it
    onBlur?.();
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const open = !isOpen;
    setIsOpen(open);
    onDropdownVisibleChange?.(open);
    if (open) {
      onFocus?.();
      inputRef.current?.focus();
    } else {
      onBlur?.();
      setSearchValue('');
    }
  };

  const handleDropdownClose = () => {
    setIsOpen(false);
    setSearchValue('');
    onDropdownVisibleChange?.(false);
  };

  const getSizeClasses = () => ({
    small: 'min-h-[24px] px-2 text-sm',
    large: 'min-h-[40px] px-3 text-base',
    middle: 'min-h-[32px] px-3 text-sm',
  }[size]);

  const getStatusClasses = () => {
    if (status === 'error') return 'border-red-500 focus-within:border-red-500 ring-red-200';
    if (status === 'warning') return 'border-yellow-500 focus-within:border-yellow-500 ring-yellow-200';
    return 'border-gray-300 focus-within:border-blue-500 ring-blue-200';
  };

  // Calculate the right padding based on which buttons are present
  const getInputRightPadding = () => {
    const selectedOptions = getSelectedOptions();
    const hasClearButton = allowClear && selectedOptions.length > 0 && !disabled;
    const hasDropdownButton = true; // Always present
    
    if (hasClearButton && hasDropdownButton) {
      return 'pr-16'; // Space for both buttons (X + dropdown)
    } else if (hasDropdownButton) {
      return 'pr-10'; // Space for dropdown button only
    }
    return 'pr-3'; // Default padding
  };

  const renderLabel = () => {
    if (!label) return null;
    const labelContent = <span className="text-sm font-medium">{label}{isRequired ? <span className='text-red-500'> *</span> : ''}</span>;

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 cursor-help">
                {labelContent}
                <span className="text-gray-400 hover:text-gray-600"></span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return labelContent;
  };

  const renderSelectedTags = () => {
    const selected = getSelectedOptions();
    if (!multiple || !selected.length) return null;

    const displayed = maxTagCount && selected.length > maxTagCount
      ? selected.slice(0, maxTagCount)
      : selected;
    const remaining = maxTagCount && selected.length > maxTagCount
      ? selected.length - maxTagCount
      : 0;

    return (
      <div className="flex flex-wrap gap-1">
        {displayed.map(option => (
          <span 
            key={option.value} 
            className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border max-w-[120px]"
            title={`Selected: ${option.label}`} // Enhanced tooltip for tags
          >
            <span className="truncate" title={option.label}>{option.label}</span>
            <button 
              onClick={(e) => handleRemoveTag(option.value, e)} 
              className="hover:bg-blue-200 rounded p-0.5 flex-shrink-0"
              title={`Remove ${option.label}`} // Tooltip for remove button
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {remaining > 0 && (
          <span 
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border"
            title={`${remaining} more option(s) selected`} // Tooltip for remaining count
          >
            +{remaining} more
          </span>
        )}
      </div>
    );
  };

  const getInputValue = (): string => {
    if (showSearch && searchValue) {
      return searchValue;
    }
    
    if (!multiple) {
      const selected = getSelectedOptions();
      return selected[0]?.label || '';
    }
    
    return '';
  };

  const getInputPlaceholder = () => {
    const selected = getSelectedOptions();
    if (multiple && selected.length > 0) return '';
    if (!multiple && selected.length > 0 && !searchValue) {
      // Return the label for display, tooltip will show full text
      return selected[0]?.label || placeholder;
    }
    return placeholder;
  };

  const renderOption = (option: SelectOption) => {
    const isSelected = multiple
      ? Array.isArray(currentValue) && currentValue.includes(option.value)
      : currentValue === option.value;

    return (
      <div
        key={option.value}
        onClick={() => handleOptionClick(option)}
        className={`px-3 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-100
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isSelected ? 'bg-blue-50 text-blue-600' : ''}`}
        title={option.label} // Always show tooltip with full text
      >
        <span className="truncate pr-2 min-w-0 flex-1">{option.label}</span>
        {isSelected && <Check size={16} className="flex-shrink-0" />}
      </div>
    );
  };

  const renderDropdownContent = () => {
    const baseContent = (
      <div className="py-1">
        {loading ? (
          <div className="px-3 py-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <div className="mt-2">Loading...</div>
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="px-3 py-8 text-center text-gray-500">
            {notFoundContent}
          </div>
        ) : (
          <>
            {groupedOptions.ungrouped.map(renderOption)}
            {Object.entries(groupedOptions.grouped).map(([groupName, items]) => (
              <div key={groupName}>
                <div 
                  className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 border-t truncate" 
                  title={groupName}
                >
                  {groupName}
                </div>
                {items.map(renderOption)}
              </div>
            ))}
          </>
        )}
      </div>
    );

    return dropdownRender ? dropdownRender(baseContent) : baseContent;
  };

  const renderPopup = () => {
    const inputRect = selectRef.current?.getBoundingClientRect();
    
    let availableHeight = window.innerHeight - popupPosition.top - 32;
    const inputBottom = inputRect?.bottom || 0;
    const inputTop = inputRect?.top || 0;
    
    if (popupPosition.top < inputTop) {
      availableHeight = inputTop - popupPosition.top - 4;
    }
    
    const idealHeight = 300;
    const minHeight = 100;
    const maxHeight = Math.max(minHeight, Math.min(idealHeight, availableHeight));
    const needsScroll = filteredOptions.length > 8; // Approximate items that fit without scroll

    return (
      <div
        ref={dropdownRef}
        className={cn(
          "bg-white border border-gray-300 rounded-md shadow-lg",
          dropdownClassName,
          disabled && "pointer-events-none opacity-50"
        )}
        style={{
          position: 'fixed',
          top: popupPosition.top,
          left: popupPosition.left,
          zIndex: 9999,
          transform: popupPosition.transform,
          maxHeight: `${maxHeight}px`,
          width: inputRect?.width || 200, // Exact width match with input field
        }}
      >
        <div 
          className={needsScroll ? "overflow-y-auto overflow-x-hidden" : ""}
          style={{ 
            maxHeight: `${maxHeight}px`,
          }}
        >
          {renderDropdownContent()}
        </div>
      </div>
    );
  };

  return (
    <div ref={selectRef} className={cn("space-y-2" )}>
      <div className="text-sm font-medium">{renderLabel()}</div>

      <div className="relative">
        <div
          className={cn(
            "flex items-center rounded border transition-colors relative overflow-hidden",
            "min-h-[40px]",
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-blue-400",
            getStatusClasses(),className
          )}
          style={{ 
            backgroundColor: disabled ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)', 
            borderColor: 'hsl(214.29deg 31.82% 91.37%)' 
          }}
          title={
            // Show tooltip for the entire field when there's a selected value that might be truncated
            !multiple && getSelectedOptions().length > 0 
              ? `Selected: ${getSelectedOptions()[0]?.label}`
              : multiple && getSelectedOptions().length > 0
              ? `${getSelectedOptions().length} option(s) selected`
              : undefined
          }
        >
          {/* Container for content - ensures proper spacing */}
          <div className={cn("flex items-center w-full min-w-0",containerClassName)}>
            {/* Selected tags for multiple mode */}
            {multiple && getSelectedOptions().length > 0 && (
              <div className="flex-shrink-0 pl-3 py-1">
                {renderSelectedTags()}
              </div>
            )}
            
            {/* Input field with proper text overflow handling */}
            <div className={cn("flex-1 min-w-0 relative", getInputRightPadding())}>
              {!multiple && !showSearch && getSelectedOptions().length > 0 ? (
                // Show selected value with ellipsis for single select readonly mode
                <div 
                  className={cn(
                    "px-3 py-2 text-sm truncate cursor-pointer",
                    disabled && "cursor-not-allowed"
                  )}
                  onClick={handleInputClick}
                  title={getSelectedOptions()[0]?.label} // Tooltip for selected option
                >
                  {getSelectedOptions()[0]?.label || placeholder}
                </div>
              ) : (
                // Input field for search mode or empty state
                <input
                  ref={inputRef}
                  type="text"
                  value={getInputValue()}
                  onChange={showSearch ? handleInputChange : undefined}
                  onClick={handleInputClick}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={getInputPlaceholder()}
                  disabled={disabled}
                  readOnly={!showSearch}
                  className={cn(
                    "w-full bg-transparent outline-none text-sm px-3 py-2 truncate",
                    disabled && "cursor-not-allowed",
                    !showSearch && "cursor-pointer"
                  )}
                  title={
                    // Show tooltip for selected option when not in search mode
                    !showSearch && !multiple && getSelectedOptions()[0]?.label 
                      ? getSelectedOptions()[0].label 
                      : showSearch && !multiple && getSelectedOptions()[0]?.label && !searchValue
                      ? getSelectedOptions()[0].label
                      : undefined
                  }
                />
              )}
            </div>
          </div>

          {/* Clear and dropdown buttons - positioned absolutely to avoid flex issues */}
          <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-3 bg-inherit">
            {allowClear && getSelectedOptions().length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:bg-gray-200 rounded p-1 text-gray-500 flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {isOpen && !disabled && (
          <>
            {/* Backdrop for closing dropdown */}
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={handleDropdownClose} 
            />
            
            {/* Render popup */}
            {usePortal ? (
              createPortal(renderPopup(), document.body)
            ) : (
              <div className="absolute z-[9999] top-full left-0 mt-1" style={{ width: '100%' }}>
                <div
                  className={cn(
                    "bg-white border border-gray-300 rounded-md shadow-lg",
                    dropdownClassName
                  )}
                  style={{
                    minHeight: '50px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    width: '100%' // Match container width
                  }}
                >
                  {renderDropdownContent()}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(status === "error" || error) && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

ReusableDropdown.displayName = 'ReusableDropdown';
