
// import React, { useState, useMemo, useCallback } from 'react';
// import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ReusableTable, TableAction, TablePermissions, AuditTrail } from '@/components/ui/reusable-table';
// import { 
//   Calendar,
//   Users,
//   Package,
//   TrendingUp,
//   Home,
//   RefreshCw,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   DollarSign,
//   Clock,
//   AlertTriangle,
//   CheckCircle
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';

// interface Subscription {
//   id: string;
//   customerName: string;
//   productName: string;
//   subscriptionFromDate: string;
//   subscriptionToDate: string;
//   subscriptionType: 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';
//   status: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
//   revenue: number;
//   billingEmail: string;
//   renewalDate: string;
//   createdAt: string;
//   lastModified: string;
//   notes?: string;
//   paymentStatus: 'Paid' | 'Pending' | 'Overdue';
//   autoRenew: boolean;
//   discountPercent?: number;
// }

// // Enhanced mock data with more fields for enterprise features
// const mockSubscriptions: Subscription[] = [
//   {
//     id: '1',
//     customerName: 'Keerthi Technologies',
//     productName: 'Udyog Enterprise',
//     subscriptionFromDate: '2025-03-10',
//     subscriptionToDate: '2025-04-09',
//     subscriptionType: 'Monthly',
//     status: 'Active',
//     revenue: 2999,
//     billingEmail: 'billing@keerthi.com',
//     renewalDate: '2025-04-09',
//     createdAt: '2025-01-15',
//     lastModified: '2025-03-10',
//     paymentStatus: 'Paid',
//     autoRenew: true,
//     discountPercent: 10
//   },
//   {
//     id: '2',
//     customerName: 'Rashmi Solutions Ltd',
//     productName: 'Udyog Professional',
//     subscriptionFromDate: '2025-03-03',
//     subscriptionToDate: '2025-04-02',
//     subscriptionType: 'Monthly',
//     status: 'Active',
//     revenue: 1999,
//     billingEmail: 'accounts@rashmi.com',
//     renewalDate: '2025-04-02',
//     createdAt: '2025-02-01',
//     lastModified: '2025-03-03',
//     paymentStatus: 'Paid',
//     autoRenew: true
//   },
//   {
//     id: '3',
//     customerName: 'Keerthi Corp',
//     productName: 'Udyog Standard',
//     subscriptionFromDate: '2025-03-05',
//     subscriptionToDate: '2025-04-04',
//     subscriptionType: 'Monthly',
//     status: 'Active',
//     revenue: 999,
//     billingEmail: 'finance@keerthicorp.com',
//     renewalDate: '2025-04-04',
//     createdAt: '2025-02-15',
//     lastModified: '2025-03-05',
//     paymentStatus: 'Pending',
//     autoRenew: false
//   },
//   {
//     id: '4',
//     customerName: 'TechCorp Industries',
//     productName: 'Udyog Enterprise',
//     subscriptionFromDate: '2024-03-06',
//     subscriptionToDate: '2025-03-05',
//     subscriptionType: 'Annual',
//     status: 'Expired',
//     revenue: 29999,
//     billingEmail: 'billing@techcorp.com',
//     renewalDate: '2025-03-05',
//     createdAt: '2024-03-06',
//     lastModified: '2025-01-20',
//     paymentStatus: 'Overdue',
//     autoRenew: false
//   },
//   {
//     id: '5',
//     customerName: 'Digital Ventures',
//     productName: 'Udyog Professional',
//     subscriptionFromDate: '2025-01-06',
//     subscriptionToDate: '2025-04-05',
//     subscriptionType: 'Quarterly',
//     status: 'Active',
//     revenue: 5999,
//     billingEmail: 'payments@digitalventures.com',
//     renewalDate: '2025-04-05',
//     createdAt: '2024-12-20',
//     lastModified: '2025-01-06',
//     paymentStatus: 'Paid',
//     autoRenew: true,
//     discountPercent: 5
//   },
//   {
//     id: '6',
//     customerName: 'Innovation Labs',
//     productName: 'Udyog Standard',
//     subscriptionFromDate: '2025-05-21',
//     subscriptionToDate: '2025-06-20',
//     subscriptionType: 'Monthly',
//     status: 'Pending',
//     revenue: 999,
//     billingEmail: 'admin@innovationlabs.com',
//     renewalDate: '2025-06-20',
//     createdAt: '2025-05-15',
//     lastModified: '2025-05-21',
//     paymentStatus: 'Pending',
//     autoRenew: true
//   },
//   {
//     id: '7',
//     customerName: 'Global Systems Inc',
//     productName: 'Udyog Enterprise',
//     subscriptionFromDate: '2024-05-21',
//     subscriptionToDate: '2025-05-20',
//     subscriptionType: 'Annual',
//     status: 'Active',
//     revenue: 35999,
//     billingEmail: 'billing@globalsystems.com',
//     renewalDate: '2025-05-20',
//     createdAt: '2024-05-21',
//     lastModified: '2024-11-15',
//     paymentStatus: 'Paid',
//     autoRenew: true,
//     discountPercent: 15
//   },
//   {
//     id: '8',
//     customerName: 'SmartTech Solutions',
//     productName: 'Udyog Professional',
//     subscriptionFromDate: '2024-12-21',
//     subscriptionToDate: '2025-06-20',
//     subscriptionType: 'Bi-Annual',
//     status: 'Active',
//     revenue: 11999,
//     billingEmail: 'finance@smarttech.com',
//     renewalDate: '2025-06-20',
//     createdAt: '2024-12-15',
//     lastModified: '2024-12-21',
//     paymentStatus: 'Paid',
//     autoRenew: true
//   }
// ];

