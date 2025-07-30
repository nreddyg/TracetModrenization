
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Suspense, lazy } from "react";
import FixedHeader from "@/components/layout/FixedHeader";
import { ReusableLoader } from "@/components/ui/reusable-loader";
import { MessageProvider } from "./components/ui/reusable-message";

// Lazy load all pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Timesheet = lazy(() => import("./pages/Timesheet"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectCreate = lazy(() => import("./pages/ProjectCreate"));
const TaskCreate = lazy(() => import("./pages/TaskCreate"));

// Payroll - Lazy loaded
const PayrollDashboard = lazy(() => import("./pages/payroll/PayrollDashboard"));
const IndianPayroll = lazy(() => import("./pages/payroll/IndianPayroll"));
const USPayroll = lazy(() => import("./pages/payroll/USPayroll"));
const TicketsList = lazy(() => import("./pages/TicketsList"));
const TicketView = lazy(() => import("./pages/TicketView"));
const TicketCreate = lazy(() => import("./pages/TicketCreate"));

// Masters - Lazy loaded
const Organization = lazy(() => import("./pages/masters/Organization"));
const CompanyHierarchy = lazy(() => import("./pages/masters/CompanyHierarchy"));
const Department = lazy(() => import("./pages/masters/Department"));
const AssetsMasters = lazy(() => import("./pages/masters/AssetsMasters"));
const MaintenanceMasters = lazy(() => import("./pages/masters/MaintenanceMasters"));
const ReportsMasters = lazy(() => import("./pages/masters/ReportsMasters"));

// CWIP - Lazy loaded
const ProjectManagement = lazy(() => import("./pages/cwip/ProjectManagement"));
const AssetOperations = lazy(() => import("./pages/cwip/AssetOperations"));
const VerificationTracking = lazy(() => import("./pages/cwip/VerificationTracking"));
const DataManagement = lazy(() => import("./pages/cwip/DataManagement"));
const CwipReports = lazy(() => import("./pages/cwip/CwipReports"));

// Procurement - Lazy loaded
const PurchaseRequests = lazy(() => import("./pages/procurement/PurchaseRequests"));
const PurchaseOrders = lazy(() => import("./pages/procurement/PurchaseOrders"));
const GoodsManagement = lazy(() => import("./pages/procurement/GoodsManagement"));
const ProcurementReports = lazy(() => import("./pages/procurement/ProcurementReports"));

// Fixed Assets - Lazy loaded
const AssetManagement = lazy(() => import("./pages/fixedassets/AssetManagement"));
const AssetOps = lazy(() => import("./pages/fixedassets/AssetOps"));
const AssetMaintenance = lazy(() => import("./pages/fixedassets/AssetMaintenance"));
const FixedAssetsReports = lazy(() => import("./pages/fixedassets/FixedAssetsReports"));

// Depreciation - Lazy loaded
const DepreciationProcess = lazy(() => import("./pages/depreciation/DepreciationProcess"));
const Adjustments = lazy(() => import("./pages/depreciation/Adjustments"));
const Analysis = lazy(() => import("./pages/depreciation/Analysis"));
const DepreciationReports = lazy(() => import("./pages/depreciation/DepreciationReports"));

// Consumables - Lazy loaded
const Receiving = lazy(() => import("./pages/consumables/Receiving"));
const InventoryOperations = lazy(() => import("./pages/consumables/InventoryOperations"));
const Verification = lazy(() => import("./pages/consumables/Verification"));
const ConsumablesReports = lazy(() => import("./pages/consumables/ConsumablesReports"));

// Physical Verification - Lazy loaded
const AuditPlanning = lazy(() => import("./pages/physicalverification/AuditPlanning"));
const VerificationMethods = lazy(() => import("./pages/physicalverification/VerificationMethods"));
const Reconciliation = lazy(() => import("./pages/physicalverification/Reconciliation"));
const CategoryManagement = lazy(() => import("./pages/physicalverification/CategoryManagement"));

