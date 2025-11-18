// login page urls

export const GET_TOKEN = '/token';
export const URL_ORGANZIATION_DETAILS = "/api/Masters/GetSelectedOrganizationByAccesToken";
export const URL_GET_USER_DETAILS = "/api/Masters/GetUserDetailsByUserName";

//utility urls
export const URL_GET_HIERARCHY_LEVELS_DATA = "/api/Settings/GetHierarchyLevelsData";
//header nav urls
export const URL_GET_COMPANY_LIST = "/api/Masters/GetOrganizationsByUserId";
export const URL_GET_BRANCH_LIST = "/api/Masters/GetHeirarchyDetailsLastLevelByCompanyId";

//service desk urls
// create ticket screen
export const URL_GET_SRCONFIG_LIST = "/api/ServiceDeskAPI/GetServiceRequestConfiguration";
export const URL_GET_SR_TYPE_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestTypeLookupsByBranchId";
export const URL_CREATE_SERVICE_REQUEST = "/api/ServiceDeskAPI/CreateServiceRequestwithAdditionalFields";
export const URL_SAVE_FILE_UPLOAD = "/api/ServiceDeskAPI/SaveFileUploadByServiceRequestId";
export const URL_GET_SR_ASSIGN_TO_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestAssignToLookups";
export const URL_GET_SR_REQUESTED_BY_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestRequestedByLookups";
export const URL_GET_SR_CUSTOMER_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestCustomerLookups";
export const URL_GET_SR_ADDITIONAL_FIELDS = "/api/ServiceDeskAPI/GetServiceRequestsAdditionalFieldsByServiceRequestTypeName";
export const URL_GET_ALL_SERVICE_REQUESTS_DETAILS = "/api/ServiceDeskAPI/GetAllServiceRequestsDetails";
export const URL_GET_SUBSCRIPTION_BY_CUSTOMER = "/api/ServiceDeskAPI/GetSubscriptionByCustomer";
export const URL_GET_MANAGE_ASSETS_LIST = "/api/FixedAssetAPI/GetManageAssetsList";
export const URL_GET_SERVICE_REQUEST_LINK_TO_LOOKUP_LIST = '/api/ServiceDeskAPI/GetServiceRequestLinkToLookups'
export const URL_GET_SERVICE_REQUEST_CC_LIST_LOOKUPS = '/api/ServiceDeskAPI/GetServiceRequestCCListLookups'
export const URL_GET_SUBSCRIPTION_HISTORY_BY_CUSTOMER = "/api/ServiceDeskAPI/GetSubscriptionHistory";
export const URL_GET_COMMENT_CHANGES_HISTORY_BY_SERVICE_REQUEST_ID = "/api/ServiceDeskAPI/GetAllServiceRequestsChangesCommentsById";
export const URL_POST_SERVICE_REQUEST_COMMENT_API = '/api/ServiceDeskAPI/UpdateServiceRequestComments';
export const URL_GET_COMMENTS_API = '/api/ServiceDeskAPI/GetAllServiceRequestsCommentsById';
export const URL_GET_STATUS_LOOKUP_API = '/api/ServiceDeskAPI/GetServiceRequestStatusLookups';
export const URL_GET_STATUS_LOOKUP_FOR_CALCULATE_SLA_API = '/api/ServiceDeskAPI/GetServiceRequestStatusToCalculateSLALookups';
export const URL_GET_LINKED_SERVICE_REQUESTS_API = '/api/ServiceDeskAPI/GetChildServiceRequest';
export const URL_GET_SERVICE_REQUEST_DETAILS_BY_SERVICE_REQUEST_ID = '/api/ServiceDeskAPI/GetAllServiceRequestsDetailswithAdditionalFields'; //ServiceRequestId=10748&branchname=All&CompId=111
export const URL_GET_UPLOADED_FILES_API_BY_SERVICE_REQUEST_ID = '/api/ServiceDeskAPI/GetFileUpload';
export const URL_POST_DELETE_UPLOADED_FILES = '/api/ServiceDeskAPI/DeleteFileUploadById';
export const URL_POST_UPDATE_SERVICE_REQUEST = '/api/ServiceDeskAPI/UpdateServiceRequestwithAdditionalFields';
export const URL_GET_SR_ASSETS_LIST = '/api/ServiceDeskAPI/GetServiceRequestAssetsList';