// const Subscription = () => {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
//   const [loading, setLoading] = useState(false);
//   const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([]);
//   const { toast } = useToast();

//   // Stats calculations
//   const stats = useMemo(() => {
//     const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.revenue, 0);
//     const activeCount = subscriptions.filter(sub => sub.status === 'Active').length;
//     const totalCustomers = new Set(subscriptions.map(sub => sub.customerName)).size;
//     const pendingPayments = subscriptions.filter(sub => sub.paymentStatus === 'Pending' || sub.paymentStatus === 'Overdue').length;

//     return {
//       totalRevenue,
//       activeCount,
//       totalCustomers,
//       pendingPayments,
//       totalSubscriptions: subscriptions.length
//     };
//   }, [subscriptions]);

//   // Helper functions for styling
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'Expired': return 'bg-red-50 text-red-700 border-red-200';
//       case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
//       case 'Cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
//       default: return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'Annual': return 'bg-blue-50 text-blue-700 border-blue-200';
//       case 'Monthly': return 'bg-green-50 text-green-700 border-green-200';
//       case 'Quarterly': return 'bg-purple-50 text-purple-700 border-purple-200';
//       case 'Bi-Annual': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
//       default: return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   const getPaymentStatusColor = (status: string) => {
//     switch (status) {
//       case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
//       case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
//       default: return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   // Enhanced permissions for enterprise features
//   const permissions: TablePermissions = {
//     canEdit: true,
//     canDelete: true,
//     canView: true,
//     canExport: true,
//     canAdd: true,
//     canBulkEdit: true,
//     canInlineEdit: true,
//     canManageColumns: true
//   };

//   // Column helper
//   const columnHelper = createColumnHelper<Subscription>();

//   // Enhanced column definitions with inline editing support
//   const columns: ColumnDef<Subscription>[] = useMemo(() => [
//     columnHelper.accessor('customerName', {
//       header: 'Company Name',
//       cell: ({ getValue, row, column, table }) => {
//         const value = getValue();
//         return (
//           <div className="font-medium text-gray-900">
//             {value}
//           </div>
//         );
//       },
//       enableSorting: true,
//       enableColumnFilter: true,
//       meta: {
//         editable: true,
//         editType: 'input',
//         validate: (value: string) => value.length > 0 ? true : 'Company name is required'
//       }
//     }),

//     columnHelper.accessor('productName', {
//       header: 'Product',
//       cell: ({ getValue }) => (
//         <div className="text-gray-700">{getValue()}</div>
//       ),
//       enableSorting: true,
//       enableColumnFilter: true,
//     }),

