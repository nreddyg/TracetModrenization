// login page urls

export const GET_TOKEN='/token';
export const URL_ORGANZIATION_DETAILS="/api/Masters/GetSelectedOrganizationByAccesToken";
export const URL_GET_USER_DETAILS="/api/Masters/GetUserDetailsByUserName";

//utility urls
export const URL_GET_HIERARCHY_LEVELS_DATA="/api/Settings/GetHierarchyLevelsData";
//header nav urls
export const URL_GET_COMPANY_LIST="/api/Masters/GetOrganizationsByUserId";
export const URL_GET_BRANCH_LIST="/api/Masters/GetHeirarchyDetailsLastLevelByCompanyId";

//service desk urls
// create ticket screen
export const URL_GET_SRCONFIG_LIST = "/api/ServiceDeskAPI/GetServiceRequestConfiguration";
// export const URL_GET_SR_TYPE_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestTypeLookups";
export const URL_GET_SR_TYPE_LOOKUPS="/api/ServiceDeskAPI/GetServiceRequestTypeLookupsByBranchId";
export const URL_CREATE_SERVICE_REQUEST = "/api/ServiceDeskAPI/CreateServiceRequestwithAdditionalFields";
export const URL_SAVE_FILE_UPLOAD = "/api/ServiceDeskAPI/SaveFileUploadByServiceRequestId";
export const URL_GET_SR_ASSIGN_TO_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestAssignToLookups";
export const URL_GET_HEIRARCHY_DETAILS_LAST_LEVEL = "/api/Masters/GetHeirarchyDetailsLastLevelByCompanyId";
export const URL_GET_SR_REQUESTED_BY_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestRequestedByLookups";
export const URL_GET_SR_CUSTOMER_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestCustomerLookups";
export const URL_GET_SR_ADDITIONAL_FIELDS = "/api/ServiceDeskAPI/GetServiceRequestsAdditionalFieldsByServiceRequestTypeName";
export const URL_GET_ALL_SERVICE_REQUESTS_DETAILS = "/api/ServiceDeskAPI/GetAllServiceRequestsDetails";
export const URL_GET_SUBSCRIPTION_BY_CUSTOMER = "/api/ServiceDeskAPI/GetSubscriptionByCustomer";
export const URL_GET_MANAGE_ASSETS_LIST = "/api/FixedAssetAPI/GetManageAssetsList";
export const URL_GET_SERVICE_REQUEST_LINK_TO_LOOKUP_LIST='/api/ServiceDeskAPI/GetServiceRequestLinkToLookups'
export const URL_GET_SERVICE_REQUEST_CC_LIST_LOOKUPS='/api/ServiceDeskAPI/GetServiceRequestCCListLookups'
export const URL_GET_SUBSCRIPTION_HISTORY_BY_CUSTOMER = "/api/ServiceDeskAPI/GetSubscriptionHistory";
export const URL_GET_COMMENT_CHANGES_HISTORY_BY_SERVICE_REQUEST_ID = "/api/ServiceDeskAPI/GetAllServiceRequestsChangesCommentsById";
export const URL_POST_SERVICE_REQUEST_COMMENT_API = '/api/ServiceDeskAPI/UpdateServiceRequestComments';
export const URL_GET_COMMENTS_API = '/api/ServiceDeskAPI/GetAllServiceRequestsCommentsById';
export const URL_GET_STATUS_LOOKUP_API = '/api/ServiceDeskAPI/GetServiceRequestStatusLookups';
export const URL_GET_STATUS_LOOKUP_FOR_CALCULATE_SLA_API = '/api/ServiceDeskAPI/GetServiceRequestStatusToCalculateSLALookups';
export const URL_GET_LINKED_SERVICE_REQUESTS_API = '/api/ServiceDeskAPI/GetChildServiceRequest';
export const URL_GET_SERVICE_REQUEST_DETAILS_BY_SERVICE_REQUEST_ID = '/api/ServiceDeskAPI/GetAllServiceRequestsDetailswithAdditionalFields'; //ServiceRequestId=10748&branchname=All&CompId=111
export const URL_GET_UPLOADED_FILES_API_BY_SERVICE_REQUEST_ID = '/api/ServiceDeskAPI/GetFileUpload';
export const URL_POST_DELETE_UPLOADED_FILES='/api/ServiceDeskAPI/DeleteFileUploadById';
export const URL_POST_UPDATE_SERVICE_REQUEST ='/api/ServiceDeskAPI/UpdateServiceRequestwithAdditionalFields';
export const URL_GET_SR_ASSETS_LIST='/api/ServiceDeskAPI/GetServiceRequestAssetsList';
//userGroup screen
export const URL_GET_USER_GROUP_TABLE_DATA="/api/ServiceDeskAPI/GetUserGroupList";
export const URL_GET_USER_GROUP_BY_ID='/api/ServiceDeskAPI/GetUserGroup';
export const URL_ADD_USER_GROUP="/api/ServiceDeskAPI/AddUserGroupDetails";
export const URL_UPDATE_USER_GROUP="/api/ServiceDeskAPI/UpdateUserGroupDetails";
export const URL_DELETE_USER_GROUP="/api/ServiceDeskAPI/DeleteUserGroup";
//Reports 
export const URL_GET_REPORT_FOR_SR_DETAILS="/api/ServiceDeskAPI/GetServiceRequestDetailsReport";
export const URL_GET_REPORT_FOR_SR_DETAILS_COLUMNS="/api/ServiceDeskAPI/GetDefaultColumnsServiceRequests";
export const URL_GET_REPORT_FOR_SR_DETAILS_HISTORY="/api/ServiceDeskAPI/GetServiceRequestHistoyReport";
export const URL_GET_SR_SLA_MET_SEL_VIOLATED="/api/ServiceDeskAPI/GetServiceRequestSLAReport";
export const URL_GET_SR_SLA_MET_SEL_VIOLATED_COLUMNS="/api/ServiceDeskAPI/GetDefaultColumnsSLAMetViolated";
export const URL_GET_SR_SEVERITY = "api/ServiceDeskAPI/GetServiceRequestSeverityLookups";
export const URL_GET_SR_PRIORITY = 'api/ServiceDeskAPI/GetServiceRequestPriorityLookups';
export const URL_GET_MAIN_CATEGORY_DETAILS="/api/Masters/GetCategoryLookups";
export const URL_GET_SUB_CATEGORY_DETAILS = "/api/Masters/GetSubCategoryLookups";
export const URL_GET_DEPARTMENT_DETAILS = "api/Masters/GetDepartmentDetailsByCompanyId";
export const URL_GET_SLA_STATUS = "api/ServiceDeskAPI/GetServiceRequestSLAStatusLookups";
export const URL_GET_LEVEL_FIVE_COMPANY="api/Masters/GetHeirarchyDetailsByCompanyId";
export const URL_POST_COLUMNS_FOR_SR_DETAILS="api/ServiceDeskAPI/SaveDefaultServiceRequestDetailsColumns";
export const URL_POST_COLUMNS_FOR_SR_MET_VIOLATED="api/ServiceDeskAPI/SaveDefaultServiceRequestSLADetailsColumns";
export const URL_ADDITIONAL_FIELD_CONFIG_DETAILS="api/Settings/GetAllAdditionalFieldConfigurationDetails"
 
