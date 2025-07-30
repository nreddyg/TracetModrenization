import React, { forwardRef, useState, useRef, useEffect, useMemo } from 'react';
import { Check, X, ChevronDown, Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: MultiSelectOption[];
  icon?: React.ReactNode;
  description?: string;
}

export interface OptionGroup {
  label: string;
  options: MultiSelectOption[];
}

export type FilterOption = (inputValue: string, option: MultiSelectOption) => boolean;

export interface ReusableMultiSelectProps {
  // Basic props
  label?: string;
  tooltip?: string;
  error?: string;
  options?: MultiSelectOption[];
  groupedOptions?: OptionGroup[];
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  
  // Display props
  allowClear?: boolean;
  searchable?: boolean;
  selectAll?: boolean;
  maxTagCount?: number;
  maxTagTextLength?: number;
  showCount?: boolean;
  showSearch?: boolean;
  showArrow?: boolean;
  suffixIcon?: React.ReactNode;
  
  // Size and styling
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'filled' | 'borderless';
  status?: 'error' | 'warning';
  
  // Advanced features
  mode?: 'multiple' | 'tags';
  tagRender?: (props: { label: string; value: string; onClose: () => void; disabled?: boolean }) => React.ReactNode;
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
  filterOption?: boolean | FilterOption;
  filterSort?: (optionA: MultiSelectOption, optionB: MultiSelectOption) => number;
  
  // Behavior props
  autoClearSearchValue?: boolean;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  listHeight?: number;
  maxCount?: number;
  tokenSeparators?: string[];
  
  // Dropdown props
  dropdownMatchSelectWidth?: boolean | number;
  dropdownClassName?: string;
  popupClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  
  // Virtual scrolling
  virtual?: boolean;
  
  // Custom rendering
  optionRender?: (option: MultiSelectOption, info: { index: number }) => React.ReactNode;
  optionLabelProp?: string;
  
  // Styling
  containerClassName?: string;
  className?: string;
  
  // Events
  onChange?: (value: string[], options: MultiSelectOption[]) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: MultiSelectOption) => void;
  onDeselect?: (value: string, option: MultiSelectOption) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onInputKeyDown?: (e: React.KeyboardEvent) => void;
  onPopupScroll?: (e: React.UIEvent) => void;
}

