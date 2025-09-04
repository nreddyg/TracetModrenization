import React, { forwardRef, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Check, X, ChevronDown, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';
import { Options } from '@/Local_DB/types/types';

export interface OptionGroup {
  label: string;
  options: Options[];
}

export type FilterOption = (inputValue: string, option: Options) => boolean;

// Type for grouped selections
export type GroupedSelections = Record<string, string[]>;

// Helper function to convert grouped selections back to flat array
export const flattenGroupedSelections = (groupedSelections: GroupedSelections): string[] => {
  return (Object.values(groupedSelections) as string[][]).flat();
};

// Helper function to convert flat array to grouped selections
export const convertToGroupedSelections = (flatValues: string[], groupedOptions: OptionGroup[]): GroupedSelections => {
  const grouped: GroupedSelections = {};
  
  // Initialize all groups
  groupedOptions.forEach(group => {
    grouped[group.label] = [];
  });
  
  // Distribute values to their respective groups
  flatValues.forEach(value => {
    for (const group of groupedOptions) {
      const option = group.options.find(opt => opt.value === value);
      if (option) {
        grouped[group.label].push(value);
        break;
      }
    }
  });
  
  return grouped;
};

export interface ReusableMultiSelectProps {
  // Basic props
  label?: string;
  tooltip?: string;
  isRequired?: boolean;
  error?: string;
  options?: Options[];
  groupedOptions?: OptionGroup[];
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  
  // Display props
  allowClear?: boolean;
  searchable?: boolean;
  selectAll?: boolean;
  groupSelectAll?: boolean;
  maxTagCount?: number;
  maxTagTextLength?: number;
  showCount?: boolean;
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
  filterSort?: (optionA: Options, optionB: Options) => number;
  
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
  optionRender?: (option: Options, info: { index: number }) => React.ReactNode;
  optionLabelProp?: string;
  
  // Styling
  containerClassName?: string;
  className?: string;
  
  // Events
  onChange?: (value: string[] | GroupedSelections, options: Options[]) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: Options) => void;
  onDeselect?: (value: string, option: Options) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onInputKeyDown?: (e: React.KeyboardEvent) => void;
  onPopupScroll?: (e: React.UIEvent) => void;
  onGroupSelectAll?: (groupLabel: string, selected: boolean, options: Options[]) => void;
}

