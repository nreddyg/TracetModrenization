import AssetLocation from "./pages/masters/AssetLocation";
import CompanyHierarchy from "./pages/masters/CompanyHierarchy";
import CostCenter from "./pages/masters/CostCenter";
import Customer from "./pages/masters/Customer";
import CustomerLocation from "./pages/masters/CustomerLocation";
import Department from "./pages/masters/Department";
import AddBook from "./pages/masters/depreciation/AddBook";
import AssetCategoryMappingBookCategory from "./pages/masters/depreciation/AssetCategoryMappingBookCategory";
import Books from "./pages/masters/depreciation/Books";
import AssetCategory from "./pages/masters/fixedAssets/AssetCategory";
import UserAttributes from "./pages/masters/fixedAssets/UserAttributes";
import ItemCategory from "./pages/masters/ItemCategory";
import ItemMaster from "./pages/masters/ItemMaster";
import Organization from "./pages/masters/Organization";
import ProductMasters from "./pages/masters/ProductMasters";
import ReportsMasters from "./pages/masters/ReportsMasters";
import ServiceLocations from "./pages/masters/ServiceLocations";
import Store from "./pages/masters/Store";
import UnitOfMeasure from "./pages/masters/UnitsOfMeasure";
import User from "./pages/masters/User";
import Vendor from "./pages/masters/Vendor";
import AllRequests from "./pages/servicedesk/AllRequests";
import AssetCodeTable from "./pages/servicedesk/AssetCodeTable";
import Configuration from "./pages/servicedesk/Configuration";
import MyWorkbench from "./pages/servicedesk/MyWorkbench";
import PaymentDetails from "./pages/servicedesk/PaymentDetails";
import ServiceDeskReports from "./pages/servicedesk/ServiceDeskReports";
import SubscriptionManagement from "./pages/servicedesk/Subscription";
import TicketProgressDashboard from "./pages/servicedesk/TicketProgressDashboard";
import UserGroups from "./pages/servicedesk/UserGroups";
import TicketCreate from "./pages/TicketCreate";
import TicketView from "./pages/TicketView";



