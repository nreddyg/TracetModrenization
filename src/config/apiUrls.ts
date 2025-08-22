//service desk urls
// create ticket screen
export const URL_GET_SRCONFIG_LIST = "/api/ServiceDeskAPI/GetServiceRequestConfiguration";
export const URL_GET_SR_TYPE_LOOKUPS = "/api/ServiceDeskAPI/GetServiceRequestTypeLookups";
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

