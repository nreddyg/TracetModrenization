import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store/reduxStore';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Suspense } from "react";
import FixedHeader from "@/components/layout/FixedHeader";
import { ReusableLoader } from "@/components/ui/reusable-loader";
import { MessageProvider } from "./components/ui/reusable-message";
import WrapperLazyComponent from "./components/common/WrapperLazyComponent";
import AssetCodeTable from "./pages/servicedesk/AssetCodeTable";
import ServiceRequestReport from "./pages/servicedesk/ServiceRequestDetailsHistory";
import AssetLocation from "./pages/masters/AssetLocation";
import Store from "./pages/masters/Store";

// Lazy load all pages
const Index = WrapperLazyComponent(() => import("./pages/Index"));
const Login = WrapperLazyComponent(() => import("./pages/Login"));
const Timesheet = WrapperLazyComponent(() => import("./pages/Timesheet"));
const Projects = WrapperLazyComponent(() => import("./pages/Projects"));
const ProjectCreate = WrapperLazyComponent(() => import("./pages/ProjectCreate"));
const TaskCreate = WrapperLazyComponent(() => import("./pages/TaskCreate"));

// Payroll
const PayrollDashboard = WrapperLazyComponent(() => import("./pages/payroll/PayrollDashboard"));
const IndianPayroll = WrapperLazyComponent(() => import("./pages/payroll/IndianPayroll"));
const USPayroll = WrapperLazyComponent(() => import("./pages/payroll/USPayroll"));
const TicketsList = WrapperLazyComponent(() => import("./pages/TicketsList"));
const TicketView = WrapperLazyComponent(() => import("./pages/TicketView"));
const TicketCreate = WrapperLazyComponent(() => import("./pages/TicketCreate"));

// Masters
const Organization = WrapperLazyComponent(() => import("./pages/masters/Organization"));
const CompanyHierarchy = WrapperLazyComponent(() => import("./pages/masters/CompanyHierarchy"));
const Department = WrapperLazyComponent(() => import("./pages/masters/Department"));
const CostCenter=WrapperLazyComponent(() => import("./pages/masters/CostCenter"));
const AssetsMasters = WrapperLazyComponent(() => import("./pages/masters/AssetsMasters"));
const MaintenanceMasters = WrapperLazyComponent(() => import("./pages/masters/MaintenanceMasters"));
const ReportsMasters = WrapperLazyComponent(() => import("./pages/masters/ReportsMasters"));

// CWIP
const ProjectManagement = WrapperLazyComponent(() => import("./pages/cwip/ProjectManagement"));
const AssetOperations = WrapperLazyComponent(() => import("./pages/cwip/AssetOperations"));
const VerificationTracking = WrapperLazyComponent(() => import("./pages/cwip/VerificationTracking"));
const DataManagement = WrapperLazyComponent(() => import("./pages/cwip/DataManagement"));
const CwipReports = WrapperLazyComponent(() => import("./pages/cwip/CwipReports"));

// Procurement
const PurchaseRequests = WrapperLazyComponent(() => import("./pages/procurement/PurchaseRequests"));
const PurchaseOrders = WrapperLazyComponent(() => import("./pages/procurement/PurchaseOrders"));
const GoodsManagement = WrapperLazyComponent(() => import("./pages/procurement/GoodsManagement"));
const ProcurementReports = WrapperLazyComponent(() => import("./pages/procurement/ProcurementReports"));

// Fixed Assets
const AssetManagement = WrapperLazyComponent(() => import("./pages/fixedassets/AssetManagement"));
const AssetOps = WrapperLazyComponent(() => import("./pages/fixedassets/AssetOps"));
const AssetMaintenance = WrapperLazyComponent(() => import("./pages/fixedassets/AssetMaintenance"));
const FixedAssetsReports = WrapperLazyComponent(() => import("./pages/fixedassets/FixedAssetsReports"));

// Depreciation
const DepreciationProcess = WrapperLazyComponent(() => import("./pages/depreciation/DepreciationProcess"));
const Adjustments = WrapperLazyComponent(() => import("./pages/depreciation/Adjustments"));
const Analysis = WrapperLazyComponent(() => import("./pages/depreciation/Analysis"));
const DepreciationReports = WrapperLazyComponent(() => import("./pages/depreciation/DepreciationReports"));

// Consumables
const Receiving = WrapperLazyComponent(() => import("./pages/consumables/Receiving"));
const InventoryOperations = WrapperLazyComponent(() => import("./pages/consumables/InventoryOperations"));
const Verification = WrapperLazyComponent(() => import("./pages/consumables/Verification"));
const ConsumablesReports = WrapperLazyComponent(() => import("./pages/consumables/ConsumablesReports"));

// Physical Verification
const AuditPlanning = WrapperLazyComponent(() => import("./pages/physicalverification/AuditPlanning"));
const VerificationMethods = WrapperLazyComponent(() => import("./pages/physicalverification/VerificationMethods"));
const Reconciliation = WrapperLazyComponent(() => import("./pages/physicalverification/Reconciliation"));
const CategoryManagement = WrapperLazyComponent(() => import("./pages/physicalverification/CategoryManagement"));

