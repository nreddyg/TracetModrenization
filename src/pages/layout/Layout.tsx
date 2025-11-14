import AppSidebar from '@/components/AppSidebar'
import FixedHeader from '@/components/layout/FixedHeader'
import { ReusableLoader } from '@/components/ui/reusable-loader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { Suspense, useLayoutEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import TicketView from '../TicketView'
import UserGroups from '../servicedesk/UserGroups'
import SubscriptionManagement from '../servicedesk/Subscription'
import MyWorkbench from '../servicedesk/MyWorkbench'
import Configuration from '../servicedesk/Configuration'
import { RxDotFilled } from 'react-icons/rx'; 
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
  Shield,
  UserRoundCheckIcon,
  UserPlus,
  User,
  UserCheck,
  UserCog,
  MapPin
} from 'lucide-react';
import { useAppSelector } from '@/store'
import { setLoading, setReportsMenu } from '@/store/slices/projectsSlice'
import { useDispatch } from 'react-redux'
import { getUserWiseModuleList } from '@/services/userRoleServices'
import NotFound from '../NotFound'
import { appRoutesObj } from '@/AppRouter'
import { useAppDispatch } from '@/store/reduxStore'
import { modulesOverride } from '@/Local_DB/userWiseModulesOverride'
interface NavItem {
  label: string;
  icon?: React.ComponentType<any>;
  link: string;
  children?: NavItem[];
}
const icons={

"masters":Building2, "servicedesk":Headphones, "fixedassets":Building2, "depreciation":DollarSign, "utilities":Building2, "cwip":Building2, "procurement":Building2, "consumables":Building2, "physicalverification":Building2,"settings":Settings,"softwareassets":Building2

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
//         // icon: AlertCircle,
//         link: '/service-desk/create-ticket',
//       },
//       {
//         label: 'My Workbench',
//         // icon: Users,
//         link: '/service-desk/my-workbench',
//       },
//       {
//         label: 'My Requests',
//         // icon: FileText,
//         link: '/service-desk/my-requests',
//       },
//       {
//         label: 'All Service Requests',
//         // icon: FileText,
//         link: '/service-desk/all-requests',
//       },
//       {
//         label: 'Ticket Progress Dashboard',
//         // icon: TrendingUp,
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
//         // icon: Users,
//         link: '/service-desk/user-groups',
//       },
//       {
//         label: 'Configuration',
//         // icon: Settings,
//         link: '/service-desk/configuration',
//       },
//       {
//         label: 'Subscription',
//         // icon: Star,
//         link: '/service-desk/subscription',
//       },
//       {
//         label: 'Reports',
//         // icon: BarChart,
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
//       {
//         label: 'Depreciation',
//         icon: DollarSign,
//         link: '/depreciation',
//         children: [
//           {
//             label: 'Process',
//             icon: DollarSign,
//             link: '/depreciation/process',
//           },
//           {
//             label: 'Adjustments',
//             icon: DollarSign,
//             link: '/depreciation/adjustments',
//           },
//           {
//             label: 'Analysis',
//             icon: DollarSign,
//             link: '/depreciation/analysis',
//           },
//           {
//             label: 'Reports',
//             icon: FileText,
//             link: '/depreciation/reports',
//           },
//         ],
//       },
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
//             // icon: Building2,
//             link: '/masters/company/organization',
//           },
//           {
//             label: 'Company Hierarchy',
//             // icon: Building2,
//             link: '/masters/company/company-hierarchy',
//           },
//           {
//             label: 'Asset Location',
//             // icon: Building2,
//             link: '/masters/company/asset-location',
//           },
//           {
//             label: 'Department',
//             // icon: Building2,
//             link: '/masters/company/department',
//           },
//           {
//             label: 'Cost Center',
//             // icon: DollarSign,
//             link: '/masters/company/costcenter',
//           },
//           {
//             label: 'User',
//             // icon: User,
//             link: '/masters/company/user',
//           },
//           {
//             label: 'Vendor',
//             // icon: UserCheck,
//             link: '/masters/company/vendor',
//           },
//           {
//             label: 'Customer',
//             // icon: UserCog,
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
//         link: '/company',
//         children: [
//           {
//             label: 'Asset Category',
//             // icon: Building2,
//             link: 'masters/fixed-assets/asset-category',
//           },
//           {
//             label: 'Cost Breakup Attributes',
//             // icon: DollarSign,
//             link: 'masters/fixed-assets/costbreakup',
//           },
//           {
//             label: 'User Attributes',
//             // icon: DollarSign,
//             link: 'masters/fixed-assets/userattributes',
//           }
//         ]
//       },
//       {
//         label: 'Depreciation',
//         // icon: Building2,
//         link: '/depreciation',
//         children: [
//           {
//             label: 'Books',
//             // icon: BarChart,
//             link: '/masters/depreciation/book',
//           },
//           {
//             label: 'Asset Category Book Category Mapping',
//             // icon: BarChart,
//             link: '/masters/depreciation/assetcategorybookcategorymapping',
//           },
//         ],
//       },
//       {
//         label: 'Consumables',
//         // icon: Building2,
//         link: '/consumables',
//         children: [
//           {
//             label: 'Store',
//             // icon: BarChart,
//             link: '/masters/consumables/store',
//           },
//           {
//             label: 'Item Master',
//             // icon: BarChart,
//             link: '/masters/consumables/item-master',
//           },
//           {
//             label: "Units Of Measure",
//             // icon: BarChart,
//             link: '/masters/consumables/unitsofmeasure',
//           },
//           {
//             label: 'Item Category',
//             // icon: BarChart,
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
//             // icon:MapPin,
//             link: '/masters/servicemaintenance/servicelocations',
//           },
//           {
//             label: 'Product Masters',
//             // icon: Package,
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
//     label: 'Software assets',
//     icon: Package,
//     link: '/software-assets/asset-registry',
//     children: [
//       {
//         label: 'Asset Registry',
//         // icon: Package,
//         link: '/software-assets/asset-registry',
//       },
//       {
//         label: 'License Assignment',
//         // icon: Settings,
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
//     link: '/settings/system-configuration',
//     children: [
//       {
//         label: 'System Configuration',
//         // icon: Settings,
//         link: '/settings/system-configuration',
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



const parentModules = ["masters", "servicedesk", "fixedassets", "depreciation", "utilities", "cwip", "procurement", "consumables", "physicalverification","settings","softwareassets"]
const Layout = () => {
    const location = useLocation();
    const navigate=useNavigate()
     const LoggedInUser = JSON.parse(localStorage.getItem("LoggedInUser") || "{}");
    const dispatch=useAppDispatch();
    const [showCreateBtn,setShowCreateBtn]=useState(true)
    
      const companyId = useAppSelector(state => state.projects.companyId);
      const userId = useAppSelector(state => state.projects.userId);

      
        const [roleModuleUsedParams, setRoleModuleUsedParams] = useState({ companyId: "", userId: "" })
      

    const [appRoutesState, setAppRoutesState] = useState([
{
 path:'servicedesk/newservicerequest',
  component: <TicketView key={'create'} />,
  index:true,
  children:[]
},
{
     path:'servicedesk/usergroups',
 component: <UserGroups/>,
   index:false,
   

},
{
   path:'servicedesk/subscription',
 component: <SubscriptionManagement />,
    index:false
     

},
{
     path:'servicedesk/myrequest',
 component: <MyWorkbench key={"myrequest"} />,
    index:false
},
{
     path:'/service-desk/configuration',
 component: <Configuration />,
    index:false
},
 

 
]
 )
      const [menuList, setMenuList] = useState([])

      console.log("clg",LoggedInUser)
  useLayoutEffect(() => {
    if (companyId && userId) {
      if (roleModuleUsedParams.companyId !== companyId || roleModuleUsedParams.userId !==String(userId)) {
        setRoleModuleUsedParams({ companyId: companyId, userId: String(userId) })
        userRoleModuleDetailAPI(userId, companyId)
      }
    }
  }, [companyId, userId])

   const userRoleModuleDetailAPI = async (userId, CompId) => {
      dispatch(setLoading(true));
      try {
        const res = await getUserWiseModuleList(userId, CompId);
        if(res.data && res.data?.status===undefined ){
                 settingMenus(res.data)
        }else{
          
        }
      } catch { } finally { dispatch(setLoading(false)) }
    }
    const settingMenus = (data) => {
    data.push( {
        "ModuleId": 1,
        "ModuleName": "Software Assets",
        "Children": [
            {
                "ModuleId": 1,
                "ModuleName": "Asset Registry"
            },
            {
                "ModuleId": 2,
                "ModuleName": "License Assignment"
            },  
            {
                "ModuleId": 3,
                "ModuleName": "Usage Tracking"
            },  
              {
                "ModuleId": 4,
                "ModuleName": "Reports"
            },        
        ]
    })
    let regExp=/^\/layout(\/+|\?+\/?)?$/
    let settingsPath=""
    const result = formattingMenuAPIData(data)

    if (result.settingsPaths?.length > 0) {
      // result.settingsPaths[0].index = true
      // settingsPath=`/layout/settingspagelayout/${result.settingsPaths}`
         result.pathArray.push(...result.settingsPaths)
      // result.pathArray.push({
      //   path: 'settingspagelayout',
      //   component: <SettingsPageLayout />,
      //   index: false,
      //   children: result.settingsPaths
      // })
    }
    result.pathArray.push({
      path: '*',
      component: <NotFound />,
      index: false
    })
    result.pathArray[0].index = true
    localStorage.setItem("landingPagePath",result.pathArray[0].path)
    const list = []
    let settingsList = []

    // result.children.forEach((item) => {
    //   if (item.title !== "Settings" && item.children?.length > 0) {

    //     let activeitem = (item?.children[0]?.children !== undefined && item?.children[0]?.children.length !== 0) ? item?.children[0]?.children[0].key : item?.children[0].key;

    //     if (moduleList[item.title]) {
    //       moduleList[item.title].displaymenu = {
    //         items: item.children,
    //         heading: item.title,
    //         activeMenuItem: activeitem,
    //         defaultOpenKey: item.children[0].key
    //       }
    //       moduleList[item.title].defaultPath = activeitem
    //       list.push(moduleList[item.title])
    //     }
    //   } else if (item.title === "Settings") {
    //     settingsList = item.children ? item.children : []
    //   }
    // })

    if (regExp.test(location.pathname)) {
      navigate(`/layout/${result.pathArray[0].path}`)
    }

    
    // result.pathArray.length <= 1 && setEnableSupportText(true)
    setAppRoutesState(result.pathArray)
    // setSettingsData(settingsList)
    // settingsPath && setSettingsIndexPath(settingsPath)
    // dispatch(updateSettingsMenueList(settingsList))
    result.children.push(result.children.shift());
    setMenuList(result.children.filter(f=>f))
  }
  const formattingMenuAPIData = (data, parent = '', currentPath = '', pathsArray = [], settingsPaths = []) => {
    parent = parent.toLowerCase().replace(/\s+/g, '')
    const menuItems = [];

    data?.forEach((module, ind) => {
      const moduleName = module.ModuleName.split('-')[0];
      const modulePath = currentPath ? `${currentPath}-${moduleName.toLowerCase().replace(/\s+/g, '')}` : moduleName.toLowerCase().replace(/\s+/g, '');
          console.log("data",data,module)
      if (module.ModuleName.toLowerCase() === "reports") {
        
        const reportsPathArr = storingReportsMenu(module, parent, modulePath)
        if (reportsPathArr && reportsPathArr?.length !== 0) {
          pathsArray.push(...reportsPathArr)
        }
      }
      if (module.ModuleName.toLowerCase() === "create service request") {
        pathsArray.push(appRoutesObj[modulePath])
        if (appRoutesObj[modulePath]?.dependent) {
          pathsArray.push(...appRoutesObj[modulePath].dependent)
        }
        setShowCreateBtn(true)
      }
      if (module.ModuleName.toLowerCase() === "service desk" && !(LoggedInUser.IsServiceDesk)) {
        return;
      }
      if(module.ModuleName.toLowerCase()=="software assets" && !(LoggedInUser.RoleName==="Root Admin")){
 return;
      }
      
      if (modulesOverride[module.ModuleName.toLowerCase()]) {
        let res = modulesOverride[module.ModuleName.toLowerCase()]?.action(module,parent)
        if (!res) {
          return;
        } else module = res
      }

      if (hasNoChildren(module)) {
        if (modulePath?.split("-")[0] === "settings") {
          if (appRoutesObj[modulePath]) { settingsPaths.push(appRoutesObj[modulePath]) }
        } else {
          if (appRoutesObj[modulePath])
            pathsArray.push(appRoutesObj[modulePath])
          if (appRoutesObj[modulePath]?.dependent) {
            pathsArray.push(...appRoutesObj[modulePath].dependent)
          }
        }
      }
      const menuItem:NavItem = {
        // id: module.ModuleId,
        // title: module.ModuleName,
        // key: `${hasNoChildren(module)?routesObject[module.ModuleName] : module.ModuleName}`,
        // key: `${hasNoChildren(module) ? routesObject[modulePath] : module.ModuleName}`,
        link: `${hasNoChildren(module) ? appRoutesObj[modulePath]?.path : module.ModuleName}`,
        label: module.ModuleName,
        icon:parentModules.includes(modulePath) ? icons[modulePath] :(module.Children && module.Children?.length > 0)?null:RxDotFilled,
      };
      
      if (module.Children && module.Children?.length > 0) {
        menuItem.children = formattingMenuAPIData(module.Children, module.ModuleName, modulePath, pathsArray, settingsPaths).children;
      }

      if (!menuItem.children || menuItem.children.length > 0) {
        menuItems.push(menuItem);
       
      }
    });
    return { children: menuItems, pathArray: pathsArray, settingsPaths: settingsPaths };
  };

  const storingReportsMenu = (module, parent, prevPath) => {
    if (parent === "servicedesk") {
        console.log("reports",module)
      dispatch(setReportsMenu({serviceDeskReportsMenu:module.Children ? module.Children : []}))
    }
     else if (parent === "fixedassets") {
      const reportsPathsArray = []
      module?.Children?.forEach((reportType) => {
        const modulePath1 = `${prevPath}-${reportType?.ModuleName?.toLowerCase().replace(/\s+/g, '')}`
        reportType?.Children?.forEach((subreport) => {
          const modulePath2 = `${modulePath1}-${subreport?.ModuleName?.toLowerCase().replace(/\s+/g, '')}`
          if (appRoutesObj[modulePath2])
            reportsPathsArray.push(appRoutesObj[modulePath2])
          if (appRoutesObj[modulePath2]?.dependent) {
            reportsPathsArray.push(...appRoutesObj[modulePath2].dependent)
          }
        })
      })
 
        dispatch(setReportsMenu({fixedAssetsReportsMenu:module.Children ? module.Children : []}))
        return  reportsPathsArray
      }
    
    // if(parent==="depreciation"){
    //     dispatch(updateDepreciationReportsMenu(module.Children?module.Children:[]))
    //   }
    //    else if(parent==="physicalverification"){
    //     dispatch(updatePhysicalVerificationReportsMenu(module.Children?module.Children:[]))
    //    }
      // else if(parent==="cwip"){
      // }else if(parent==="consumables"){

    // }else if(parent==="procurement"){

    // }
  }

  const hasNoChildren = (module) => {
    return (!module.Children || module.Children?.length == 0)
  }
  const createLabel = (module, parent, path) => {
    // if (hasNoChildren(module)) {
      // return <NavLink to={`/layout/${routesObject[path]}`}><div style={{ width: (!parentModules.includes(parent)) ? 140 : 150, overflow: "hidden", textOverflow: "ellipsis" }}><span>{module.ModuleName}</span></div></NavLink>}
      return module.ModuleName
    // }
    
  }

  return (
    <SidebarProvider>
        <div className="h-screen flex w-full bg-app-background overflow-hidden">
          {menuList.length!=0 &&<AppSidebar  navigation={menuList}/>}
          <SidebarInset className="flex flex-col overflow-hidden bg-[#f9fafb]">
            <FixedHeader />
            {/* <div className="w-full h-full pt-1 transition-all duration-200 ease-in-out"> */}
               {menuList.length!=0 && <Suspense fallback={<ReusableLoader spinning={true} size="lg" position="center" />}>
             {appRoutesState.length > 1 ? 
             <Routes location={location}>
              {appRoutesState.map((route, index) => (
                (route) ?
                   route.path === "fixedassets/manageassets/editasset" ? (
                    <Route key={index} path={route.path} element={route.component}>
                      {route.children.map((childRoute, childIndex) => (
                        <>
                          <Route index={childRoute?.index} element={childRoute.index ? childRoute.component : ''} />
                          <Route
                            path={childRoute?.path}
                            element={childRoute?.component}

                          />
                        </>
                      ))}
                    </Route>
                  ) : (
                    <>
                      <Route index={route?.index} element={route.index ? route.component : ''} />
                      <Route
                        path={route?.path}
                        element={route?.component}
                      />
                    </>
                  ) :
                  <></>
              ))}
            </Routes> :""
              // <>{enableSupportText && <HomePage />}</>
            }
              </Suspense>}
            {/* </div> */}
          </SidebarInset>
        </div>
      </SidebarProvider>
  )
}

export default Layout