// Service Desk - Lazy loaded
const QuickActions = lazy(() => import("./pages/servicedesk/QuickActions"));
const MyWorkbench = lazy(() => import("./pages/servicedesk/MyWorkbench"));
const AllRequests = lazy(() => import("./pages/servicedesk/AllRequests"));
const WorkManagement = lazy(() => import("./pages/servicedesk/WorkManagement"));
const Administration = lazy(() => import("./pages/servicedesk/Administration"));
const Configuration = lazy(() => import("./pages/servicedesk/Configuration"));
const ServiceDeskReports = lazy(() => import("./pages/servicedesk/ServiceDeskReports"));
const Subscription = lazy(() => import("./pages/servicedesk/Subscription"));
const UserGroups = lazy(() => import("./pages/servicedesk/UserGroups"));
const PaymentDetails = lazy(() => import("./pages/servicedesk/PaymentDetails"));
const TicketProgressDashboard = lazy(() => import("./pages/servicedesk/TicketProgressDashboard"));
const CreateWorkOrder = lazy(() => import("./pages/servicedesk/CreateWorkOrder"));
const ManageWorkOrder = lazy(() => import("./pages/servicedesk/ManageWorkOrder"));
const TicketsDashboard = lazy(() => import("./pages/TicketsDashboard"));

// Utilities - Lazy loaded
const PrintingCodes = lazy(() => import("./pages/utilities/PrintingCodes"));
const UtilitiesDataManagement = lazy(() => import("./pages/utilities/UtilitiesDataManagement"));
const TrackingMonitoring = lazy(() => import("./pages/utilities/TrackingMonitoring"));
const Notifications = lazy(() => import("./pages/utilities/Notifications"));

// Settings - Lazy loaded
const Settings = lazy(() => import("./pages/settings/Settings"));
const SystemConfiguration = lazy(() => import("./pages/settings/SystemConfiguration"));
const UserManagement = lazy(() => import("./pages/settings/UserManagement"));
const ProcessConfiguration = lazy(() => import("./pages/settings/ProcessConfiguration"));
const AdvancedSetup = lazy(() => import("./pages/settings/AdvancedSetup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage) {
    return (
      <div className="w-full h-full">
        <Suspense fallback={<ReusableLoader spinning={true} size="lg" position="center" />}>
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </div>
    );
  }
  
  return (
    <MessageProvider duration={3} maxCount={5} offset={24}>
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-app-background">
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <FixedHeader />
          <div className="w-full h-full pt-20 transition-all duration-300 ease-in-out">
            <Suspense fallback={<ReusableLoader spinning={true} size="lg" position="center" />}>
              <Routes location={location}>
                <Route path="/" element={<Index />} />
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
                <Route path="/tickets/:id" element={<TicketView />} />
                <Route path="/tickets/dashboard" element={<TicketsDashboard />} />
                
                {/* Masters */}
                <Route path="/masters/organization" element={<Organization />} />
                <Route path="/masters/company-hierarchy" element={<CompanyHierarchy />} />
                <Route path="/masters/department" element={<Department />} />
                <Route path="/masters/assets-inventory" element={<AssetsMasters />} />
                <Route path="/masters/maintenance" element={<MaintenanceMasters />} />
                <Route path="/masters/reports" element={<ReportsMasters />} />
                
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
                
                {/* Service Desk - Enhanced */}
                <Route path="/service-desk/new-request" element={<TicketCreate />} />
                <Route path="/service-desk/my-workbench" element={<MyWorkbench />} />
                <Route path="/service-desk/sla-violated" element={<AllRequests />} />
                <Route path="/service-desk/group-tickets" element={<AllRequests />} />
                <Route path="/service-desk/closed-tickets" element={<AllRequests />} />
                <Route path="/service-desk/my-requests" element={<AllRequests />} />
                <Route path="/service-desk/draft-requests" element={<AllRequests />} />
                <Route path="/service-desk/create-work-order" element={<CreateWorkOrder />} />
                <Route path="/service-desk/manage-work-order" element={<ManageWorkOrder />} />
                <Route path="/service-desk/user-groups" element={<UserGroups />} />
                <Route path="/service-desk/configuration" element={<Configuration />} />
                <Route path="/service-desk/subscription" element={<Subscription />} />
                <Route path="/service-desk/payment-details" element={<PaymentDetails />} />
                <Route path="/service-desk/mis-reports" element={<ServiceDeskReports />} />
                <Route path="/service-desk/quick-actions" element={<QuickActions />} />
                
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
