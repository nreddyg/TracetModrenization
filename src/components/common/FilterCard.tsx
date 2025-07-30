
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FilterCardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const FilterCard: React.FC<FilterCardProps> = ({ 
  title = "Filters", 
  children, 
  actions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        {actions && (
          <div className="flex justify-end gap-3 mt-6">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterCard;