//userGroup screen
export const URL_GET_USER_GROUP_TABLE_DATA = "/api/ServiceDeskAPI/GetUserGroupList";
export const URL_GET_USER_GROUP_BY_ID = '/api/ServiceDeskAPI/GetUserGroup';
export const URL_ADD_USER_GROUP = "/api/ServiceDeskAPI/AddUserGroupDetails";
export const URL_UPDATE_USER_GROUP = "/api/ServiceDeskAPI/UpdateUserGroupDetails";
export const URL_DELETE_USER_GROUP = "/api/ServiceDeskAPI/DeleteUserGroup";

//Reports 
export const URL_GET_REPORT_FOR_SR_DETAILS = "/api/ServiceDeskAPI/GetServiceRequestDetailsReport";
export const URL_GET_REPORT_FOR_SR_DETAILS_COLUMNS = "/api/ServiceDeskAPI/GetDefaultColumnsServiceRequests";
export const URL_GET_REPORT_FOR_SR_DETAILS_HISTORY = "/api/ServiceDeskAPI/GetServiceRequestHistoyReport";
export const URL_GET_SR_SLA_MET_SEL_VIOLATED = "/api/ServiceDeskAPI/GetServiceRequestSLAReport";
export const URL_GET_SR_SLA_MET_SEL_VIOLATED_COLUMNS = "/api/ServiceDeskAPI/GetDefaultColumnsSLAMetViolated";
export const URL_GET_SR_SEVERITY = "/api/ServiceDeskAPI/GetServiceRequestSeverityLookups";
export const URL_GET_SR_PRIORITY = '/api/ServiceDeskAPI/GetServiceRequestPriorityLookups';
export const URL_GET_MAIN_CATEGORY_DETAILS = "/api/Masters/GetCategoryLookups";
export const URL_GET_SUB_CATEGORY_DETAILS = "/api/Masters/GetSubCategoryLookups";
export const URL_GET_DEPARTMENT_DETAILS = "/api/Masters/GetDepartmentDetailsByCompanyId";
export const URL_GET_SLA_STATUS = "/api/ServiceDeskAPI/GetServiceRequestSLAStatusLookups";
export const URL_GET_LEVEL_FIVE_COMPANY = "/api/Masters/GetHeirarchyDetailsByCompanyId";
export const URL_POST_COLUMNS_FOR_SR_DETAILS = "/api/ServiceDeskAPI/SaveDefaultServiceRequestDetailsColumns";
export const URL_POST_COLUMNS_FOR_SR_MET_VIOLATED = "/api/ServiceDeskAPI/SaveDefaultServiceRequestSLADetailsColumns";
export const URL_ADDITIONAL_FIELD_CONFIG_DETAILS = "/api/Settings/GetAllAdditionalFieldConfigurationDetails"

//configuration
export const URL_GET_SERVICE_REQUEST_TYPES = '/api/ServiceDeskAPI/GetServiceRequestTypes'
export const URL_GET_SERVICE_REQUEST_TYPES_BY_ID = '/api/ServiceDeskAPI/GetServiceRequestTypesById'
export const URL_GET_VENDOR_DETAILS_BY_COMPID = "/api/Masters/GetVendorDetailsByCompanyId"
export const URL_GET_SERVICE_REQUEST_STATUS = "/api/ServiceDeskAPI/GetServiceRequestStatus"
export const URL_GET_NOTIFY_TYPE_LOOKUPS = "/api/ServiceDeskAPI/GetNotifyTypeListLookups"
export const URL_POST_SERVICE_REQUEST_CONFIGURATION = "/api/ServiceDeskAPI/SaveServiceRequestconfig"
export const URL_POST_SERVICE_REQUEST_TYPE = "/api/ServiceDeskAPI/AddServiceRequestType"
export const URL_POST_UPDATE_SR_TYPE = "/api/ServiceDeskAPI/UpdateServiceRequestType"
export const URL_POST_DELETE_SR_TYPE_BY_ID = "/api/ServiceDeskAPI/DeleteServiceRequestTypeById"
export const URL_POST_ADD_SR_STATUS = "/api/ServiceDeskAPI/AddServiceRequestStatus"
export const URL_POST_UPDATE_SR_STATUS = "/api/ServiceDeskAPI/UpdateServiceRequestStatus"
export const URL_POST_DELETE_SR_STATUS = "/api/ServiceDeskAPI/DeleteServiceRequestStatusById";
export const URL_POST_UPDATE_SR_STATUS_SEQUENCE = "/api/ServiceDeskAPI/UpdateIndexSequence";

