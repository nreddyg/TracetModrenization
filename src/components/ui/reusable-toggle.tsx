
import React, { forwardRef } from 'react';
import { Switch } from './switch';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export interface ReusableToggleProps {
  label?: string;
  tooltip?: string;
  error?: string;
  checked?: boolean;
  disabled?: boolean;
  preLabel?: string;
  postLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export const ReusableToggle = forwardRef<HTMLButtonElement, ReusableToggleProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    checked = false,
    disabled = false,
    preLabel,
    postLabel,
    size = 'md',
    containerClassName,
    className,
    onChange,
    ...props 
  }, ref) => {
    const renderLabel = () => {
      if (!label) return null;

      const labelElement = <Label className="text-sm font-medium">{label}</Label>;

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

    const sizeClasses = {
      sm: 'h-4 w-7',
      md: 'h-6 w-11',
      lg: 'h-8 w-14'
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {renderLabel()}
        <div className="flex items-center space-x-2">
          {preLabel && <Label className="text-sm">{preLabel}</Label>}
          <Switch
            ref={ref}
            checked={checked}
            disabled={disabled}
            onCheckedChange={onChange}
            className={cn(sizeClasses[size], className)}
            {...props}
          />
          {postLabel && <Label className="text-sm">{postLabel}</Label>}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

ReusableToggle.displayName = "ReusableToggle";