// export const URL_GET_WORK_ORDER_LIST="/api/ServiceDeskAPI/DeleteUserGroup";
// export const URL_GET_WORK_ORDER_DETAILS="/api/ServiceDeskAPI/DeleteUserGroup";
// export const URL_GET_SCHEDULED_WORK_ORDER_LIST="/api/ServiceDeskAPI/DeleteUserGroup";
// export const URL_GET_WORK_ORDER_TASK_DETAILS="/api/ServiceDeskAPI/DeleteUserGroup";
// export const URL_GET_WORK_ORDER_PENALITY="/api/ServiceDeskAPI/DeleteUserGroup";



//configuration

export const URL_GET_SERVICE_REQUEST_TYPES='/api/ServiceDeskAPI/GetServiceRequestTypes'
export const URL_GET_SERVICE_REQUEST_TYPES_BY_ID='/api/ServiceDeskAPI/GetServiceRequestTypesById'
export const URL_GET_VENDOR_DETAILS_BY_COMPID="/api/Masters/GetVendorDetailsByCompanyId"
export const URL_GET_SERVICE_REQUEST_STATUS="/api/ServiceDeskAPI/GetServiceRequestStatus"
export const URL_GET_NOTIFY_TYPE_LOOKUPS="/api/ServiceDeskAPI/GetNotifyTypeListLookups"
export const URL_POST_SERVICE_REQUEST_CONFIGURATION="/api/ServiceDeskAPI/SaveServiceRequestconfig"
export const URL_POST_SERVICE_REQUEST_TYPE="/api/ServiceDeskAPI/AddServiceRequestType"
export const URL_POST_UPDATE_SR_TYPE="/api/ServiceDeskAPI/UpdateServiceRequestType"
export const URL_POST_DELETE_SR_TYPE_BY_ID="/api/ServiceDeskAPI/DeleteServiceRequestTypeById"
export const URL_POST_ADD_SR_STATUS="/api/ServiceDeskAPI/AddServiceRequestStatus"
export const URL_POST_UPDATE_SR_STATUS="/api/ServiceDeskAPI/UpdateServiceRequestStatus"
export const URL_POST_DELETE_SR_STATUS="/api/ServiceDeskAPI/DeleteServiceRequestStatusById";
export const URL_POST_UPDATE_SR_STATUS_SEQUENCE="/api/ServiceDeskAPI/UpdateIndexSequence";