//Subscription screen 
export const URL_GET_SUBSCRIPTION_LIST = '/api/ServiceDeskAPI/GetSubscription';
export const URL_GET_PRODUCT_LIST = '/api/Masters/GetProductMasterDetailsByCompanyId';
export const SUBSCRIPTION_CURRENCY = '/api/ServiceDeskAPI/GetSubscriptionsCurrency';
export const SUBSCRIPTION_NEXT_AMC_FROM_DATE = '/api/ServiceDeskAPI/GetNextAMCFromDate';
export const ADD_SUBSCRIPTION = '/api/ServiceDeskAPI/AddSubscription';
export const UPDATE_SUBSCRIPTION = '/api/ServiceDeskAPI/UpdateSubscription';
export const URL_SUBSCRIPTION_BY_ID = '/api/ServiceDeskAPI/GetSubscriptionById';
export const URL_DUPLICATE_ADD_CHECK_NO = '/api/ServiceDeskAPI/CheckAddDuplicateCheque';
export const URL_DUPLICATE_UPDATE_CHECK_NO = '/api/ServiceDeskAPI/CheckUpdateDuplicateCheque'

//User Master
export const URL_GET_USER_LIST = '/api/Masters/GetUserDetailsByCompanyId';
export const URL_GET_DEPARTMENTS = '/api/Masters/GetDepartmentLookups';
export const URL_GET_ROLES = '/api/Masters/GetUserRoleNameLookups';
export const URL_POST_NEW_USER = '/api/Masters/AddUserDetails';
export const URL_DELETE_USER = '/api/Masters/DeleteUserById';
export const URL_POST_UPDATE_USER = '/api/Masters/UpdateUserDetails';

//Customer Master
export const URL_GET_CUSTOMER_LIST = '/api/Masters/GetCustomerDetailsByCompanyId';
export const URL_POST_ADD_NEW_CUSTOMER = "/api/Masters/AddCustomerDetails"
export const URL_POST_DELETE_CUSTOMER = "/api/Masters/DeleteCustomerById"
export const URL_GET_BRANCH_LOOKUP = "/api/Masters/GetBranchLookups"
export const URL_POST_UPDATE_CUSTOMER = "/api/Masters/UpdateCustomerDetails"
export const URL_GET_CUSTOMER_LOCATION_DATA = "/api/Masters/GetCustomerLocationDetailsByCompanyId"
export const URL_POST_ADD_CUSTOMER_LOCATION = "/api/Masters/AddCustomerLocationDetails"
export const URL_POST_UPDATE_CUSTOMER_LOCATION = "/api/Masters/UpdateCustomerLocationDetails"
export const URL_POST_DELETE_CUSTOMER_LOCATION = "/api/Masters/DeleteCustomerLocationByCompanyId"



//Vendor Master
export const URL_POST_VENDOR_DETAILS = "/api/Masters/AddVendorDetails";
export const URL_POST_UPDATE_VENDOR_DETAILS = "/api/Masters/UpdateVendorDetails";
export const URL_POST_DELETE_VENDOR = "/api/Masters/DeleteVendorById"

//SMTP URLS
export const URL_GET_SMTP_CONFIG = "/api/Settings/GetSMTPConfigurationDetails";
export const URL_POST_ADD_OR_UPDATE_SMTP_CONFIG = "/api/Settings/AddOrUpdateSMTPConfiguration";

//Organization Master
export const URL_GET_ORGANIZATION_LIST = '/api/Masters/GetOrganizations';
export const URL_GET_COUNTRY_LIST = '/api/Masters/GetCountry';
export const URL_ADD_ORGANIZATION = '/api/Masters/AddOrganizationDetails';
export const URL_UPDATE_ORGANIZATION = '/api/Masters/UpdateOrganizationDetails';
export const URL_GET_CURRENCY_LIST = '/api/Masters/GetCurrency';

