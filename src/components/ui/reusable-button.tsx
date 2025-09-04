import React, { forwardRef } from 'react';
import { ButtonProps } from './button'; // assuming ButtonProps from your base Button component
import { cn } from '@/lib/utils';

export interface ReusableButtonProps extends Omit<ButtonProps, 'size' | 'variant' | 'type'> {
  // Core props
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;

  // Size variants (matching Ant Design)
  size?: 'small' | 'middle' | 'large';

  // Style variants (matching Ant Design)
  variant?: 'link' | 'text' | 'default' | 'primary' | 'dashed';

  // Shape variants
  shape?: 'default' | 'circle' | 'round';

  // Danger state
  danger?: boolean;

  // Ghost mode
  ghost?: boolean;

  // Block (full width)
  block?: boolean;

  // Native HTML button type attribute
  htmlType?: 'button' | 'submit' | 'reset';

  // Href for link behavior
  href?: string;
  target?: string;

  // Auto focus
  autoFocus?: boolean;

  // Custom loading icon
  loadingIcon?: React.ReactNode;

  // Auto insert space between characters (for Chinese)
  autoInsertSpace?: boolean;
}

const getSizeClasses = (
  size: ReusableButtonProps['size'], 
  shape: ReusableButtonProps['shape']
) => {
  const sizeMap = {
    small: {
      default: 'h-7 px-2 text-xs',
      circle: 'h-7 w-7 p-0',
      round: 'h-7 px-3 text-xs rounded-full',
    },
    middle: {
      default: 'h-8 px-3 text-sm',
      circle: 'h-8 w-8 p-0',
      round: 'h-8 px-4 text-sm rounded-full',
    },
    large: {
      default: 'h-10 px-4 text-base',
      circle: 'h-10 w-10 p-0',
      round: 'h-10 px-6 text-base rounded-full',
    },
  };

  return sizeMap[size || 'middle'][shape || 'default'];
};

const getTypeClasses = (
  variant: ReusableButtonProps['variant'], 
  danger: boolean, 
  ghost: boolean
) => {
  if (danger) {
    if (ghost) {
      return {
        primary: 'border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 bg-transparent',
        default: 'border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 bg-transparent',
        dashed: 'border-dashed border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 bg-transparent',
        text: 'text-red-500 hover:text-red-400 bg-transparent border-transparent hover:bg-red-50',
        link: 'text-red-500 hover:text-red-400 bg-transparent border-transparent hover:underline shadow-none',
      }[variant || 'default'];
    }

    return {
      primary: 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600',
      default: 'border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 bg-white',
      dashed: 'border-dashed border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 bg-white',
      text: 'text-red-500 hover:text-red-600 bg-transparent border-transparent hover:bg-red-50',
      link: 'text-red-500 hover:text-red-600 bg-transparent border-transparent hover:underline shadow-none',
    }[variant || 'default'];
  }

  if (ghost) {
    return {
      primary: 'border-blue-500 text-blue-500 hover:border-blue-400 hover:text-blue-400 bg-transparent',
      default: 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400 bg-transparent',
      dashed: 'border-dashed border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400 bg-transparent',
      text: 'text-gray-700 hover:text-blue-500 bg-transparent border-transparent hover:bg-gray-50',
      link: 'text-blue-500 hover:text-blue-400 bg-transparent border-transparent hover:underline shadow-none',
    }[variant || 'default'];
  }

  return {
    primary: 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600',
    default: 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400 bg-white hover:bg-gray-50',
    dashed: 'border-dashed border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400 bg-white hover:bg-gray-50',
    text: 'text-gray-700 hover:text-blue-500 bg-transparent border-transparent hover:bg-gray-50',
    link: 'text-blue-500 hover:text-blue-400 bg-transparent border-transparent hover:underline shadow-none',
  }[variant || 'default'];
};

const getShapeClasses = (shape: ReusableButtonProps['shape']) => {
  return {
    default: 'rounded-md',
    circle: 'rounded-full',
    round: 'rounded-full',
  }[shape || 'default'];
};

export const ReusableButton = forwardRef<HTMLButtonElement, ReusableButtonProps>(
  (
    {
      children,
      icon,
      iconPosition,
      loading = false,
      disabled,
      className,
      size = 'middle',
      variant = 'default',
      shape = 'default',
      danger = false,
      ghost = false,
      block = false,
      htmlType = 'button',
      href,
      target,
      autoFocus = false,
      loadingIcon,
      autoInsertSpace = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const isIconOnly = !children && (icon || loading);
    const effectiveShape = isIconOnly ? 'circle' : shape;

    // Auto insert space for Chinese characters
    const processedChildren = React.useMemo(() => {
      if (!autoInsertSpace || typeof children !== 'string') return children;

      // Simple check for mixed Chinese/English content
      const hasChinese = /[\u4e00-\u9fff]/.test(children);
      const hasEnglish = /[a-zA-Z]/.test(children);

      if (hasChinese && hasEnglish) {
        return children
          .replace(/([\u4e00-\u9fff])([a-zA-Z])/g, '$1 $2')
          .replace(/([a-zA-Z])([\u4e00-\u9fff])/g, '$1 $2');
      }

      return children;
    }, [children, autoInsertSpace]);

    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-auto border',

      // Size classes
      getSizeClasses(size, effectiveShape),

      // Variant style classes
      getTypeClasses(variant, danger, ghost),

      // Shape classes
      getShapeClasses(effectiveShape),

      // Block (full width)
      block && 'w-full',

      // Loading state
      loading && 'opacity-50 cursor-not-allowed',

      // Disabled state
      isDisabled && 'opacity-50 bg-gray-100 cursor-not-allowed',

      // Gap for icon and text
      (icon || loading) && children && 'gap-2',

      className
    );

    const renderContent = () => {
      const loadingSpinner =
        loadingIcon || (
          <div
            className={cn(
              'animate-spin rounded-full border-b-2 border-current',
              size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-4 w-4'
            )}
          />
        );

      return (
        <>
          {loading && loadingSpinner}
          {!loading && icon && iconPosition === 'left' && (
            <span
              className={cn(
                'flex items-center',
                size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'
              )}
            >
              {icon}
            </span>
          )}
          {processedChildren && (
            <span className={isIconOnly ? 'sr-only' : undefined}>{processedChildren}</span>
          )}
          {!loading && icon && iconPosition === 'right' && (
            <span
              className={cn(
                'flex items-center',
                size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'
              )}
            >
              {icon}
            </span>
          )}
        </>
      );
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    };

    // Render as link if href is provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          className={baseClasses}
          onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
          {...(props as unknown as React.HTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={isDisabled}
        autoFocus={autoFocus}
        className={baseClasses}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

ReusableButton.displayName = 'ReusableButton';
