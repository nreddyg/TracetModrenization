import React, { forwardRef, useState, useRef, useImperativeHandle, useCallback, useMemo } from 'react';
import { Eye, EyeOff, X, Search } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export type InputSize = 'small' | 'middle' | 'large';
export type InputStatus = 'error' | 'warning' | '';
export type InputVariant = 'outlined' | 'borderless' | 'filled';
export type LabelPosition = 'top' | 'left' | 'right' | 'bottom';

export interface ReusableInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  // Basic props
  label?: string;
  labelPosition?: LabelPosition; // Position of the label relative to input
  tooltip?: string;
  error?: string;
  warning?: string;
  isRequired?:boolean;
  
  // Icons and affixes
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  
  // Password specific
  showPasswordToggle?: boolean;
  visibilityToggle?: boolean;
  
  // Styling
  containerClassName?: string;
  inputClassName?: string;
  size?: InputSize;
  variant?: InputVariant;
  status?: InputStatus;
  
  // Functionality
  allowClear?: boolean;
  showCount?: boolean;
  maxLength?: number;
  
  // Search specific
  enterButton?: boolean | React.ReactNode;
  onSearch?: (value: string, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  loading?: boolean;
  
  // Advanced
  bordered?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  
  // NEW FEATURES
  ellipsisPlaceholder?: boolean; // Enable ellipsis for placeholder text
  enterToTab?: boolean; // Enable Enter key to focus next field
  
  // REGEX VALIDATION
  validationPattern?: string | RegExp; // Regular expression pattern for validation (renamed to avoid conflict)
  patternErrorMessage?: string; // Custom error message for pattern validation
  validateOnChange?: boolean; // Validate on every change (default: false)
  validateOnBlur?: boolean; // Validate on blur (default: true)
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void; // Callback for validation state
  
  // Callbacks
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ReusableInputRef {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  select: () => void;
  input: HTMLInputElement | null;
}

export const ReusableInput = forwardRef<ReusableInputRef, ReusableInputProps>(
  ({ 
    // Basic props
    label, 
    labelPosition = 'top',
    tooltip, 
    error, 
    warning,
    isRequired,
    
    // Icons and affixes
    prefixIcon, 
    suffixIcon, 
    addonBefore,
    addonAfter,
    
    // Password specific
    showPasswordToggle = false,
    visibilityToggle = false,
    
    // Styling
    containerClassName,
    inputClassName,
    className,
    size = 'middle',
    variant = 'outlined',
    status = '',
    
    // Functionality
    allowClear = false,
    showCount = false,
    maxLength,
    
    // Search specific
    enterButton = false,
    onSearch,
    loading = false,
    
    // Advanced
    bordered = true,
    autoSize = false,
    
    // NEW FEATURES
    ellipsisPlaceholder = false,
    enterToTab = false,
    
    // REGEX VALIDATION
    validationPattern,
    patternErrorMessage = 'Invalid input format',
    validateOnChange = false,
    validateOnBlur = true,
    onValidationChange,
    
    // Input props
    type = 'text',
    value,
    defaultValue,
    placeholder,
    // Callbacks
    onPressEnter,
    onClear,
    onChange,
    onFocus,
    onBlur,
    
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || defaultValue || '');
    const [validationError, setValidationError] = useState<string>('');
    const [isValid, setIsValid] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      focus: (options?: FocusOptions) => inputRef.current?.focus(options),
      blur: () => inputRef.current?.blur(),
      select: () => inputRef.current?.select(),
      input: inputRef.current,
    }));

    React.useEffect(() => {
      if ((showPasswordToggle || visibilityToggle) && type === 'password') {
        setInputType(showPassword ? 'text' : 'password');
      }
    }, [showPassword, showPasswordToggle, visibilityToggle, type]);

    React.useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      }
    }, [value]);

    // Regex validation function
    const validateInput = useCallback((inputVal: string) => {
      if (!validationPattern || inputVal === '') {
        setValidationError('');
        setIsValid(true);
        onValidationChange?.(true);
        return true;
      }

      const regex = typeof validationPattern === 'string' ? new RegExp(validationPattern) : validationPattern;
      const isInputValid = regex.test(inputVal);
      
      if (!isInputValid) {
        setValidationError(patternErrorMessage);
        setIsValid(false);
        onValidationChange?.(false, patternErrorMessage);
        return false;
      } else {
        setValidationError('');
        setIsValid(true);
        onValidationChange?.(true);
        return true;
      }
    }, [validationPattern, patternErrorMessage, onValidationChange]);

    const togglePassword = useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword]);

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue('');
      if (onChange) {
        const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      onClear?.();
      inputRef.current?.focus();
    }, [onChange, onClear]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      setInputValue(newValue);
      
      // Validate on change if enabled
      if (validateOnChange) {
        validateInput(newValue);
      }
      
      onChange?.(e);
    }, [maxLength, onChange, validateOnChange, validateInput]);

    // Function to focus next focusable element
    const focusNextElement = useCallback(() => {
      const focusableElements = document.querySelectorAll(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      const currentIndex = Array.from(focusableElements).indexOf(inputRef.current!);
      const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
      
      if (nextElement) {
        nextElement.focus();
      }
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        // Handle enter to tab functionality
        if (enterToTab && !onSearch) {
          e.preventDefault();
          focusNextElement();
        }
        
        // Call custom onPressEnter handler
        onPressEnter?.(e);
        
        // Handle search functionality (only if not using enterToTab or if onSearch exists)
        if (onSearch && (!enterToTab || e.ctrlKey || e.metaKey)) {
          onSearch(inputValue.toString(), e);
        }
      }
      props.onKeyDown?.(e);
    }, [onPressEnter, onSearch, inputValue, props, enterToTab, focusNextElement]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    }, [onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      
      // Validate on blur if enabled
      if (validateOnBlur) {
        validateInput(inputValue.toString());
      }
      
      onBlur?.(e);
    }, [onBlur, validateOnBlur, validateInput, inputValue]);

    const handleSearch = useCallback((e: React.MouseEvent<HTMLElement>) => {
      if (onSearch) {
        onSearch(inputValue.toString(), e);
      }
    }, [onSearch, inputValue]);

    // Size classes
    const sizeClasses = useMemo(() => {
      switch (size) {
        case 'small':
          return 'h-8 px-2 text-xs';
        case 'large':
          return 'h-12 px-4 text-base';
        default:
          return 'h-10 px-3 text-sm';
      }
    }, [size]);

    // Variant classes
    const variantClasses = useMemo(() => {
      switch (variant) {
        case 'borderless':
          return 'border-transparent bg-transparent hover:bg-gray-50 focus:bg-white focus:border-blue-500';
        case 'filled':
          return 'border-transparent bg-gray-100 hover:bg-gray-50 focus:bg-white focus:border-blue-500';
        default:
          return bordered ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50';
      }
    }, [variant, bordered]);

    // Status classes - include validation error
    const statusClasses = useMemo(() => {
      // if (error || status === 'error' || validationError) {
      //   return 'border-red-500 focus:border-red-500 focus:ring-red-200';
      // }
      if (warning || status === 'warning') {
        return 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-200';
      }
      // if (validationPattern && isValid && inputValue) {
      //   return 'border-green-500 focus:border-green-500 focus:ring-green-200';
      // }
      return 'focus:border-blue-500 focus:ring-blue-200';
    }, [error, warning, status, validationError, validationPattern, isValid, inputValue]);

    // Label positioning classes
    const labelClasses = useMemo(() => {
      const baseClasses = "text-sm font-medium";
      
      switch (labelPosition) {
        case 'left':
          return `${baseClasses} flex-shrink-0 mr-3`;
        case 'right':
          return `${baseClasses} flex-shrink-0 ml-3`;
        case 'bottom':
          return `${baseClasses}`;
        default: // 'top'
          return baseClasses;
      }
    }, [labelPosition]);

    // Container layout classes based on label position
    const containerLayoutClasses = useMemo(() => {
      switch (labelPosition) {
        case 'left':
        case 'right':
          return 'flex items-center';
        default: // 'top' or 'bottom'
          return 'space-y-2';
      }
    }, [labelPosition]);

    // Ellipsis placeholder - using CSS with proper container constraints
    const ellipsisStyles = useMemo(() => {
      if (!ellipsisPlaceholder) return {};
      
      return {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%'
      };
    }, [ellipsisPlaceholder]);

    const renderLabel = () => {
      if (!label) return null;

      const labelElement = <Label className={labelClasses}>{label}{isRequired ?<span className='text-red-500'> *</span>:''}</Label>;

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

    const renderAddonBefore = () => {
      if (!addonBefore) return null;
      
      return (
        <div className={cn(
          "flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md",
          sizeClasses.split(' ').find(cls => cls.startsWith('h-')),
          variantClasses,
          statusClasses
        )}>
          {addonBefore}
        </div>
      );
    };

    const renderAddonAfter = () => {
      if (!addonAfter && !enterButton) return null;
      
      return (
        <div className={cn(
          "flex items-center px-3 bg-gray-50 border border-l-0 rounded-r-md",
          sizeClasses.split(' ').find(cls => cls.startsWith('h-')),
          variantClasses,
          statusClasses,
          enterButton && "cursor-pointer hover:bg-gray-100"
        )}
        onClick={enterButton ? handleSearch : undefined}
        >
          {enterButton && onSearch ? (
            typeof enterButton === 'boolean' ? (
              loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )
            ) : (
              enterButton
            )
          ) : (
            addonAfter
          )}
        </div>
      );
    };

    const renderSuffixIcons = () => {
      const icons = [];
      
      // Clear icon
      if (allowClear && inputValue && !props.readOnly && !props.disabled) {
        icons.push(
          <button
            key="clear"
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        );
      }

      // Password toggle
      if ((showPasswordToggle || visibilityToggle) && type === 'password') {
        icons.push(
          <button
            key="password-toggle"
            type="button"
            onClick={togglePassword}
            className="text-gray-400 hover:text-gray-600 p-0.5"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        );
      }

      // Custom suffix icon
      if (suffixIcon) {
        icons.push(
          <div key="suffix" className="text-gray-400">
            {suffixIcon}
          </div>
        );
      }

      // Loading icon
      if (loading && !enterButton) {
        icons.push(
          <div key="loading" className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        );
      }

      return icons.length > 0 ? (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {icons}
        </div>
      ) : null;
    };

    const renderCount = () => {
      if (!showCount) return null;
      
      const currentLength = inputValue.toString().length;
      const maxLen = maxLength;
      
      return (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {maxLen ? `${currentLength}/${maxLen}` : currentLength}
        </div>
      );
    };

    const hasAddon = addonBefore || addonAfter || enterButton;
    const inputWrapperClass = cn(
      "relative flex",
      hasAddon && "rounded-none",
      addonBefore && "rounded-l-none",
      addonAfter && "rounded-r-none",
      !hasAddon && "rounded-md"
    );

    // Render the input field section
    const renderInputSection = () => (
      <div className={labelPosition === 'left' || labelPosition === 'right' ? 'flex-1' : ''}>
        <div className="">
          {renderAddonBefore()}
          
          <div className={inputWrapperClass}>
            {prefixIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {prefixIcon}
              </div>
            )}
            
            <Input
              ref={inputRef}
              type={inputType}
              value={inputValue}
              placeholder={placeholder}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={ellipsisStyles}
              className={cn(
                sizeClasses,
                variantClasses,
                statusClasses,
                ellipsisPlaceholder && "overflow-hidden text-ellipsis whitespace-nowrap",
                prefixIcon && "pl-10",
                (suffixIcon || showPasswordToggle || visibilityToggle || allowClear || loading) && "pr-10",
                focused && "ring-2 ring-opacity-50",
                hasAddon && "border-0",
                addonBefore && "rounded-l-none border-l-0",
                addonAfter && "rounded-r-none border-r-0",
                !hasAddon && "rounded-md",
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-backgroun",
                inputClassName,
                className
              )}
              {...props}
            />
            
            {renderSuffixIcons()}
          </div>
          
          {renderAddonAfter()}
        </div>
        
        {/* Error/Warning/Validation messages - always below input */}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {!error && validationError && <p className="text-xs text-red-500 mt-1">{validationError}</p>}
        {warning && !error && !validationError && <p className="text-xs text-yellow-600 mt-1">{warning}</p>}
        
        {/* Character count - always below input */}
        {renderCount()}
      </div>
    );

    return (
      <div className={cn(containerLayoutClasses, containerClassName)}>
        {/* Label positioning logic */}
        {labelPosition === 'top' && renderLabel()}
        {labelPosition === 'left' && renderLabel()}
        
        {renderInputSection()}
        
        {labelPosition === 'right' && renderLabel()}
        {labelPosition === 'bottom' && renderLabel()}
      </div>
    );
  }
);

ReusableInput.displayName = "ReusableInput";