export const ReusableMultiSelect = forwardRef<HTMLDivElement, ReusableMultiSelectProps>(
  ({ 
    // Basic props
    label, 
    tooltip, 
    isRequired = false,
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
    groupSelectAll = true,
    maxTagCount = 1,
    maxTagTextLength = 2,
    showCount = false,
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
    onGroupSelectAll,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Normalize value to always be an array
    const normalizedValue = useMemo(() => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'object') {
        return (Object.values(value as GroupedSelections) as string[][]).flat();
      }
      return [];
    }, [value]);

    // Flatten options for easier processing
    const flatOptions = useMemo(() => {
      if (groupedOptions) {
        return groupedOptions.reduce((acc, group) => [...acc, ...group.options], [] as Options[]);
      }
      return options;
    }, [options, groupedOptions]);

    // Memoized onChange handler
    const handleChange = useCallback((newValue: string[]) => {
      const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
      
      if (groupedOptions && onChange) {
        const groupedSelections = convertToGroupedSelections(newValue, groupedOptions);
        onChange(groupedSelections, selectedOptions);
      } else if (onChange) {
        onChange(newValue, selectedOptions);
      }
    }, [onChange, groupedOptions, flatOptions]);

    // Auto focus
    useEffect(() => {
      if (autoFocus && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [autoFocus]);

    // Handle outside clicks and positioning
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
          setIsOpen(false);
          setIsSearching(false);
          setSearchTerm('');
          onDropdownVisibleChange?.(false);
        }
      };

      const handleResize = () => {
        if (isOpen && triggerRef.current) {
          updateDropdownPosition();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, { passive: true });
      }
      
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
    const filterOptions = useCallback((options: Options[], searchTerm: string): Options[] => {
      if (!searchTerm || filterOption === false) return options;
      
      return options.filter(option => {
        if (typeof filterOption === 'function') {
          return filterOption(searchTerm, option);
        }
        
        const searchLower = searchTerm.toLowerCase();
        return option.label.toString().toLowerCase().includes(searchLower) ||
               option.value.toString().toLowerCase().includes(searchLower) ||
               option.description?.toString().toLowerCase().includes(searchLower);
      });
    }, [filterOption]);

    const filteredOptions = useMemo(() => {
      let filtered = filterOptions(flatOptions, searchTerm);
      
      if (filterSort) {
        filtered = filtered.sort(filterSort);
      }
      
      return filtered;
    }, [flatOptions, searchTerm, filterOptions, filterSort]);

    const renderLabel = () => {
      if (!label) return null;

      const labelElement = (
        <Label className={cn("text-sm font-medium")}>
          {label}{isRequired ? <span className='text-red-500'> *</span> : ''}
          {showCount && normalizedValue.length > 0 && (
            <span className="ml-1 text-xs text-gray-500">({normalizedValue.length})</span>
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

    const handleOptionToggle = useCallback((optionValue: string) => {
      if (disabled) return;
      
      const option = flatOptions.find(opt => opt.value === optionValue);
      if (!option) return;

      const isSelected = normalizedValue.includes(optionValue);
      let newValue: string[];
      
      if (isSelected) {
        newValue = normalizedValue.filter(v => v !== optionValue);
        onDeselect?.(optionValue, option);
      } else {
        if (maxCount && normalizedValue.length >= maxCount) {
          return;
        }
        newValue = [...normalizedValue, optionValue];
        onSelect?.(optionValue, option);
      }
      
      handleChange(newValue);

      if (autoClearSearchValue && !isSelected) {
        setSearchTerm('');
        setIsSearching(false);
      }
    }, [disabled, flatOptions, normalizedValue, maxCount, onDeselect, onSelect, handleChange, autoClearSearchValue]);

    const handleSelectAll = useCallback(() => {
      const availableOptions = filteredOptions.filter(opt => !opt.disabled);
      const availableValues = availableOptions.map(opt => opt.value);
      const isAllSelected = availableValues.every(val => normalizedValue.includes(val));
      
      let newValue: string[];
      if (isAllSelected) {
        newValue = normalizedValue.filter(v => !availableValues.includes(v));
      } else {
        const valuesToAdd = availableValues.filter(v => !normalizedValue.includes(v));
        if (maxCount) {
          const remainingSlots = maxCount - normalizedValue.length;
          newValue = [...normalizedValue, ...valuesToAdd.slice(0, remainingSlots)];
        } else {
          newValue = [...new Set([...normalizedValue, ...availableValues])];
        }
      }
      
      handleChange(newValue);
    }, [filteredOptions, normalizedValue, maxCount, handleChange]);

    const handleGroupSelectAll = useCallback((groupOptions: Options[], groupLabel: string) => {
      const availableGroupOptions = groupOptions.filter(opt => !opt.disabled);
      const availableGroupValues = availableGroupOptions.map(opt => opt.value);
      const isGroupAllSelected = availableGroupValues.every(val => normalizedValue.includes(val));
      
      let newValue: string[];
      if (isGroupAllSelected) {
        newValue = normalizedValue.filter(v => !availableGroupValues.includes(v));
      } else {
        const valuesToAdd = availableGroupValues.filter(v => !normalizedValue.includes(v));
        if (maxCount) {
          const remainingSlots = maxCount - normalizedValue.length;
          newValue = [...normalizedValue, ...valuesToAdd.slice(0, remainingSlots)];
        } else {
          newValue = [...new Set([...normalizedValue, ...availableGroupValues])];
        }
      }
      
      handleChange(newValue);
      onGroupSelectAll?.(groupLabel, !isGroupAllSelected, availableGroupOptions);
    }, [normalizedValue, maxCount, handleChange, onGroupSelectAll]);

    const handleClear = useCallback(() => {
      onClear?.();
      handleChange([]);
      setSearchTerm('');
      setIsSearching(false);
    }, [onClear, handleChange]);

    const handleCreateTag = useCallback((tagValue: string) => {
      if (mode !== 'tags' || !tagValue.trim()) return;
      
      const trimmedValue = tagValue.trim();
      if (normalizedValue.includes(trimmedValue)) return;
      
      const newValue = [...normalizedValue, trimmedValue];
      handleChange(newValue);
      setSearchTerm('');
      setIsSearching(false);
    }, [mode, normalizedValue, handleChange]);

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      onInputKeyDown?.(e);
      
      if (mode === 'tags' && tokenSeparators.includes(e.key)) {
        e.preventDefault();
        handleCreateTag(searchTerm);
        return;
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (mode === 'tags' && searchTerm) {
          handleCreateTag(searchTerm);
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionToggle(filteredOptions[focusedIndex].value);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          onDropdownVisibleChange?.(true);
        }
        setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          onDropdownVisibleChange?.(true);
        }
        setFocusedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setIsSearching(false);
        setSearchTerm('');
        onDropdownVisibleChange?.(false);
      } else if (e.key === 'Backspace' && searchTerm === '' && normalizedValue.length > 0) {
        const lastValue = normalizedValue[normalizedValue.length - 1];
        handleOptionToggle(lastValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);
      setIsSearching(true);
      onSearch?.(newValue);
      
      if (!isOpen && newValue) {
        setIsOpen(true);
        onDropdownVisibleChange?.(true);
      }
    };

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getSelectedOptions = () => {
      return normalizedValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
    };

    const renderTag = (option: Options, index: number) => {
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

    // Fixed checkbox that maintains its shape and doesn't get squeezed
    const SimpleCheckbox = ({ checked, disabled: checkboxDisabled }: { checked: boolean; disabled?: boolean }) => (
      <div
        className={cn(
          "w-4 h-4 border rounded flex items-center justify-center flex-shrink-0",
          checked ? "bg-blue-500 border-blue-500" : "border-gray-300",
          checkboxDisabled && "opacity-50"
        )}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    );

    // Helper function to check if text should be truncated
    const shouldTruncateText = (text: string, maxChars: number = 40) => {
      return text.length > maxChars;
    };

    // Render option with ellipsis and tooltip for long text
    const renderOptionContent = (option: Options) => {
      const labelText = option.label;
      const shouldTruncate = shouldTruncateText(labelText);
      
      const optionContent = (
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-sm block",
            shouldTruncate && "truncate"
          )}>
            {labelText}
          </span>
          {option.description && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">{option.description}</div>
          )}
        </div>
      );

      if (shouldTruncate) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {optionContent}
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p className="max-w-xs">{labelText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return optionContent;
    };

    const renderOption = (option: Options, index: number) => {
      if (optionRender) {
        return optionRender(option, { index });
      }

      const isSelected = normalizedValue.includes(option.value);
      const isFocused = index === focusedIndex;

      return (
        <div
          key={option.value}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer",
            size === 'small' && "px-2 py-1.5 text-sm",
            size === 'large' && "px-4 py-3",
            option.disabled && " bg-gray-100 cursor-not-allowed",
            isFocused && "bg-blue-50",
            isSelected && "bg-blue-50"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!option.disabled) {
              handleOptionToggle(option.value);
            }
          }}
          onMouseEnter={() => setFocusedIndex(index)}
        >
          <SimpleCheckbox checked={isSelected} disabled={option.disabled} />
          {option.icon && <span className="text-gray-500 flex-shrink-0">{option.icon}</span>}
          {renderOptionContent(option)}
          {isSelected && <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />}
        </div>
      );
    };

    const renderGroupSelectAll = (groupOptions: Options[], groupLabel: string) => {
      const availableGroupOptions = groupOptions.filter(opt => !opt.disabled);
      const availableGroupValues = availableGroupOptions.map(opt => opt.value);
      const isGroupAllSelected = availableGroupValues.every(val => normalizedValue.includes(val));

      return (
        <div
          className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 bg-gray-50/50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleGroupSelectAll(groupOptions, groupLabel);
          }}
        >
          <SimpleCheckbox 
            checked={isGroupAllSelected} 
            disabled={disabled || availableGroupOptions.length === 0} 
          />
          <span className="text-xs font-medium text-gray-600 flex-1 min-w-0 truncate">
            {isGroupAllSelected
              ? `Deselect All in ${groupLabel}`
              : `Select All in ${groupLabel}`}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            ({availableGroupOptions.filter(opt => normalizedValue.includes(opt.value)).length}/{availableGroupOptions.length})
          </span>
        </div>
      );
    };

    const renderDropdownMenu = () => {
      const menu = (
        <div className="max-h-60 overflow-auto" ref={listRef} onScroll={onPopupScroll}>
          {selectAll && filteredOptions.length > 0 && (
            <div
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 sticky top-0 bg-white z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectAll();
              }}
            >
              <SimpleCheckbox
                checked={filteredOptions.filter(opt => !opt.disabled).every(opt => normalizedValue.includes(opt.value))}
                disabled={disabled}
              />
              <span className="text-sm font-medium">
                {filteredOptions.filter(opt => !opt.disabled).every(opt => normalizedValue.includes(opt.value))
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </div>
          )}
          
          <div className="p-1" style={{ maxHeight: listHeight }}>
            {mode === 'tags' && searchTerm && !filteredOptions.some(opt => opt.value === searchTerm) && (
              <div
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                onClick={() => handleCreateTag(searchTerm)}
              >
                <Plus className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600">Create "{searchTerm}"</span>
              </div>
            )}
            
            {groupedOptions ? (
              groupedOptions.map((group, groupIndex) => {
                const groupFilteredOptions = filterOptions(group.options, searchTerm);
                if (groupFilteredOptions.length === 0) return null;
                
                return (
                  <div key={groupIndex}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.label}
                    </div>
                    {groupSelectAll && renderGroupSelectAll(groupFilteredOptions, group.label)}
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
                ) : searchTerm ? (
                  `No options found for "${searchTerm}"`
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
        return "border-red-500 focus-within:border-red-500 focus-within:ring-red-200";
      }
      if (status === 'warning') {
        return "border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-200";
      }
      return "";
    };

    const handleContainerClick = (e: React.MouseEvent) => {
      if (disabled) return;
      
      // Don't open if clicking on a tag's close button
      if ((e.target as HTMLElement).closest('button')) return;
      
      if (!isOpen) {
        setIsOpen(true);
        onDropdownVisibleChange?.(true);
      }
      
      // Focus the search input
      if (searchable && searchInputRef.current) {
        searchInputRef.current.focus();
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
              "w-full rounded-md border cursor-text transition-colors",
              "focus-within:outline-none focus-within:ring-2 ",
              getSizeClasses(),
              getVariantClasses(),
              getStatusClasses(),
              disabled && "cursor-not-allowed  bg-gray-100",
              className
            )}
            onClick={handleContainerClick}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <div className="flex items-center justify-between min-h-[24px]">
              <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1">
                {normalizedValue.length > 0 && renderSelectedTags()}
                
                {searchable && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={normalizedValue.length === 0 ? placeholder : ''}
                    disabled={disabled}
                    className={cn(
                      "flex-1 min-w-[120px] bg-transparent border-none outline-none",
                      "placeholder:text-muted-foreground",
                      size === 'small' && "text-sm",
                      size === 'large' && "text-base",
                      disabled && "cursor-not-allowed  bg-gray-100"
                    )}
                    style={{ minWidth: isSearching || normalizedValue.length === 0 ? '120px' : '60px' }}
                  />
                )}
                
                {!searchable && normalizedValue.length === 0 && (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                {status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {allowClear && normalizedValue.length > 0 && !loading && (
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
        {error && <p className="text-xs text-red-500 flex items-center">{error}</p>}
      </div>
    );
  }
);

ReusableMultiSelect.displayName = "ReusableMultiSelect";




// import React, { forwardRef, useState, useRef, useEffect, useMemo } from 'react';
// import { Check, X, ChevronDown, Plus, Loader2, AlertCircle } from 'lucide-react';
// import { Label } from './label';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
// import { Checkbox } from './checkbox';
// import { cn } from '@/lib/utils';
// import { Options } from '@/Local_DB/types/types';

// export interface OptionGroup {
//   label: string;
//   options: Options[];
// }

// export type FilterOption = (inputValue: string, option: Options) => boolean;

// // NEW: Type for grouped selections
// export type GroupedSelections = Record<string, string[]>;

// // NEW: Helper function to convert grouped selections back to flat array
// export const flattenGroupedSelections = (groupedSelections: GroupedSelections): string[] => {
//   return (Object.values(groupedSelections) as string[][]).flat();
// };

// // NEW: Helper function to convert flat array to grouped selections (requires groupedOptions)
// export const convertToGroupedSelections = (flatValues: string[], groupedOptions: OptionGroup[]): GroupedSelections => {
//   const grouped: GroupedSelections = {};
  
//   // Initialize all groups
//   groupedOptions.forEach(group => {
//     grouped[group.label] = [];
//   });
  
//   // Distribute values to their respective groups
//   flatValues.forEach(value => {
//     for (const group of groupedOptions) {
//       const option = group.options.find(opt => opt.value === value);
//       if (option) {
//         grouped[group.label].push(value);
//         break;
//       }
//     }
//   });
  
//   return grouped;
// };

// export interface ReusableMultiSelectProps {
//   // Basic props
//   label?: string;
//   tooltip?: string;
//   isRequired?:boolean;
//   error?: string;
//   options?: Options[];
//   groupedOptions?: OptionGroup[];
//   value?: string[]; // IMPORTANT: Always expects string[] format, even when using grouped options
//   placeholder?: string;
//   disabled?: boolean;
//   loading?: boolean;
  
//   // Display props
//   allowClear?: boolean;
//   searchable?: boolean;
//   selectAll?: boolean;
//   groupSelectAll?: boolean; // NEW: Controls individual group select all
//   maxTagCount?: number;
//   maxTagTextLength?: number;
//   showCount?: boolean;
//   showArrow?: boolean;
//   suffixIcon?: React.ReactNode;
  
//   // Size and styling
//   size?: 'small' | 'middle' | 'large';
//   variant?: 'default' | 'filled' | 'borderless';
//   status?: 'error' | 'warning';
  
//   // Advanced features
//   mode?: 'multiple' | 'tags';
//   tagRender?: (props: { label: string; value: string; onClose: () => void; disabled?: boolean }) => React.ReactNode;
//   dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
//   filterOption?: boolean | FilterOption;
//   filterSort?: (optionA: Options, optionB: Options) => number;
  
//   // Behavior props
//   autoClearSearchValue?: boolean;
//   autoFocus?: boolean;
//   defaultOpen?: boolean;
//   listHeight?: number;
//   maxCount?: number;
//   tokenSeparators?: string[];
  
//   // Dropdown props
//   dropdownMatchSelectWidth?: boolean | number;
//   dropdownClassName?: string;
//   popupClassName?: string;
//   placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  
//   // Virtual scrolling
//   virtual?: boolean;
  
//   // Custom rendering
//   optionRender?: (option: Options, info: { index: number }) => React.ReactNode;
//   optionLabelProp?: string;
  
//   // Styling
//   containerClassName?: string;
//   className?: string;
  
//   // Events
//   onChange?: (value: string[] | GroupedSelections, options: Options[]) => void; // UPDATED: Can return grouped selections
//   onClear?: () => void;
//   onSearch?: (value: string) => void;
//   onSelect?: (value: string, option: Options) => void;
//   onDeselect?: (value: string, option: Options) => void;
//   onDropdownVisibleChange?: (open: boolean) => void;
//   onFocus?: (e: React.FocusEvent) => void;
//   onBlur?: (e: React.FocusEvent) => void;
//   onInputKeyDown?: (e: React.KeyboardEvent) => void;
//   onPopupScroll?: (e: React.UIEvent) => void;
//   onGroupSelectAll?: (groupLabel: string, selected: boolean, options: Options[]) => void; // NEW: Group select all event
// }

// export const ReusableMultiSelect = forwardRef<HTMLDivElement, ReusableMultiSelectProps>(
//   ({ 
//     // Basic props
//     label, 
//     tooltip, 
//     isRequired=false,
//     error, 
//     options = [],
//     groupedOptions,
//     value = [],
//     placeholder = "Select options",
//     disabled = false,
//     loading = false,
    
//     // Display props
//     allowClear = true,
//     searchable = true,
//     selectAll = true,
//     groupSelectAll = true, // NEW: Default to true
//     maxTagCount = 1,
//     maxTagTextLength = 2,
//     showCount = false,
//     showArrow = true,
//     suffixIcon,
    
//     // Size and styling
//     size = 'middle',
//     variant = 'default',
//     status,
    
//     // Advanced features
//     mode = 'multiple',
//     tagRender,
//     dropdownRender,
//     filterOption = true,
//     filterSort,
    
//     // Behavior props
//     autoClearSearchValue = true,
//     autoFocus = false,
//     defaultOpen = false,
//     listHeight = 256,
//     maxCount,
//     tokenSeparators = [',', ';'],
    
//     // Dropdown props
//     dropdownMatchSelectWidth = true,
//     dropdownClassName,
//     popupClassName,
//     placement = 'bottomLeft',
    
//     // Virtual scrolling
//     virtual = false,
    
//     // Custom rendering
//     optionRender,
//     optionLabelProp = 'label',
    
//     // Styling
//     containerClassName,
//     className,
    
//     // Events
//     onChange,
//     onClear,
//     onSearch,
//     onSelect,
//     onDeselect,
//     onDropdownVisibleChange,
//     onFocus,
//     onBlur,
//     onInputKeyDown,
//     onPopupScroll,
//     onGroupSelectAll, // NEW: Group select all event handler
//     ...props 
//   }, ref) => {
//     const [isOpen, setIsOpen] = useState(defaultOpen);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
//     const [focusedIndex, setFocusedIndex] = useState(-1);
//     const [isSearching, setIsSearching] = useState(false);
    
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const triggerRef = useRef<HTMLDivElement>(null);
//     const searchInputRef = useRef<HTMLInputElement>(null);
//     const listRef = useRef<HTMLDivElement>(null);

//     // Normalize value to always be an array
//     const normalizedValue = useMemo(() => {
//       if (!value) return [];
//       if (Array.isArray(value)) return value;
//       // If value is a grouped selection object, flatten it
//       if (typeof value === 'object') {
//         return (Object.values(value as GroupedSelections) as string[][]).flat();
//       }
//       return [];
//     }, [value]);

//     // Auto focus
//     useEffect(() => {
//       if (autoFocus && searchInputRef.current) {
//         searchInputRef.current.focus();
//       }
//     }, [autoFocus]);

//     // Flatten options for easier processing
//     const flatOptions = useMemo(() => {
//       if (groupedOptions) {
//         return groupedOptions.reduce((acc, group) => [...acc, ...group.options], [] as Options[]);
//       }
//       return options;
//     }, [options, groupedOptions]);

//     // NEW: Helper function to convert flat array to grouped selections
//     const convertToGroupedSelections = (selectedValues: string[]): GroupedSelections => {
//       if (!groupedOptions) return {};
      
//       const grouped: GroupedSelections = {};
      
//       // Initialize all groups
//       groupedOptions.forEach(group => {
//         grouped[group.label] = [];
//       });
      
//       // Distribute selected values to their respective groups
//       selectedValues.forEach(value => {
//         for (const group of groupedOptions) {
//           const option = group.options.find(opt => opt.value === value);
//           if (option) {
//             grouped[group.label].push(value);
//             break;
//           }
//         }
//       });
      
//       return grouped;
//     };

//     // NEW: Helper function to trigger onChange with appropriate format
//     const triggerOnChange = (newValue: string[], selectedOptions: Options[]) => {
//       if (groupedOptions) {
//         const groupedSelections = convertToGroupedSelections(newValue);
//         onChange?.(groupedSelections, selectedOptions);
//       } else {
//         onChange?.(newValue, selectedOptions);
//       }
//     };

//     // Handle outside clicks and positioning
//     useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         const target = event.target as Node;
        
//         const isOtherDropdown = target instanceof Element && (
//           target.closest('[data-dropdown-type="single"]') ||
//           target.closest('[data-dropdown-type="multi"]')
//         );
        
//         if (dropdownRef.current && !dropdownRef.current.contains(target)) {
//           setIsOpen(false);
//           setIsSearching(false);
//           setSearchTerm('');
//           onDropdownVisibleChange?.(false);
//         } else if (isOtherDropdown && !dropdownRef.current?.contains(target)) {
//           setIsOpen(false);
//           setIsSearching(false);
//           setSearchTerm('');
//           onDropdownVisibleChange?.(false);
//         }
//       };

//       const handleResize = () => {
//         if (isOpen && triggerRef.current) {
//           updateDropdownPosition();
//         }
//       };

//       document.addEventListener('mousedown', handleClickOutside);
//       window.addEventListener('resize', handleResize);
//       window.addEventListener('scroll', handleResize, { passive: true });
      
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//         window.removeEventListener('resize', handleResize);
//         window.removeEventListener('scroll', handleResize);
//       };
//     }, [isOpen, onDropdownVisibleChange]);

//     const updateDropdownPosition = () => {
//       if (!triggerRef.current) return;
      
//       const rect = triggerRef.current.getBoundingClientRect();
//       const spaceBelow = window.innerHeight - rect.bottom;
//       const spaceAbove = rect.top;
      
//       const shouldShowAbove = placement.startsWith('top') || 
//         (spaceBelow < 200 && spaceAbove > spaceBelow);
      
//       setDropdownPosition(shouldShowAbove ? 'top' : 'bottom');
//     };

//     useEffect(() => {
//       if (isOpen) {
//         updateDropdownPosition();
//       }
//     }, [isOpen, placement]);

//     // Filter options based on search term
//     const filterOptions = (options: Options[], searchTerm: string): Options[] => {
//       if (!searchTerm || filterOption === false) return options;
      
//       return options.filter(option => {
//         if (typeof filterOption === 'function') {
//           return filterOption(searchTerm, option);
//         }
        
//         const searchLower = searchTerm.toLowerCase();
//         return option.label.toString().toLowerCase().includes(searchLower) ||
//                option.value.toString().toLowerCase().includes(searchLower) ||
//                option.description?.toString().toLowerCase().includes(searchLower);
//       });
//     };

//     const filteredOptions = useMemo(() => {
//       let filtered = filterOptions(flatOptions, searchTerm);
      
//       if (filterSort) {
//         filtered = filtered.sort(filterSort);
//       }
      
//       return filtered;
//     }, [flatOptions, searchTerm, filterOption, filterSort]);

//     const renderLabel = () => {
//       if (!label) return null;

//       const labelElement = (
//         <Label className={cn("text-sm font-medium")}>
//           {label}{isRequired ?<span className='text-red-500'> *</span>:''}
//           {showCount && normalizedValue.length > 0 && (
//             <span className="ml-1 text-xs text-gray-500">({normalizedValue.length})</span>
//           )}
//         </Label>
//       );

//       if (tooltip) {
//         return (
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 {labelElement}
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{tooltip}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         );
//       }

//       return labelElement;
//     };

//     const handleOptionToggle = (optionValue: string) => {
//       if (disabled) return;
      
//       const option = flatOptions.find(opt => opt.value === optionValue);
//       if (!option) return;

//       const isSelected = normalizedValue.includes(optionValue);
//       let newValue: string[];
      
//       if (isSelected) {
//         newValue = normalizedValue.filter(v => v !== optionValue);
//         onDeselect?.(optionValue, option);
//       } else {
//         // Check max count
//         if (maxCount && normalizedValue.length >= maxCount) {
//           return;
//         }
//         newValue = [...normalizedValue, optionValue];
//         onSelect?.(optionValue, option);
//       }
      
//       const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
//       triggerOnChange(newValue, selectedOptions);

//       // Clear search if needed
//       if (autoClearSearchValue && !isSelected) {
//         setSearchTerm('');
//         setIsSearching(false);
//       }
//     };

//     const handleSelectAll = () => {
//       const availableOptions = filteredOptions.filter(opt => !opt.disabled);
//       const availableValues = availableOptions.map(opt => opt.value);
//       const isAllSelected = availableValues.every(val => normalizedValue.includes(val));
      
//       let newValue: string[];
//       if (isAllSelected) {
//         newValue = normalizedValue.filter(v => !availableValues.includes(v));
//       } else {
//         const valuesToAdd = availableValues.filter(v => !normalizedValue.includes(v));
//         if (maxCount) {
//           const remainingSlots = maxCount - normalizedValue.length;
//           newValue = [...normalizedValue, ...valuesToAdd.slice(0, remainingSlots)];
//         } else {
//           newValue = [...new Set([...normalizedValue, ...availableValues])];
//         }
//       }
      
//       const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
//       triggerOnChange(newValue, selectedOptions);
//     };

//     // NEW: Handle group select all
//     const handleGroupSelectAll = (groupOptions: Options[], groupLabel: string) => {
//       const availableGroupOptions = groupOptions.filter(opt => !opt.disabled);
//       const availableGroupValues = availableGroupOptions.map(opt => opt.value);
//       const isGroupAllSelected = availableGroupValues.every(val => normalizedValue.includes(val));
      
//       let newValue: string[];
//       if (isGroupAllSelected) {
//         // Deselect all options in this group
//         newValue = normalizedValue.filter(v => !availableGroupValues.includes(v));
//       } else {
//         // Select all options in this group
//         const valuesToAdd = availableGroupValues.filter(v => !normalizedValue.includes(v));
//         if (maxCount) {
//           const remainingSlots = maxCount - normalizedValue.length;
//           newValue = [...normalizedValue, ...valuesToAdd.slice(0, remainingSlots)];
//         } else {
//           newValue = [...new Set([...normalizedValue, ...availableGroupValues])];
//         }
//       }
      
//       const selectedOptions = newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
//       triggerOnChange(newValue, selectedOptions);
//       onGroupSelectAll?.(groupLabel, !isGroupAllSelected, availableGroupOptions);
//     };

//     const handleClear = () => {
//       onClear?.();
//       triggerOnChange([], []);
//       setSearchTerm('');
//       setIsSearching(false);
//     };

//     const handleCreateTag = (tagValue: string) => {
//       if (mode !== 'tags' || !tagValue.trim()) return;
      
//       const trimmedValue = tagValue.trim();
//       if (normalizedValue.includes(trimmedValue)) return;
      
//       const newOption: Options = {
//         value: trimmedValue,
//         label: trimmedValue
//       };
      
//       const newValue = [...normalizedValue, trimmedValue];
//       const selectedOptions = [...newValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[], newOption];
      
//       triggerOnChange(newValue, selectedOptions);
//       setSearchTerm('');
//       setIsSearching(false);
//     };

//     const handleInputKeyDown = (e: React.KeyboardEvent) => {
//       onInputKeyDown?.(e);
      
//       if (mode === 'tags' && tokenSeparators.includes(e.key)) {
//         e.preventDefault();
//         handleCreateTag(searchTerm);
//         return;
//       }
      
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         if (mode === 'tags' && searchTerm) {
//           handleCreateTag(searchTerm);
//         } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
//           handleOptionToggle(filteredOptions[focusedIndex].value);
//         }
//       } else if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         if (!isOpen) {
//           setIsOpen(true);
//           onDropdownVisibleChange?.(true);
//         }
//         setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         if (!isOpen) {
//           setIsOpen(true);
//           onDropdownVisibleChange?.(true);
//         }
//         setFocusedIndex(prev => Math.max(prev - 1, -1));
//       } else if (e.key === 'Escape') {
//         setIsOpen(false);
//         setIsSearching(false);
//         setSearchTerm('');
//         onDropdownVisibleChange?.(false);
//       } else if (e.key === 'Backspace' && searchTerm === '' && normalizedValue.length > 0) {
//         // Remove last selected option when backspacing with empty search
//         const lastValue = normalizedValue[normalizedValue.length - 1];
//         handleOptionToggle(lastValue);
//       }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const newValue = e.target.value;
//       setSearchTerm(newValue);
//       setIsSearching(true);
//       onSearch?.(newValue);
      
//       if (!isOpen && newValue) {
//         setIsOpen(true);
//         onDropdownVisibleChange?.(true);
//       }
//     };

//     const truncateText = (text: string, maxLength: number) => {
//       return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//     };

//     const getSelectedOptions = () => {
//       return normalizedValue.map(v => flatOptions.find(opt => opt.value === v)).filter(Boolean) as Options[];
//     };

//     const renderTag = (option: Options, index: number) => {
//       const handleClose = () => handleOptionToggle(option.value);
      
//       if (tagRender) {
//         return tagRender({
//           label: option.label,
//           value: option.value,
//           onClose: handleClose,
//           disabled: disabled || option.disabled
//         });
//       }

//       return (
//         <span
//           key={option.value}
//           className={cn(
//             "inline-flex items-center px-2 py-1 rounded-md text-xs",
//             size === 'small' && "px-1.5 py-0.5 text-xs",
//             size === 'large' && "px-2.5 py-1.5 text-sm",
//             variant === 'filled' ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800",
//             (disabled || option.disabled) && "opacity-50"
//           )}
//         >
//           {option.icon && <span className="mr-1">{option.icon}</span>}
//           {truncateText(option.label, maxTagTextLength)}
//           {!disabled && !option.disabled && (
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleClose();
//               }}
//               className="ml-1 hover:text-blue-600"
//             >
//               <X className="h-3 w-3" />
//             </button>
//           )}
//         </span>
//       );
//     };

//     const renderSelectedTags = () => {
//       const selectedOptions = getSelectedOptions();
//       const displayTags = selectedOptions.slice(0, maxTagCount);
//       const remainingCount = selectedOptions.length - maxTagCount;

//       return (
//         <div className="flex flex-wrap gap-1">
//           {displayTags.map((option, index) => renderTag(option, index))}
//           {remainingCount > 0 && (
//             <span className={cn(
//               "inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600",
//               size === 'small' && "px-1.5 py-0.5",
//               size === 'large' && "px-2.5 py-1.5 text-sm"
//             )}>
//               +{remainingCount} more
//             </span>
//           )}
//         </div>
//       );
//     };

//     const renderOption = (option: Options, index: number) => {
//       if (optionRender) {
//         return optionRender(option, { index });
//       }

//       const isSelected = normalizedValue.includes(option.value);
//       const isFocused = index === focusedIndex;

//       return (
//         <div
//           key={option.value}
//           className={cn(
//             "flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer",
//             size === 'small' && "px-2 py-1.5 text-sm",
//             size === 'large' && "px-4 py-3",
//             option.disabled && "opacity-50 cursor-not-allowed",
//             isFocused && "bg-blue-50",
//             isSelected && "bg-blue-50"
//           )}
//           onClick={() => !option.disabled && handleOptionToggle(option.value)}
//           onMouseEnter={() => setFocusedIndex(index)}
//         >
//           <Checkbox
//             checked={isSelected}
//             onChange={() => !option.disabled && handleOptionToggle(option.value)}
//             disabled={option.disabled}
//           />
//           {option.icon && <span className="text-gray-500">{option.icon}</span>}
//           <div className="flex-1">
//             <span className="text-sm">{option.label}</span>
//             {option.description && (
//               <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
//             )}
//           </div>
//           {isSelected && <Check className="h-4 w-4 text-blue-500" />}
//         </div>
//       );
//     };

//     // NEW: Render group select all option
//     const renderGroupSelectAll = (groupOptions: Options[], groupLabel: string) => {
//       const availableGroupOptions = groupOptions.filter(opt => !opt.disabled);
//       const availableGroupValues = availableGroupOptions.map(opt => opt.value);
//       const isGroupAllSelected = availableGroupValues.every(val => normalizedValue.includes(val));
//       const isGroupPartiallySelected = availableGroupValues.some(val => normalizedValue.includes(val)) && !isGroupAllSelected;

//       return (
//         <div
//           className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 bg-gray-50/50"
//           onClick={() => handleGroupSelectAll(groupOptions, groupLabel)}
//         >
//           <Checkbox
//             checked={isGroupAllSelected}
//             // Use aria-checked for indeterminate state
//             aria-checked={isGroupPartiallySelected ? 'mixed' : undefined}
//             onChange={() => handleGroupSelectAll(groupOptions, groupLabel)}
//             disabled={disabled || availableGroupOptions.length === 0}
//           />
//           <span className="text-xs font-medium text-gray-600">
//             {isGroupAllSelected
//               ? `Deselect All in ${groupLabel}`
//               : `Select All in ${groupLabel}`}
//           </span>
//           <span className="text-xs text-gray-400">
//             ({availableGroupOptions.filter(opt => normalizedValue.includes(opt.value)).length}/{availableGroupOptions.length})
//           </span>
//         </div>
//       );
//     };

//     const renderDropdownMenu = () => {
//       const menu = (
//         <div className="max-h-60 overflow-auto" ref={listRef} onScroll={onPopupScroll}>
//           {/* Global Select All - only show when not using grouped options or when explicitly enabled */}
//           {selectAll && filteredOptions.length > 0  && (
//             <div
//               className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 sticky top-0 bg-white z-10"
//               onClick={handleSelectAll}
//             >
//               <Checkbox
//                 checked={filteredOptions.filter(opt => !opt.disabled).every(opt => normalizedValue.includes(opt.value))}
//                 // Use aria-checked for indeterminate state, since Checkbox does not support 'indeterminate' prop
//                 aria-checked={
//                   filteredOptions.filter(opt => !opt.disabled).some(opt => normalizedValue.includes(opt.value)) &&
//                   !filteredOptions.filter(opt => !opt.disabled).every(opt => normalizedValue.includes(opt.value))
//                     ? 'mixed'
//                     : undefined
//                 }
//                 onChange={handleSelectAll}
//                 disabled={disabled}
//               />
//               <span className="text-sm font-medium">
//                 {filteredOptions.filter(opt => !opt.disabled).every(opt => normalizedValue.includes(opt.value))
//                   ? 'Deselect All'
//                   : 'Select All'}
//               </span>
//             </div>
//           )}
          
//           <div className="p-1" style={{ maxHeight: listHeight }}>
//             {mode === 'tags' && searchTerm && !filteredOptions.some(opt => opt.value === searchTerm) && (
//               <div
//                 className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                 onClick={() => handleCreateTag(searchTerm)}
//               >
//                 <Plus className="h-4 w-4 text-blue-500" />
//                 <span className="text-sm text-blue-600">Create "{searchTerm}"</span>
//               </div>
//             )}
            
//             {groupedOptions ? (
//               groupedOptions.map((group, groupIndex) => {
//                 const groupFilteredOptions = filterOptions(group.options, searchTerm);
//                 if (groupFilteredOptions.length === 0) return null;
                
//                 return (
//                   <div key={groupIndex}>
//                     <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       {group.label}
//                     </div>
//                     {/* Group Select All */}
//                     {groupSelectAll && renderGroupSelectAll(groupFilteredOptions, group.label)}
//                     {groupFilteredOptions.map((option, optionIndex) => 
//                       renderOption(option, groupIndex * 1000 + optionIndex)
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               filteredOptions.map((option, index) => renderOption(option, index))
//             )}
            
//             {filteredOptions.length === 0 && (
//               <div className="px-3 py-4 text-sm text-gray-500 text-center">
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     Loading...
//                   </div>
//                 ) : searchTerm ? (
//                   `No options found for "${searchTerm}"`
//                 ) : (
//                   "No options found"
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       );

//       return dropdownRender ? dropdownRender(menu) : menu;
//     };

//     const getSizeClasses = () => {
//       switch (size) {
//         case 'small':
//           return "min-h-[32px] px-2 py-1 text-sm";
//         case 'large':
//           return "min-h-[48px] px-4 py-3 text-base";
//         default:
//           return "min-h-[40px] px-3 py-2 text-sm";
//       }
//     };

//     const getVariantClasses = () => {
//       switch (variant) {
//         case 'filled':
//           return "bg-gray-50 border-transparent";
//         case 'borderless':
//           return "border-transparent shadow-none";
//         default:
//           return "bg-background border-input";
//       }
//     };

//     const getStatusClasses = () => {
//       if (error || status === 'error') {
//         return "border-red-500 focus-within:border-red-500 focus-within:ring-red-200";
//       }
//       if (status === 'warning') {
//         return "border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-200";
//       }
//       return "focus-within:ring-blue-200";
//     };

//     const handleContainerClick = (e: React.MouseEvent) => {
//       if (disabled) return;
      
//       // Don't open if clicking on a tag's close button
//       if ((e.target as HTMLElement).closest('button')) return;
      
//       if (!isOpen) {
//         setIsOpen(true);
//         onDropdownVisibleChange?.(true);
//       }
      
//       // Focus the search input
//       if (searchable && searchInputRef.current) {
//         searchInputRef.current.focus();
//       }
//     };

//     const dropdownWidth = dropdownMatchSelectWidth === true 
//       ? '100%' 
//       : typeof dropdownMatchSelectWidth === 'number' 
//         ? `${dropdownMatchSelectWidth}px` 
//         : 'auto';

//     return (
//       <div className={cn("space-y-2", containerClassName)} ref={ref} {...props}>
//         {renderLabel()}
//         <div className="relative" ref={dropdownRef} data-dropdown-type="multi">
//           <div
//             ref={triggerRef}
//             className={cn(
//               "w-full rounded-md border cursor-text transition-colors",
//               "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
//               getSizeClasses(),
//               getVariantClasses(),
//               getStatusClasses(),
//               disabled && "cursor-not-allowed opacity-50",
//               className
//             )}
//             onClick={handleContainerClick}
//             onFocus={onFocus}
//             onBlur={onBlur}
//           >
//             <div className="flex items-center justify-between min-h-[24px]">
//               <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1">
//                 {normalizedValue.length > 0 && renderSelectedTags()}
                
//                 {/* Search Input */}
//                 {searchable && (
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     value={searchTerm}
//                     onChange={handleInputChange}
//                     onKeyDown={handleInputKeyDown}
//                     placeholder={normalizedValue.length === 0 ? placeholder : ''}
//                     disabled={disabled}
//                     className={cn(
//                       "flex-1 min-w-[120px] bg-transparent border-none outline-none",
//                       "placeholder:text-muted-foreground",
//                       size === 'small' && "text-sm",
//                       size === 'large' && "text-base",
//                       disabled && "cursor-not-allowed"
//                     )}
//                     style={{ minWidth: isSearching || normalizedValue.length === 0 ? '120px' : '60px' }}
//                   />
//                 )}
                
//                 {/* Placeholder when not searchable and no selections */}
//                 {!searchable && normalizedValue.length === 0 && (
//                   <span className="text-muted-foreground">{placeholder}</span>
//                 )}
//               </div>
              
//               <div className="flex items-center gap-1 ml-2 flex-shrink-0">
//                 {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
//                 {status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
//                 {status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
//                 {allowClear && normalizedValue.length > 0 && !loading && (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleClear();
//                     }}
//                     className="text-gray-400 hover:text-gray-600 p-1"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//                 {showArrow && (suffixIcon || <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />)}
//               </div>
//             </div>
//           </div>

//           {isOpen && (
//             <div 
//               className={cn(
//                 "absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden",
//                 dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
//                 dropdownClassName,
//                 popupClassName
//               )}
//               style={{ 
//                 position: 'absolute', 
//                 zIndex: 9999,
//                 width: dropdownWidth,
//                 maxHeight: listHeight + 100
//               }}
//             >
//               {renderDropdownMenu()}
//             </div>
//           )}
//         </div>
//         {error && <p className="text-xs text-red-500 flex items-center">{error}</p>}
//       </div>
//     );
//   }
// );

// ReusableMultiSelect.displayName = "ReusableMultiSelect";