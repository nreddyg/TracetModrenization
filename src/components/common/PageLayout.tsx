
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