//Ticket Progress Dashboard
export const URL_GET_TICKET_PROGRESS_DASHBOARD_DATA = '/api/ServiceDeskAPI/GetServiceRequestDashboardData';

// Change password
export const URL_CHANGE_PASSWORD = '/api/PasswordAPI/ChangePassword';

// User Roles 
export const URL_USER_WISE_MODULE_LIST = '/api/Settings/GetUserwiseModulesList';

//Software Assets Module
//Software Asset Categories
export const URL_ADD_OR_UPDATE_CATEGORY = '/api/ITAssetAPI/AddUpdateSoftwareAssetCategories';
export const URL_GET_ALL_CATEGORIES = '/api/ITAssetAPI/GetSoftwareAssetCategories';
export const URL_DELETE_CATEGORY_BY_ID = '/api/ITAssetAPI/DeleteSoftwareAssetCategories';

//Asset Registry
export const URL_ADD_OR_UPDATE_SOFTWARE_LICENSE = '/api/ITAssetAPI/AddUpdateSoftwareLicenses';
export const URL_GET_SOFTWARES_LICENSES_LIST = '/api/ITAssetAPI/GetSoftwareLicenses';
export const URL_DELETE_SOFTWARE_BY_ID = '/api/ITAssetAPI/DeleteSoftwareLicenses';
export const URL_DELETE_SOFTWARE_LICENSE_BY_ID = '/api/ITAssetAPI/DeleteSoftwareLicensesDetails';

//LICENSE ASSIGNMENT
export const URL_ADD_OR_UPDATE_LICENSE_ASIGNMENT = '/api/ITAssetAPI/AddUpdateLicenseAssignment';
export const URL_GET_LICENSE_ASSIGNMENT_LIST = '/api/ITAssetAPI/GetLicenseAssignment';
export const URL_DELETE_LICENSE_ASSIGNMENT_BY_ID = '/api/ITAssetAPI/DeleteLicenseAssignment';

// Master's Department API's
export const URL_POST_DEPARTMENT_DATA = `/api/Masters/SubmitdepartmentLevels`;
export const URL_DELETE_DEPARTMENT_DATA = `/api/Masters/DeleteDepartmentDetailsById`;

// Master's Company Hierarchy Screen
export const URL_GET_STATE_LOOKUP_DATA = `/api/Masters/StateLookup`;
export const URL_POST_COMPANY_HIERARCHY_DATA = `/api/Masters/SubmitBrachLevels`;
export const URL_DELETE_COMPANY_HIERARCHY_DATA = `/api/Masters/DeleteHeirachyDetailsById`;

// Store Screen`
export const URL_GET_STORE_DATA = `/api/Masters/GetStoreDetails`;
export const URL_DELETE_STORE = `/api/Masters/DeleteStoreDetailsById`;
export const URL_POST_NEW_STORE = `/api/Masters/AddStoreDetails`;
export const URL_POST_UPDATE_STORE = `/api/Masters/UpdateStoreDetails`;

// Master's AssetLocation API's
export const URL_ASSET_LOCATION_DETAILS = `/api/Masters/GetAssetLocationDetailsByCompanyId`
export const URL_POST_ASSET_LOC_DATA = `/api/Masters/SubmitLocationLevels`;
export const URL_DELETE_LOC = `/api/Masters/DeleteAssetLocationDetailsById`;
//Masters Cost center Screen

export const URL_GET_COSTCENTER_DATA = `/api/Masters/GetCostCenterDetailsByCompanyId`;
export const URL_POST_COSTCENTER = `/api/Masters/SubmitCostCenterLevels`;
export const URL_DELETE_COSTCENTER = `/api/Masters/DeleteCostCenterDetailsById`;

//Masters Service locations
 export const URL_GET_SERVICELOCATIONS_LIST=`/api/Masters/GetServiceLocationDetailsByCompanyId`;
 export const URL_POST_SERVICELOCATIONS=`/api/Masters/AddServiceMaintenaceLocations`;
 export const URL_DELETE_SERVICELOCATIONS=`/api/Masters/DeleteServiceLocationById`;
 export const URL_UPDATE_SERVICE_LOCATIONS=`/api/Masters/UpdateServiceMaintenanceLocations`;

 //Masters Cost Breakup 
