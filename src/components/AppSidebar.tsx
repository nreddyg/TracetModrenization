import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupContent, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Headphones, Settings, Building2, Package, ChevronRight, ChevronDown, Search, Eye, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RxDotFilled } from 'react-icons/rx';

interface NavItem {
  label: string;
  icon?: React.ComponentType<any>;
  link: string;
  children?: NavItem[];
}

// const navigation: NavItem[] = [
//   // {
//   //   label: 'Dashboard',
//   //   icon: Home,
//   //   link: '/dashboard',
//   // },
//   // {
//   //   label: 'Timesheet',
//   //   icon: Calculator,
//   //   link: '/timesheet',
//   // },
//   // {
//   //   label: 'Projects',
//   //   icon: Calendar,
//   //   link: '/projects',
//   // },
//   // {
//   //   label: 'Payroll',
//   //   icon: Calculator,
//   //   link: '/payroll',
//   //   children: [
//   //     {
//   //       label: 'Dashboard',
//   //       icon: BarChart,
//   //       link: '/payroll',
//   //     },
//   //     {
//   //       label: 'Indian Payroll',
//   //       icon: Building2,
//   //       link: '/payroll/indian',
//   //     },
//   //     {
//   //       label: 'US Payroll',
//   //       icon: Building2,
//   //       link: '/payroll/us',
//   //     },
//   //   ],
//   // },
//   {
//     label: 'Service Desk',
//     icon: Headphones,
//     link: '/service-desk/all-requests',
//     children: [
//       {
//         label: 'New Service Request',
//         icon:RxDotFilled,
//         link: '/service-desk/create-ticket',
//       },
//       {
//         label: 'My Workbench',
//         icon:RxDotFilled,
//         link: '/service-desk/my-workbench',
//       },
//       {
//         label: 'My Requests',
//         icon:RxDotFilled,
//         link: '/service-desk/my-requests',
//       },
//       {
//         label: 'All Service Requests',
//         icon:RxDotFilled,
//         link: '/service-desk/all-requests',
//       },
//       {
//         label: 'Ticket Progress Dashboard',
//         icon:RxDotFilled,
//         link: '/service-desk/ticket-progress-dashboard',
//       },

//       // {
//       //   label: 'Create Work Order',
//       //   icon: Wrench,
//       //   link: '/service-desk/create-work-order',
//       // },
//       // {
//       //   label: 'Manage Work Order',
//       //   icon: Wrench,
//       //   link: '/service-desk/work-management',
//       // },
//       {
//         label: 'User Groups',
//         icon: RxDotFilled,
//         link: '/service-desk/user-groups',
//       },
//       {
//         label: 'Configuration',
//         icon: RxDotFilled,
//         link: '/service-desk/configuration',
//       },
//       {
//         label: 'Subscription',
//         icon: RxDotFilled,
//         link: '/service-desk/subscription',
//       },
//       {
//         label: 'Reports',
//         icon: RxDotFilled,
//         link: '/service-desk/reports',
//       },
//       // {
//       //   label: 'MIS Reports',
//       //   icon: BarChart,
//       //   link: '/service-desk/mis-reports',
//       // },

//     ],
//   },
//   // {
//   //   label: 'Masters',
//   //   icon: Building2,
//   //   link: '/masters',
//   //   children: [
//   //     {
//   //       label: 'Company',
//   //       icon: Building2,
//   //       link: '/company',
//   //       children: [
//   //         {
//   //           label: 'Organization',
//   //           icon: Building2,
//   //           link: '/masters/company/organization',
//   //         },
//   //         {
//   //           label: 'Company Hierarchy',
//   //           icon: Building2,
//   //           link: '/masters/company/company-hierarchy',
//   //         },
//   //         {
//   //           label: 'Department',
//   //           icon: Building2,
//   //           link: '/masters/company/department',
//   //         },
//   //         {
//   //           label: 'Cost Center',
//   //           icon: DollarSign,
//   //           link: '/masters/company/costcenter',
//   //         },
//   //         {
//   //           label: 'Assets & Inventory',
//   //           icon: Package,
//   //           link: '/masters/company/assets-inventory',
//   //         },
//   //         {
//   //           label: 'Maintenance',
//   //           icon: Wrench,
//   //           link: '/masters/company/maintenance',
//   //         },
//   //       ],
//   //     },

