import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check } from 'lucide-react';

// Mock Tooltip components for demonstration
const TooltipProvider = ({ children }) => children;
const Tooltip = ({ children }) => children;
const TooltipTrigger = ({ children, asChild }) => asChild ? children : <div>{children}</div>;
const TooltipContent = ({ children }) => <div className="bg-black text-white p-2 rounded text-sm">{children}</div>;

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

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
  containerClassName?: string;
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
  usePortal?: boolean;
}

interface PopupPosition {
  top: number;
  left: number;
  width: number;
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
  usePortal = true,
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
    width: 0,
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentValue = value !== undefined ? value : internalValue;

  // Smart position calculation - prefers below, but goes above if no space below
  const calculatePopupPosition = (): PopupPosition => {
    if (!selectRef.current) {
      return { top: 0, left: 0, width: 0 };
    }

    const inputRect = selectRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Use exact input width and position - no horizontal constraints
    const dropdownWidth = inputRect.width;
    const dropdownMaxHeight = 300; // Fixed dropdown height
    const inputSpacing = 2; // Minimal gap between input and dropdown

    // Calculate available space
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    let top: number;
    
    // Smart vertical positioning logic:
    // 1. If there's enough space below (at least 100px for minimal dropdown), position below
    // 2. If not enough space below but there's space above, position above
    // 3. If no space in either direction, still position below (will go off-screen)
    
    if (spaceBelow >= 100) {
      // Enough space below - position below the input
      top = inputRect.bottom + inputSpacing;
    } else if (spaceAbove >= 100) {
      // Not enough space below but space above - position above the input
      top = inputRect.top - inputSpacing - dropdownMaxHeight;
    } else {
      // No adequate space in either direction - default to below (off-screen)
      top = inputRect.bottom + inputSpacing;
    }

    const left = inputRect.left; // No horizontal constraints
    const width = dropdownWidth;

    return { 
      top, 
      left, 
      width 
    };
  };

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen && selectRef.current) {
      // Calculate position immediately
      setPopupPosition(calculatePopupPosition());
      
      // Also recalculate after a tiny delay to handle any layout shifts
      const timer = setTimeout(() => {
        setPopupPosition(calculatePopupPosition());
      }, 1);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Simplified scroll and resize handlers
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideSelect = selectRef.current && !selectRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      
      if (isOutsideSelect && isOutsideDropdown) {
        setIsOpen(false);
        setSearchValue('');
        onDropdownVisibleChange?.(false);
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
        selectRef.current?.focus();
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

  const getInputRightPadding = () => {
    const selectedOptions = getSelectedOptions();
    const hasClearButton = allowClear && selectedOptions.length > 0 && !disabled;
    const hasDropdownButton = true;
    
    if (hasClearButton && hasDropdownButton) {
      return 'pr-16';
    } else if (hasDropdownButton) {
      return 'pr-10';
    }
    return 'pr-3';
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
            title={`Selected: ${option.label}`}
          >
            <span className="truncate" title={option.label}>{option.label}</span>
            <button 
              onClick={(e) => handleRemoveTag(option.value, e)} 
              className="hover:bg-blue-200 rounded p-0.5 flex-shrink-0"
              title={`Remove ${option.label}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {remaining > 0 && (
          <span 
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border"
            title={`${remaining} more option(s) selected`}
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
        title={option.label}
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
    // Fixed height without viewport constraints
    const maxHeight = 300;

    return (
      <div
        ref={dropdownRef}
        className={cn(
          "bg-white border border-gray-300 rounded-md shadow-lg z-[9999]",
          dropdownClassName,
          disabled && "pointer-events-none opacity-50"
        )}
        style={{
          position: 'fixed',
          top: popupPosition.top,
          left: popupPosition.left,
          width: popupPosition.width,
          maxHeight: `${maxHeight}px`,
          zIndex: 9999,
        }}
      >
        <div 
          className="overflow-y-auto overflow-x-hidden"
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
    <div ref={selectRef} className={cn("space-y-2")}>
      <div className="text-sm font-medium">{renderLabel()}</div>

      <div className="relative">
        <div
          className={cn(
            "flex items-center rounded border transition-colors relative overflow-hidden",
            "min-h-[40px]",
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-blue-400",
            getStatusClasses(),
            className
          )}
          style={{ 
            backgroundColor: disabled ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)', 
            borderColor: 'hsl(214.29deg 31.82% 91.37%)' 
          }}
          title={
            !multiple && getSelectedOptions().length > 0 
              ? `Selected: ${getSelectedOptions()[0]?.label}`
              : multiple && getSelectedOptions().length > 0
              ? `${getSelectedOptions().length} option(s) selected`
              : undefined
          }
        >
          <div className={cn("flex items-center w-full min-w-0", containerClassName)}>
            {multiple && getSelectedOptions().length > 0 && (
              <div className="flex-shrink-0 pl-3 py-1">
                {renderSelectedTags()}
              </div>
            )}
            
            <div className={cn("flex-1 min-w-0 relative", getInputRightPadding())}>
              {!multiple && !showSearch && getSelectedOptions().length > 0 ? (
                <div 
                  className={cn(
                    "px-3 py-2 text-sm truncate cursor-pointer",
                    disabled && "cursor-not-allowed"
                  )}
                  onClick={handleInputClick}
                  title={getSelectedOptions()[0]?.label}
                >
                  {getSelectedOptions()[0]?.label || placeholder}
                </div>
              ) : (
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
                    dropdownClassName
                  )}
                  style={{
                    minHeight: '50px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    width: '100%'
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

// Demo component to show the unconstrained behavior
const DropdownDemo = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState([]);

  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Very Long Option Name That Might Overflow', value: '3' },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
    { label: 'Option 6', value: '6' },
    { label: 'Option 7', value: '7' },
    { label: 'Option 8', value: '8' },
    { label: 'Option 9', value: '9' },
    { label: 'Option 10', value: '10' },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Smart Positioning Dropdown Demo</h1>
        <p className="text-center text-gray-600 mb-8">
          The dropdown intelligently positions above/below based on available space, but can still go off-screen when needed.
        </p>
        
        {/* Dropdowns positioned at different screen locations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Left Side</h3>
            <ReusableDropdown
              label="Select option"
              placeholder="Choose..."
              options={options}
              showSearch
              allowClear
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Center</h3>
            <ReusableDropdown
              label="Multiple Select"
              placeholder="Choose multiple..."
              options={options}
              multiple
              showSearch
              allowClear
              maxTagCount={2}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Right Side</h3>
            <ReusableDropdown
              label="Right dropdown"
              placeholder="This can go off-screen..."
              options={options}
              showSearch
              allowClear
            />
          </div>
        </div>

        {/* Bottom positioned dropdowns */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Smart Positioning Test</h2>
          <p className="mb-4 text-gray-600">
            These dropdowns will appear above when there's no space below, but below when there is space.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ReusableDropdown
              label="Has Space Below"
              placeholder="Should appear below"
              options={options}
              showSearch
              allowClear
            />
            <ReusableDropdown
              label="Also Has Space"
              placeholder="Also below"
              options={options}
              multiple
              showSearch
              allowClear
            />
          </div>
        </div>

        {/* Near bottom test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Near Bottom Test</h3>
          <p className="mb-4 text-gray-600">
            Scroll to the very bottom to see dropdowns that will appear above the input field.
          </p>
          
          {/* Add significant spacing to push content near viewport bottom */}
          <div style={{ height: '70vh' }} className="flex flex-col justify-end space-y-4">
            <ReusableDropdown
              label="Should Appear Above (if at bottom)"
              placeholder="Check if this opens upward"
              options={options}
              showSearch
              allowClear
            />
            
            <ReusableDropdown
              label="Multiple Select Near Bottom"
              placeholder="This should also open upward"
              options={options}
              multiple
              showSearch
              allowClear
              maxTagCount={2}
            />
          </div>
        </div>

        {/* Final bottom test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Final Bottom Test</h3>
          <p className="mb-4 text-gray-600">
            These are positioned at the very bottom - they should definitely open upward.
          </p>
          
          <div className="space-y-4">
            <ReusableDropdown
              label="Definitely Opens Above"
              placeholder="Should open upward"
              options={options}
              showSearch
              allowClear
            />
            
            <ReusableDropdown
              label="Last Dropdown"
              placeholder="Final test - opens above"
              options={options}
              showSearch
              allowClear
            />
          </div>
          
          {/* Small bottom margin to ensure we're really at the bottom */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default DropdownDemo;