//     columnHelper.display({
//       id: 'duration',
//       header: 'Subscription Period',
//       cell: ({ row }) => (
//         <div className="text-sm">
//           <div className="text-gray-900 font-medium">
//             {new Date(row.original.subscriptionFromDate).toLocaleDateString()}
//           </div>
//           <div className="text-gray-500">
//             to {new Date(row.original.subscriptionToDate).toLocaleDateString()}
//           </div>
//         </div>
//       ),
//       enableSorting: false,
//     }),

//     columnHelper.accessor('subscriptionType', {
//       header: 'Type',
//       cell: ({ getValue }) => (
//         <Badge className={`${getTypeColor(getValue())} border`}>
//           {getValue()}
//         </Badge>
//       ),
//       enableSorting: true,
//       enableColumnFilter: true,
//       meta: {
//         editable: true,
//         editType: 'select',
//         options: [
//           { value: 'Monthly', label: 'Monthly' },
//           { value: 'Annual', label: 'Annual' },
//           { value: 'Quarterly', label: 'Quarterly' },
//           { value: 'Bi-Annual', label: 'Bi-Annual' }
//         ]
//       }
//     }),

//     columnHelper.accessor('revenue', {
//       header: 'Revenue',
//       cell: ({ getValue, row }) => (
//         <div className="font-mono text-gray-900">
//           <div className="font-semibold">
//             ${getValue().toLocaleString()}
//           </div>
//           {row.original.discountPercent && (
//             <div className="text-xs text-green-600">
//               {row.original.discountPercent}% discount
//             </div>
//           )}
//         </div>
//       ),
//       enableSorting: true,
//       sortingFn: 'basic',
//     }),

//     columnHelper.accessor('status', {
//       header: 'Status',
//       cell: ({ getValue, row }) => (
//         <div className="space-y-1">
//           <Badge className={`${getStatusColor(getValue())} border`}>
//             {getValue()}
//           </Badge>
//           <div className="text-xs text-gray-500">
//             {row.original.autoRenew ? 'Auto-renew' : 'Manual renewal'}
//           </div>
//         </div>
//       ),
//       enableSorting: true,
//       enableColumnFilter: true,
//     }),

//     columnHelper.accessor('paymentStatus', {
//       header: 'Payment',
//       cell: ({ getValue, row }) => (
//         <div className="space-y-1">
//           <Badge className={`${getPaymentStatusColor(getValue())} border text-xs`}>
//             {getValue()}
//           </Badge>
//           <div className="text-xs text-gray-500">
//             Due: {new Date(row.original.renewalDate).toLocaleDateString()}
//           </div>
//         </div>
//       ),
//       enableSorting: true,
//       enableColumnFilter: true,
//     }),

//     columnHelper.accessor('billingEmail', {
//       header: 'Billing Contact',
//       cell: ({ getValue }) => (
//         <div className="text-sm text-blue-600 hover:underline cursor-pointer">
//           {getValue()}
//         </div>
//       ),
//       enableSorting: true,
//     }),

//     columnHelper.display({
//       id: 'lastActivity',
//       header: 'Last Activity',
//       cell: ({ row }) => (
//         <div className="text-xs text-gray-500">
//           <div>Modified: {new Date(row.original.lastModified).toLocaleDateString()}</div>
//           <div>Created: {new Date(row.original.createdAt).toLocaleDateString()}</div>
//         </div>
//       ),
//     }),
//   ], []);

//   // Enhanced action handlers with audit trail
//   const handleViewSubscription = useCallback((subscription: Subscription) => {
//     toast({
//       title: "Viewing Subscription",
//       description: `Opening details for ${subscription.customerName}`,
//     });

//     // Log audit trail
//     const auditEntry: AuditTrail = {
//       timestamp: new Date(),
//       user: 'Current User', // Replace with actual user
//       action: 'View Subscription',
//       rowId: subscription.id,
//     };
//     setAuditTrail(prev => [auditEntry, ...prev]);
//   }, [toast]);

