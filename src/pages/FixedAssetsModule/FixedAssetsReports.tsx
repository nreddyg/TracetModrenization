
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, History, MapPin, Building2, Settings2, DollarSign, Users, LucideIcon } from 'lucide-react';
import { AssetPageHeader } from '@/components/fixedassets/AssetPageHeader';

interface ReportCard {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const FixedAssetsReports = () => {
  const navigate = useNavigate();

  const reports: ReportCard[] = [
    {
      title: 'Asset Count',
      description: 'View asset count by location, department, and category',
      icon: FileText,
      path: '/fixedassets/reports/asset-count',
    },
    {
      title: 'Asset History',
      description: 'Track complete history of asset changes and movements',
      icon: History,
      path: '/fixedassets/reports/asset-history',
    },
    {
      title: 'Asset Location History',
      description: 'Monitor asset location changes over time',
      icon: MapPin,
      path: '/fixedassets/reports/asset-location-history',
    },
    {
      title: 'Assets By Group Companies',
      description: 'View assets distributed across group companies',
      icon: Building2,
      path: '/fixedassets/reports/assets-by-group-companies',
    },
    {
      title: 'Assets By Masters',
      description: 'Generate reports based on master data filters',
      icon: TrendingUp,
      path: '/fixedassets/reports/assets-by-masters',
    },
    {
      title: 'Assets With Attributes',
      description: 'View assets with detailed attribute information',
      icon: Settings2,
      path: '/fixedassets/reports/assets-with-attributes',
    },
    {
      title: 'Assets With Cost Breakup',
      description: 'Analyze asset costs with detailed breakup',
      icon: DollarSign,
      path: '/fixedassets/reports/assets-with-cost-breakup',
    },
    {
      title: 'User Acknowledgement Report',
      description: 'Track user asset acknowledgements and status',
      icon: Users,
      path: '/fixedassets/reports/user-acknowledgement',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate comprehensive reports for fixed assets</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(report.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FixedAssetsReports;