//Subscription screen 
export const URL_GET_SUBSCRIPTION_LIST='/api/ServiceDeskAPI/GetSubscription';
export const URL_GET_PRODUCT_LIST='/api/Masters/GetProductMasterDetailsByCompanyId';
export const SUBSCRIPTION_CURRENCY='/api/ServiceDeskAPI/GetSubscriptionsCurrency';
export const SUBSCRIPTION_NEXT_AMC_FROM_DATE='/api/ServiceDeskAPI/GetNextAMCFromDate';
export const ADD_SUBSCRIPTION='/api/ServiceDeskAPI/AddSubscription';
export const UPDATE_SUBSCRIPTION='/api/ServiceDeskAPI/UpdateSubscription';
export const URL_SUBSCRIPTION_BY_ID='/api/ServiceDeskAPI/GetSubscriptionById';
export const URL_DUPLICATE_ADD_CHECK_NO='/api/ServiceDeskAPI/CheckAddDuplicateCheque';
export const URL_DUPLICATE_UPDATE_CHECK_NO='/api/ServiceDeskAPI/CheckUpdateDuplicateCheque'

//User Master
export const URL_GET_USER_LIST='/api/Masters/GetUserDetailsByCompanyId';
export const URL_GET_DEPARTMENTS='/api/Masters/GetDepartmentLookups';
export const URL_GET_ROLES='/api/Masters/GetUserRoleNameLookups';
export const URL_GET_CATEGORIES='/api/Masters/GetCategoryLookups';
export const URL_POST_NEW_USER='/api/Masters/AddUserDetails';
export const URL_DELETE_USER='/api/Masters/DeleteUserById';
export const URL_POST_UPDATE_USER='/api/Masters/UpdateUserDetails';

//Customer Master
export const URL_GET_CUSTOMER_LIST = '/api/Masters/GetCustomerDetailsByCompanyId';

//Vendor Master
export const URL_GET_VENDOR_LIST='/api/Masters/GetVendorDetailsByCompanyId';
export const URL_POST_VENDOR_DETAILS="/api/Masters/AddVendorDetails";
export const URL_GET_VENDOR_DETAILS="/api/Masters/GetVendorDetailsByCompanyId";
export const URL_POST_UPDATE_VENDOR_DETAILS="/api/Masters/UpdateVendorDetails";
export const URL_POST_DELETE_VENDOR="/api/Masters/DeleteVendorById"

//SMTP URLS
export const URL_GET_SMTP_CONFIG="/api/Settings/GetSMTPConfigurationDetails";
export const URL_POST_ADD_OR_UPDATE_SMTP_CONFIG="/api/Settings/AddOrUpdateSMTPConfiguration";

//Organization Master
export const URL_GET_ORGANIZATION_LIST='/api/Masters/GetOrganizations';
export const URL_GET_COUNTRY_LIST='/api/Masters/GetCountry';
export const URL_ADD_ORGANIZATION='/api/Masters/AddOrganizationDetails';
export const URL_UPDATE_ORGANIZATION='api/Masters/UpdateOrganizationDetails';
export const URL_GET_CURRENCY_LIST='/api/Masters/GetCurrency';

//Ticket Progress Dashboard
export const URL_GET_TICKET_PROGRESS_DASHBOARD_DATA = '/api/ServiceDeskAPI/GetServiceRequestDashboardData';

// Change password
export const URL_CHANGE_PASSWORD = '/api/PasswordAPI/ChangePassword';


//Software Assets Module
//Software Asset Categories
export const URL_ADD_OR_UPDATE_CATEGORY='/api/ITAssetAPI/AddUpdateSoftwareAssetCategories';
export const URL_GET_ALL_CATEGORIES='/api/ITAssetAPI/GetSoftwareAssetCategories';
export const URL_DELETE_CATEGORY_BY_ID='/api/ITAssetAPI/DeleteSoftwareAssetCategories';

//Asset Registry
export const URL_ADD_OR_UPDATE_SOFTWARE_LICENSE='/api/ITAssetAPI/AddUpdateSoftwareLicenses';
export const URL_GET_SOFTWARES_LICENSES_LIST='/api/ITAssetAPI/GetSoftwareLicenses';
export const URL_DELETE_SOFTWARE_BY_ID='/api/ITAssetAPI/DeleteSoftwareLicenses';
export const URL_DELETE_SOFTWARE_LICENSE_BY_ID='/api/ITAssetAPI/DeleteSoftwareLicensesDetails';

