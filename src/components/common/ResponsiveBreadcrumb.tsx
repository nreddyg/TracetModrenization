import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface ResponsiveBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
}

export const ResponsiveBreadcrumb: React.FC<ResponsiveBreadcrumbProps> = ({
  items,
  className,
  maxItems = 3
}) => {
  // On mobile, show only the last few items to prevent overflow
  const mobileItems = items.slice(-Math.min(maxItems, items.length));
  
  return (
    <>
      {/* Desktop Breadcrumb */}
      <div className={cn("hidden lg:block", className)}>
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href} 
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        {item.icon}
                        <span className="text-xs lg:text-sm">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {item.icon}
                      <span className="text-xs lg:text-sm">{item.label}</span>
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Mobile Breadcrumb */}
      <div className={cn("lg:hidden", className)}>
        <Breadcrumb>
          <BreadcrumbList>
            {mobileItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href} 
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        {item.icon}
                        <span className="text-xs truncate max-w-24">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {item.icon}
                      <span className="text-xs truncate max-w-24">{item.label}</span>
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
};