//   const handleEditSubscription = useCallback((subscription: Subscription) => {
//     toast({
//       title: "Editing Subscription",
//       description: `Opening edit form for ${subscription.customerName}`,
//     });

//     // Log audit trail
//     const auditEntry: AuditTrail = {
//       timestamp: new Date(),
//       user: 'Current User',
//       action: 'Edit Subscription',
//       rowId: subscription.id,
//     };
//     setAuditTrail(prev => [auditEntry, ...prev]);
//   }, [toast]);

//   const handleDeleteSubscription = useCallback((subscription: Subscription) => {
//     setSubscriptions(prev => prev.filter(sub => sub.id !== subscription.id));

//     toast({
//       title: "Subscription Deleted",
//       description: `Subscription for ${subscription.customerName} has been deleted`,
//       variant: "destructive",
//     });

//     // Log audit trail
//     const auditEntry: AuditTrail = {
//       timestamp: new Date(),
//       user: 'Current User',
//       action: 'Delete Subscription',
//       rowId: subscription.id,
//     };
//     setAuditTrail(prev => [auditEntry, ...prev]);
//   }, [toast]);

//   const handleBulkDelete = useCallback((selectedRows: Subscription[]) => {
//     const selectedIds = selectedRows.map(row => row.id);
//     setSubscriptions(prev => prev.filter(sub => !selectedIds.includes(sub.id)));

//     toast({
//       title: "Bulk Delete Completed",
//       description: `${selectedRows.length} subscriptions have been deleted`,
//       variant: "destructive",
//     });

//     // Log audit trail
//     selectedRows.forEach(subscription => {
//       const auditEntry: AuditTrail = {
//         timestamp: new Date(),
//         user: 'Current User',
//         action: 'Bulk Delete Subscription',
//         rowId: subscription.id,
//       };
//       setAuditTrail(prev => [auditEntry, ...prev]);
//     });
//   }, [toast]);

//   const handleBulkEdit = useCallback((selectedRows: Subscription[]) => {
//     toast({
//       title: "Bulk Edit",
//       description: `Opening bulk edit for ${selectedRows.length} subscriptions`,
//     });
//   }, [toast]);

//   const handleRowEdit = useCallback((row: Subscription, changes: Partial<Subscription>) => {
//     setSubscriptions(prev => 
//       prev.map(sub => 
//         sub.id === row.id 
//           ? { ...sub, ...changes, lastModified: new Date().toISOString() }
//           : sub
//       )
//     );

//     toast({
//       title: "Subscription Updated",
//       description: `Changes saved for ${row.customerName}`,
//     });

//     // Log audit trail
//     const auditEntry: AuditTrail = {
//       timestamp: new Date(),
//       user: 'Current User',
//       action: 'Inline Edit Subscription',
//       rowId: row.id,
//       changes: Object.entries(changes).reduce((acc, [key, value]) => {
//         acc[key] = { from: (row as any)[key], to: value };
//         return acc;
//       }, {} as Record<string, { from: any; to: any }>)
//     };
//     setAuditTrail(prev => [auditEntry, ...prev]);
//   }, [toast]);

//   const handleAddSubscription = useCallback(() => {
//     toast({
//       title: "Add New Subscription",
//       description: "Opening subscription creation form",
//     });
//   }, [toast]);

//   const handleRefresh = useCallback(() => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       toast({
//         title: "Data Refreshed",
//         description: "Subscription data has been updated",
//       });
//     }, 1000);
//   }, [toast]);

//   const handleAuditLog = useCallback((entry: AuditTrail) => {
//     setAuditTrail(prev => [entry, ...prev]);
//   }, []);

