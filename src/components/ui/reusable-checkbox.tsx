
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
  
  // Ant Design Compatible Props
  autoFocus?: boolean;
  defaultChecked?: boolean;
  
  // Group Functionality
  options?: CheckboxOption[];
  defaultValue?: (string | number)[];
  
  // Styling Options
  size?: 'small' | 'default' | 'large';
  
  // Event Handlers (Ant Design Compatible)
  onChange?: (e: CheckboxChangeEvent) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onGroupChange?: (checkedValues: (string | number)[]) => void;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[] | string[] | number[];
  value?: (string | number | boolean)[];
  defaultValue?: (string | number)[];
  disabled?: boolean;
  name?: string;
  className?: string;
  size?: 'small' | 'default' | 'large';
  onChange?: (checkedValues: (string | number)[]) => void;
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
    defaultChecked = true,
    options,
    defaultValue = [],
    size = 'default',
    onChange,
    onBlur,
    onFocus,
    onGroupChange,
    ...props 
  }, ref) => {
    // State Management
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [groupValues, setGroupValues] = useState<(string | number)[]>(defaultValue);
    const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);
    const checkboxRef = useRef<HTMLButtonElement>(null);

    // Imperative Handle for Methods
    useImperativeHandle(ref, () => ({
      blur: () => checkboxRef.current?.blur(),
      focus: () => checkboxRef.current?.focus(),
      nativeElement: checkboxRef.current
    }), []);

    // Controlled vs Uncontrolled Logic
    const isControlled = checked !== undefined;
    const actualChecked = isControlled ? checked : internalChecked;

    // Effects
    useEffect(() => {
      if (isControlled && checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked, isControlled]);

    useEffect(() => {
      setIsIndeterminate(indeterminate);
    }, [indeterminate]);

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
      
      const changeEvent: CheckboxChangeEvent = {
        target: {
          checked: newChecked,
          name,
          value
        },
        nativeEvent: event || new Event('change')
      };
      
      onChange?.(changeEvent);
    };

    const handleGroupCheckboxChange = (optionValue: string | number, newChecked: boolean) => {
      let newGroupValues: (string | number)[];
      
      if (newChecked) {
        newGroupValues = [...groupValues, optionValue];
      } else {
        newGroupValues = groupValues.filter(v => v !== optionValue);
      }
      
      setGroupValues(newGroupValues);
      onGroupChange?.(newGroupValues);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      onFocus?.(e);
    };

    // Render Methods
    const renderLabel = (labelText?: string, htmlFor?: string, optionTitle?: string) => {
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
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          data-indeterminate={isIndeterminate}
          {...props}
        />
        {renderLabel(label, name)}
      </div>
    );

    const renderCheckboxGroup = () => {
      if (!options || options.length === 0) return null;

      return (
        <div className="space-y-3">
          {label && (
            <div className="mb-3">
              {renderLabel(label)}
            </div>
          )}
          <div className="space-y-2">
            {options.map((option, index) => {
              const optionId = `${name || 'checkbox'}-option-${index}`;
              const isOptionChecked = groupValues.includes(option.value);
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
                      error && "border-red-500 focus-visible:ring-red-500",
                      option.className
                    )}
                    style={option.style}
                  />
                  {renderLabel(option.label, optionId, option.title)}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const renderErrorMessage = () => {
      if (!error) return null;
      
      return (
        <p className={cn(
          "text-red-500 mt-1",
          sizeClasses.error
        )}>
          {error}
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
    onChange,
    ...props
  }, ref) => {
    // State Management
    const [internalValue, setInternalValue] = useState<(string | number)[]>(
      value as (string | number)[] ?? defaultValue
    );

    const isControlled = value !== undefined;
    const actualValue = isControlled ? (value as (string | number)[]) : internalValue;

    // Effects
    useEffect(() => {
      if (isControlled && value) {
        setInternalValue(value as (string | number)[]);
      }
    }, [value, isControlled]);

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

    // Render
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
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
                className={cn(sizeClasses.checkbox, option.className)}
                style={option.style}
              />
              <Label 
                htmlFor={optionId}
                title={option.title}
                className={cn(
                  "font-medium cursor-pointer select-none",
                  isDisabled && "cursor-not-allowed opacity-50",
                  sizeClasses.label
                )}
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

// Export all types for external use
// export type { CheckboxChangeEvent, CheckboxMethods };