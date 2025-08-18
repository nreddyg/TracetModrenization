import React, { forwardRef, useCallback, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export interface ReusableRadioProps {
  // Basic props
  label?: string;
  tooltip?: string;
  error?: string;
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  
  // Layout & Appearance
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
  
  // Variants (Ant Design inspired)
  variant?: 'default' | 'button' | 'solid';
  buttonStyle?: 'outline' | 'solid';
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Styling
  containerClassName?: string;
  className?: string;
  optionType?: 'default' | 'button';
  
  // Events
  onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  // Advanced features
  name?: string;
  id?: string;
  autoFocus?: boolean;
  required?: boolean;
  
  // Custom render functions
  renderOption?: (option: RadioOption, index: number) => React.ReactNode;
}

export const ReusableRadio = forwardRef<HTMLDivElement, ReusableRadioProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    options,
    value,
    defaultValue,
    direction = 'vertical',
    size = 'md',
    labelPosition = 'right',
    variant = 'default',
    buttonStyle = 'outline',
    disabled = false,
    loading = false,
    containerClassName,
    className,
    optionType = 'default',
    onChange,
    onFocus,
    onBlur,
    name,
    id,
    autoFocus = false,
    required = false,
    renderOption,
    ...props 
  }, ref) => {
    
    const handleValueChange = useCallback((newValue: string) => {
      if (onChange) {
        onChange(newValue);
      }
    }, [onChange]);

    const renderLabel = () => {
      if (!label) return null;

      const labelElement = (
        <Label 
          className={cn(
            "text-sm font-medium",
            disabled && "text-muted-foreground",
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
          htmlFor={id}
        >
          {label}
        </Label>
      );

      if (tooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 cursor-help">
                  {labelElement}
                  <div className="w-3 h-3 rounded-full border border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground">
                    ?
                  </div>
                </div>
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

    const sizeClasses = {
      sm: {
        radio: 'h-3 w-3',
        text: 'text-xs',
        button: 'h-6 px-2 text-xs',
        gap: 'gap-1.5'
      },
      md: {
        radio: 'h-4 w-4',
        text: 'text-sm',
        button: 'h-8 px-3 text-sm',
        gap: 'gap-2'
      },
      lg: {
        radio: 'h-5 w-5',
        text: 'text-base',
        button: 'h-10 px-4 text-base',
        gap: 'gap-3'
      }
    };

    const currentSize = sizeClasses[size];

    // Button variant rendering
    const renderButtonOption = (option: RadioOption, index: number) => {
      const isSelected = value === option.value;
      const isDisabled = option.disabled || disabled || loading;

      if (renderOption) {
        return renderOption(option, index);
      }

      const buttonVariant = buttonStyle === 'solid' 
        ? (isSelected ? 'default' : 'outline')
        : (isSelected ? 'default' : 'ghost');

      return (
        <Button
          key={option.value}
          variant={buttonVariant}
          size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
          className={cn(
            "transition-all duration-200",
            currentSize.button,
            isSelected && buttonStyle === 'solid' && "bg-primary text-primary-foreground shadow",
            isSelected && buttonStyle === 'outline' && "border-primary bg-primary/10 text-primary",
            isDisabled && "opacity-50 cursor-not-allowed",
            loading && "opacity-60",
            option.className
          )}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleValueChange(option.value)}
          onFocus={()=>{onFocus}}
          onBlur={()=>onBlur}
          autoFocus={index === 0 && autoFocus}
          style={option.style}
          type="button"
        >
          {loading && isSelected && (
            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {option.label}
        </Button>
      );
    };

    // Default radio option rendering
    const renderDefaultOption = (option: RadioOption, index: number) => {
      const isDisabled = option.disabled || disabled || loading;

      if (renderOption) {
        return renderOption(option, index);
      }

      return (
        <div 
          key={option.value} 
          className={cn(
            "flex items-center",
            currentSize.gap,
            labelPosition === 'left' && "flex-row-reverse justify-end",
            isDisabled && "opacity-50 cursor-not-allowed",
            option.className
          )}
          style={option.style}
        >
          <RadioGroupItem
            value={option.value}
            id={`${id || name || 'radio'}-${option.value}`}
            disabled={isDisabled}
            className={cn(
              currentSize.radio,
              "transition-all duration-200",
              loading && value === option.value && "animate-pulse"
            )}
            onFocus={()=>onFocus}
            onBlur={()=>onBlur}
            autoFocus={index === 0 && autoFocus}
          />
          <Label 
            htmlFor={`${id || name || 'radio'}-${option.value}`} 
            className={cn(
              currentSize.text,
              "cursor-pointer transition-colors duration-200",
              isDisabled && "cursor-not-allowed",
              "hover:text-foreground/80"
            )}
          >
            {loading && value === option.value && (
              <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {option.label}
          </Label>
        </div>
      );
    };

    const isButtonVariant = optionType === 'button' || variant === 'button' || variant === 'solid';

    const containerClasses = cn(
      "space-y-2",
      disabled && "opacity-60",
      containerClassName
    );

    const radioGroupClasses = cn(
      isButtonVariant 
        ? (direction === 'horizontal' ? 'flex flex-row flex-wrap gap-2' : 'flex flex-col gap-2')
        : (direction === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-2'),
      className
    );

    if (isButtonVariant) {
      return (
        <div className={containerClasses}>
          {renderLabel()}
          <div className={radioGroupClasses}>
            {options.map((option, index) => renderButtonOption(option, index))}
          </div>
          {error && (
            <p className={cn(
              "text-red-500 flex items-center gap-1",
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        {renderLabel()}
        <RadioGroup
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={disabled || loading}
          className={radioGroupClasses}
          name={name}
          required={required}
          {...props}
        >
          {options.map((option, index) => renderDefaultOption(option, index))}
        </RadioGroup>
        {error && (
          <p className={cn(
            "text-red-500 flex items-center gap-1",
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

ReusableRadio.displayName = "ReusableRadio";