// Service Desk
const QuickActions = WrapperLazyComponent(() => import("./pages/servicedesk/QuickActions"));
const MyWorkbench = WrapperLazyComponent(() => import("./pages/servicedesk/MyWorkbench"));
const AllRequests = WrapperLazyComponent(() => import("./pages/servicedesk/AllRequests"));
const WorkManagement = WrapperLazyComponent(() => import("./pages/servicedesk/WorkManagement"));
const Administration = WrapperLazyComponent(() => import("./pages/servicedesk/Administration"));
const Configuration = WrapperLazyComponent(() => import("./pages/servicedesk/Configuration"));
const ServiceDeskReports = WrapperLazyComponent(() => import("./pages/servicedesk/ServiceDeskReports"));
const Subscription = WrapperLazyComponent(() => import("./pages/servicedesk/Subscription"));
const UserGroups = WrapperLazyComponent(() => import("./pages/servicedesk/UserGroups"));
const PaymentDetails = WrapperLazyComponent(() => import("./pages/servicedesk/PaymentDetails"));
const TicketProgressDashboard = WrapperLazyComponent(() => import("./pages/servicedesk/TicketProgressDashboard"));
const CreateWorkOrder = WrapperLazyComponent(() => import("./pages/servicedesk/CreateWorkOrder"));
const ManageWorkOrder = WrapperLazyComponent(() => import("./pages/servicedesk/ManageWorkOrder"));
const TicketsDashboard = WrapperLazyComponent(() => import("./pages/TicketsDashboard"));

// Utilities
const PrintingCodes = WrapperLazyComponent(() => import("./pages/utilities/PrintingCodes"));
const UtilitiesDataManagement = WrapperLazyComponent(() => import("./pages/utilities/UtilitiesDataManagement"));
const TrackingMonitoring = WrapperLazyComponent(() => import("./pages/utilities/TrackingMonitoring"));
const Notifications = WrapperLazyComponent(() => import("./pages/utilities/Notifications"));

