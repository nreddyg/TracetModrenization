
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Search, Check, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  label?: string;
  tooltip?: string;
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  multiple?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  error?: string;
  maxTagCount?: number;
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
  showSearch = false,
  multiple = false,
  size = 'middle',
  status,
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
  dropdownClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [internalValue, setInternalValue] = useState(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return multiple ? [] : '';
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const currentValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onDropdownVisibleChange?.(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDropdownVisibleChange]);

  useEffect(() => {
    if (isOpen && showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, showSearch]);

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
  };

  const handleRemoveTag = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!multiple) return;
    const newValue = (currentValue as (string | number)[]).filter(v => v !== val);
    const selectedOption = options.filter(opt => newValue.includes(opt.value));
    if (value === undefined) setInternalValue(newValue);
    onChange?.(newValue, selectedOption);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch?.(val);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    const open = !isOpen;
    setIsOpen(open);
    onDropdownVisibleChange?.(open);
    if (open) onFocus?.();
    else {
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

  const renderLabel = () => {
    if (!label) return null;
    const labelContent = <span className="text-sm font-medium">{label}</span>;

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

  const renderSelectedContent = () => {
    const selected = getSelectedOptions();
    if (!selected.length) return <span className="text-gray-400">{placeholder}</span>;

    if (multiple) {
      const displayed = maxTagCount && selected.length > maxTagCount
        ? selected.slice(0, maxTagCount)
        : selected;
      const remaining = maxTagCount && selected.length > maxTagCount
        ? selected.length - maxTagCount
        : 0;

      return (
        <div className="flex flex-wrap gap-1">
          {displayed.map(option => (
            <span key={option.value} className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded border">
              {option.label}
              <button onClick={(e) => handleRemoveTag(option.value, e)} className="hover:bg-blue-200 rounded p-0.5">
                <X size={12} />
              </button>
            </span>
          ))}
          {remaining > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border">
              +{remaining} more
            </span>
          )}
        </div>
      );
    }

    return <span>{selected[0]?.label}</span>;
  };

  const renderDropdownContent = () => {
    const baseContent = (
      <div className="py-1">
        {showSearch && (
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        )}

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
                <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 border-t">{groupName}</div>
                {items.map(renderOption)}
              </div>
            ))}
          </>
        )}
      </div>
    );

    return dropdownRender ? dropdownRender(baseContent) : baseContent;
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
      >
        <span>{option.label}</span>
        {isSelected && <Check size={16} />}
      </div>
    );
  };

  return (
    <div ref={selectRef} className={cn("space-y-2", className)}>
      <div className="text-sm font-medium">{renderLabel()}</div>

      <div className="relative">
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          onClick={toggleDropdown}
          className={cn(
            "flex items-center justify-between rounded border px-3 py-2 text-sm transition-colors",
            "min-h-[40px]", // Match height
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-blue-400",
            getStatusClasses()
          )}
          style={{ backgroundColor: disabled ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)', borderColor: 'hsl(214.29deg 31.82% 91.37%)' }}

        >
          <div className="flex-1 min-w-0 truncate">{renderSelectedContent()}</div>
          <div className="flex items-center gap-1 ml-2">
            {allowClear && getSelectedOptions().length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:bg-gray-200 rounded p-1 text-gray-500"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={cn(
                "text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md border border-gray-300 bg-white shadow",
              dropdownClassName
            )}
          >
            {renderDropdownContent()}
          </div>
        )} */}
        {isOpen && (
          <div
            className={cn(
              className="absolute z-50 mt-1 w-full max-h-[300px] overflow-y-auto rounded-md shadow", // scroll enabled
              dropdownClassName
            )}
            style={{
              minHeight: '50px',
              maxHeight: "150px", // 👈 adjusts height (roughly 4–5 items)
              backgroundColor: 'white',
              border: '1px solid hsl(214.29deg 31.82% 91.37%)'
            }}
          >
            {renderDropdownContent()}
          </div>
        )}
      </div>

      {status === "error" && error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>

  );
};

ReusableDropdown.displayName = 'ReusableDropdown';
