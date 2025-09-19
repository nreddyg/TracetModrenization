// login page urls

export const GET_TOKEN='/token';
export const URL_ORGANZIATION_DETAILS="/api/Masters/GetSelectedOrganizationByAccesToken";
export const URL_GET_USER_DETAILS="/api/Masters/GetUserDetailsByUserName";
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

//Vendor Master
export const URL_GET_VENDOR_LIST='/api/Masters/GetVendorDetailsByCompanyId';

//SMTP URLS
export const URL_GET_SMTP_CONFIG="/api/Settings/GetSMTPConfigurationDetails";
export const URL_POST_ADD_OR_UPDATE_SMTP_CONFIG="/api/Settings/AddOrUpdateSMTPConfiguration";
//Organization Master
export const URL_GET_ORGANIZATION_LIST='/api/Masters/GetOrganizations';