// Settings
const Settings = WrapperLazyComponent(() => import("./pages/settings/Settings"));
const SystemConfiguration = WrapperLazyComponent(() => import("./pages/settings/SystemConfiguration"));
const UserManagement = WrapperLazyComponent(() => import("./pages/settings/UserManagement"));
const ProcessConfiguration = WrapperLazyComponent(() => import("./pages/settings/ProcessConfiguration"));
const AdvancedSetup = WrapperLazyComponent(() => import("./pages/settings/AdvancedSetup"));
const NotFound = WrapperLazyComponent(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const cleanRoutes = ["/service-desk/srdetailshistoryview"];
  if (isLoginPage) {
    return (
      <div className="w-full h-full">
        <MessageProvider duration={3} maxCount={5} offset={24}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </MessageProvider>
      </div>
    );
  }
  if (cleanRoutes.includes(location.pathname)) {
    return (
      <Routes location={location}>
        <Route
          path="/service-desk/srdetailshistoryview"
          element={<ServiceRequestReport />}
        />
      </Routes>
    );
  }
  return (
    <MessageProvider duration={3} maxCount={5} offset={24}>
      <SidebarProvider>
        <div className="h-screen flex w-full bg-app-background overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex flex-col overflow-hidden">
            <FixedHeader />
            <div className="w-full h-full pt-20 transition-all duration-300 ease-in-out">
              <Suspense fallback={<ReusableLoader spinning={true} size="lg" position="center" />}>
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path='/dashboard' element={<Index/>}/>
                  <Route path="/timesheet" element={<Timesheet />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/create" element={<ProjectCreate />} />
                  <Route path="/tasks/create" element={<TaskCreate />} />
                  
                  {/* Payroll */}
                  <Route path="/payroll" element={<PayrollDashboard />} />
                  <Route path="/payroll/indian" element={<IndianPayroll />} />
                  <Route path="/payroll/us" element={<USPayroll />} />
                  
                  <Route path="/tickets" element={<TicketsList />} />
                  <Route path="/tickets/create" element={<TicketCreate />} />
                  <Route path="/service-desk/create-ticket" element={<TicketView key={'create'} />} />
                  <Route path="/service-desk/all-requests/tickets/:Did/:id" element={<TicketView key={`edit`} />} />
                  <Route path="/service-desk/my-workbench/tickets/:Did/:id" element={<TicketView key={`editMyWorkbench`} />} />
                  <Route path="/service-desk/my-requests/tickets/:Did/:id" element={<TicketView key={`editMyReq`} />} />
                  <Route path="/tickets/dashboard" element={<TicketsDashboard />} />

                  {/* Masters */}
                  <Route path="/masters/organization" element={<Organization />} />
                  <Route path="/masters/company-hierarchy" element={<CompanyHierarchy />} />
                  <Route path="/masters/department" element={<Department />} />
                  <Route path='/masters/costcenter' element={<CostCenter/>}/>
                  <Route path="/masters/assets-inventory" element={<AssetsMasters />} />
                  <Route path="/masters/maintenance" element={<MaintenanceMasters />} />
                  <Route path="/masters/reports" element={<ReportsMasters />} />
                  <Route path="/masters/asset-location" element={<AssetLocation />} />
                  <Route path="/masters/store" element={<Store/>} />

                  {/* CWIP */}
                  <Route path="/cwip/project-management" element={<ProjectManagement />} />
                  <Route path="/cwip/asset-operations" element={<AssetOperations />} />
                  <Route path="/cwip/verification-tracking" element={<VerificationTracking />} />
                  <Route path="/cwip/data-management" element={<DataManagement />} />
                  <Route path="/cwip/reports" element={<CwipReports />} />

                  {/* Procurement */}
                  <Route path="/procurement/purchase-requests" element={<PurchaseRequests />} />
                  <Route path="/procurement/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/procurement/goods-management" element={<GoodsManagement />} />
                  <Route path="/procurement/reports" element={<ProcurementReports />} />

                  {/* Fixed Assets */}
                  <Route path="/fixed-assets/asset-management" element={<AssetManagement />} />
                  <Route path="/fixed-assets/asset-operations" element={<AssetOps />} />
                  <Route path="/fixed-assets/asset-maintenance" element={<AssetMaintenance />} />
                  <Route path="/fixed-assets/reports" element={<FixedAssetsReports />} />

                  {/* Depreciation */}
                  <Route path="/depreciation/process" element={<DepreciationProcess />} />
                  <Route path="/depreciation/adjustments" element={<Adjustments />} />
                  <Route path="/depreciation/analysis" element={<Analysis />} />
                  <Route path="/depreciation/reports" element={<DepreciationReports />} />

                  {/* Consumables */}
                  <Route path="/consumables/receiving" element={<Receiving />} />
                  <Route path="/consumables/inventory-operations" element={<InventoryOperations />} />
                  <Route path="/consumables/verification" element={<Verification />} />
                  <Route path="/consumables/reports" element={<ConsumablesReports />} />

                  {/* Physical Verification */}
                  <Route path="/physical-verification/audit-planning" element={<AuditPlanning />} />
                  <Route path="/physical-verification/verification-methods" element={<VerificationMethods />} />
                  <Route path="/physical-verification/reconciliation" element={<Reconciliation />} />
                  <Route path="/physical-verification/category-management" element={<CategoryManagement />} />

                  {/* Service Desk */}
                  <Route path="/service-desk/create-ticket" element={<TicketCreate />} />
                  <Route path="/service-desk/my-workbench" element={<MyWorkbench key={"myworkbench"} />} />
                  <Route path="/service-desk/sla-violated" element={<AllRequests />} />
                  <Route path="/service-desk/group-tickets" element={<AllRequests />} />
                  <Route path="/service-desk/closed-tickets" element={<AllRequests />} />
                  <Route path="/service-desk/my-requests" element={<MyWorkbench key={"myrequest"} />} />
                  <Route path="/service-desk/draft-requests" element={<AllRequests />} />
                  <Route path="/service-desk/create-work-order" element={<CreateWorkOrder />} />
                  <Route path="/service-desk/manage-work-order" element={<ManageWorkOrder />} />
                  <Route path="/service-desk/user-groups" element={<UserGroups />} />
                  <Route path="/service-desk/configuration" element={<Configuration />} />
                  <Route path="/service-desk/subscription" element={<Subscription />} />
                  <Route path="/service-desk/payment-details" element={<PaymentDetails />} />
                  <Route path="/service-desk/mis-reports" element={<ServiceDeskReports />} />
                  <Route path="/service-desk/quick-actions" element={<QuickActions />} />
                  <Route path="/service-desk/new-request/assetcode-table" element={<AssetCodeTable />} />
                  <Route path="/service-desk/all-requests" element={<AllRequests />} />
                  <Route path="/service-desk/work-management" element={<WorkManagement />} />
                  <Route path="/service-desk/administration" element={<Administration />} />
                  <Route path="/service-desk/reports" element={<ServiceDeskReports />} />
                  <Route path="/service-desk/ticket-progress" element={<TicketProgressDashboard />} />

                  {/* Utilities */}
                  <Route path="/utilities/printing-codes" element={<PrintingCodes />} />
                  <Route path="/utilities/data-management" element={<UtilitiesDataManagement />} />
                  <Route path="/utilities/tracking-monitoring" element={<TrackingMonitoring />} />
                  <Route path="/utilities/notifications" element={<Notifications />} />

                  {/* Settings */}
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings/system-configuration" element={<SystemConfiguration />} />
                  <Route path="/settings/user-management" element={<UserManagement />} />
                  <Route path="/settings/process-configuration" element={<ProcessConfiguration />} />
                  <Route path="/settings/advanced-setup" element={<AdvancedSetup />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </MessageProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ReusableLoader />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
