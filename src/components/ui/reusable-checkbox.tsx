import React, { forwardRef, useEffect, useState, useImperativeHandle, useRef } from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

// Types and Interfaces
export interface CheckboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  checked?: boolean;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface CheckboxChangeEvent {
  target: {
    checked: boolean;
    name?: string;
    value?: string | number;
  };
  nativeEvent: Event;
}

export interface CheckboxMethods {
  blur: () => void;
  focus: () => void;
  nativeElement: HTMLButtonElement | null;
  validate: () => boolean;
}

export interface ReusableCheckboxProps {
  // Basic Props
  label?: string;
  tooltip?: string;
  error?: string;
  disabled?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string | number;
  containerClassName?: string;
  className?: string;
  
  // Validation Props
  isRequired?: boolean;
  requiredMessage?: string;
  
  // Ant Design Compatible Props
  autoFocus?: boolean;
  defaultChecked?: boolean;
  
  // Group Functionality
  options?: CheckboxOption[];
  defaultValue?: (string | number)[];
  
  // Styling Options
  size?: 'small' | 'default' | 'large';
  
  // Event Handlers (Ant Design Compatible + React Hook Form Compatible)
  onChange?: ((e: CheckboxChangeEvent) => void) | ((value: boolean | (string | number)[]) => void);
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onGroupChange?: (checkedValues: (string | number)[]) => void;
  
  // React Hook Form Integration
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[] | string[] | number[];
  value?: (string | number | boolean)[];
  defaultValue?: (string | number)[];
  disabled?: boolean;
  name?: string;
  className?: string;
  size?: 'small' | 'default' | 'large';
  isRequired?: boolean;
  requiredMessage?: string;
  error?: string;
  onChange?: (checkedValues: (string | number)[]) => void;
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void;
}