export const URL_GET_COSTBREAKUP_LIST=`/api/Masters/GetCostBreakupAttributesByCompanyId`;
export const URL_POST_COSTBREAKUP=`/api/Masters/AddCostBreakupAttributesDetails`;
export const URL_UPDATE_COSTBREAKUP=`/api/Masters/UpdateCostBreakupAttributesDetails`;
export const URL_DELETE_COSTBREAKUP=`/api/Masters/DeleteCostBreakupAttributes`;
// Master's fixed Assets Asset Category
export const URL_GET_ASSET_CATEGORY_DATA = `/api/Masters/GetAssetCategoriesByCompanyId`;
export const URL_POST_ASSET_CATEGORY_DATA = `/api/Masters/AddAssetCategoryDetails`;
export const URL_UPDATE_ASSET_CATEGORY_DATA = `/api/Masters/UpdateAssetCategoryDetails`;
export const URL_DELETE_ASSET_CATEGORY_REC = `/api/Masters/DeleteAssetCategoryById`;
export const URL_USER_ATTRIBUTES = `/api/Masters/GetUserAttributesByCompanyId`;

// Masters Item Master 
export const URL_GET_ITEM_MASTER_DATA = `/api/Masters/GetItemMasterDetailsByCompanyId`;
export const URL_DELETE_ITEM_MASTER = `/api/Masters/DeleteItemMaster`;
export const URL_POST_NEW_ITEM_MASTER = `/api/Masters/AddItemMasterDetails`;
export const URL_POST_UPDATE_ITEM_MASTER = `/api/Masters/UpdateItemMasterDetails`;
//Masters Units of Measure

export const URL_GET_UNITS_OF_MEASURE_DATA = `/api/Masters/GetUOMDetailsByCompanyId`;
export const URL_GET_MANAGE_UNITS_OF_MEASURE_DATA = `/api/Masters/GetUOMConversionDetails`;
export const URL_DELETE_UNITS_OF_MEASURE = `/api/Masters/DeleteUnitofMeasureById`;
export const URL_DELETE_CONVERSION = `/api/Masters/DeleteUOMConversionById`;
export const URL_POST_NEW_UNITS_OF_MEASURE = `/api/Masters/AddUnitOfMeasuresDetails`;
export const URL_POST_NEW_CONVERSION = `/api/Masters/AddUOMConversionDetails`;
export const URL_POST_UPDATE_UNITS_OF_MEASURE = `/api/Masters/UpdateUnitOfMeasuresDetails`;
//Masters Product masters
export const URL_POST_PRODUCTS=`/api/Masters/AddProductDetails`;
export const URL_UPDATE_PRODUCTS=`/api/Masters/UpdateProductDetails`;
export const URL_DELETE_PRODUCTS=`/api/Masters/DeleteProductMasterById`;
// Masters User Attributes 
export const URL_GET_USER_ATTRIBUTES_DATA_BY_ID = `/api/Masters/GetUserAttributes`;
export const URL_POST_NEW_USER_ATTRIBUTES=`/api/Masters/AddUserAttributesDetails`;
export const URL_DELETE_GROUP=`/api/Masters/DeleteUserAttributes`;
export const URL_UPDATE_GROUP=`/api/Masters/UpdateUserAttributesDetails`;

// Item Cateory
export const URL_GET_ITEM_CATEGORY = `/api/Masters/GetItemCategoryDetailsByCompanyId`;
export const URL_ADD_ITEM_CATEGORY = `/api/Masters/AddItemCategoryDetails`;
export const URL_UPDATE_ITEM_CATEGORY = `/api/Masters/UpdateItemCategoryDetails`;
export const URL_DELETE_ITEM_CATEGORY = `/api/Masters/DeleteItemCategoriesById`;
export const URL_ITEM_CATEGORY_BY_ID = `/api/Masters/GetItemCategoryDetails`;