export const ReusableMultiSelect = forwardRef<HTMLDivElement, ReusableMultiSelectProps>(
  ({ 
    // Basic props
    label, 
    tooltip, 
    error, 
    options = [],
    groupedOptions,
    value = [],
    placeholder = "Select options",
    disabled = false,
    loading = false,
    
    // Display props
    allowClear = true,
    searchable = true,
    selectAll = true,
    maxTagCount = 3,
    maxTagTextLength = 20,
    showCount = false,
    showSearch = true,
    showArrow = true,
    suffixIcon,
    
    // Size and styling
    size = 'middle',
    variant = 'default',
    status,
    
    // Advanced features
    mode = 'multiple',
    tagRender,
    dropdownRender,
    filterOption = true,
    filterSort,
    
    // Behavior props
    autoClearSearchValue = true,
    autoFocus = false,
    defaultOpen = false,
    listHeight = 256,
    maxCount,
    tokenSeparators = [',', ';'],
    
    // Dropdown props
    dropdownMatchSelectWidth = true,
    dropdownClassName,
    popupClassName,
    placement = 'bottomLeft',
    
    // Virtual scrolling
    virtual = false,
    
    // Custom rendering
    optionRender,
    optionLabelProp = 'label',
    
    // Styling
    containerClassName,
    className,
    
    // Events
    onChange,
    onClear,
    onSearch,
    onSelect,
    onDeselect,
    onDropdownVisibleChange,
    onFocus,
    onBlur,
    onInputKeyDown,
    onPopupScroll,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Auto focus
    useEffect(() => {
      if (autoFocus && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [autoFocus]);

    // Flatten options for easier processing
    const flatOptions = useMemo(() => {
      if (groupedOptions) {
        return groupedOptions.reduce((acc, group) => [...acc, ...group.options], [] as MultiSelectOption[]);
      }
      return options;
    }, [options, groupedOptions]);

    // Handle outside clicks and positioning
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        
        const isOtherDropdown = target instanceof Element && (
          target.closest('[data-dropdown-type="single"]') ||
          target.closest('[data-dropdown-type="multi"]')
        );
        
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
          setIsOpen(false);
          onDropdownVisibleChange?.(false);
        } else if (isOtherDropdown && !dropdownRef.current?.contains(target)) {
          setIsOpen(false);
          onDropdownVisibleChange?.(false);
        }
      };

      const handleResize = () => {
        if (isOpen && triggerRef.current) {
          updateDropdownPosition();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, { passive: true });
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }, [isOpen, onDropdownVisibleChange]);

    const updateDropdownPosition = () => {
      if (!triggerRef.current) return;
      
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      const shouldShowAbove = placement.startsWith('top') || 
        (spaceBelow < 200 && spaceAbove > spaceBelow);
      
      setDropdownPosition(shouldShowAbove ? 'top' : 'bottom');
    };

    useEffect(() => {
      if (isOpen) {
        updateDropdownPosition();
      }
    }, [isOpen, placement]);

    // Filter options based on search term
    const filterOptions = (options: MultiSelectOption[], searchTerm: string): MultiSelectOption[] => {
      if (!searchTerm || filterOption === false) return options;
      
      return options.filter(option => {
        if (typeof filterOption === 'function') {
          return filterOption(searchTerm, option);
        }
        
        const searchLower = searchTerm.toLowerCase();
        return option.label.toLowerCase().includes(searchLower) ||
               option.value.toLowerCase().includes(searchLower) ||
               option.description?.toLowerCase().includes(searchLower);
      });
    };

    const filteredOptions = useMemo(() => {
      let filtered = filterOptions(flatOptions, searchTerm);
      
      if (filterSort) {
        filtered = filtered.sort(filterSort);
      }
      
      return filtered;
    }, [flatOptions, searchTerm, filterOption, filterSort]);

    const renderLabel = () => {
      if (!label) return null;

      const labelElement = (
        <Label className={cn("text-sm font-medium", {
          "text-red-500": status === 'error' || error,
          "text-yellow-600": status === 'warning'
        })}>
          {label}
          {showCount && value.length > 0 && (
            <span className="ml-1 text-xs text-gray-500">({value.length})</span>
          )}
        </Label>
      );

      if (tooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {labelElement}
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return labelElement;
    };

    const handleOptionToggle = (optionValue: string) => {
      if (disabled) return;
      
      const option = flatOptions.find(opt => opt.value === optionValue);
      if (!option) return;

      const isSelected = value.includes(optionValue);
      let newValue: string[];
      
      if (isSelected) {
        newValue = value.filter(v => v !== optionValue);
        onDeselect?.(optionValue, option);
      } else {
        // Check max count
        if (maxCount && value.length >= maxCount) {
          return;
        }
        newValue = [...value, optionValue];
        onSelect?.(optionValue, option);
      }
      
      const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as MultiSelectOption[];
      onChange?.(newValue, selectedOptions);

      // Clear search if needed
      if (autoClearSearchValue && !isSelected) {
        setSearchTerm('');
        setInputValue('');
      }
    };

    const handleSelectAll = () => {
      const availableOptions = filteredOptions.filter(opt => !opt.disabled);
      const availableValues = availableOptions.map(opt => opt.value);
      const isAllSelected = availableValues.every(val => value.includes(val));
      
      let newValue: string[];
      if (isAllSelected) {
        newValue = value.filter(v => !availableValues.includes(v));
      } else {
        const valuesToAdd = availableValues.filter(v => !value.includes(v));
        if (maxCount) {
          const remainingSlots = maxCount - value.length;
          newValue = [...value, ...valuesToAdd.slice(0, remainingSlots)];
        } else {
          newValue = [...new Set([...value, ...availableValues])];
        }
      }
      
      const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as MultiSelectOption[];
      onChange?.(newValue, selectedOptions);
    };

    const handleClear = () => {
      onClear?.();
      onChange?.([], []);
      setSearchTerm('');
      setInputValue('');
    };

    const handleCreateTag = (tagValue: string) => {
      if (mode !== 'tags' || !tagValue.trim()) return;
      
      const trimmedValue = tagValue.trim();
      if (value.includes(trimmedValue)) return;
      
      const newOption: MultiSelectOption = {
        value: trimmedValue,
        label: trimmedValue
      };
      
      const newValue = [...value, trimmedValue];
      const selectedOptions = [...newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as MultiSelectOption[], newOption];
      
      onChange?.(newValue, selectedOptions);
      setInputValue('');
      setSearchTerm('');
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      onInputKeyDown?.(e);
      
      if (mode === 'tags' && tokenSeparators.includes(e.key)) {
        e.preventDefault();
        handleCreateTag(inputValue);
        return;
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (mode === 'tags' && inputValue) {
          handleCreateTag(inputValue);
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionToggle(filteredOptions[focusedIndex].value);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        onDropdownVisibleChange?.(false);
      }
    };

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getSelectedOptions = () => {
      return value.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as MultiSelectOption[];
    };

    const renderTag = (option: MultiSelectOption, index: number) => {
      const handleClose = () => handleOptionToggle(option.value);
      
      if (tagRender) {
        return tagRender({
          label: option.label,
          value: option.value,
          onClose: handleClose,
          disabled: disabled || option.disabled
        });
      }

      return (
        <span
          key={option.value}
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-md text-xs",
            size === 'small' && "px-1.5 py-0.5 text-xs",
            size === 'large' && "px-2.5 py-1.5 text-sm",
            variant === 'filled' ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800",
            (disabled || option.disabled) && "opacity-50"
          )}
        >
          {option.icon && <span className="mr-1">{option.icon}</span>}
          {truncateText(option.label, maxTagTextLength)}
          {!disabled && !option.disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="ml-1 hover:text-blue-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      );
    };

    const renderSelectedTags = () => {
      const selectedOptions = getSelectedOptions();
      const displayTags = selectedOptions.slice(0, maxTagCount);
      const remainingCount = selectedOptions.length - maxTagCount;

      return (
        <div className="flex flex-wrap gap-1">
          {displayTags.map((option, index) => renderTag(option, index))}
          {remainingCount > 0 && (
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600",
              size === 'small' && "px-1.5 py-0.5",
              size === 'large' && "px-2.5 py-1.5 text-sm"
            )}>
              +{remainingCount} more
            </span>
          )}
        </div>
      );
    };

    const renderOption = (option: MultiSelectOption, index: number) => {
      if (optionRender) {
        return optionRender(option, { index });
      }

      const isSelected = value.includes(option.value);
      const isFocused = index === focusedIndex;

      return (
        <div
          key={option.value}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer",
            size === 'small' && "px-2 py-1.5 text-sm",
            size === 'large' && "px-4 py-3",
            option.disabled && "opacity-50 cursor-not-allowed",
            isFocused && "bg-blue-50",
            isSelected && "bg-blue-50"
          )}
          onClick={() => !option.disabled && handleOptionToggle(option.value)}
          onMouseEnter={() => setFocusedIndex(index)}
        >
          <Checkbox
            checked={isSelected}
            onChange={() => !option.disabled && handleOptionToggle(option.value)}
            disabled={option.disabled}
          />
          {option.icon && <span className="text-gray-500">{option.icon}</span>}
          <div className="flex-1">
            <span className="text-sm">{option.label}</span>
            {option.description && (
              <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
            )}
          </div>
          {isSelected && <Check className="h-4 w-4 text-blue-500" />}
        </div>
      );
    };

    const renderDropdownMenu = () => {
      const menu = (
        <div className="max-h-60 overflow-auto" ref={listRef} onScroll={onPopupScroll}>
          {(searchable || showSearch) && (
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {mode === 'tags' && inputValue && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleCreateTag(inputValue)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create "{inputValue}"
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectAll && filteredOptions.length > 0 && (
            <div
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 sticky top-12 bg-white z-10"
              onClick={handleSelectAll}
            >
              <Checkbox
                checked={filteredOptions.filter(opt => !opt.disabled).every(opt => value.includes(opt.value))}
                // Use aria-checked for indeterminate state, since Checkbox does not support 'indeterminate' prop
                aria-checked={
                  filteredOptions.filter(opt => !opt.disabled).some(opt => value.includes(opt.value)) &&
                  !filteredOptions.filter(opt => !opt.disabled).every(opt => value.includes(opt.value))
                    ? 'mixed'
                    : undefined
                }
                onChange={handleSelectAll}
                disabled={disabled}
              />
              <span className="text-sm font-medium">
                {filteredOptions.filter(opt => !opt.disabled).every(opt => value.includes(opt.value))
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </div>
          )}
          
          <div className="p-1" style={{ maxHeight: listHeight }}>
            {groupedOptions ? (
              groupedOptions.map((group, groupIndex) => {
                const groupFilteredOptions = filterOptions(group.options, searchTerm);
                if (groupFilteredOptions.length === 0) return null;
                
                return (
                  <div key={groupIndex}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.label}
                    </div>
                    {groupFilteredOptions.map((option, optionIndex) => 
                      renderOption(option, groupIndex * 1000 + optionIndex)
                    )}
                  </div>
                );
              })
            ) : (
              filteredOptions.map((option, index) => renderOption(option, index))
            )}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  "No options found"
                )}
              </div>
            )}
          </div>
        </div>
      );

      return dropdownRender ? dropdownRender(menu) : menu;
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'small':
          return "min-h-[32px] px-2 py-1 text-sm";
        case 'large':
          return "min-h-[48px] px-4 py-3 text-base";
        default:
          return "min-h-[40px] px-3 py-2 text-sm";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'filled':
          return "bg-gray-50 border-transparent";
        case 'borderless':
          return "border-transparent shadow-none";
        default:
          return "bg-background border-input";
      }
    };

    const getStatusClasses = () => {
      if (error || status === 'error') {
        return "border-red-500 focus:border-red-500 focus:ring-red-200";
      }
      if (status === 'warning') {
        return "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200";
      }
      return "focus:ring-blue-200";
    };

    const handleDropdownToggle = () => {
      if (disabled) return;
      const newOpen = !isOpen;
      setIsOpen(newOpen);
      onDropdownVisibleChange?.(newOpen);
      
      if (newOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    };

    const dropdownWidth = dropdownMatchSelectWidth === true 
      ? '100%' 
      : typeof dropdownMatchSelectWidth === 'number' 
        ? `${dropdownMatchSelectWidth}px` 
        : 'auto';

    return (
      <div className={cn("space-y-2", containerClassName)} ref={ref} {...props}>
        {renderLabel()}
        <div className="relative" ref={dropdownRef} data-dropdown-type="multi">
          <div
            ref={triggerRef}
            className={cn(
              "w-full rounded-md border cursor-pointer transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              getSizeClasses(),
              getVariantClasses(),
              getStatusClasses(),
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            onClick={handleDropdownToggle}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={disabled ? -1 : 0}
          >
            <div className="flex items-center justify-between min-h-[24px]">
              <div className="flex-1 min-w-0">
                {value.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                  renderSelectedTags()
                )}
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                {status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {allowClear && value.length > 0 && !loading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {showArrow && (suffixIcon || <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />)}
              </div>
            </div>
          </div>

          {isOpen && (
            <div 
              className={cn(
                "absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden",
                dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
                dropdownClassName,
                popupClassName
              )}
              style={{ 
                position: 'absolute', 
                zIndex: 9999,
                width: dropdownWidth,
                maxHeight: listHeight + 100
              }}
            >
              {renderDropdownMenu()}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{error}</p>}
      </div>
    );
  }
);

ReusableMultiSelect.displayName = "ReusableMultiSelect";