export const appRoutesObj={
 'masters-fixedassets-assetcategory': {
    path: 'masters/assetcategory',
    component: <AssetCategory/>,
    index: false,
  },
  "masters-company-organization": {
    path: 'masters/addneworg',
    component: <Organization />,
    index: true,
  },
  "masters-company-user": {
    path: 'masters/usercreation',
    component: <User />,
    index: false,
  },
  "masters-company-vendor": {
    path: 'masters/newVendor',
    component: <Vendor />,
    index: false,
  },
 'masters-company-companyhierarchy':  {
    path: 'masters/companyhierarchy',
    component: <CompanyHierarchy />,
    index: false,
  },
 'masters-company-department/unit': {
    path: 'masters/department',
    component: <Department />,
    index: false,
  },
  "masters-company-customer": {
    path: 'masters/addnewcustomer',
    component: <Customer />,
    index: false,
    dependent:[{
      path: 'masters/customerlocation',
      component: <CustomerLocation/>,
      index:false
    }]
  },
  'masters-company-assetlocation': {
    path: 'masters/assetlocation',
    component: <AssetLocation />,
    index: false,
  },
 'masters-company-costcenter':  {
    path: 'masters/costcenter',
    component: <CostCenter />,
    index: false,
  },
 "masters-consumables-itemmaster":  {
    path:"masters/itemmaster",
    component:<ItemMaster/>,
    index:false,
  },
 "masters-consumables-unitsofmeasure":  {
    path:"masters/unitsofmeasure",
    component:<UnitOfMeasure/>,
    index:false,
  },
  "masters-consumables-store": {
    path:"masters/store",
    component:<Store/>,
    index:false
  },
 "masters-consumables-itemcategories":  {
    path: 'masters/itemcategory',
    component: <ItemCategory/>,
    index: false,
  },

  "masters-depreciation-book": {
    path: 'masters/Book',
    component: <Books/>,
    index: false,
    dependent:[ {
      path: '/masters/depreciation/book/addbook',
      component: <AddBook/>,
      index: false,
    },]
  },
  "masters-depreciation-assetcategorybookcategorymapping": {
  path:'masters/AssetcategoryMappingWithBookCategory',
  component:<AssetCategoryMappingBookCategory/>,
  index:false
},

 "masters-servicemaintenance-productmaster":  {
    path:'masters/productMaster',
    component:<ProductMasters />,
    index:false
  },
 'masters-servicemaintenance-servicelocations':  {
    path:'masters/servicelocations',
    component:<ServiceLocations />,
    index:false
  },
  
  'masters-masterreports':{
    path:'masters/MasterReports',
    component:<ReportsMasters/>,
    index:false
  },
  'masters-fixedassets-userattributes': {
    path: 'masters/userattributes',
    component: <UserAttributes/>,
    index: false,
  },


//   "fixedassets-assetacquisition": {
//     path:'fixedassets/assetacquisition',
//     component:<AssetAcquisition/>,
//     index:false
//   },
//   "fixedassets-manageassets":{
//     path:'fixedassets/manageassets',
//     component:<ManageAssets/>,
//     index:false,
//     dependent:[
//       {
//         path:'fixedassets/assetacquisition',
//     component:<AssetAcquisition/>,
//     index:false
//       },
//       {
//         path:'fixedassets/manageassets/editasset',
//         component:<EditAssetLayout/>,
//         index:false,
//         children:[{
//           path:'assetdetails',
//           component:<AssetDetails/>,
//           index:true,
//         },
//         {
//           path:'shiftwise',
//           component:<ShiftWise/>,
//           index:false,
//         },
//         {
//           path:'documents',
//           component:<ManageAssetsDocument/>,
//           index:false,
//         },
//         {
//           path:'assign',
//           component:<Assign/>,
//           index:false,
//         },
//         {
//           path:'transfer',
//           component:<Transfer/>,
//           index:false,
//         },
//         {
//           path:'insurance',
//           component:<Insurance/>,
//           index:false,
//         },
//         {
//           path:'maintenance',
//           component:<Maintenance/>,
//           index:false,
//         },
//         {
//           path:'retire',
//           component:<Retire/>,
//           index:false,
//         },
//         {
//           path:'serviceMaintenance',
//           component:<ServiceMaintenance/>,
//           index:false,
//         },
//         {
//           path:'childassets',
//           component:<ChildAsset/>,
//           index:false,
//         },
//         {
//           path:'physicalverification',
//           component:<PhysicalVerification/>,
//           index:false,
//         },
//         {
//           path:'assethistory',
//           component:<AssetHistory/>,
//           index:false,
//         },
//         ]
//       },
//     ]
//   },
//   "fixedassets-assetsplit":{
//     path:'fixedassets/assetsplit',
//     component:<AssetSplit/>,
//     index:false
//   },
//   'masters-fixedassets-costbreakupattributes': {
//     path: 'masters/costbreakupattributes',
//     component: <CostBreakupAttributes/>,
//     index: false,
//   },
//   "fixedassets-assettransfer-intratransfer":{
//     path:'fixedassets/intratransfer',
//     component:<IntraTransfer/>,
//     index:false,
//     dependent:[  {
//       path:'fixedassets/intratransfer/assettransferto',
//       component:<AssetTransferTo/>,
//       index:false
//     },]
//   },
//   "fixedassets-changeinassetcategory":{
//     path:'fixedassets/changeassetcategory',
//     component:<ChangeAssetCategory/>,
//     index:false
//   },
//   "fixedassets-unretireassets":{
//     path:'fixedassets/unretireassets',
//     component:<Unretire/>,
//     index:false
//     },
// 'fixedassets-reports':{
//   path:'fixedassets/fixedassetsreports',
//   component:<FixedAssetsReportsMenu/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-fixedassetsbymasters":{
//   path:'fixedassets/fixedassetsreports/trackingreports/fixedassetsby',
//   component:<FixedAssetsByMastersReports/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-assethistory":{
//   path:'fixedassets/fixedassetsreports/trackingreports/assethistory',
//   component:<AssetHistoryReports/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-assetcount":{
//   path:'fixedassets/fixedassetsreports/trackingreports/assetcount',
//   component:<AssetCountReport/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-assetlocationhistory":{
//   path:'fixedassets/fixedassetsreports/trackingreports/assetlocationhistory',
//   component:<AssetLocationHistory/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-fixedassetswithattributes":{
//   path:'fixedassets/fixedassetsreports/trackingreports/fixedassetswithattributes',
//   component:<FixedAssetsWithAttributes/>,
//   index:false,
// },
// "fixedassets-reports-transfer&disposalreports-assettransferbetweencompanyhierarchy":{
//   path:'fixedassets/fixedassetsreports/transferanddisposalreports/assettransferbetweencompanyhierarchy',
//   component:<AssetTransferBetweenCompanyHierachy/>,
//   index:false,
// },
// "fixedassets-reports-transfer&disposalreports-assettransfertaxinvoicereport":{
//   path:'fixedassets/fixedassetsreports/transferanddisposalreports/assettransfertaxinvoicereport',
//   component:<AssetTransferTaxInvoiceReport/>,
//   index:false,
// },
// "fixedassets-reports-transfer&disposalreports-retiredassets":{
//   path:'fixedassets/fixedassetsreports/transferanddisposalreports/retiredassets',
//   component:<RetiredAssetsReports/>,
//   index:false,
// },
// "fixedassets-reports-transfer&disposalreports-assetsaleinvoice":{
//   path:'fixedassets/fixedassetsreports/transferanddisposalreports/assetsaleinvoice',
//   component:<AssetSaleInvoiceReport/>,
//   index:false,
// },
// "fixedassets-reports-letout(issue)/letin(return)reports-externalletout(issue)/letin(return)":{
//   path:'fixedassets/fixedassetsreports/letoutorletinreports/externalletoutorletin',
//   component:<ExternalLetOutOrLetInReport/>,
//   index:false,
// },
// "fixedassets-reports-letout(issue)/letin(return)reports-internalletout(issue)/letin(return)":{
//   path:'fixedassets/fixedassetsreports/letoutorletinreports/internalletoutorletin',
//   component:<InternalLetOutOrLetInReport/>,
//   index:false,
// },
// 'fixedassets-reports-letout(issue)/letin(return)reports-letout(issue)/letin(return)consolidatehistoryreport':{
//   path:'fixedassets/fixedassetsreports/letoutorletinreports/letoutorletinconsolidateshistoryreport',
//   component:<LetOutOrLetInConsolidateHistoryReport/>,
//   index:false,
// },
// 'fixedassets-reports-letout(issue)/letin(return)reports-externalpendingitems':{
//   path:'fixedassets/fixedassetsreports/letoutorletinreports/externalpendingitems',
//   component:<ExternalPendingItemsReport/>,
//   index:false,
// },
// 'fixedassets-reports-letout(issue)/letin(return)reports-internalpendingitems':{
//   path:'fixedassets/fixedassetsreports/letoutorletinreports/internalpendingitems',
//   component:<InternalPendingItemsReport/>,
//   index:false,
// },
// "fixedassets-reports-trackingreports-fixedassetswithcostbreakup":{
//   path:'fixedassets/fixedassetsreports/trackingreports/fixedassetswithcostbreakup',
//   component:<FixedAssetsWithCostBreakupReport/>,
//       index:false,
// },
// "fixedassets-reports-trackingreports-fixedassetsbygroupcompanies":{
//   path:'fixedassets/fixedassetsreports/trackingreports/fixedassetsbygroupcompanies',
//   component:<FixedAssetsByGroupCompanies/>,
//       index:false,
// },
// 'fixedassets-reports-trackingreports-useracknowledgementreport':{
//   path:'fixedassets/fixedassetsreports/trackingreports/useracknowledgementreport',
//   component:<UserAcknowledgementReport/>,
//   index:false,
// },
// 'fixedassets-reports-trackingreports-userwiseassethistory':{
//   path:'fixedassets/fixedassetsreports/trackingreports/userwiseassethistory',
//   component:<UserWiseAssetHistory/>,
//   index:false,
// },
// 'fixedassets-reports-trackingreports-assetsummaryreport':{
//   path:'fixedassets/fixedassetsreports/trackingreports/assetsummary',
//   component:<AssetSummaryReports/>,
//   index:false,
// },
// 'fixedassets-reports-maintenancereports-assetmaintenance':{
//   path:'fixedassets/fixedassetsreports/maintenancereports/assetmaintenance',
//   component:<AssetMaintenance/>,
//   index:false,
// },
// 'fixedassets-reports-maintenancereports-assetinsurance':{
//   path:'fixedassets/fixedassetsreports/maintenancereports/assetinsurance',
//   component:<AssetInsurance/>,
//   index:false,
// },
// 'fixedassets-reports-maintenancereports-assetwarranty':{
//   path:'fixedassets/fixedassetsreports/maintenancereports/assetwarranty',
//   component:<AssetWarranty/>,
//   index:false,
// },
// "fixedassets-reports-maintenancereports-assetlease":{
//   path:'fixedassets/fixedassetsreports/maintenancereports/assetlease',
//   component:<AssetLease/>,
//   index:false,
// },
// 'fixedassets-reports-maintenancereports-fixedassetsbyadditionalcostdetails':{
//   path:'fixedassets/fixedassetsreports/maintenancereports/fixedassetsbyadditionalcostdetails',
//   component:<FixedAssetsByAdditionalCostDetails/>,
//   index:false,
// },
// 'fixedassets-reports-exceptionalreports-assetsassignedfree':{
//   path:'fixedassets/fixedassetsreports/exceptionalreports/assetsassignedfree',
//   component:<AssetsAssignedFree/>,
//   index:false,
// },

// 'fixedassets-reports-manageorderreports-grn/rgic/paymentclearanc':{
//   path:'fixedassets/fixedassetsreports/manageorderreports/manageorderreports',
//   component:<ManageOrderReports/>,
//   index:false,
// },

// "depreciation-rundepreciation":{
//   path:'depreciation/rundepreciation',
//   component:<RunDepreciation/>,
//   index:false,
//   dependent:[
//     {
//       path:'utilities/backgroundjobstatus',
//       component:<BackgroundJobStatus/>,
//       index:false
//     },
//   ]
// },
// "depreciation-managedepreciationresult":{
//   path:'depreciation/managedepreciationresult',
//   component:<ManageDepreciationResult/>,
//   index:false,
//   dependent:[
//     {
//       path:'depreciation/managedepreciationresult/viewdepreciationresult',
//       component:<ViewDepreciationResult/>,
//       index:false
//     },
//     {
//       path:'utilities/backgroundjobstatus',
//       component:<BackgroundJobStatus/>,
//       index:false
//     },
//   ]
// },
// "depreciation-assetrevaluation":{
//   path:'depreciation/assetrevaluation',
//   component:<AssetRevaluation/>,
//   index:false
// },
// "depreciation-forexadjustment":{
//   path:'depreciation/forexadjustment',
//   component:<ForexAdjustment/>,
//   index:false
// },
// "depreciation-importassetwiseaccumulatedvalue":{
//   path:'depreciation/importassetwiseaccumulatedvalue',
//   component:<ImportAssetWiseAccumuatedValue/>,
//   index:false,
//   dependent:[
//     {
//       path:'utilities/backgroundjobstatus',
//       component:<BackgroundJobStatus/>,
//       index:false
//     },
//   ]
// },
// "depreciation-reports":{
//   path:'depreciation/reports',
//   component: <DepreciationReports/>,
//   index:false,
//   dependent:[
//   {
//     path:'depreciation/reports/table',
//     component: <DepreciationReportTable/>,
//     index:false
//   },]
// },

// "settings-licensedetails":{
//   path:'licensedetails',
//   component:<LicenseDetails/>,
//   index:true,
// },
// "settings-hierarchyconfiguration":{
//   path:'hierarchyconfiguration',
//   component:<HierarchyConfiguration/>,
//   index:false
// },
//  "settings-smtpconfiguration":{
//   path:'smtpconfig',
//   component:<SMTPConfiguration/>,
//   index:false,
// },
// "settings-documentnumbergeneration":{
//   path:"documentnumbergeneration",
//   component:<DocumentNumberGeneration/>,
//   index:false
// },
// "settings-additionalfieldconfiguration":{
//   path:"additionalfieldconfiguration",
//   component:<AdditionalFieldConfiguration/>,
//   index:false
// },
// "utilities-backgroundjobstatus":{
//   path:'utilities/backgroundjobstatus',
//   component:<BackgroundJobStatus/>,
//   index:false
// },
//  'utilities-importdata':{
//     path:'utilities/importdata',
//     component:< ImportData/>,
//     index:false
//   },




"servicedesk-createservicerequest":{
  path:'servicedesk/newservicerequest',
  component: <TicketView key={'create'} />,
  index: false,
  dependent:[
    {
      path:'servicedesk/newservicerequest/assettable',
      component: <AssetCodeTable />,
      index: false,
     },
  ]
},
"servicedesk-usergroups":{
 path:'servicedesk/usergroups',
 component: <UserGroups/>,
 index: false,
},
"servicedesk-subscription":{
 path:'servicedesk/subscription',
 component: <SubscriptionManagement />,
 index: false,
 dependent:[
  {
    path:'servicedesk/subscriptionpaymentdetails',
    component: <PaymentDetails />,
    index: false,
   },
 ]
},
// {
//   path:'servicedesk/createworkorder',
//   component: <CreateWorkOrder />,
//   index: false,
// },

"servicedesk-myrequests":{
 path:'servicedesk/myrequest',
 component: <MyWorkbench key={"myrequest"} />,
 index: false,
 dependent:[ {
  path:'servicedesk/editscreen',
  component:<TicketView key={`editMyReq`} />,
  index:false
},]
 },
 // {
 //   path:'servicedesk/newservicerequest',
 //   component: <Open/>,
 //   index: false,
 // },

 "servicedesk-allservicerequests":{
   path:'servicedesk/allservicerequests',
   component: <AllRequests/>,
   index: false,
   dependent:[ {
    path:'servicedesk/editscreen',
    component:<TicketView key={`edit`} />,
    index:false
  },]
 },
 "servicedesk-configuration":{
   path:'servicedesk/configuration',
   component: <Configuration/>,
   index: false,
 },
 // {
 //   path:'servicedesk/manageworkorder',
 //   component: <ManageWorkOrder/>,
 //   index: false,
 // },

"servicedesk-reports": {
  path:'servicedesk/reports',
  component:<ServiceDeskReports/>,
  index:false
},
"servicedesk-ticketprogressdashboard": {
  path:'servicedesk/ticket-progress-dashboard',
  component:<TicketProgressDashboard/>,
  index:false
},





// "physicalverification-createauditplan":{
//   path:'physicalverification/createauditplan',
//   component: <CreateAuditPlan/>,
//   index:false
// },
// "physicalverification-reviewauditplans":{
//   path:'physicalverification/reviewauditplan',
//   component: <ReviewAuditPlan/>,
//   index:false
// },
// "physicalverification-manualverification":{
//   path:'physicalverification/manualverification',
//   component: <ManualVerification/>,
//   index:false,
//   dependent:[ {
//     path:'utilities/backgroundjobstatus',
//     component:<BackgroundJobStatus/>,
//     index:false
//   },]
// },

// "physicalverification-scannerverification":{
//   path:'physicalverification/scannerverification',
//   component:<ScannerVerification/>,
//   index:false
// },
// "physicalverification-reconciliation":{
//   path:'physicalverification/reconciliation',
//   component:<Reconciliation/>,
//   index:false
// },

// "physicalverification-submittedauditplans":{
//   path:'physicalverification/submittedauditplans',
//   component: <SubmittedAuditPlans/>,
//   index:false
// },
// "physicalverification-categorylevelcreateaudit":{
//   path:'physicalverification/categorylevelcreateaudit',
//   component: <CategoryLevelCreateAudit/>,
//   index:false
// },
// "physicalverification-categorylevelmanualverification":{
//   path:'physicalverification/categorylevelmanualverification',
//   component:<CategoryLevelManualVerification/>,
//   index:false,
//   dependent:[ {
//     path:'utilities/backgroundjobstatus',
//     component:<BackgroundJobStatus/>,
//     index:false
//   },]
// },

// "physicalverification-categorylevelreviewaudit":{
//   path:'physicalverification/categorylevelreviewaudit',
//   component: <CategoryLevelReviewAudit/>,
//   index: false
// },
// "physicalverification-userselfauditcreation":{
//   path:'physicalverification/userselfauditcreation',
//   component: <UserSelfAuditCreation/>,
//   index: false
// },
// "physicalverification-userselfauditstatus":{
//   path:'physicalverification/userselfauditstatus',
//   component: <UserSelfAuditStatus/>,
//   index: false
// },
// "physicalverification-reports":{
//   path:'physicalverification/reports',
//   component: <PhysicalVerificationReports/>,
//   index:false,
//   dependent:[{
//     path:'physicalverification/reports/table',
//     component: <PhysicalVerificationReportTable/>,
//     index:false
//   }]
// },

}