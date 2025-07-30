import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Button } from './button';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { cn } from '@/lib/utils';

interface ResponsiveTabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface ResponsiveTabsProps {
  items: ResponsiveTabItem[];
  defaultValue?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  items,
  defaultValue,
  className,
  variant = 'default',
  orientation = 'horizontal',
  breakpoint = 'md'
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value);
  const [visibleTabs, setVisibleTabs] = useState<ResponsiveTabItem[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<ResponsiveTabItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      };
      
      if (orientation === 'vertical') {
        setIsVertical(window.innerWidth < breakpoints[breakpoint]);
      } else {
        setIsVertical(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, [breakpoint, orientation]);

  useEffect(() => {
    if (isVertical || !tabsListRef.current) {
      setVisibleTabs(items);
      setHiddenTabs([]);
      setShowDropdown(false);
      return;
    }

    const calculateVisibleTabs = () => {
      const container = tabsListRef.current!;
      const containerWidth = container.offsetWidth;
      const dropdownButtonWidth = 40; // Approximate width of dropdown button
      
      let totalWidth = 0;
      let visibleCount = 0;
      
      for (let i = 0; i < items.length; i++) {
        // Estimate tab width based on label length (rough approximation)
        const estimatedWidth = items[i].label.length * 8 + 32; // 8px per char + padding
        if (totalWidth + estimatedWidth + dropdownButtonWidth < containerWidth) {
          totalWidth += estimatedWidth;
          visibleCount++;
        } else {
          break;
        }
      }

      if (visibleCount < items.length) {
        setVisibleTabs(items.slice(0, Math.max(1, visibleCount - 1)));
        setHiddenTabs(items.slice(Math.max(1, visibleCount - 1)));
        setShowDropdown(true);
      } else {
        setVisibleTabs(items);
        setHiddenTabs([]);
        setShowDropdown(false);
      }
    };

    calculateVisibleTabs();
    window.addEventListener('resize', calculateVisibleTabs);
    return () => window.removeEventListener('resize', calculateVisibleTabs);
  }, [items, isVertical]);

  const renderMobileTabs = () => (
    <div className="flex flex-col space-y-2">
      <div className="flex overflow-x-auto scrollbar-hide">
        <TabsList className="flex-nowrap min-w-full">
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="flex-shrink-0 text-xs px-3 py-2"
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              <span className="truncate max-w-20">{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );

  const renderDesktopTabs = () => (
    <div className="flex items-center" ref={tabsListRef}>
      <TabsList className={cn(
        "flex-shrink-0",
        variant === 'pills' && "bg-muted rounded-lg p-1",
        variant === 'underline' && "bg-transparent border-b"
      )}>
        {visibleTabs.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              "flex items-center gap-2",
              variant === 'underline' && "border-b-2 border-transparent data-[state=active]:border-primary"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {showDropdown && hiddenTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 h-9 px-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hiddenTabs.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  activeTab === item.value && "bg-accent"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full", className)}
      orientation={isVertical ? "vertical" : "horizontal"}
    >
      <div className={cn(
        "w-full",
        isVertical ? "block" : "hidden",
        `${breakpoint}:hidden`
      )}>
        {renderMobileTabs()}
      </div>

      <div className={cn(
        "hidden w-full",
        `${breakpoint}:block`
      )}>
        {renderDesktopTabs()}
      </div>

      <div className="mt-4">
        {items.map((item) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className="mt-0 data-[state=inactive]:hidden"
          >
            {item.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};