// Main ReusableCheckbox Component
export const ReusableCheckbox = forwardRef<CheckboxMethods, ReusableCheckboxProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    disabled,
    checked,
    indeterminate = false,
    name,
    value,
    containerClassName,
    className,
    autoFocus = false,
    defaultChecked = false,
    options,
    defaultValue = [],
    size = 'default',
    isRequired = false,
    requiredMessage = 'This field is required',
    onChange,
    onBlur,
    onFocus,
    onGroupChange,
    onValidationChange,
    ...props 
  }, ref) => {
    // State Management
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [groupValues, setGroupValues] = useState<(string | number)[]>(defaultValue);
    const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);
    const [validationError, setValidationError] = useState<string>('');
    const checkboxRef = useRef<HTMLButtonElement>(null);

    // Handle react-hook-form value prop for both single checkbox and group
    useEffect(() => {
      if (value !== undefined) {
        if (options) {
          // For checkbox group, value should be an array
          const arrayValue = Array.isArray(value) ? value as (string | number)[] : [];
          setGroupValues(arrayValue);
        } else {
          // For single checkbox, value should be boolean
          const boolValue = Boolean(value);
          setInternalChecked(boolValue);
        }
      }
    }, [value, options]);

    // Controlled vs Uncontrolled Logic
    const isControlled = checked !== undefined || value !== undefined;
    const actualChecked = checked !== undefined ? checked : (value !== undefined ? Boolean(value) : internalChecked);
    const actualGroupValues = value !== undefined && Array.isArray(value) ? value as (string | number)[] : groupValues;

    // Validation Logic
    const validateField = (currentValue?: boolean | (string | number)[]) => {
      if (!isRequired) return true;

      let isValid = false;
      let errorMessage = '';

      if (options) {
        // Group validation
        const valuesToCheck = currentValue as (string | number)[] || actualGroupValues;
        isValid = valuesToCheck.length > 0;
      } else {
        // Single checkbox validation
        const valueToCheck = currentValue !== undefined ? currentValue as boolean : actualChecked;
        isValid = valueToCheck === true;
      }

      if (!isValid) {
        errorMessage = error || requiredMessage;
      }

      setValidationError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
      
      return isValid;
    };

    // Imperative Handle for Methods
    useImperativeHandle(ref, () => ({
      blur: () => checkboxRef.current?.blur(),
      focus: () => checkboxRef.current?.focus(),
      nativeElement: checkboxRef.current,
      validate: () => validateField()
    }), []);

    // Effects
    useEffect(() => {
      if (isControlled && checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked, isControlled]);

    useEffect(() => {
      setIsIndeterminate(indeterminate);
    }, [indeterminate]);

    // REMOVED: Auto-validation on mount/value changes
    // Only validate when error prop is provided or user interacts
    useEffect(() => {
      if (error) {
        // Trigger validation only when error is explicitly provided from props
        validateField();
      }
    }, [error]);

    // Clear validation error when external error changes
    useEffect(() => {
      if (error !== undefined) {
        setValidationError('');
      }
    }, [error]);

    // Style Configuration
    const getSizeClasses = () => ({
      checkbox: {
        small: 'h-3 w-3',
        default: 'h-4 w-4',
        large: 'h-5 w-5'
      }[size],
      label: {
        small: 'text-xs',
        default: 'text-sm',
        large: 'text-base'
      }[size],
      error: {
        small: 'text-xs',
        default: 'text-xs',
        large: 'text-sm'
      }[size]
    });

    const sizeClasses = getSizeClasses();

    // Event Handlers
    const handleSingleCheckboxChange = (newChecked: boolean, event?: Event) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      
      // Validate on user interaction
      if (isRequired) {
        validateField(newChecked);
      }
      
      // Handle both event-based onChange and direct value onChange (for react-hook-form)
      if (onChange) {
        // If the consumer expects a boolean or array, pass the value directly
        if (typeof newChecked === "boolean" && (!options || options.length === 0)) {
          (onChange as (value: boolean) => void)(newChecked);
        } else {
          // Event-based onChange (legacy/AntD style)
          const changeEvent: CheckboxChangeEvent = {
            target: {
              checked: newChecked,
              name,
              value
            },
            nativeEvent: event || new Event('change')
          };
          (onChange as (e: CheckboxChangeEvent) => void)(changeEvent);
        }
      }
    };

    const handleGroupCheckboxChange = (optionValue: string | number, newChecked: boolean) => {
      let newGroupValues: (string | number)[];
      
      if (newChecked) {
        newGroupValues = [...actualGroupValues, optionValue];
      } else {
        newGroupValues = actualGroupValues.filter(v => v !== optionValue);
      }
      
      setGroupValues(newGroupValues);
      
      // Validate on user interaction
      if (isRequired) {
        validateField(newGroupValues);
      }
      
      // Handle both group change and direct onChange
      if (onGroupChange) {
        onGroupChange(newGroupValues);
      } else if (onChange) {
        if (onChange.length === 1) {
          // Direct value onChange (react-hook-form style)
          (onChange as any)(newGroupValues);
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      // Trigger validation on blur for user interaction
      if (isRequired) {
        validateField();
      }
      onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      onFocus?.(e);
    };

    // Determine current error message
    const currentError = error || validationError;
    const hasError = Boolean(currentError);

    // Render Methods
    const renderLabel = (labelText?: string, htmlFor?: string, optionTitle?: string, showRequired = false) => {
      if (!labelText) return null;

      const labelElement = (
        <Label 
          htmlFor={htmlFor}
          title={optionTitle}
          className={cn(
            "font-medium cursor-pointer select-none",
            disabled && "cursor-not-allowed opacity-50",
            sizeClasses.label
          )}
        >
          {labelText}
          {showRequired && isRequired && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
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

    const renderSingleCheckbox = () => (
      <div className="flex items-center space-x-2">
        <Checkbox
          ref={checkboxRef}
          id={name}
          name={name}
          checked={actualChecked}
          disabled={disabled}
          autoFocus={autoFocus}
          onCheckedChange={(checked) => handleSingleCheckboxChange(checked as boolean)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            sizeClasses.checkbox,
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          data-indeterminate={isIndeterminate}
          aria-required={isRequired}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...props}
        />
        {renderLabel(label, name, undefined, true)}
      </div>
    );

    const renderCheckboxGroup = () => {
      if (!options || options.length === 0) return null;

      return (
        <fieldset className="mb-1">
          {label && (
            <div className='flex items-center gap-1 mb-1'>
            <legend className="">    
              {renderLabel(label, undefined, undefined, true)}
            </legend>
            </div>
          )}
          <div 
            className="space-y-2 p-0" 
            role="group" 
            aria-required={isRequired}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-group-error` : undefined}
          >
            {options.map((option, index) => {
              const optionId = `${name || 'checkbox'}-option-${index}`;
              const isOptionChecked = actualGroupValues.includes(option.value);
              const isOptionDisabled = disabled || option.disabled;

              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={optionId}
                    name={name}
                    checked={isOptionChecked}
                    disabled={isOptionDisabled}
                    onCheckedChange={(checked) => 
                      handleGroupCheckboxChange(option.value, checked as boolean)
                    }
                    className={cn(
                      sizeClasses.checkbox,
                      option.className
                    )}
                    style={option.style}
                    aria-describedby={hasError ? `${name}-group-error` : undefined}
                  />
                  {renderLabel(option.label, optionId, option.title)}
                </div>
              );
            })}
          </div>
        </fieldset>
      );
    };

    const renderErrorMessage = () => {
      if (!currentError) return null;
      
      const errorId = options ? `${name}-group-error` : `${name}-error`;
      
      return (
        <p 
          id={errorId}
          className={cn(
            "text-red-500 mt-1",
            sizeClasses.error
          )}
          role="alert"
          aria-live="polite"
        >
          {currentError}
        </p>
      );
    };

    // Main Render
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {options ? renderCheckboxGroup() : renderSingleCheckbox()}
        {renderErrorMessage()}
      </div>
    );
  }
);

ReusableCheckbox.displayName = "ReusableCheckbox";

// Standalone Checkbox Group Component
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({
    options,
    value,
    defaultValue = [],
    disabled = false,
    name,
    className,
    size = 'default',
    isRequired = false,
    requiredMessage = 'Please select at least one option',
    error,
    onChange,
    onValidationChange,
    ...props
  }, ref) => {
    // State Management
    const [internalValue, setInternalValue] = useState<(string | number)[]>(
      value as (string | number)[] ?? defaultValue
    );
    const [validationError, setValidationError] = useState<string>('');

    const isControlled = value !== undefined;
    const actualValue = isControlled ? (value as (string | number)[]) : internalValue;

    // Validation Logic
    const validateField = (currentValue?: (string | number)[]) => {
      if (!isRequired) return true;

      const valuesToCheck = currentValue || actualValue;
      const isValid = valuesToCheck.length > 0;
      const errorMessage = isValid ? '' : error;

      setValidationError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
      
      return isValid;
    };

    // Effects
    useEffect(() => {
      if (isControlled && value) {
        setInternalValue(value as (string | number)[]);
      }
    }, [value, isControlled]);

    // REMOVED: Auto-validation on mount/value changes
    // Only validate when error prop is provided
    useEffect(() => {
      if (error) {
        // Trigger validation only when error is explicitly provided from props
        validateField();
      }
    }, [error]);

    // Clear validation error when external error changes
    useEffect(() => {
      if (error !== undefined) {
        setValidationError('');
      }
    }, [error]);

    // Event Handlers
    const handleChange = (optionValue: string | number, checked: boolean) => {
      let newValues: (string | number)[];
      
      if (checked) {
        newValues = [...actualValue, optionValue];
      } else {
        newValues = actualValue.filter(v => v !== optionValue);
      }
      
      if (!isControlled) {
        setInternalValue(newValues);
      }
      
      // Validate on user interaction
      if (isRequired) {
        validateField(newValues);
      }
      
      onChange?.(newValues);
    };

    // Style Configuration
    const getSizeClasses = () => ({
      checkbox: {
        small: 'h-3 w-3',
        default: 'h-4 w-4',
        large: 'h-5 w-5'
      }[size],
      label: {
        small: 'text-xs',
        default: 'text-sm',
        large: 'text-base'
      }[size]
    });

    const sizeClasses = getSizeClasses();

    // Normalize Options
    const normalizedOptions: CheckboxOption[] = options.map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          label: String(option),
          value: option
        };
      }
      return option;
    });

    // Determine current error message
    const currentError = error || validationError;
    const hasError = Boolean(currentError);

    // Render
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <fieldset>
          <div 
            className="space-y-2"
            role="group"
            aria-required={isRequired}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-group-error` : undefined}
          >
            {normalizedOptions.map((option, index) => {
              const optionId = `${name || 'checkbox-group'}-${index}`;
              const isChecked = actualValue.includes(option.value);
              const isDisabled = disabled || option.disabled;

              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={optionId}
                    name={name}
                    checked={isChecked}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => 
                      handleChange(option.value, checked as boolean)
                    }
                    className={cn(
                      sizeClasses.checkbox, 
                      hasError && "border-red-500 focus-visible:ring-red-500",
                      option.className
                    )}
                    style={option.style}
                    aria-describedby={hasError ? `${name}-group-error` : undefined}
                  />
                  <Label 
                    htmlFor={optionId}
                    title={option.title}
                    className={cn(
                      "font-medium cursor-pointer select-none",
                      isDisabled && "cursor-not-allowed opacity-50",
                      hasError && "text-red-600",
                      sizeClasses.label
                    )}
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </fieldset>
        {error && (
          <p 
            id={`${name}-group-error`}
            className="text-red-500 text-xs mt-1"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";