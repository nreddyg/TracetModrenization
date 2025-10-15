
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Home,
  Settings,
  Building2,
  Package,
  Wrench,
  FileText,
  HardHat,
  ShoppingCart,
  DollarSign,
  Calculator,
  Search,
  Headphones,
  Cog,
  ChevronRight,
  ChevronDown,
  Star,
  AlertCircle,
  Users,
  BarChart,
  Calendar,
  TrendingUp,
  Shield
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  link: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  // {
  //   label: 'Dashboard',
  //   icon: Home,
  //   link: '/dashboard',
  // },
  // {
  //   label: 'Timesheet',
  //   icon: Calculator,
  //   link: '/timesheet',
  // },
  // {
  //   label: 'Projects',
  //   icon: Calendar,
  //   link: '/projects',
  // },
  // {
  //   label: 'Payroll',
  //   icon: Calculator,
  //   link: '/payroll',
  //   children: [
  //     {
  //       label: 'Dashboard',
  //       icon: BarChart,
  //       link: '/payroll',
  //     },
  //     {
  //       label: 'Indian Payroll',
  //       icon: Building2,
  //       link: '/payroll/indian',
  //     },
  //     {
  //       label: 'US Payroll',
  //       icon: Building2,
  //       link: '/payroll/us',
  //     },
  //   ],
  // },
  {
    label: 'Service Desk',
    icon: Headphones,
    link: '/service-desk',
    children: [
      {
        label: 'New Service Request',
        icon: AlertCircle,
        link: '/service-desk/create-ticket',
      },
      {
        label: 'My Workbench',
        icon: Users,
        link: '/service-desk/my-workbench',
      },
      {
        label: 'My Requests',
        icon: FileText,
        link: '/service-desk/my-requests',
      },
            {
        label: 'All Service Requests',
        icon: FileText,
        link: '/service-desk/all-requests',
      },
      // {
      //   label: 'Ticket Progress Dashboard',
      //   icon: TrendingUp,
      //   link: '/service-desk/ticket-progress',
      // },

      // {
      //   label: 'Create Work Order',
      //   icon: Wrench,
      //   link: '/service-desk/create-work-order',
      // },
      // {
      //   label: 'Manage Work Order',
      //   icon: Wrench,
      //   link: '/service-desk/work-management',
      // },
      {
        label: 'User Groups',
        icon: Users,
        link: '/service-desk/user-groups',
      },
      {
        label: 'Configuration',
        icon: Settings,
        link: '/service-desk/configuration',
      },
      {
        label: 'Subscription',
        icon: Star,
        link: '/service-desk/subscription',
      },
      {
        label: 'Reports',
        icon: BarChart,
        link: '/service-desk/reports',
      },
      // {
      //   label: 'MIS Reports',
      //   icon: BarChart,
      //   link: '/service-desk/mis-reports',
      // },
    
    ],
  },
  {
    label: 'Masters',
    icon: Building2,
    link: '/masters',
    children: [
      {
        label: 'Organization',
        icon: Building2,
        link: '/masters/organization',
      },
      {
        label: 'Company Hierarchy',
        icon: Building2,
        link: '/masters/company-hierarchy',
      },
      {
        label: 'Department',
        icon: Building2,
        link: '/masters/department',
      },
      {
        label: 'Assets & Inventory',
        icon: Package,
        link: '/masters/assets-inventory',
      },
      {
        label: 'Maintenance',
        icon: Wrench,
        link: '/masters/maintenance',
      },
      {
        label: 'Reports',
        icon: FileText,
        link: '/masters/reports',
      },
        {
        label: 'Store',
        icon: BarChart,
        link: '/masters/store',
      },
    ],
    
  },
  // {
  //   label: 'CWIP',
  //   icon: HardHat,
  //   link: '/cwip',
  //   children: [
  //     {
  //       label: 'Project Management',
  //       icon: HardHat,
  //       link: '/cwip/project-management',
  //     },
  //     {
  //       label: 'Asset Operations',
  //       icon: Package,
  //       link: '/cwip/asset-operations',
  //     },
  //     {
  //       label: 'Verification Tracking',
  //       icon: Search,
  //       link: '/cwip/verification-tracking',
  //     },
  //     {
  //       label: 'Data Management',
  //       icon: FileText,
  //       link: '/cwip/data-management',
  //     },
  //     {
  //       label: 'Reports',
  //       icon: FileText,
  //       link: '/cwip/reports',
  //     },
  //   ],
  // },
  // {
  //   label: 'Procurement',
  //   icon: ShoppingCart,
  //   link: '/procurement',
  //   children: [
  //     {
  //       label: 'Purchase Requests',
  //       icon: FileText,
  //       link: '/procurement/purchase-requests',
  //     },
  //     {
  //       label: 'Purchase Orders',
  //       icon: ShoppingCart,
  //       link: '/procurement/purchase-orders',
  //     },
  //     {
  //       label: 'Goods Management',
  //       icon: Package,
  //       link: '/procurement/goods-management',
  //     },
  //     {
  //       label: 'Reports',
  //       icon: FileText,
  //       link: '/procurement/reports',
  //     },
  //   ],
  // },
  // {
  //   label: 'Fixed Assets',
  //   icon: Package,
  //   link: '/fixed-assets',
  //   children: [
  //     {
  //       label: 'Asset Management',
  //       icon: Package,
  //       link: '/fixed-assets/asset-management',
  //     },
  //     {
  //       label: 'Asset Operations',
  //       icon: Wrench,
  //       link: '/fixed-assets/asset-operations',
  //     },
  //     {
  //       label: 'Asset Maintenance',
  //       icon: Wrench,
  //       link: '/fixed-assets/asset-maintenance',
  //     },
  //     {
  //       label: 'Reports',
  //       icon: FileText,
  //       link: '/fixed-assets/reports',
  //     },
  //   ],
  // },
  // {
  //   label: 'Depreciation',
  //   icon: DollarSign,
  //   link: '/depreciation',
  //   children: [
  //     {
  //       label: 'Process',
  //       icon: DollarSign,
  //       link: '/depreciation/process',
  //     },
  //     {
  //       label: 'Adjustments',
  //       icon: DollarSign,
  //       link: '/depreciation/adjustments',
  //     },
  //     {
  //       label: 'Analysis',
  //       icon: DollarSign,
  //       link: '/depreciation/analysis',
  //     },
  //     {
  //       label: 'Reports',
  //       icon: FileText,
  //       link: '/depreciation/reports',
  //     },
  //   ],
  // },
  // {
  //   label: 'Consumables',
  //   icon: Package,
  //   link: '/consumables',
  //   children: [
  //     {
  //       label: 'Receiving',
  //       icon: Package,
  //       link: '/consumables/receiving',
  //     },
  //     {
  //       label: 'Inventory Operations',
  //       icon: Package,
  //       link: '/consumables/inventory-operations',
  //     },
  //     {
  //       label: 'Verification',
  //       icon: Search,
  //       link: '/consumables/verification',
  //     },
  //     {
  //       label: 'Reports',
  //       icon: FileText,
  //       link: '/consumables/reports',
  //     },
  //   ],
  // },
  // {
  //   label: 'Physical Verification',
  //   icon: Search,
  //   link: '/physical-verification',
  //   children: [
  //     {
  //       label: 'Audit Planning',
  //       icon: Search,
  //       link: '/physical-verification/audit-planning',
  //     },
  //     {
  //       label: 'Verification Methods',
  //       icon: Search,
  //       link: '/physical-verification/verification-methods',
  //     },
  //     {
  //       label: 'Reconciliation',
  //       icon: Search,
  //       link: '/physical-verification/reconciliation',
  //     },
  //     {
  //       label: 'Category Management',
  //       icon: Search,
  //       link: '/physical-verification/category-management',
  //     },
  //   ],
  // },
  // {
  //   label: 'Utilities',
  //   icon: Cog,
  //   link: '/utilities',
  //   children: [
  //     {
  //       label: 'Printing Codes',
  //       icon: Cog,
  //       link: '/utilities/printing-codes',
  //     },
  //     {
  //       label: 'Data Management',
  //       icon: FileText,
  //       link: '/utilities/data-management',
  //     },
  //     {
  //       label: 'Tracking Monitoring',
  //       icon: Search,
  //       link: '/utilities/tracking-monitoring',
  //     },
  //     {
  //       label: 'Notifications',
  //       icon: AlertCircle,
  //       link: '/utilities/notifications',
  //     },
  //   ],
  // },
  // {
  //   label: 'Settings',
  //   icon: Settings,
  //   link: '/settings',
  //   children: [
  //     {
  //       label: 'System Configuration',
  //       icon: Settings,
  //       link: '/settings/system-configuration',
  //     },
  //     {
  //       label: 'User Management',
  //       icon: HardHat,
  //       link: '/settings/user-management',
  //     },
  //     {
  //       label: 'Process Configuration',
  //       icon: Cog,
  //       link: '/settings/process-configuration',
  //     },
  //     {
  //       label: 'Advanced Setup',
  //       icon: Settings,
  //       link: '/settings/advanced-setup',
  //     },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (link: string) => {
    return location.pathname.includes(link);
  };

  const isSubMenuOpen = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(child => {
      if (child.children) {
        return child.children.some(grandChild => isActive(grandChild.link));
      }
      return isActive(child.link);
    });
  };

  const isNestedSubMenuOpen = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.link));
  };

  // Filter navigation based on search term
  const filteredNavigation = React.useMemo(() => {
    if (!searchTerm) return navigation;

    return navigation.filter(item => {
      const itemMatches = item.label.toLowerCase().includes(searchTerm.toLowerCase());
      const childMatches = item.children?.some(child =>
        child.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.children?.some(grandChild =>
          grandChild.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      return itemMatches || childMatches;
    }).map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            const childMatches = child.label.toLowerCase().includes(searchTerm.toLowerCase());
            const grandChildMatches = child.children?.some(grandChild =>
              grandChild.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return childMatches || grandChildMatches;
          }).map(child => {
            if (child.children) {
              return {
                ...child,
                children: child.children.filter(grandChild =>
                  grandChild.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
              };
            }
            return child;
          })
        };
      }
      return item;
    });
  }, [searchTerm]);

  const renderMenuItem = (item: NavItem, depth: number = 0) => {
    if (item.children && !collapsed) {
      return (
        <Collapsible key={item.label} className="w-full" defaultOpen={isSubMenuOpen(item)}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.label}>
              <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-blue-50">
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="group-data-[collapsible=icon]:hidden truncate max-w-[180px]">{item.label}</span>
                      </TooltipTrigger>
                      {item.label.length > 25 && (
                        <TooltipContent>
                          <p>{item.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  {isSubMenuOpen(item) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((child) => {
                  if (child.children) {
                    return (
                      <Collapsible key={child.label} className="w-full" defaultOpen={isNestedSubMenuOpen(child)}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-blue-50">
                              <div className="flex items-center space-x-2">
                                <child.icon className="h-3 w-3" />
                                <span>{child.label}</span>
                              </div>
                              {isNestedSubMenuOpen(child) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </CollapsibleTrigger>
                          </SidebarMenuSubButton>
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-4">
                              {child.children.map((grandChild) => (
                                <SidebarMenuSubItem key={grandChild.label}>
                                  <SidebarMenuSubButton asChild isActive={isActive(grandChild.link)}>
                                    <Link to={grandChild.link} className="flex items-center space-x-2">
                                      <grandChild.icon className="h-3 w-3" />
                                      <span
                                       className="truncate"
                                    title={String(grandChild.label)}
                                      >{grandChild.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuSubItem>
                      </Collapsible>
                    );
                  }
                  return (
                    <SidebarMenuSubItem key={child.label}>
                      <SidebarMenuSubButton asChild isActive={isActive(child.link)}>
                        <Link to={child.link} className="flex items-center space-x-2">
                          <child.icon className="h-3 w-3" />
                          <span
                           className="truncate"
                           title={String(child.label)}
                          >{child.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild isActive={isActive(item.link)} tooltip={collapsed ? item.label : undefined}>
          <Link to={item.link} className="flex items-center space-x-1 hover:bg-blue-50">
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="group-data-[collapsible=icon]:hidden truncate max-w-[180px]">{item.label}</span>
                  </TooltipTrigger>
                  {item.label.length > 25 && (
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 px-2 py-1">
          <Building2 className="h-8 w-8 text-blue-600 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xl font-bold text-gray-900">Tracet</span>
              <span className="text-xs text-gray-500">Enterprise Suite</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {filteredNavigation.map((item) => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="relative group-data-[collapsible=icon]:hidden">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 text-black"
                />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        {!collapsed && (
          <div className="text-xs text-white text-center border-t pt-2 group-data-[collapsible=icon]:hidden">
            <div>&copy; {new Date().getFullYear()} Tracet Enterprise</div>
            <div className="text-white font-medium">v2.0.1</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
