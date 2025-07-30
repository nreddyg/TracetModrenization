
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveBreadcrumb } from './ResponsiveBreadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, breadcrumbs }) => {
  return (
    <>
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger />
          <ResponsiveBreadcrumb items={breadcrumbs} className="flex-1 min-w-0" />
        </div>
      </header>
      
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{description}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PageHeader;
