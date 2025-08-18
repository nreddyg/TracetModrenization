import React, { forwardRef, useState, useRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { Textarea } from './textarea';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export interface ReusableTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'prefix' | 'resize'> {
  // Existing props
  label?: string;
  tooltip?: string;
  error?: string;
  isRequired?:boolean;
  numberOfRows?: number;
  numberOfColumns?: number;
  containerClassName?: string;
  classNameInput?:string
  
  // Ant Design inspired features
  size?: 'small' | 'middle' | 'large';
  variant?: 'outlined' | 'borderless' | 'filled';
  status?: 'error' | 'warning' | 'success';
  
  // Auto resize functionality
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  
  // Character count and limits
  showCount?: boolean;
  maxLength?: number;
  
  // Clear functionality
  allowClear?: boolean;
  
  // Prefix and suffix (React components, not HTML attributes)
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  
  // Loading state
  loading?: boolean;
  
  // Controlled resize (CSS resize property)
  resizeMode?: 'none' | 'both' | 'horizontal' | 'vertical';
  
  // Events
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onResizing?: (size: { width: number; height: number }) => void;
  onClear?: () => void;
  
  // Focus management
  bordered?: boolean;
}

export interface TextareaRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  textArea: HTMLTextAreaElement | null;
}

export const ReusableTextarea = forwardRef<TextareaRef, ReusableTextareaProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    isRequired=false,
    numberOfRows = 3,
    numberOfColumns=2,
    containerClassName,
    classNameInput,
    className,
    size = 'middle',
    variant = 'outlined',
    status,
    autoSize = false,
    showCount = false,
    maxLength,
    allowClear = false,
    addonBefore,
    addonAfter,
    loading = false,
    resizeMode = 'vertical',
    onPressEnter,
    onResize,
    onResizing,
    onClear,
    bordered = true,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    disabled,
    ...props 
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const resizeObserverRef = useRef<ResizeObserver>();
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [isFocused, setIsFocused] = useState(false);
    
    const currentValue = value !== undefined ? value : internalValue;
    const currentLength = String(currentValue || '').length;
    
    // Auto resize functionality
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoSize) return;
      
      const minRows = typeof autoSize === 'object' ? autoSize.minRows : numberOfRows;
      const maxRows = typeof autoSize === 'object' ? autoSize.maxRows : undefined;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      
      // Calculate min and max heights based on rows
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const paddingHeight = parseInt(getComputedStyle(textarea).paddingTop) + 
                           parseInt(getComputedStyle(textarea).paddingBottom);
      
      let newHeight = scrollHeight;
      
      if (minRows) {
        const minHeight = lineHeight * minRows + paddingHeight;
        newHeight = Math.max(newHeight, minHeight);
      }
      
      if (maxRows) {
        const maxHeight = lineHeight * maxRows + paddingHeight;
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      textarea.style.height = `${newHeight}px`;
    }, [autoSize, numberOfRows]);
    
    // Set up resize observer for onResize callback
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea || !onResizing) return;
      
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          onResizing({ width, height });
        }
      });
      
      resizeObserverRef.current.observe(textarea);
      
      return () => {
        resizeObserverRef.current?.disconnect();
      };
    }, [onResizing]);
    
    // Handle value changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      // Enforce maxLength if specified
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(e);
      
      // Adjust height for auto resize
      if (autoSize) {
        setTimeout(adjustHeight, 0);
      }
    };
    
    // Handle key events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && onPressEnter) {
        onPressEnter(e);
      }
      onKeyDown?.(e);
    };
    
    // Clear functionality
    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      onChange?.(syntheticEvent);
      onClear?.();
      textareaRef.current?.focus();
    };
    
    // Imperative handle
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      clear: handleClear,
      textArea: textareaRef.current,
    }));
    
    // Auto resize on mount and value change
    useEffect(() => {
      if (autoSize) {
        adjustHeight();
      }
    }, [currentValue, adjustHeight]);
    
    // Size classes
    const getSizeClasses = () => {
      switch (size) {
        case 'small':
          return 'text-xs px-2 py-1';
        case 'large':
          return 'text-base px-4 py-3';
        default:
          return 'text-sm px-3 py-2';
      }
    };
    
    // Variant classes
    const getVariantClasses = () => {
      switch (variant) {
        case 'borderless':
          return 'border-0 shadow-none focus:ring-0 focus:border-0';
        case 'filled':
          return 'bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-500';
        default:
          return bordered ? 'border border-gray-300' : 'border-0';
      }
    };
    
    // Status classes
    const getStatusClasses = () => {
      if (error || status === 'error') {
        return 'border-red-500 focus:border-red-500 focus:ring-red-200';
      }
      if (status === 'warning') {
        return 'border-orange-500 focus:border-orange-500 focus:ring-orange-200';
      }
      if (status === 'success') {
        return 'border-green-500 focus:border-green-500 focus:ring-green-200';
      }
      return 'focus:border-blue-500 focus:ring-blue-200';
    };
    
    // Render label
    const renderLabel = () => {
      if (!label) return null;

      const labelElement = <Label className="text-sm font-medium">{label}{isRequired ?<span className='text-red-500'> *</span>:''}</Label>;

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
    
    // Render count
    const renderCount = () => {
      if (!showCount) return null;
      
      const countText = maxLength ? `${currentLength}/${maxLength}` : currentLength;
      const isOverLimit = maxLength && currentLength > maxLength;
      
      return (
        <div className={cn(
          "text-xs mt-1 text-right",
          isOverLimit ? "text-red-500" : "text-gray-500"
        )}>
          {countText}
        </div>
      );
    };
    
    // Render wrapper content
    const renderTextareaWrapper = () => {
      const hasAffixes = addonBefore || addonAfter || allowClear || loading;
      
      if (!hasAffixes) {
        return (
          <Textarea
            ref={textareaRef}
            rows={autoSize ? 1 : numberOfRows}
            cols={numberOfColumns}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled || loading}
            maxLength={showCount ? undefined : maxLength}
            className={cn(
              getSizeClasses(),
              getVariantClasses(),
              getStatusClasses(),
              resizeMode !== 'none' && `resize-${resizeMode}`,
              disabled && "opacity-50 cursor-not-allowed",
              className,classNameInput
            )}
            style={{
              resize: resizeMode,
              ...props.style
            }}
            {...props}
          />
        );
      }
      
      // Wrapper with affixes
      return (
        <span className={cn(
         "relative flex flex-col p-0 m-0",
          getVariantClasses(),
          getStatusClasses(),
         
          "rounded-md transition-all duration-200",
         
        )}>
          {/* Top affixes */}
          {addonBefore && (
            <div className="flex items-center px-3 pt-2 text-gray-500">
              {addonBefore}
            </div>
          )}
          
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            rows={autoSize ? 8 : numberOfRows}
            cols={numberOfColumns}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled || loading}
            maxLength={showCount ? undefined : maxLength}
            className={cn(
              getSizeClasses(),
              "border-0 shadow-none focus:ring-0 resize-none ",
              resizeMode !== 'none' && `resize-${resizeMode}`,
              disabled && "opacity-50 cursor-not-allowed",
              addonBefore && "pt-0",
              (addonAfter || allowClear || loading) && "pb-0",
              className
            )}
            style={{
              resize: resizeMode,
              ...props.style
            }}
            {...props}
          />
          
          {/* Bottom affixes */}
          {(addonAfter || allowClear || loading) && (
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="text-gray-500">
                {addonAfter}
              </div>
              <div className="flex items-center space-x-1">
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                )}
                {allowClear && !disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </span>
      );
    };

    return (
      <div className={cn("space-y-2  ", containerClassName)}>
        {renderLabel()}
        {renderTextareaWrapper()}
        {(error || status === 'error') && <p className="text-xs text-red-500">{error}</p>}
        {status === 'warning' && <p className="text-xs text-orange-500">Warning message</p>}
        {status === 'success' && <p className="text-xs text-green-500">Success message</p>}
        {renderCount()}
      </div>
    );
  }
);

ReusableTextarea.displayName = "ReusableTextarea";