//   //     {
//   //       label: 'Fixed Assets',
//   //       icon: Building2,
//   //       link: '/company',
//   //       children: [
//   //         {
//   //           label: 'Consumables',
//   //           icon: Building2,
//   //           link: '/consumables',
//   //           children: [
//   //             {
//   //               label: 'Store',
//   //               icon: BarChart,
//   //               link: '/masters/consumables/store',
//   //             },
//   //             //  {
//   //             //   label: 'Item Master',
//   //             //   icon: BarChart,
//   //             //   link: '/masters/consumables/item-master',
//   //             // },
//   //           ],

//   //         },
//   // {
//   //   label: 'Service Maintenance',
//   //   icon: Building2,
//   //   link: '/servicemaintenance',
//   //   children: [
//   //     {
//   //       label: 'Service Locations',
//   //       icon: Building2,
//   //       link: '/masters/servicemaintenance/servicelocations',
//   //     },
//   //     {
//   //       label: 'Product Masters',
//   //       icon: Building2,
//   //       link: '/masters/servicemaintenance/productmaster',
//   //     },
//   //   ],

//   // },

//   //         ,

//   //       ]
//   //     },
//   //     // {
//   //     //   label: 'CWIP',
//   //     //   icon: HardHat,
//   //     //   link: '/cwip',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Project Management',
//   //     //       icon: HardHat,
//   //     //       link: '/cwip/project-management',
//   //     //     },
//   //     //     {
//   //     //       label: 'Asset Operations',
//   //     //       icon: Package,
//   //     //       link: '/cwip/asset-operations',
//   //     //     },
//   //     //     {
//   //     //       label: 'Verification Tracking',
//   //     //       icon: Search,
//   //     //       link: '/cwip/verification-tracking',
//   //     //     },
//   //     //     {
//   //     //       label: 'Data Management',
//   //     //       icon: FileText,
//   //     //       link: '/cwip/data-management',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reports',
//   //     //       icon: FileText,
//   //     //       link: '/cwip/reports',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Procurement',
//   //     //   icon: ShoppingCart,
//   //     //   link: '/procurement',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Purchase Requests',
//   //     //       icon: FileText,
//   //     //       link: '/procurement/purchase-requests',
//   //     //     },
//   //     //     {
//   //     //       label: 'Purchase Orders',
//   //     //       icon: ShoppingCart,
//   //     //       link: '/procurement/purchase-orders',
//   //     //     },
//   //     //     {
//   //     //       label: 'Goods Management',
//   //     //       icon: Package,
//   //     //       link: '/procurement/goods-management',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reports',
//   //     //       icon: FileText,
//   //     //       link: '/procurement/reports',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Fixed Assets',
//   //     //   icon: Package,
//   //     //   link: '/fixed-assets',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Asset Management',
//   //     //       icon: Package,
//   //     //       link: '/fixed-assets/asset-management',
//   //     //     },
//   //     //     {
//   //     //       label: 'Asset Operations',
//   //     //       icon: Wrench,
//   //     //       link: '/fixed-assets/asset-operations',
//   //     //     },
//   //     //     {
//   //     //       label: 'Asset Maintenance',
//   //     //       icon: Wrench,
//   //     //       link: '/fixed-assets/asset-maintenance',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reports',
//   //     //       icon: FileText,
//   //     //       link: '/fixed-assets/reports',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Depreciation',
//   //     //   icon: DollarSign,
//   //     //   link: '/depreciation',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Process',
//   //     //       icon: DollarSign,
//   //     //       link: '/depreciation/process',
//   //     //     },
//   //     //     {
//   //     //       label: 'Adjustments',
//   //     //       icon: DollarSign,
//   //     //       link: '/depreciation/adjustments',
//   //     //     },
//   //     //     {
//   //     //       label: 'Analysis',
//   //     //       icon: DollarSign,
//   //     //       link: '/depreciation/analysis',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reports',
//   //     //       icon: FileText,
//   //     //       link: '/depreciation/reports',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Consumables',
//   //     //   icon: Package,
//   //     //   link: '/consumables',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Receiving',
//   //     //       icon: Package,
//   //     //       link: '/consumables/receiving',
//   //     //     },
//   //     //     {
//   //     //       label: 'Inventory Operations',
//   //     //       icon: Package,
//   //     //       link: '/consumables/inventory-operations',
//   //     //     },
//   //     //     {
//   //     //       label: 'Verification',
//   //     //       icon: Search,
//   //     //       link: '/consumables/verification',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reports',
//   //     //       icon: FileText,
//   //     //       link: '/consumables/reports',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Physical Verification',
//   //     //   icon: Search,
//   //     //   link: '/physical-verification',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Audit Planning',
//   //     //       icon: Search,
//   //     //       link: '/physical-verification/audit-planning',
//   //     //     },
//   //     //     {
//   //     //       label: 'Verification Methods',
//   //     //       icon: Search,
//   //     //       link: '/physical-verification/verification-methods',
//   //     //     },
//   //     //     {
//   //     //       label: 'Reconciliation',
//   //     //       icon: Search,
//   //     //       link: '/physical-verification/reconciliation',
//   //     //     },
//   //     //     {
//   //     //       label: 'Category Management',
//   //     //       icon: Search,
//   //     //       link: '/physical-verification/category-management',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label: 'Utilities',
//   //     //   icon: Cog,
//   //     //   link: '/utilities',
//   //     //   children: [
//   //     //     {
//   //     //       label: 'Printing Codes',
//   //     //       icon: Cog,
//   //     //       link: '/utilities/printing-codes',
//   //     //     },
//   //     //     {
//   //     //       label: 'Data Management',
//   //     //       icon: FileText,
//   //     //       link: '/utilities/data-management',
//   //     //     },
//   //     //     {
//   //     //       label: 'Tracking Monitoring',
//   //     //       icon: Search,
//   //     //       link: '/utilities/tracking-monitoring',
//   //     //     },
//   //     //     {
//   //     //       label: 'Notifications',
//   //     //       icon: AlertCircle,
//   //     //       link: '/utilities/notifications',
//   //     //     },
//   //     //   ],
//   //     // },
//   //     // {
//   //     //   label:'Change Password',
//   //     //   icon: Package,
//   //     //   link: '/changepassword'
//   //     // },  
//   //   ]
//   // },
//   {
//     label: 'Masters',
//     icon: Building2,
//     link: '/masters/company/organization',
//     children: [
//       {
//         label: 'Company',
//         // icon: Building2,
//         link: '/company',
//         children: [
//           {
//             label: 'Organization',
//             icon:RxDotFilled,
//             link: '/masters/company/organization',
//           },
//           {
//             label: 'Company Hierarchy',
//             icon:RxDotFilled,
//             link: '/masters/company/company-hierarchy',
//           },
//           {
//             label: 'Asset Location',
//             icon:RxDotFilled,
//             link: '/masters/company/asset-location',
//           },
//           {
//             label: 'Department',
//             icon:RxDotFilled,
//             link: '/masters/company/department',
//           },
//           {
//             label: 'Cost Center',
//             icon:RxDotFilled,
//             link: '/masters/company/costcenter',
//           },
//           {
//             label: 'User',
//             icon:RxDotFilled,
//             link: '/masters/company/user',
//           },
//           {
//             label: 'Vendor',
//             icon: RxDotFilled,
//             link: '/masters/company/vendor',
//           },
//           {
//             label: 'Customer',
//             icon: RxDotFilled,
//             link: '/masters/company/customer',
//           },
//           // {
//           //   label: 'Assets & Inventory',
//           //   icon: Package,
//           //   link: '/masters/company/assets-inventory',
//           // },
//           // {
//           //   label: 'Maintenance',
//           //   icon: Wrench,
//           //   link: '/masters/company/maintenance',
//           // },
//         ],
//       },
//       {
//         label: 'Fixed Assets',
//         // icon: Building2,
//         link: '/fixed-assets',
//         children: [
//           {
//             label: 'Asset Category',
//             icon: RxDotFilled,
//             link: 'masters/fixed-assets/asset-category',
//           },
//           {
//             label: 'Cost Breakup Attributes',
//             icon: RxDotFilled,
//             link: 'masters/fixed-assets/costbreakup',
//           },
//           {
//             label: 'User Attributes',
//             icon: RxDotFilled,
//             link: 'masters/fixed-assets/userattributes',
//           }
//         ]
//       },
//       // {
//       //   label: 'Depreciation',
//       //   // icon: Building2,
//       //   link: '/depreciation',
//       //   children: [
//       //     {
//       //       label: 'Books',
//       //       icon: RxDotFilled,
//       //       link: '/masters/depreciation/book',
//       //     },
//       //     {
//       //       label: 'Asset Category Mapping With Book Category',
//       //       icon: RxDotFilled,
//       //       link: '/masters/depreciation/assetcategorybookcategorymapping',
//       //     },
//       //   ],
//       // },
//       {
//         label: 'Consumables',
//         // icon: Building2,
//         link: '/consumables',
//         children: [
//           {
//             label: 'Store',
//             icon: RxDotFilled,
//             link: '/masters/consumables/store',
//           },
//           {
//             label: 'Item Master',
//             icon: RxDotFilled,
//             link: '/masters/consumables/item-master',
//           },
//           {
//             label: "Units Of Measure",
//             icon: RxDotFilled,
//             link: '/masters/consumables/unitsofmeasure',
//           },
//           {
//             label: 'Item Category',
//             icon: RxDotFilled,
//             link: '/masters/consumables/item-category',
//           },
//         ],
//       },
//       {
//         label: 'Service Maintenance',
//         // icon:  Wrench,
//         link: '/servicemaintenance',
//         children: [
//           {
//             label: 'Service Locations',
//             icon: RxDotFilled,
//             link: '/masters/servicemaintenance/servicelocations',
//           },
//           {
//             label: 'Product Masters',
//             icon: RxDotFilled,
//             link: '/masters/servicemaintenance/productmaster',
//           },
//         ],

