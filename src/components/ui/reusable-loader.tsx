
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/store/reduxStore';
import { cn } from '@/lib/utils';

export interface ReusableLoaderProps {
  spinning?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
  position?: 'center' | 'top' | 'bottom';
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  tip?: string;
  indicator?: React.ReactNode;
  wrapperClassName?: string;
  theme?: 'light' | 'dark' | 'auto';
  overlay?: boolean;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  percent?: number;
  showPercent?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  type?: 'loader' | 'default' | 'dots' | 'pulse' | 'bars' | 'progress' | 'spin';
  direction?: 'horizontal' | 'vertical';
}

export const ReusableLoader: React.FC<ReusableLoaderProps> = ({
  spinning: propSpinning,
  size = 'md',
  position = 'center',
  delay = 0,
  style,
  className,
  children,
  tip,
  indicator,
  wrapperClassName,
  theme = 'auto',
  overlay = true,
  overlayClassName,
  overlayStyle,
  percent,
  showPercent = false,
  strokeWidth,
  strokeColor = 'hsl(var(--primary))',
  trailColor = 'hsl(var(--muted))',
  type = 'loader',
  direction = 'vertical'
}) => {
  const globalLoading = useAppSelector((state: RootState) => state.projects.loading);
  const [delayedSpinning, setDelayedSpinning] = React.useState(false);

  const spinning = propSpinning !== undefined ? propSpinning : globalLoading;

  React.useEffect(() => {
    if (spinning) {
      const timer = setTimeout(() => {
        setDelayedSpinning(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setDelayedSpinning(false);
    }
  }, [spinning, delay]);

  // Size configuration
  const getSizeConfig = () => {
    if (typeof size === 'number') {
      return {
        className: '',
        style: { width: size, height: size, borderWidth: Math.max(2, size / 8) }
      };
    }
    
    const sizeConfigs = {
      sm: { className: 'h-4 w-4', borderWidth: 2 },
      md: { className: 'h-8 w-8', borderWidth: 3 },
      lg: { className: 'h-12 w-12', borderWidth: 4 }
    };
    
    return {
      className: sizeConfigs[size].className,
      style: { borderWidth: strokeWidth || sizeConfigs[size].borderWidth }
    };
  };

  const sizeConfig = getSizeConfig();

  // Position classes
  const positionClasses = {
    center: 'fixed inset-0 flex items-center justify-center',
    top: 'fixed top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'fixed bottom-4 left-1/2 transform -translate-x-1/2'
  };

  // Theme classes
  const getThemeClasses = () => {
   const baseOverlay = overlay ? 'bg-background/10 backdrop-blur-[1px] loader-overlay' : '';
    if (theme === 'light') return `${baseOverlay} text-foreground`;
    if (theme === 'dark') return `${baseOverlay} bg-black/80 text-white`;
    return `${baseOverlay} text-foreground`; // auto
  };

  // Spinner components
  const DefaultSpinner = () => (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-t-transparent",
        sizeConfig.className
      )}
      style={{
        ...sizeConfig.style,
        borderColor: trailColor,
        borderTopColor: 'transparent',
        borderRightColor: strokeColor,
        borderBottomColor: strokeColor,
        borderLeftColor: strokeColor,
      }}
    />
  );

  const DotsSpinner = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            typeof size === 'number' ? '' : {
              sm: 'h-1 w-1',
              md: 'h-2 w-2', 
              lg: 'h-3 w-3'
            }[size]
          )}
          style={{
            backgroundColor: strokeColor,
            animationDelay: `${i * 0.2}s`,
            ...(typeof size === 'number' && {
              width: size / 4,
              height: size / 4
            })
          }}
        />
      ))}
    </div>
  );

  const PulseSpinner = () => (
    <div
      className={cn(
        "rounded-full animate-ping",
        sizeConfig.className
      )}
      style={{
        backgroundColor: strokeColor,
        opacity: 0.7,
        ...sizeConfig.style
      }}
    />
  );

  const BarsSpinner = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-sm",
            typeof size === 'number' ? '' : {
              sm: 'w-0.5',
              md: 'w-1',
              lg: 'w-1.5'
            }[size]
          )}
          style={{
            backgroundColor: strokeColor,
            animationDelay: `${i * 0.15}s`,
            height: typeof size === 'number' ? size : {
              sm: 16,
              md: 32,
              lg: 48
            }[size],
            width: typeof size === 'number' ? size / 8 : undefined,
          }}
        />
      ))}
    </div>
  );

  const ProgressSpinner = () => {
    const radius = typeof size === 'number' ? size / 2 - 4 : { sm: 6, md: 14, lg: 22 }[size];
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (circumference * (percent || 0)) / 100;

    return (
      <div className="relative">
        <svg
          className={cn(
            "transform -rotate-90",
            sizeConfig.className
          )}
          style={typeof size === 'number' ? { width: size, height: size } : {}}
        >
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={trailColor}
            strokeWidth={strokeWidth || sizeConfig.style.borderWidth}
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth || sizeConfig.style.borderWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        {showPercent && percent !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {Math.round(percent)}%
          </div>
        )}
      </div>
    );
  };

  const Spinner = () => {
  return (
    <>
      <style>{`
        @keyframes pulse0112 {
          0%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pulse0112 {
          animation: pulse0112 1s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative flex items-center justify-start h-11 w-11">
        {/* Dot 1 - 0deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '0s' }} />
        </div>
        
        {/* Dot 2 - 45deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-45">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.7875s' }} />
        </div>
        
        {/* Dot 3 - 90deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-90">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.675s' }} />
        </div>
        
        {/* Dot 4 - 135deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-[135deg]">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.5625s' }} />
        </div>
        
        {/* Dot 5 - 180deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-180">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.45s' }} />
        </div>
        
        {/* Dot 6 - 225deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-[225deg]">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.3375s' }} />
        </div>
        
        {/* Dot 7 - 270deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-[270deg]">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.225s' }} />
        </div>
        
        {/* Dot 8 - 315deg */}
        <div className="absolute top-0 left-0 flex items-center justify-start h-full w-full rotate-[315deg]">
          <div className="h-[20%] w-[20%] rounded-full bg-[#183153] transform scale-0 opacity-50 animate-pulse0112 shadow-[0_0_20px_rgba(18,31,53,0.3)]" 
               style={{ animationDelay: '-0.1125s' }} />
        </div>
      </div>
    </>
  );
  };

  const Loader: React.FC = () => {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="loader relative w-10 h-10 rotate-[165deg]" />
        <style>
          {`
            .loader::before,
            .loader::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              display: block;
              width: 0.5em;
              height: 0.5em;
              border-radius: 0.25em;
              transform: translate(-50%, -50%);
            }

            .loader::before {
              animation: before8 2s infinite;
            }

            .loader::after {
              animation: after6 2s infinite;
            }

            @keyframes before8 {
              0% {
                width: 0.5em;
                box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
                            -1em 0.5em rgba(111, 202, 220, 0.75);
              }
              35% {
                width: 2.5em;
                box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75),
                            0 0.5em rgba(111, 202, 220, 0.75);
              }
              70% {
                width: 0.5em;
                box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75),
                            1em 0.5em rgba(111, 202, 220, 0.75);
              }
              100% {
                box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
                            -1em 0.5em rgba(111, 202, 220, 0.75);
              }
            }

            @keyframes after6 {
              0% {
                height: 0.5em;
                box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
                            -0.5em -1em rgba(233, 169, 32, 0.75);
              }
              35% {
                height: 2.5em;
                box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75),
                            -0.5em 0 rgba(233, 169, 32, 0.75);
              }
              70% {
                height: 0.5em;
                box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75),
                            -0.5em 1em rgba(233, 169, 32, 0.75);
              }
              100% {
                box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
                            -0.5em -1em rgba(233, 169, 32, 0.75);
              }
            }

            .loader {
              position: absolute;
              top: calc(50% - 1.25em);
              left: calc(50% - 1.25em);
            }
          `}
        </style>
      </div>
    );
  };

  const renderSpinner = () => {
    if (indicator) return indicator;
    
    switch (type) {
      case 'loader': return <Loader/>;
      case 'dots': return <DotsSpinner />;
      case 'pulse': return <PulseSpinner />;
      case 'bars': return <BarsSpinner />;
      case 'progress': return <ProgressSpinner />;
      case 'spin':return <Spinner/>;
      case 'default':return <DefaultSpinner />;
      default: return <Loader/>;
    }
  };

  // If not spinning and no delay, just render children
  if (!delayedSpinning && !spinning) {
    return <div className={wrapperClassName}>{children}</div>;
  }

  // Render with or without children
  if (!children) {
    // Standalone spinner
    return (
      <div
        className={cn(
          positionClasses[position],
          getThemeClasses(),
          "z-50",
          className
        )}
        style={{ ...overlayStyle, ...style }}
      >
        <div className={cn(
          "flex items-center gap-3",
          direction === 'horizontal' ? 'flex-row' : 'flex-col'
        )}>
          {delayedSpinning && renderSpinner()}
          {tip && (
            <div className="text-sm font-medium text-muted-foreground">
              {tip}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Wrapper with children
  return (
    <div className={cn("relative", wrapperClassName)}>
      {/* Children with conditional opacity */}
      <div className={cn(
        "transition-opacity duration-200",
        delayedSpinning ? "opacity-50 pointer-events-none" : "opacity-100"
      )}>
        {children}
      </div>
      
      {/* Overlay spinner */}
      {delayedSpinning && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center z-50",
            getThemeClasses(),
            overlayClassName
          )}
          style={{ ...overlayStyle, ...style }}
        >
          <div className={cn(
            "flex items-center gap-3 ",
            direction === 'horizontal' ? 'flex-row' : 'flex-col',
            className
          )}>
            {renderSpinner()}
            {tip && (
              <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {tip}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