//LICENSE ASSIGNMENT
export const URL_ADD_OR_UPDATE_LICENSE_ASIGNMENT='/api/ITAssetAPI/AddUpdateLicenseAssignment';
export const URL_GET_LICENSE_ASSIGNMENT_LIST='/api/ITAssetAPI/GetLicenseAssignment';
export const URL_DELETE_LICENSE_ASSIGNMENT_BY_ID='/api/ITAssetAPI/DeleteLicenseAssignment';

// Master's Department API's
// export const URL_POST_DEPARTMENT_DATA=`/api/Masters/GetDepartmentDetailsByCompanyId`;
export const URL_GET_DEPARTMENT_DATA = `/api/Masters/GetDepartmentDetailsByCompanyId`;
export const URL_POST_DEPARTMENT_DATA = `/api/Masters/SubmitdepartmentLevels`;
export const URL_DELETE_DEPARTMENT_DATA = `/api/Masters/DeleteDepartmentDetailsById`;
export const URL_GET_DEPARTMENT_DATA_BY_DEPId = `/api/Masters/GetDepartmentDetailsByCompanyId`;

// hierarchy Level Data based on Id
export const HIERARCHY_LEVEL_DATA = `/api/Settings/GetHierarchyLevelsData`;
// Master's Company Hierarchy Screen

export const URL_GET_COMPANY_HIERARCHY_DATA = `/api/Masters/GetHeirarchyDetailsByCompanyId`;
export const URL_GET_STATE_LOOKUP_DATA = `/api/Masters/StateLookup`;
export const URL_POST_COMPANY_HIERARCHY_DATA=`/api/Masters/SubmitBrachLevels`;
export const URL_DELETE_COMPANY_HIERARCHY_DATA=`/api/Masters/DeleteHeirachyDetailsById`;
export const URL_GET_COMPANY_HIERARCHY_DATA_BY_BRANCHID=`/api/Masters/GetHeirarchyDetailsByCompanyId`;

// Store Screen`

export const URL_GET_STORE_DATA = `/api/Masters/GetStoreDetails`;
export const URL_DELETE_STORE = `/api/Masters/DeleteStoreDetailsById`;
export const URL_POST_NEW_STORE = `/api/Masters/AddStoreDetails`;
export const URL_POST_UPDATE_STORE = `/api/Masters/UpdateStoreDetails`;
// export const URL_GET_EDIT_STORE_DATA = `/api/Masters/GetStoreDetails`;
// export const URL_GET_COMPANY_HIERARCHY_DATA = `/api/Masters/GetHeirarchyDetailsByCompanyId`
// export const URL_POST_COMPANY_HIERARCHY_DATA=`/api/Masters/GetHeirarchyDetailsByCompanyId`;


// Master's AssetLocation API's
export const URL_ASSET_LOCATION_DETAILS = `/api/Masters/GetAssetLocationDetailsByCompanyId`
export const URL_ASSET_LOCATION_BY_LOC_ID = `/api/Masters/GetAssetLocationDetailsByCompanyId`
export const URL_POST_ASSET_LOC_DATA =`/api/Masters/SubmitLocationLevels`;
export const URL_DELETE_LOC = `/api/Masters/DeleteAssetLocationDetailsById`;
//Masters Cost center Screen

export const URL_GET_COSTCENTER_DATA=`/api/Masters/GetCostCenterDetailsByCompanyId`;
export const URL_POST_COSTCENTER=`/api/Masters/SubmitCostCenterLevels`;
export const URL_GET_COSTCENTER_BY_ID=`/api/Masters/GetCostCenterDetailsByCompanyId`;
export const URL_DELETE_COSTCENTER=`/api/Masters/DeleteCostCenterDetailsById`;

//Masters Service locations
 export const URL_GET_SERVICELOCATIONS_LIST=`/api/Masters/GetServiceLocationDetailsByCompanyId`;
 export const URL_POST_SERVICELOCATIONS=`/api/Masters/AddServiceMaintenaceLocations`;
// Master's fixed Assets Asset Category
export const URL_GET_ASSET_CATEGORY_DATA = `/api/Masters/GetAssetCategoriesByCompanyId`;
export const URL_POST_ASSET_CATEGORY_DATA = `/api/Masters/AddAssetCategoryDetails`;
export const URL_UPDATE_ASSET_CATEGORY_DATA = `/api/Masters/UpdateAssetCategoryDetails`;
export const URL_DELETE_ASSET_CATEGORY_REC = `/api/Masters/DeleteAssetCategoryById`;
// Masters Item Master 
export const URL_GET_ITEM_MASTER_DATA = `/api/Masters/GetItemMasterDetailsByCompanyId`;
export const URL_DELETE_ITEM_MASTER = `/api/Masters/DeleteItemMaster`;
export const URL_POST_NEW_ITEM_MASTER = `/api/Masters/AddItemMasterDetails`;
export const URL_POST_UPDATE_ITEM_MASTER = `/api/Masters/UpdateItemMasterDetails`;