//   // Enhanced table actions
//   const actions: TableAction<Subscription>[] = [
//     {
//       label: 'View Details',
//       icon: Eye,
//       onClick: handleViewSubscription,
//       tooltip: 'View subscription details',
//     },
//     {
//       label: 'Edit',
//       icon: Edit,
//       onClick: handleEditSubscription,
//       hidden: (row) => row.status === 'Cancelled',
//       tooltip: 'Edit subscription',
//     },
//     {
//       label: 'Delete',
//       icon: Trash2,
//       onClick: handleDeleteSubscription,
//       variant: 'destructive',
//       tooltip: 'Delete subscription',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50/30">
//       <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//           <SidebarTrigger />
//           <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
//             <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
//               <Home className="h-3 w-3 sm:h-4 sm:w-4" />
//               <span className="hidden sm:inline">Dashboard</span>
//               <span className="sm:hidden">Home</span>
//             </Link>
//             <span>/</span>
//             <Link to="/service-desk" className="hover:text-blue-600 transition-colors hidden sm:inline">Service Desk</Link>
//             <span className="hidden sm:inline">/</span>
//             <span className="text-gray-900 font-medium">
//               <span className="hidden sm:inline">Subscription Management</span>
//               <span className="sm:hidden">Subscriptions</span>
//             </span>
//           </nav>
//         </div>
//       </header>

//       <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Subscription Management</h1>
//             <p className="text-gray-600 mt-1 text-sm sm:text-base">Comprehensive subscription management with enterprise features</p>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//             <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
//               <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//               <span className="hidden sm:inline">Refresh</span>
//               <span className="sm:hidden">Refresh</span>
//             </Button>
//             <Button size="sm" onClick={handleAddSubscription} className="flex-1 sm:flex-none">
//               <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//               <span className="hidden sm:inline">New Subscription</span>
//               <span className="sm:hidden">New</span>
//             </Button>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
//           <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Total Revenue</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">${stats.totalRevenue.toLocaleString()}</p>
//                 </div>
//                 <div className="p-2 sm:p-3 bg-blue-500 rounded-lg">
//                   <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-1">Active</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">{stats.activeCount}</p>
//                 </div>
//                 <div className="p-2 sm:p-3 bg-emerald-500 rounded-lg">
//                   <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Customers</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{stats.totalCustomers}</p>
//                 </div>
//                 <div className="p-2 sm:p-3 bg-purple-500 rounded-lg">
//                   <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Total</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{stats.totalSubscriptions}</p>
//                 </div>
//                 <div className="p-2 sm:p-3 bg-amber-500 rounded-lg">
//                   <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100/50">
//             <CardContent className="p-3 sm:p-4 lg:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Pending</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{stats.pendingPayments}</p>
//                 </div>
//                 <div className="p-2 sm:p-3 bg-red-500 rounded-lg">
//                   <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Enterprise Table */}
//         <ReusableTable
//           data={subscriptions}
//           columns={columns}
//           loading={loading}
//           title="Subscription Overview"
//           permissions={permissions}
//           actions={actions}
//           onAdd={handleAddSubscription}
//           onRefresh={handleRefresh}
//           onBulkDelete={handleBulkDelete}
//           onBulkEdit={handleBulkEdit}
//           onRowEdit={handleRowEdit}
//           onAuditLog={handleAuditLog}
//           enableSelection={true}
//           enableSearch={true}
//           enableColumnVisibility={true}
//           enableExport={true}
//           enablePagination={true}
//           enableSorting={true}
//           enableFiltering={true}
//           enableGrouping={true}
//           enableInlineEdit={true}
//           enableKeyboardNav={true}
//           enableVirtualScrolling={false}
//           enableAdvancedFilters={true}
//           enableAuditTrail={true}
//           enablePrintMode={true}
//           pageSize={10}
//           storageKey="subscription-management-table"
//           emptyMessage="No subscriptions found. Create your first subscription to get started."
//           rowHeight="comfortable"
//           className="bg-white rounded-lg shadow-sm overflow-x-auto"
//         />
//       </div>
//     </div>
//   );
// };

// export default Subscription;