// Asset Mapping Book Catergory
export const URL_DEP_BOOK_DETAILS = `/api/Masters/GetDepreciationBookDetails`
export const URL_ASSET_CAT_BOOK_MAPPING_DETAILS = `/api/Masters/GetDepAssetCatBookCatMappingDetails`;
export const URL_GET_PREV_NEXT_FINANCIAL_YEAR_BOOK_DETAILS = `/api/Masters/GetPrevNextFinancialYearDepreciationBookCategoryDetails`
export const URL_ADD_OR_UPDATE_NEW_FIN_YEAR = `/api/Masters/AddorUpdateNewFinYearAssetBookCatMappingDetails`
export const URL_ASSET_CATEGORIES_PREV_NEXT_DATES = `/api/Masters/GetAssetCategoriesMappingPrevNextDate`;
export const URL_GET_DATE_LIST = `/api/Masters/GetAssetCatBookCatMapEffFromDatesListLookupsByBookId`;
export const URL_DOWNLOAD_EXCEL_DATA = `/api/Masters/DownLoadAssetCategoryBookCategoryMapping`;
export const URL_POST_UPLOAD_EXCEL_DATA = `/api/Masters/ImportAssetCategoryBookCategoryMappingData`;
export const URL_GET_COMPANY_HIERARCHY_MASTER_REPORT='api/Masters/GetCompanyHierarchyMasterReport';
export const URL_GET_DEPARTMENT_MASTER_REPORT='/api/Masters/GetDepartmentMasterReport';
export const URL_GET_COST_CENTER_MASTER_REPORT='/api/Masters/GetCostCenterMasterReport';
export const URL_GET_ASSET_LOCATION_MASTER_REPORT='/api/Masters/GetAssetLocationMasterReport';
export const URL_GET_ASSET_CATEGORY_MASTER_REPORT='/api/Masters/GetAssetCategoryMasterReport';
export const URL_GET_USER_MASTER_REPORT='/api/Masters/GetUserMasterReport';
export const URL_GET_VENDOR_MASTER_REPORT='/api/Masters/GetVendorMasterReport';
export const URL_GET_CUSTOMER_MASTER_REPORT='/api/Masters/GetCustomerMasterReport';
export const URL_GET_USER_LOG_MASTER_REPORT='/api/Masters/GetUserLogMasterReport';
export const URL_GET_SERVICE_LOCATIONS_MASTER_REPORT='/api/Masters/GetServiceLocationMasterReport';
export const URL_GET_CUSTOMER_LOCATIONS_MASTER_REPORT='/api/Masters/GetCustomerLocationMasterReport';
export const URL_GET_MASTER_REPORTS_COLUMNS='/api/Masters/GetMasterDataReportsGridColumnsList';
export const URL_POST_MASTER_REPORTS_COLUMNS='/api/Masters/SaveMasterDataReportsGridColumns'

//Masters book 
export const URL_GET_ADDITIONAL_DEPRECIATION_BOOK="/api/Masters/GetAdditionalDepreciationDetails"
export const URL_POST_ADD_ADDITIONAL_DEPRECIATION="/api/Masters/AddAdditionalDepreciationDetails"
export const URL_POST_UPDATE_ADDITIONAL_DEPRECIATION="/api/Masters/UpdateAdditionalDepreciationDetails"
export const URL_DELETE_ADDITIONAL_DEPRECIATION="/api/Masters/DeleteAdditionalDepreciation"
export const URL_GET_GROUP_BY_BOOK_ID="/api/Masters/GetGroupByBookIdDetails"
export const URL_GET_DEPRECIATION_BOOK_DETAILS_BY_ID="/api/Masters/GetDepreciationBookDetailsByBookId"
export const URL_GET_BOOK_CATEGORY_LIST="/api/Masters/GetDepreciationBookCategoryDetailsByBookId"
export const URL_GET_EFFECTIVE_FROM_DATE="/api/Masters/GetEffectiveFromDatesListLookupsByBookId"
export const URL_GET_CHECK_DEP_RAN_FY="/api/DepreciationAPI/CheckForDepreciationRanForFY"
export const URL_POST_ADD_OR_UPDATE_BOOK_CAT="/api/Masters/AddorUpdateDepBookCategoryDetailsByEffFrom"
export const URL_POST_ADD_GROUP_CATEGORY_DETAILS="/api/Masters/AddGroupCategoryDetails"
export const URL_POST_ADD_DEPRECIATION_MASTER="/api/Masters/AddDepBookMasterDetails"
export const URL_POST_UPDATE_BOOK_DETAILS="/api/Masters/UpdateDepBookMasterDetails"
export const URL_POST_UPDATE_GROUP_CATEGORY_DETAILS="/api/Masters/UpdateGroupCategoryDetails"
export const URL_DELETE_DEPRECIATION_BOOK="/api/Masters/DeleteDepreciationBook"
export const URL_DELETE_GROUP_BY_ID="/api/Masters/DeleteGroupById"
export const URL_DELETE_BOOK_CATEGORY="/api/Masters/DeleteDepBookCategory"