//       },
//       {
//         label: 'Reports',
//         // icon: FileText,
//         link: '/masters/reports',
//       },
//       // masters/fixed-assets/asset-category
//     ],
//   },
//   {
//     label: 'Software Assets',
//     icon: Package,
//     link: '/software-assets/asset-registry',
//     children: [
//       {
//         label: 'Asset Registry',
//         icon: RxDotFilled,
//         link: '/software-assets/asset-registry',
//       },
//       {
//         label: 'License Assignment',
//         icon: RxDotFilled,
//         link: '/software-assets/license-assignment',
//       },
//       // {
//       //   label: 'Usage Tracking',
//       //   icon: HardHat,
//       //   link: '/software-assets/usage-tracking',
//       // },
//       // {
//       //   label: 'Compliance & Audit',
//       //   icon: Cog,
//       //   link: '/software-assets/compliance&audit',
//       // },
//       // {
//       //   label: 'Reports',
//       //   icon: Cog,
//       //   link: '/software-assets/reports',
//       // },
//       // {
//       //   label: 'Advanced Setup',
//       //   icon: Settings,
//       //   link: '/settings/advanced-setup',
//       // },
//     ],
//   },
//   {
//     label: 'Settings',
//     icon: Settings,
//     link: '/settings/smtp-configuration',
//     children: [
//       {
//         label: 'SMTP Configuration',
//         icon: RxDotFilled,
//         link: '/settings/smtp-configuration',
//       },
//       // {
//       //   label: 'User Management',
//       //   icon: HardHat,
//       //   link: '/settings/user-management',
//       // },
//       // {
//       //   label: 'Process Configuration',
//       //   icon: Cog,
//       //   link: '/settings/process-configuration',
//       // },
//       // {
//       //   label: 'Advanced Setup',
//       //   icon: Settings,
//       //   link: '/settings/advanced-setup',
//       // },
//     ],
//   },
// ]
type MyComponentProps = {
  navigation: NavItem[];
};
const AppSidebar: React.FC<MyComponentProps> = ({navigation}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const isActive = (link: string) => location.pathname.includes(link);

  const isItemOrDescendantActive = (item: NavItem): boolean => {
    if (isActive(item.link)) return true;
    if (!item.children) return false;
    return item.children.some(child => isItemOrDescendantActive(child));
  };

  const isChildOrHasActiveGrandchild = (child: NavItem) =>
    isActive(child.link) || !!child.children?.some(gc => isActive(gc.link));

  const isParentOrHasActiveDescendant = (item: NavItem) =>
    isActive(item?.link) || !!item.children?.some(c => isChildOrHasActiveGrandchild(c));

  const toggleMenu = (label: string) =>
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));

  useEffect(() => {
    const newOpen: Record<string, boolean> = {};
    navigation.filter(f=>f).forEach(p => {
      if (isParentOrHasActiveDescendant(p)) {
        newOpen[p.label] = true;
        p.children?.forEach(c => {
          if (isChildOrHasActiveGrandchild(c)) newOpen[c.label] = true;
        });
      }
    });
    setOpenMenus(newOpen);
  }, [location]);

  const filteredNavigation = React.useMemo(() => {
    if (!searchTerm) return navigation;
    const q = searchTerm.toLowerCase();
    return navigation
      .filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.children?.some(
          c =>
            c.label.toLowerCase().includes(q) ||
            c.children?.some(gc => gc.label.toLowerCase().includes(q))
        )
      )
      .map(item => ({
        ...item,
        children: item.children
          ?.filter(
            c =>
              c.label.toLowerCase().includes(q) ||
              c.children?.some(gc => gc.label.toLowerCase().includes(q))
          )
          .map(c => ({
            ...c,
            children: c.children?.filter(gc => gc.label.toLowerCase().includes(q)),
          })),
      }));
  }, [searchTerm]);

  const hasAnyOpenDescendant = (item: NavItem): boolean => {
    if (!item.children) return false;
    for (const c of item.children) {
      if (openMenus[c.label]) return true;
      if (c.children && hasAnyOpenDescendant(c)) return true;
    }
    return false;
  };

  const renderGrandChild = (grandChild: NavItem) => {
    const isGrandchildActive = isActive(grandChild.link);
    const highlight = isGrandchildActive || hoveredLabel === grandChild.label;

    return (
      <SidebarMenuSubItem
        key={grandChild.label}
        onMouseEnter={() => setHoveredLabel(grandChild.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuSubButton asChild isActive={isGrandchildActive}>
          {/* <Link
            to={grandChild.link}
            className={cn(
              "flex items-center space-x-2 transition-colors duration-200 my-1",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            {grandChild.icon ? (
              // <grandChild.icon
              //   className={cn(
              //     "h-3 w-3 transition-colors duration-200",
              //     highlight ? "text-white" : "text-[#a4bbdc]"
              //   )}
              // />
              <Eye className='text-black' style={{color:'red'}}
              // className={cn(
                  // "h-3 w-3 transition-colors duration-200",
                  // highlight ? "text-white" : "text-[#a4bbdc]"
                // )}
                />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
              )}
              title={grandChild.label}
            >
              {grandChild.label}
            </span>
          </Link> */}
          <Link
            to={`/layout/${grandChild.link}`}
            className={cn(
              "flex items-center space-x-2 transition-colors duration-200 my-[2px]",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            {grandChild.icon ? (
              <RxDotFilled
                className={cn(
                  "h-3 w-3 transition-colors duration-200",
                  highlight ? "text-white" : "!text-[#a4bbdc]"
                )}
              />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
              )}
              title={grandChild.label}
            >
              {grandChild.label}
            </span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  const renderChild = (child: NavItem) => {
    const isChildActive = isActive(child.link);
    const hasActive = isChildOrHasActiveGrandchild(child);
    const childOpen = openMenus[child.label] ?? false;
    const highlight = isChildActive || hasActive || childOpen || hoveredLabel === child.label;

    if (child.children && !collapsed) {
      return (
        <Collapsible
          key={child.label}
          className="w-full"
          open={childOpen}
          onOpenChange={() => toggleMenu(child.label)}
        >
          <SidebarMenuSubItem
            onMouseEnter={() => setHoveredLabel(child.label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <SidebarMenuSubButton asChild>
              <CollapsibleTrigger className="flex items-center justify-between w-full transition-colors duration-200 rounded-md my-[2px]">
                <div className="flex items-center space-x-2" title={child.label}>
                  {child.icon ? (
                    <RxDotFilled
                      className={cn(
                        "h-3 w-3 transition-colors duration-200",
                        highlight ? "text-white" : "!text-[#a4bbdc]"
                      )}
                    />
                  ) : (
                    <pre />
                  )}
                  <span
                    className={cn(
                      "truncate transition-colors duration-200",
                      highlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
                    )}
                  >
                    {child.label}
                  </span>
                </div>
                {childOpen ? (
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform transition-colors duration-200",
                      highlight ? "text-white" : "text-[#a4bbdc]"
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 transition-transform transition-colors duration-200",
                      highlight ? "text-white" : "text-[#a4bbdc]"
                    )}
                  />
                )}
              </CollapsibleTrigger>
            </SidebarMenuSubButton>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-0">
                {child.children.map(gc => renderGrandChild(gc))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuSubItem
        key={child.label}
        onMouseEnter={() => setHoveredLabel(child.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuSubButton asChild isActive={isChildActive}>
          <Link
            to={`/layout/${child.link}`}
            className={cn(
              "flex items-center space-x-0 transition-colors duration-200 my-[2px]",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
            title={child.label}
          >
            {child.icon ? (
               <RxDotFilled
                className={cn(
                  "h-3 w-3 transition-colors duration-200",
                  highlight ? "text-white" : "!text-[#a4bbdc]"
                )}
              />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
              )}
            >
              {child.label}
            </span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  const renderMenuItem = (item: NavItem) => {
    const isParentActive = isParentOrHasActiveDescendant(item);
    const isParentOpen = openMenus[item.label] ?? false;

    const hasOpenDescendant = hasAnyOpenDescendant(item);

    const shouldHighlight =
      isParentActive || isParentOpen || hasOpenDescendant || hoveredLabel === item.label;

    if (item.children && !collapsed) {
      return (
        <Collapsible
          key={item.label}
          open={isParentOpen}
          onOpenChange={() => toggleMenu(item.label)}
          className="w-full"
        >
          <SidebarMenuItem
            onMouseEnter={() => setHoveredLabel(item.label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <SidebarMenuButton asChild tooltip={item.label}>
              <CollapsibleTrigger className={cn("flex items-center justify-between w-full transition-colors duration-200 rounded-md my-[2px]")}>
                <div className="flex items-center space-x-3 gap-1" title={item.label}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        shouldHighlight ? "text-white" : "text-[#a4bbdc]"
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span
                      className={cn(
                        "truncate max-w-[180px] transition-colors duration-200",
                        shouldHighlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
                {/* {isParentOpen ? (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform transition-colors duration-200",
                      shouldHighlight ? "text-white" : "text-[#a4bbdc]"
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform transition-colors duration-200",
                      shouldHighlight ? "text-white" : "text-[#a4bbdc]"
                    )}
                  />
                )} */}
              </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>{item.children.map(c => renderChild(c))}</SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    const isItemActive = isActive(item.link);
    const showHighlight = isItemActive || hoveredLabel === item.label;

    return (
      <SidebarMenuItem
        key={item.label}
        onMouseEnter={() => setHoveredLabel(item.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuButton asChild isActive={isItemActive}>
          <Link
            to={`/layout/${item.link}`}
            className={cn(
              "flex items-center space-x-1 transition-colors duration-200 rounded-md my-1",
              showHighlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                showHighlight ? "text-white" : "!text-[#a4bbdc]"
              )}
            />
            {!collapsed && (
              <span
                className={cn(
                  "truncate max-w-[180px] transition-colors duration-200",
                  showHighlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
                )}
              >
                {item.label}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-[16px] shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center space-x-2 px-2 py-1">
          {!collapsed ? <div className="text-xl font-bold text-gray-300">Tracet</div> : <div>T</div>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className={cn(collapsed && "mt-2")}>
          {filteredNavigation.map(item => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 text-black"
                />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        {!collapsed && (
          <div className="text-xs text-white text-center border-t pt-2">
            <div>&copy; {new Date().getFullYear()} Tracet Enterprise</div>
            <div className="text-white [font-weight:350]">v2.0.1</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;