import React, { useState, useMemo, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { Form, } from '@/components/ui/form';
import { useForm, Controller } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { ReusableButton } from '../../components/ui/reusable-button';
import { ReusableInput } from '../../components/ui/reusable-input';
import { ReusableDropdown } from '../../components/ui/reusable-dropdown';
import { ReusableTable, TableAction, TablePermissions } from '../../components/ui//reusable-table';
import { MessageProvider, useMessage } from '../../components/ui/reusable-message';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { getSRCustomerLookupsList } from '@/services/ticketServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_DB } from '@/Local_DB/Form_JSON_Data/SubscriptionDB';
import { getProductName, getSubscriptionTableData } from '@/services/subscriptionServices';
import ExcelJS from "exceljs";
import { Badge } from '@/components/ui/badge';




interface subscriptionrecord {
  SubscriptionId: number,
  CustomerId: number,
  CustomerName: string,
  ProductId: number,
  ProductName: string,
  AMCFromDate: string,
  AMCToDate: string,
  SubscriptionType: string,
  SubscriptionStatus: string
}

const downloadExcel = async <T extends Record<string, any>>(
  dataSource: T[],
  columns: ColumnDef<T, any>[]
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const headerFontStyle = { bold: true, size: 12 };
  const dataFontStyle = { size: 10 };

  // Extract headers safely
  const colHeaders = columns
    .map((col) => {
      // ✅ explicitly check if accessorKey exists
      if ("accessorKey" in col && typeof col.accessorKey === "string") {
        return {
          accessorKey: col.accessorKey,
          header: String(col.header ?? col.accessorKey),
        };
      }
      return null;
    })
    .filter(
      (col): col is { accessorKey: string; header: string } => col !== null
    );

  // Set column widths
  colHeaders.forEach((_, index) => {
    worksheet.getColumn(index + 1).width = 30;
  });

  // Add header row (use friendly header labels)
  const headerRow = worksheet.addRow(colHeaders.map((c) => c.header));
  headerRow.eachCell((cell) => (cell.font = headerFontStyle));

  // Add data rows
  dataSource.forEach((rowData) => {
    const rowValues = colHeaders.map((c) => rowData[c.accessorKey]);
    const row = worksheet.addRow(rowValues);
    row.eachCell((cell) => (cell.font = dataFontStyle));
  });

  // Export file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Subscription_List.xlsx";
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};


const SubscriptionManagement = () => {
  const message = useMessage();
  const [dataSource, setDatasource] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fields, setFields] = useState<BaseField[]>(SUBSCRIPTION_DB);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSubscriptionData(111, 'All');
    fetchLookups();
  }, [])

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),

  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, getValues, formState: { errors } } = form;

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;

    const validationRules = {
      required: isRequired ? `${label} is required` : false,
    };

    switch (fieldType) {
      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  // Helper function to get fields by names 
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  // Filter data based on search
  const filteredData = useMemo(() => {
    return dataSource.filter(group =>
      Object.values(group).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [dataSource, searchTerm]);

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-300';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Define table columns
  const columns: ColumnDef<subscriptionrecord>[] = [
    {
      accessorKey: 'CustomerName',
      header: 'Customer Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 text-sm">{row.getValue('CustomerName')}</span>
      ),
    },
    {
      accessorKey: 'ProductName',
      header: 'Product Name',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('ProductName')}</span>
      ),
    },
    {
      accessorKey: 'AMCFromDate',
      header: 'AMC From Date',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('AMCFromDate')}</span>
      ),
    },
    {
      accessorKey: 'AMCToDate',
      header: 'AMC To Date',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('AMCToDate')}</span>
      ),
    },
    {
      accessorKey: 'SubscriptionType',
      header: 'Subscription Type',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('SubscriptionType')}</span>
      ),
    },
    // {
    //   accessorKey: 'SubscriptionStatus',
    //   header: 'Subscription Status',
    //   cell: ({ row }) => (
    //     <span className="text-gray-700 text-sm">{row.getValue('SubscriptionStatus')}</span>
    //   ),
    // },
     {
        accessorKey: "SubscriptionStatus", header: "Subscription Status",
        cell: ({ row }) => (
          <Badge className={`${getStatusColor(row.getValue('SubscriptionStatus'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
            {row.getValue('SubscriptionStatus')}
          </Badge>
        ),
      },
  ];

  // Define table actions
  const tableActions: TableAction<subscriptionrecord>[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: (record: subscriptionrecord) => {
        navigate('/service-desk/payment-details', {
          state: { subscriptionData: record }
        });
      },
      variant: 'default',
    },
  ];

  // Define table permissions
  const tablePermissions: TablePermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
    canExport: false,
    canAdd: true,
    canManageColumns: false,
  };

  // Handle refresh
  const handleRefresh = () => {
    message.info("Refreshing Subscriptions...");
    // Add refresh logic here
  };

  //table data api integration
  async function getSubscriptionData(compId: number, BranchName: string) {
    await getSubscriptionTableData(compId, BranchName).then(res => {
      if (res.success && res.data) {
        if (res.data?.length > 0) {
          setDatasource(res.data?.reverse())
        }
      }
    })
      .catch(err => {
        console.error('Error fetching subscription by customer:', err);
      });
  }

  //fetch lookup data
  async function fetchLookups() {
    const [custResult, prodResult] = await Promise.allSettled([
      getSRCustomerLookupsList(111, 'All').then(res => res.data.ServiceRequestCustomerLookup),
      getProductName(111).then(res => res.data),
    ]);


    setFields(prev =>
      prev.map(field => {
        if (field.name === "CustomerName" && custResult.status === "fulfilled") {
          return {
            ...field,
            defaultValue: custResult.value[0].CustomerName,
            options: custResult.value.map(item => ({
              label: item.CustomerName,
              value: item.CustomerName,
            })),
          };
        }
        if (field.name === "ProductName" && prodResult.status === "fulfilled") {
          return {
            ...field,
            defaultValue: prodResult.value[0].ProductName,
            options: prodResult.value.map(item => ({
              label: item.ProductName,
              value: item.ProductName,
            }))
          };
        }
        return field;
      })
    );
    reset({
      CustomerName:
        custResult.status === "fulfilled" ? custResult.value[0].CustomerName : '',
      ProductName:
        prodResult.status === "fulfilled" ? prodResult.value[0].ProductName : '',
    });
  }

  const handleNavigation = () => {
    const { CustomerName, ProductName } = getValues();
if(CustomerName!=='' && ProductName!==''){
 navigate('/service-desk/payment-details', {
      state: {
        parentData: {
          CustomerName,
          ProductName,
        },
      },
    });
}
else{
  message.error('Please select Customer Name/Product Name')
}
   
  }

  return (
    <div className="bg-gray-50/30 h-full overflow-y-scroll">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <ReusableButton
            size="small"
            variant="primary"
              onClick={()=>{navigate('/service-desk/create-ticket')}}
          >
            New Service Request
          </ReusableButton>
        </div>
      </header>

      <div className="p-4 space-y-4 " >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div >
            <h1 className="text-lg font-semibold text-gray-900">Subscription</h1>
            <p className="text-sm text-gray-600 mt-0.5">Subscription Management</p>
          </div>
          <div className='flex gap-2'>
            <ReusableButton
              size="small"
              variant="primary"
              icon={<Plus className="h-3 w-3" />}
              iconPosition="left"
              onClick={handleNavigation}
            >
              Payment Details
            </ReusableButton>
            <ReusableButton
              size="small"
              variant="primary"
              icon={<></>}
              iconPosition="left"
              onClick={() => downloadExcel(dataSource, columns)}
            >
              Export to Excel
            </ReusableButton>
          </div>
        </div>

        {/* Subscription Form */}

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Add Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFieldsByNames(['CustomerName', 'ProductName']).map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>


        {/* User Group List with ReusableTable */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Subscription List</CardTitle>
              <ReusableInput
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefixIcon={<Search className="h-3 w-3 text-gray-400" />}
                allowClear={true}
                onClear={() => setSearchTerm('')}
                size="small"
                className="w-50 pl-7"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ReusableTable
              data={filteredData}
              columns={columns}
              actions={tableActions}
              permissions={tablePermissions}
              // loading={loading}
              title=""
              onRefresh={handleRefresh}
              enableSearch={false}
              enableSelection={false}
              enableExport={true}
              enableColumnVisibility={true}
              enablePagination={true}
              enableSorting={true}
              enableFiltering={true}
              pageSize={10}
              emptyMessage="No user groups found"
              rowHeight="normal"
              storageKey="usergroups-table"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