//Depreciation Forex Adjustment
export const URL_GET_CALCULATION_LIST_LOOKUP='/api/Masters/GetCalculationBasedListLookups';
export const URL_GET_FOREX_ADJUSTMENT='/api/DepreciationAPI/GetForexAdjustment';

//import asset wise
export const URL_DOWNLOAD_IMPORT_ASSET_WISE='/api/DepreciationAPI/DownloadAssetwiseAccumulatedValues';
export const URL_POST_IMPORT_WISE_ACCUMULATED_VALUE='/api/DepreciationAPI/ImportAssetWiseAccumulatedValue';
// AssetTransfer Asset 1st Tab
export const URL_ASSET_TRANSFER_LIST="/api/FixedAssetAPI/GetAssetsTransferList";
export const URL_BASIC_SEARCH = `/api/FixedAssetAPI/GetAssetTransferDetailsListByBasicSearch`;
export const URL_FILTER_SEARCH = `/api/FixedAssetAPI/GetManageAssetTransferListByFilter`;
export const URL_GRID_COLS = `/api/FixedAssetAPI/GetAllGridColumnsList`;

//Fixed Assets Module
//Lookups
export const URL_GET_SELLER_LOOKUP_DATA='/api/Masters/GetSellerLookups';
export const URL_GET_ACQUISITION_TYPE_LIST='/api/Masters/GetAcquisitionTypeLookups';
export const URL_GET_DEPENDENCY_TYPE_LIST='/api/Masters/GetDependencyTypeLookups';
export const URL_GET_WORKING_CONDITION_LOOKUP_LIST='/api/Masters/GetWorkingConditionLookups';
export const URL_GET_DEPARTMENT_LOOKUP_DATA_BY_USER='/api/Masters/GetDepartmentDetailsByUser';
export const URL_GET_MANUFACTURER_LOOKUP_DATA='/api/Masters/GetManufacturerLookups';
export const URL_GET_ASSET_TAGGABLE_LOOKUP_DATA='/api/Masters/GetIsAssetTaggableLookups';
export const URL_GET_ASSIGNED_TO_LOOKUP_DATA='/api/Masters/GetAssignedUserLookups';
export const URL_GET_ASSET_OWNER_LOOKUP_DATA='/api/Masters/GetAssetOwnerLookups';
export const URL_GET_MAINTENANCE_TYPE_LOOKUP_DATA='/api/Masters/GetMaintenanceTypeLookups'
//Add Asset or Edit Asset Details
export const URL_GET_USER_ATTRIBUTES_BY_SUB_CAT='/api/FixedAssetAPI/GetUserAttributesByCategoryId';
export const URL_GET_COST_BREAKUP_DATA_SUB_CAT='/api/FixedAssetAPI/GetCostBreakupByCatId';
export const URL_GET_ASSET_DETAILS='/api/FixedAssetAPI/GetManageAssetsListWithAttributesById';
export const URL_GET_VIEW_ASSET_CARD_DETAILS='/api/FixedAssetAPI/GetViewAssetCardDetails';
export const URL_GET_GROUP_ASSET_CARD_DETAILS='/api/FixedAssetAPI/GetGroupAssetViewCardDetails';
export const URL_GET_COST_BREAKUP_DATA_BY_ASSET_ID='/api/FixedAssetAPI/GetCostBreakup';
export const URL_GET_RETIRE_DETAILS_BY_ASSET_ID='/api/FixedAssetAPI/GetRetireById';
export const URL_POST_UPDATE_ASSET_DETAILS_WITH_ATTRIBUTES='/api/FixedAssetAPI/UpdateAssetDetailsWithAttribute';
export const URL_POST_UPDATE_ASSET_DETAILS='/api/FixedAssetAPI/UpdateAssetDetails';
export const URL_POST_ADD_ASSET_DETAILS='/api/FixedAssetAPI/AddAssetDetails';
export const URL_ADD_ASSET_DETAILS_WITH_ATTRIBUTES='/api/FixedAssetAPI/AddAssetDetailsWithAttribute';
