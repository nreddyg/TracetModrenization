

import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import { ReusableRichTextEditor } from '@/components/ui/reusable-rich-text-editor';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ArrowLeft, Edit, Save, X, Tag, Link, Search, ChevronLeft, ChevronRight, } from 'lucide-react';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Controller, useForm } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import ReusableTable from '@/components/ui/reusable-table';
import { BaseField, GenericObject, UploadedFileOutput, UploadFileInput } from '@/Local_DB/types/types';
import { CREATE_TICKET_DB, modules } from '@/Local_DB/Form_JSON_Data/CreateTicketDB';
import { cn } from '@/lib/utils';
import { deleteSRUpload, getAllSRDetailsList, getCommentHistoryList, getCommentsAPI, getLinkedServiceRequests, getManageAssetsList, GetServiceRequestAssignToLookups, getServiceRequestDetailsById, getSRAdditionalFieldsByServiceRequestType, getSRAssetsList, getSRBranchList, getSRCCListLookupsList, getSRConfigList, getSRCustomerLookupsList, getSRLinkToLookupsList, getSRRequestByLookupsList, getStatusLookups, getSubscriptionByCustomer, getSubscriptionHistoryByCustomer, getUploadedFilesByServiceRequestId, postCommentAPI, postServiceRequest, saveFileUpload, ServiceRequestTypeLookups, updateServiceRequest } from '@/services/ticketServices';
import { fileToByteArray, formatDate, byteArrayToFile, formatDateToDDMMYYYY, getActivityStatusColor, getPriorityColor, getStatusColor, getRequestTypeById } from '@/_Helper_Functions/HelperFunctions';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaSearch } from 'react-icons/fa';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { BsFileEarmarkPdf, BsFiletypeHtml, BsFiletypePptx } from 'react-icons/bs';
import {PiMicrosoftExcelLogoFill,PiMicrosoftWordLogo,PiImage,} from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

interface HistoryRecord {
  id: string;
  date: string;
  user: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  description: string;
}
export interface Ticket {
  CompanyId?: number,
  UserName?: string,
  ServiceRequestId?: number,
  ServiceRequestNo?: string,
  Title?: string,
  ServiceRequestType?: string,
  LinkTo?: string | null,
  RequestedDate?: string,
  RequestedBy?: string,
  BranchId?: number,
  Branch?: string,
  Customer?: string | null,
  SLA?: string,
  AssetId?: null,
  FileUploadURLs?: string,
  IsDraft?: boolean,
  IsOverDue?: boolean,
  CreatedDate?: string,
  Severity?: string,
  Status?: string,
  Priority?: string | null,
  AssigneeSelectedUsers?: string,
  AssigneeSelectedUserGroups?: string,
  CCListSelectedUsers?: string,
  CCListSelectedUserGroups?: string,
  ChildServiceRequestId?:number,
   ChildServiceRequestNo?:string,
  RequestType?: string,
  AssignedTo?:string,
  TicketStatus?: string
}
interface ActivityLog {
  id: string;
  user: string;
  date: string;
  app: string;
  description: string;
  hoursSpent: string;
  status: 'Linked' | 'Unlinked' | 'Manual Entry';
}
interface Comment {
  Comment: ReactNode;
  RequestedDate: ReactNode;
  CommenterName: any;
  id: string;
  user: string;
  date: string;
  text: string;
  type: 'comment' | 'status_change' | 'time_logged';
}
interface OptionItem {
  [key: string]: any;
  label?: string;
  value?: any;
}
interface OptType {
  data: OptionItem[];
  label: string;
  value: string;
  defaultValues?: string | string[];
}
interface allResponsesType {
  ServiceRequestType: OptType
  AssigneeSelectedUsers: OptType
  RequestedBy: OptType
  Customer: OptType
  LinkTo: OptType
  AssetId: OptType
}
interface additionalFieldData {
  AdditionalFieldName: any
  TextBoxValue: any
  DateValues: any
  SelectedValues: any
}
const enableInClose = ["CCListSelectedUsers", "Status", "FileUploadURLs", "Title", "Description"]
const workBenchEnables=["100","101","102","103"]
const myRequestEnables=["104","105"]
const TicketView = () => {
  const { Did, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateMode, setIsCreateMode] = useState(location.pathname === '/service-desk/create-ticket');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>();
  const [selectedTicket, setSelectedTicket] = useState<Ticket>({} as Ticket);
  const [originalTicket, setOriginalTicket] = useState<Ticket>(selectedTicket);
  const [requestTypeId,setRequestTypeId]=useState(Did)
  const [hasChanges, setHasChanges] = useState(false);
  const [activityLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusOptions,setStatusOptions]=useState([
    { value: 'All Status', label: 'All Status' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ]);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [cols, setCols] = useState([])
  const [assetCols,setAssetCols]=useState([])
  const [dataSource, setDataSource] = useState([]);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);
  const [showAccordion, setShowAccordion] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<UploadedFileOutput[]>([]);
  const [ticketStatus, setTicketStatus] = useState<string>('Open');
  const [uploadData, setUploadData] = useState([]);
  // History popup states
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [selectedRowForHistory, setSelectedRowForHistory] = useState<any>(null);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [historyColumns, setHistoryColumns] = useState([]);
  const [comments, setComments] = useState<Comment[]>();
  const [commentHistory, setCommentHistory] = useState<any>([])
  const [childListData, setChildListData] = useState<any>([])
  const [updatedComments,setUpdatedComments]=useState("")
  const [notifyValues,setNotifyValues]=useState({"Notify":[]})
  const selectedAssetCodesData: GenericObject[] = location.state ? location.state?.data : [];
  const [triggerAccordionValidations,setTriggerAccordionValidations]=useState(false);
  const msg = useMessage()
  const dispatch = useAppDispatch();
  const storeData = useAppSelector(state => state);
  const [srtLookupData,setSrtLookupData]=useState<any[]>([]);
  const [assetsData,setAssetData]=useState([])

  // Add ref to track previous ServiceRequestType to prevent infinite loops
  const prevServiceRequestTypeRef = useRef<string>('');
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ServiceRequestNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ticket.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const [fields, setFields] = useState<BaseField[]>(CREATE_TICKET_DB);

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const commentForm = useForm({
    defaultValues: {
      comment: ""
    }
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;


  //api calls to be made in edit mode
  useEffect(() => {
    if (!isCreateMode) {
      if(requestTypeId){
       fetchAllTickets(getRequestTypeById(requestTypeId));
      }
     
    }
  }, [isCreateMode,requestTypeId])

  // Function to clear all form values but preserve all field configurations and options
  const clearAllFormValues = useCallback(() => {
    const currentFields = fields;
    currentFields.forEach(field => {
      setValue(field.name!, '');
    });
  }, [setValue]);
  useEffect(() => {
    if (selectedTicketId) {
      fetchSingleTicketRelatedAPIs(Number(selectedTicketId))
      setHasChanges(false);
    }
  }, [selectedTicketId])
  //Will execute on component mounts and respective dependency mutations
  useEffect(() => {
    if (selectedAssetCodesData)
      fetchAllLookUps();
    if(location?.state?.formData){
     form.reset(location?.state?.formData)
    }
 
  }, []);
  useEffect(() => {
    if (watch('Customer')) fetchSubscriptionByCustomer(watch('Customer'), 111, 'All');
  }, [watch('Customer')])
  useEffect(() => {
    if (isCreateMode) {
      const currentServiceRequestType = watch('ServiceRequestType');
      if (currentServiceRequestType !== prevServiceRequestTypeRef.current) {
        prevServiceRequestTypeRef.current = currentServiceRequestType;
        if (currentServiceRequestType) {
          const additionalFields = fields.filter(f => f.isAdditionalField);
          additionalFields.forEach(field => {
            setValue(field.name!, '');
          });
          fetchAdditionalFieldsData(currentServiceRequestType, 111,false,'setDefaultAssigneeBasedOnServiceRequestType');
        } else {
          const additionalFields = fields.filter(f => f.isAdditionalField);
          additionalFields.forEach(field => {
            setValue(field.name!, '');
          });
          setShowAccordion(false);
          setAccordionOpen(undefined);
        }
      }
    }
  }, [watch('ServiceRequestType')])
  useEffect(() => {
    if (form.watch("FileUploadURLs")) {
      console.log((form.watch("FileUploadURLs")))
      const process = async () => {
        const result = await multipleFileUpload(form.watch("FileUploadURLs"));
      };
      process();
    }
  }, [form.watch("FileUploadURLs")]);
  useEffect(() => {
    if (Object.keys(originalTicket).length > 0) {
      form.reset({ ...originalTicket,...notifyValues })
    }
  }, [originalTicket])

  //assets lisat get for edit
   const assetListAPICall=async(id:string,compId:number)=>{
   await getSRAssetsList(id,compId).then(res => {

        if (res.success && res.data && res.data !== undefined) {
          setAssetData(res.data.AssetsList)
          let cols=generateColumnsFromData(res.data.AssetsList,false)
          setAssetCols(cols)
        } else {
          setAssetData([])
        }
      }
      )
      .catch((err) => {
   
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    }

  //fetch single ticket related apis
  async function fetchSingleTicketRelatedAPIs(serviceRequestId: number) {
    dispatch(setLoading(true));
    try {
      const [TicketDetails, childTickets, uploadedFiles, getComments, getCommentsHistory] = await Promise.allSettled([
        getServiceRequestDetailsById(serviceRequestId, 111, 'All'), getLinkedServiceRequests(serviceRequestId, 111), getUploadedFilesByServiceRequestId(serviceRequestId, 111), getCommentsAPI(serviceRequestId.toString(), 111), getCommentHistoryList(serviceRequestId, 111)
      ]);
      if (TicketDetails.status === 'fulfilled' && TicketDetails.value.data && TicketDetails.value.data.ServiceRequestDetails) {
        let ticketData = TicketDetails.value.data.ServiceRequestDetails
        setSelectedTicket(ticketData);
        try {
          await fetchAdditionalFieldsData(ticketData.ServiceRequestType, 111, ticketData);
            if(ticketData.AssetId){
             await assetListAPICall(serviceRequestId.toString(),111)
          }
        } catch (err) {}
      }
      if (childTickets.status === 'fulfilled' && childTickets.value.data) {
        if (childTickets.value.data.status == undefined)
        {
           setChildListData(childTickets.value.data)
        }else{
          setChildListData([])
        }
      } else {
        setChildListData([])
      }
      if (uploadedFiles.status === 'fulfilled' && uploadedFiles.value.data) {
        setUploadData(uploadedFiles.value.data?.FileUploadDetails)
      } else {
        setUploadData([]);
      }
      if (getComments.status === 'fulfilled' && getComments.value.data) {
        if (getComments.value.data?.status===undefined ) {
          if(getComments.value.data.length>0){
         const commentsArray = getComments.value.data[0]?.Comments || [];
          setComments(commentsArray);
          }else{
            setComments([]);
          }
        } else {
          setComments([]);
        }
      }
      if (getCommentsHistory.status === 'fulfilled' && getCommentsHistory.value.data) {
        if (getCommentsHistory.value.data?.status===undefined) {
         if(getCommentsHistory.value.data.length>0){
          setCommentHistory(getCommentsHistory.value.data[0].Comments)
         }else{
          setCommentHistory([]);
         }
        } else {
          setCommentHistory([]);
        }
      }
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      dispatch(setLoading(false));
    }
  }
  //fetch all tickets list
  async function fetchAllTickets(requestType:string) {
    dispatch(setLoading(true))
    await getAllSRDetailsList('All', 111, requestType).then(res => {
      if (res.success && res.data.status === undefined) {
        if (Array.isArray(res.data)) {
          setTickets(res.data)
        } else {
          setTickets([])
        }

      } else {

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  //fetch uploaded files data based on the service request id 
  async function fetchUploadedFilesByServiceRequestId(serviceRequestId: number) {
    dispatch(setLoading(true))
    await getUploadedFilesByServiceRequestId(serviceRequestId, 111).then(res => {
      if (res.success && res.data) {
        setUploadData(res.data?.FileUploadDetails)
      } else {
        setUploadData([]);
      }
    }).catch(err => {
    }).finally(()=>{
      dispatch(setLoading(false));
    })
  }
  //store lookups data in json
  const setLookupsDataInJson = (lookupsData: allResponsesType, config: GenericObject): void => {
    const arr = Object.keys(lookupsData)
    const groupNames: string[] = []
    const opts: { [key: string]: any } = {}
    arr.forEach((obj) => {
      let ret = []
      if (lookupsData[obj].isGrouping) {
        groupNames.push(obj)
        let groupOpts = []
        ret = lookupsData[obj].groupData.map((element) => {
          groupOpts = element.data.map((ele) => {
            let opt = {}
            opt["label"] = ele[element.label]
            opt["value"] = ele[element.value]
            return opt
          });
          return {
            "label": element.groupLabel,
            "options": groupOpts
          }
        })

      } else {
        ret = lookupsData[obj].data.map((element) => {
          let opt = {}
          opt["label"] = element[lookupsData[obj].label]
          opt["value"] = element[lookupsData[obj].value]
          return opt
        });
      }

      opts[obj] = ret

    })
    const data = structuredClone(fields);
    data.forEach((obj) => {
      if (arr.includes(obj.name)) {
        if (groupNames.includes(obj.name)) {
          obj.groupedOptions = opts[obj.name]
        }
        obj.options = opts[obj.name]
      }
      if (obj.name === 'Customer' || obj.name === 'AssetId') {
        obj['show'] = config[obj.name];
        if (obj.name === 'AssetId') {
          obj['defaultValue'] = lookupsData.AssetId.defaultValues || []
          form.setValue('AssetId', lookupsData.AssetId.defaultValues);
        }
      }
      if (obj.name !== 'RequestedDate' && !isCreateMode) {
        obj.disabled = !isEditing;
      }
      if ((obj.name === 'Branch' || obj.name === 'ServiceRequestType') && !isCreateMode) {
        obj.disabled = true;
      }
      if ((obj.name === 'AssetId' || obj.name === 'LinkTo') && !isCreateMode) {
        obj.show = false;
      } if(obj.name==="RequesterCheckbox"|| obj.name==="CCListCheckbox" || obj.name==="AssignToCheckbox" || obj.name==="Notify"){
          if(config.IsDefaultNotifyUsers){
              form.setValue("Notify",config.NotifyUserTypes?.split(","))
              setNotifyValues({"Notify":config.NotifyUserTypes?.split(",")})
          }
      }
    });
    setFields(data);
  }
  //add comments api
  const postComment = async () => {
    const payload = {
      "ServiceRequestComments": [
        {
          "ServiceRequestNo": originalTicket.ServiceRequestNo,
          "Comment": commentForm.watch("comment"),
        }
      ]
    }
   
    dispatch(setLoading(true))
    await postCommentAPI(111, 'All', payload).then(res => {
        let commentList=`${updatedComments} Comment:${payload["ServiceRequestComments"][0].Comment}`
      if (res.data.status) {
        msg.success(res.data.message)
        setUpdatedComments(commentList)
        commentForm.setValue("comment","")
        getCommentApi(originalTicket.ServiceRequestId.toString(), 111);
      } else {
        msg.warning(res?.data?.ErrorDetails[0]['Error Message'] || 'Please Fill All The Required Fields')
      }
    }).catch(err => { }).finally(() => dispatch(setLoading(false)))
  }
  // Handle history button click
  const handleHistoryClick = (row: any) => {
    setSelectedRowForHistory(row);
    const recordId = row.id || row.ID || Object.values(row)[0] || 'Unknown';
    fetchSubscriptionHistoryByCustomer(watch("Customer"), 111, "All", row.ProductId)
    setIsHistoryPopupOpen(true);
  };
  //method for generating columns based on data
  function generateColumnsFromData<T extends Record<string, any>>(
    data: T[],
    includeActions: boolean = true
  ): ColumnDef<T>[] {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    let keys=Object.keys(sample)
    const columns: ColumnDef<T>[] = keys.filter((obj)=>obj!=="ProductId").map((key) => {
    const value = sample[key];

      let editType: 'text' | 'number' | 'date' | 'select' = 'text';
      if (typeof value === 'number') {
        editType = 'number';
      } else if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        editType = 'date';
      }

      return {
        accessorKey: key,
        header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        meta: {
          editable: true,
          editType,
        },
      } as ColumnDef<T>;
  
  
    });

    if (includeActions) {
      columns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            size="sm"
            onClick={() => handleHistoryClick(row.original)}
            className="flex items-center gap-1"
            style={{ backgroundColor: "#fb8420" }}
          >
            History
          </Button>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }
    return columns;
  }
  async function getCommentApi(ServiceRequestId: string, compId: number) {
    dispatch(setLoading(true))
    try {
      const res = await getCommentsAPI(ServiceRequestId, compId);
      if (res.success && res.data) {
        const commentsArray = res.data[0]?.Comments || [];
        setComments(commentsArray);
      }
    } catch (err) {}finally{dispatch(setLoading(false))}
  }
  //subscription table api call
  async function fetchSubscriptionByCustomer(CustomerName: string, compId: number, BranchName: string) {
    dispatch(setLoading(true))
    await getSubscriptionByCustomer(CustomerName, compId, BranchName).then(res => {
      if (res.success && res.data.status === undefined) {
        setDataSource(res.data);
        const newCols = generateColumnsFromData(res.data)
        setCols(newCols)
      } else {
        setDataSource([]);
      }
    })
      .catch(err => {
      }).finally(()=>{
        dispatch(setLoading(false));
      })
  }
  //fetching all lookups data
  async function fetchAllLookUps() {
    dispatch(setLoading(true));
    try {
      const [SRTLookUp, SRTAssignToLookup, SRTRequestedByLookup, SRTLinkToLookup, SRTCCListLookup, SRTBranchListLookup, ConfigData, StatusLookup] = await Promise.allSettled([
        ServiceRequestTypeLookups(111), GetServiceRequestAssignToLookups(111, 'All'),
        getSRRequestByLookupsList(111, 'All'), getSRLinkToLookupsList(111, 'All'),
        getSRCCListLookupsList(111, 'All'), getSRBranchList(111), getSRConfigList(111, 'All'),
        getStatusLookups(111)
      ]);
      let configuration = ConfigData.status === 'fulfilled' && ConfigData.value.data && ConfigData.value.data.ServiceRequestConfiguration ? ConfigData.value.data.ServiceRequestConfiguration : { CustomerFieldinMyRequest: true, AssetFieldinCreateEditServiceRequest: true }
      let fetchCustomerAndAssetCodesLookup = { Customer: configuration.CustomerFieldinMyRequest, AssetId: configuration.AssetFieldinCreateEditServiceRequest,...configuration };
      let SRTCustomerLookup: [] = [], Assets: [] = [];
      if (fetchCustomerAndAssetCodesLookup.Customer) {
        await getSRCustomerLookupsList(111, 'All').then(res => {
          SRTCustomerLookup = res.success ? res.data.ServiceRequestCustomerLookup ? res.data.ServiceRequestCustomerLookup : [] : []
        }).catch(err => { }).finally(() => { })
      }
      if (fetchCustomerAndAssetCodesLookup.AssetId) {
        await getManageAssetsList('All', 111).then(res => {
          Assets = res.success ? res.data.AssetsListDetails ? res.data.AssetsListDetails : [] : []
        }).catch(err => { }).finally(() => { })
      }
      let AssetsData: GenericObject[] = [...selectedAssetCodesData, ...Assets.filter((item: any) => item.EmpId == 'AIPL1693')]
      const allResponses = {
        ServiceRequestType: { data: SRTLookUp.status === 'fulfilled' && SRTLookUp.value.success && SRTLookUp.value.data.ServiceRequestTypesLookup ? SRTLookUp.value.data.ServiceRequestTypesLookup : [], label: 'ServiceRequestTypeName', value: 'ServiceRequestTypeName' },
        AssigneeSelectedUsers: {
          data: [], label: 'UserName', value: 'UserName', isGrouping: true, groupData: [{ label: "UserGroupName", value: "UserGroupName", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], groupLabel: "User Group" },
          { label: "UserName", value: "UserName", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], groupLabel: "Users" },]
        }
        , RequestedBy: { data: SRTRequestedByLookup.status === 'fulfilled' && SRTRequestedByLookup.value.success && SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup ? SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup : [], label: 'UserName', value: 'UserName' }
        , Customer: fetchCustomerAndAssetCodesLookup.Customer ? { data: SRTCustomerLookup, label: 'CustomerName', value: 'CustomerName' } : { data: [], label: '', value: '' }
        , LinkTo: { data: SRTLinkToLookup.status === 'fulfilled' && SRTLinkToLookup.value.success && SRTLinkToLookup.value.data.ServiceRequestLinkToLookup ? SRTLinkToLookup.value.data.ServiceRequestLinkToLookup : [], label: 'ServiceRequestName', value: 'ServiceRequestName' }
        , CCListSelectedUsers: {
          data: [], label: 'UserName', value: 'UserName', isGrouping: true, groupData: [
            { label: "UserGroupName", value: "UserGroupName", data: SRTCCListLookup.status === 'fulfilled' && SRTCCListLookup.value.success && SRTCCListLookup.value.data.ServiceRequestCCListUserGroupsLookup ? SRTCCListLookup.value.data.ServiceRequestCCListUserGroupsLookup : [], groupLabel: "User Group" },
            { label: "UserName", value: "UserName", data: SRTCCListLookup.status === 'fulfilled' && SRTCCListLookup.value.success && SRTCCListLookup.value.data.ServiceRequestCCListUsersLookup ? SRTCCListLookup.value.data.ServiceRequestCCListUsersLookup : [], groupLabel: "Users" },]
        }
        , Branch: { data: SRTBranchListLookup.status === 'fulfilled' && SRTBranchListLookup.value.success && SRTBranchListLookup.value.data ? SRTBranchListLookup.value.data.filter((ele: any) => ele.id !== 0 && ele.parent !== '#' && ele.type !== '99') : [], label: 'Name', value: 'Name' }
        , AssetId: fetchCustomerAndAssetCodesLookup.AssetId ? { data: AssetsData, label: 'AssetCode', value: 'AssetID', defaultValues: selectedAssetCodesData.map(asset => asset['AssetID']) } : { data: [], label: '', value: '' }
        , Status: { data: StatusLookup.status === 'fulfilled' && StatusLookup.value.success && StatusLookup.value.data.ServiceRequestStatusLookup ? StatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusName' }
      };
      if(StatusLookup.status === 'fulfilled' && StatusLookup.value.success && StatusLookup.value.data.ServiceRequestStatusLookup){
        let statusArr=StatusLookup.value.data.ServiceRequestStatusLookup.map((status: any) => ({ value: status?.ServiceRequestStatusName, label: status?.ServiceRequestStatusName }));
        setStatusOptions([{ value: 'All Status', label: 'All Status' },...statusArr]);
      }else{
        setStatusOptions([])
      }
      if(SRTLookUp.status === 'fulfilled' && SRTLookUp.value.success && SRTLookUp.value.data.ServiceRequestTypesLookup){
        setSrtLookupData(SRTLookUp.value.data.ServiceRequestTypesLookup);
      }else{
        setSrtLookupData([]);
      }
      setLookupsDataInJson(allResponses, fetchCustomerAndAssetCodesLookup);
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      setSelectedTicketId(id)
      dispatch(setLoading(false));
    }
  }
  //function to navigate asset table
  function navigateToAssetTable() {
    navigate("/service-desk/new-request/assetcode-table", { state: { data: form.getValues() } })
  }
  //history table api call
  async function fetchSubscriptionHistoryByCustomer(CustomerName: string, compId: number, BranchName: string, ProductId: number) {
    dispatch(setLoading(true));
    await getSubscriptionHistoryByCustomer(CustomerName, compId, BranchName, ProductId).then(res => {
      if (res.success && res.data) {
        setHistoryData(res.data);
        const newCols1 = generateColumnsFromData(res.data, false)
        setHistoryColumns(newCols1)
      }
    }).catch(err => {
      }).finally(()=>{
        dispatch(setLoading(false));
      })
  }
  // Fetch additional fields - only clear values, preserve all field configs and options
  async function fetchAdditionalFieldsData(name: string, compId: number, fieldData?: any,setDefaultAssignee?:string) {
    dispatch(setLoading(true));
    let additionalCheckBoxNames = []
    let additionalDateNames=[]
    let updatedFields=[]
    try {
      const res = await getSRAdditionalFieldsByServiceRequestType(name, compId);
      if (res.success && res.data && res.data.AdditionalFields) {
        const baseFieldsOnly = fields.filter(f => !f.isAdditionalField);
        if (res.data.AdditionalFields.length === 0) {
          setShowAccordion(false);
          setAccordionOpen(undefined);
        } else {
          const newAdditionalFields = res.data.AdditionalFields.map((field: any) => {
            if (field.FieldType.toLowerCase() === "checkbox") {
              additionalCheckBoxNames.push(field.FieldName)
            }else if(field.FieldType.toLowerCase() === "date"){
              additionalDateNames.push(field.FieldName)
            }


            return ({
              name: field.FieldName,
              isAdditionalField: true,
              label: field.FieldName,
              fieldType: field.FieldType.toLowerCase(),
              placeholder: '',
              isRequired: field.IsMandatory,
              disabled: !isCreateMode,
              allowClear: true,
              defaultValue: '',
              format: "DD-MM-YYYY",
              options: field.FieldType === 'Dropdown' || field.FieldType === 'CheckBox' || field.FieldType === 'RadioButton'
                ? field.FieldValues?.split(",")?.map((opt: any) => ({
                  label: opt,
                  value: opt,
                }))
                : [],
              // ...(field.fieldType.toLowerCase()==="date" && {format: "DD-MM-YYYY"}),
            })
          }

          );
          if(setDefaultAssignee && srtLookupData.length!==0 && watch('ServiceRequestType')){
            const selectedServiceRequestType = watch('ServiceRequestType');
            const matchingSrt = srtLookupData.find(item => item.ServiceRequestTypeName === selectedServiceRequestType);
            if(matchingSrt){
              setValue('AssigneeSelectedUsers', matchingSrt.UserGroup ? matchingSrt.UserGroup.split(",") : []);
            }
          }
          updatedFields = [...baseFieldsOnly, ...newAdditionalFields];
          setShowAccordion(true);
          newAdditionalFields.forEach((field: any) => {
            setValue(field.name!, '');
          });
        }

      } else {
        msg.open({
          content: 'No Additional Fields Found!',
          key: 'NoAdditionalFields',
          type: 'warning'
        });
        const additionalFields = fields.filter(f => f.isAdditionalField);
        additionalFields.forEach(field => {
          setValue(field.name!, '');
        });
        setShowAccordion(false);
        setAccordionOpen(undefined);
      }
    } catch (err) {
      const additionalFields = fields.filter(f => f.isAdditionalField);
      additionalFields.forEach(field => {
        setValue(field.name!, '');
      });
      setShowAccordion(false);
      setAccordionOpen(undefined);
    } finally {

      if (fieldData) {
        let additionalFields: any = {};
        if (fieldData.AdditionalFields && fieldData.AdditionalFields.length > 0) {
          fieldData.AdditionalFields.forEach((field: any) => {
            additionalFields[field.FieldName] = field.FieldValue || '';
            if (additionalCheckBoxNames.includes(field.FieldName))
              additionalFields[field.FieldName] = field.FieldValue.split(",");

              if (additionalDateNames.includes(field.FieldName))
                    additionalFields[field.FieldName] = formatDateToDDMMYYYY(field.FieldValue);
          });
        }
       fieldData["AssigneeSelectedUsers"] = {  "Users":fieldData["AssigneeSelectedUsers"].split(","),"User Group": fieldData["AssigneeSelectedUserGroups"].split(",")};
        fieldData["CCListSelectedUsers"] = {  "Users":fieldData["CCListSelectedUsers"].split(","),"User Group": fieldData["CCListSelectedUserGroups"].split(",")};
        fieldData['RequestedBy'] = fieldData['RequestedBy']?.replace(/\s*\(/g, " (");
        fieldData['RequestedDate'] = formatDateToDDMMYYYY(fieldData['RequestedDate']);
        form.reset({ ...fieldData, ...additionalFields,...notifyValues });
        setOriginalTicket({ ...fieldData, ...additionalFields,...notifyValues });
        setSelectedTicket({ ...fieldData, ...additionalFields,...notifyValues });
        resetValue(updatedFields)
      }else{
        setFields(updatedFields)
      }
      dispatch(setLoading(false));
    }
  }
  //upload Functionality and API Integration
  // const multipleFileUpload = async (
  //   filelist: UploadFileInput[]): Promise<void> => {
  //   const files: (UploadedFileOutput | null)[] = await Promise.all(
  //     filelist?.map(async (file) => {
  //       try {
  //         if (!file.url) throw new Error("Missing file URL");
  //         const response = await axios.get<Blob>(file.url, { responseType: "blob" });
  //         const byteArray = await fileToByteArray(response.data);
  //         const byteArrayAsArray = Array.from(byteArray);
  //         const jsonArrayString = JSON.stringify(byteArrayAsArray);
  //         const fileType = file.name.split(".").pop() || "";
  //         return {
  //           FileName: file.name,
  //           ServiceDocumentFile: jsonArrayString,
  //           FileType: fileType,
  //           FileConversionType: file.type,
  //         };
  //       } catch (error) {
  //         return null;
  //       }
  //     })
  //   );

  //   const validFiles = files.filter(
  //     (file): file is UploadedFileOutput => file !== null
  //   );
  //   setAttachments(validFiles);
  // };

  //upload Functionality and API Integration
const multipleFileUpload = async (filelist: UploadFileInput[]): Promise<void> => {
  // Ensure filelist is an array
  const fileArray = Array.isArray(filelist) ? filelist : [];
  
  if (fileArray.length === 0) {
    console.warn('No files to upload');
    return;
  }

  const files: (UploadedFileOutput | null)[] = await Promise.all(
    fileArray.map(async (file, index) => {
      try {
        if (!file.url) throw new Error(`Missing file URL for file at index ${index}`);
        
        const response = await axios.get<Blob>(file.url, { responseType: "blob" });
        const byteArray = await fileToByteArray(response.data);
        const byteArrayAsArray = Array.from(byteArray);
        const jsonArrayString = JSON.stringify(byteArrayAsArray);
        const fileType = file.name.split(".").pop() || "";
        
        return {
          FileName: file.name,
          ServiceDocumentFile: jsonArrayString,
          FileType: fileType,
          FileConversionType: file.type,
        };
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        return null;
      }
    })
  );

  const validFiles = files.filter(
    (file): file is UploadedFileOutput => file !== null
  );

  console.log(`Processed ${validFiles.length} out of ${fileArray.length} files`);
  setAttachments(validFiles);
};
  //handling uploaded files
  const handleSubmitUploadedFiles = async (id: string,updatedData?:any) => {
    dispatch(setLoading(true));
    const uploadPayload = { ServiceReqFileUploadDetails: attachments }
    await saveFileUpload(111, id, uploadPayload).then(res => {
      if (res.data.status) {
        msg.success(res.data.message)
        setAttachments([]);
      }
    }).catch(err => { }).finally(() => {
      if (!isCreateMode) {
     
        if(updatedData.status=="Closed"){
            navigate(-1)
        }
        fetchSingleTicketRelatedAPIs(Number(selectedTicketId))
      }else{
        form.reset();
        setAttachments([]);
      }
      dispatch(setLoading(false));
    })
  }
  //to render re usable components based on the json data from db
  const renderField = (field: BaseField) => {
    let fieldsToShowInEdit:string[]=['Priority','Status','Notify']
    const { name, label, fieldType, isRequired, show = true } = field;
    const overrideShow = !show && fieldsToShowInEdit.includes(name) && !isCreateMode;
    if (!name || (!overrideShow && (!show || (fieldsToShowInEdit.includes(name) && !isCreateMode)))) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };

    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableTextarea
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'richtext':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableRichTextEditor
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
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
                  dropdownClassName={true ? 'z-[10001]' : ''}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'multiselect':
        return (
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              rules={validationRules}
              render={({ field: ctrl }) => (
                <ReusableMultiSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  error={errors[name]?.message as string}
                  {...(name === 'AssetId' ? { suffixIcon: <FaSearch onClick={() => navigateToAssetTable()} style={{ fontSize: "16px", color: "#617ce7", cursor: 'pointer' }} color="white" /> } : {})}
                />
              )}
            />
          </div>
        );

      case 'upload':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableUpload
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'numeric':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                type="number"
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableCheckbox
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'radiobutton': return (
        <Controller
          key={name}
          name={name}
          control={control}
          rules={validationRules}
          render={({ field: ctrl }) => (
            <ReusableRadio
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
  // Grouping logic: You may customize based on field.name or custom metadata
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
  const getAdditionalFields = () => fields.filter(f => f.isAdditionalField);
  //get additional fields data
  function getAdditionalFieldsData(): additionalFieldData[] {
    return fields.filter(field => field.isAdditionalField).map(field => {
      const val = watch(field.name);
      return {
        AdditionalFieldName: field.name,
        TextBoxValue: field.fieldType === 'text' || field.fieldType === 'numeric' ? val : '',
        DateValues: field.fieldType === 'date' ? formatDate(val, 'DD/MM/YYYY') : '',
        SelectedValues: field.fieldType === 'dropdown' || field.fieldType === 'radiobutton' ? val : field.fieldType === 'checkbox' ? Array.isArray(val) ? val.join(',') : '' : ''
      };
    });
  }
  //handle submit for creating tickets
  const handleSave = async () => {
    const isValidationFailed = fields.filter(f => f.isAdditionalField && f.isRequired).every(f=>form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
    if (!isValidationFailed) {
      return;
    }
    const payload = {
      "ServiceRequestDetails": [
        {
          "Title": watch('Title'),
          "ServiceRequestType": watch('ServiceRequestType'),
          "AssigneeSelectedUserGroups": watch('AssigneeSelectedUsers')["User Group"] ? watch('AssigneeSelectedUsers')["User Group"].join(',') : "",
          "CCListSelectedUserGroups": watch('CCListSelectedUsers')["User Group"] ? watch('CCListSelectedUsers')["User Group"].join(',') : "",
          "AssigneeSelectedUsers": watch('AssigneeSelectedUsers')["Users"] ? watch('AssigneeSelectedUsers')["Users"].join(',') : "",
          "CCListSelectedUsers": watch('CCListSelectedUsers')["Users"] ? watch('CCListSelectedUsers')["Users"].join(',') : "",
          "Severity": watch('Severity'),
          "AssetIds": watch('AssetId').join(','),
          "IsDraft": false,
          "RequestedDate": formatDate(watch('RequestedDate'), 'DD-MM-YYYY'),
          "RequestedBy": 659,
          "BranchName": watch('Branch'),
          "LinkTo": watch('LinkTo'),
          "Customer": watch('Customer'),
          "Description": watch('Description'),
          "FileUploadURLs": "",
          "AdditionalFields": getAdditionalFieldsData()
        }
      ]
    }
    dispatch(setLoading(true));
    await postServiceRequest(111, 'All', payload).then(res => {
      if (res.data.status) {
        handleSubmitUploadedFiles(res.data.ServiceRequestId);
        msg.success(res.data.message)
        setHasChanges(false);
      } else {
        msg.warning(res?.data?.ErrorDetails[0]['Error Message'] || 'Please Fille All The Required Fields')
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  };
  //handle Edit Save
  const handleUpdate = async () => {
    const isValidationFailed = fields.filter(f => f.isAdditionalField && f.isRequired).every(f=>form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
    if (!isValidationFailed) {
      return;
    }
    updateServiceRequestDetails()
  }
  async function updateServiceRequestDetails() {
    let commentlist=commentForm.watch("comment")  && commentForm.watch("comment")!= "<p><br></p>"?`${updatedComments} Comment:${commentForm.watch("comment")}`:updatedComments
    const updatedData = {
      "ServiceRequestNo": originalTicket.ServiceRequestNo,
      "NotifyRequester": watch('Notify').includes("100") ? true : false,
      "NotifyAssignee": watch('Notify').includes("102") ? true : false,
      "NotifyCCList": watch('Notify').includes("101") ? true : false,
      "Status": watch('Status'),
      "Severity": watch('Severity'),
      "Priority": watch('Priority') ? watch('Priority') : "",
      "SaveAndSend": true,
       "Comment":commentForm.watch("comment") && commentForm.watch("comment")!= "<p><br></p>"?commentForm.watch("comment"):"",
      "CommentList":commentlist,
      "AsignedUserGroups":watch('AssigneeSelectedUsers')["User Group"] ? watch('AssigneeSelectedUsers')["User Group"].join(',') : "",
      "AsignedUsers":watch('AssigneeSelectedUsers')["Users"] ? watch('AssigneeSelectedUsers')["Users"].join(',') : "",
      "Customer": watch('Customer'),
      "CCListUsers": watch('CCListSelectedUsers')["Users"] ? watch('CCListSelectedUsers')["Users"].join(',') : "",
      "CCListUserGroups": watch('CCListSelectedUsers')["User Group"] ? watch('CCListSelectedUsers')["User Group"].join(',') : "",
      "FileUploadURLs": "",
      "Title": watch('Title'),
      "Description": watch('Description'),
      "AdditionalFields": selectedTicket.Status === "Closed" ? [] : getAdditionalFieldsData()
 ,
 
          
    }

    let payload = {
      "ServiceRequestDetails": [updatedData]
    }
    dispatch(setLoading(true));
    await updateServiceRequest(111, 'All', payload).then(res => {
      if (res.data.status) {
        if (attachments?.length > 0) {
          handleSubmitUploadedFiles(originalTicket.ServiceRequestId.toString(),updatedData)
        }else{
          if(updatedData.Status=="Closed"){
             navigate(-1)
          }
        fetchSingleTicketRelatedAPIs(Number(selectedTicketId))
        // resetValue()
        }
        msg.success(res.data.message);


      }
    }).catch(err => {
      msg.error(err.message);
    }).finally(() => {

      dispatch(setLoading(false));
    });
  }
  //handle Attachment delete
  const handleAttachmentDelete = async (fileId: number) => {
    dispatch(setLoading(true))
    await deleteSRUpload(fileId, 111).then((res) => {
      if (res.data.status !== undefined) {
        if (res.data.status === true) {
          msg.success(res.data.message)
          fetchUploadedFilesByServiceRequestId(selectedTicket.ServiceRequestId)
        } else {
          msg.success(res.data.message)
        }
      } else {
        msg.success(res.data?.ErrorDetails[0]["Error Message"])
      }
    }).catch(() => { }).finally(() => {
      dispatch(setLoading(false))
    })

  }
  //reset values
  const resetValue=(fieldsCopy)=>{
    commentForm.reset({comment:""})
      setAttachments([])
      setUpdatedComments("")
      setHasChanges(false);
      setIsEditing(false);
      fieldsCopy.forEach(field => { field.disabled = true; });
      setFields(fieldsCopy);
  }
  // Handle cancel edit - only clear form values, preserve all field configs and options
  const handleEdit = (type: string) => {
  let fieldsCopy = structuredClone(fields);
    if (type === 'cancel') {
      msg.warning('All unsaved changes have been discarded.');
      if(isCreateMode){
        form.reset();
        setAttachments([]);
        setUpdatedComments("")
        setHasChanges(false);
        setIsEditing(false);
      }else{
        form.reset({ ...originalTicket,...notifyValues });
        setSelectedTicket(originalTicket);
        resetValue(fieldsCopy);
      }
     
    } else if (type === 'clear' || type === 'save') {
      form.reset({...notifyValues});
      setHasChanges(false);
      setIsEditing(false);
      clearAllFormValues();
      setAttachments([]);
      setDataSource([]);
      setCols([]);
    } else if (type === 'edit') {
    
      setIsEditing(true);
      setHasChanges(true);
      let isNotClosed = selectedTicket.Status !== "Closed"
      fieldsCopy.forEach(field => {
        if (isNotClosed) {
          if (!field.isAlwaysOnDisabled && (field.name !== 'Branch' && field.name !== 'ServiceRequestType'&& field.name !== 'RequestedBy')) {
            if((workBenchEnables.includes(requestTypeId)) && (field.name !== 'Severity') && (field.name !== 'Customer')&& ( field.name !== 'Title' && field.name !== 'Description') ){
             field.disabled = false;
            }else if((myRequestEnables.includes(requestTypeId)) && (field.name !== 'Priority')  ){
              field.disabled = false;
            }else if(requestTypeId==="106"){
                 field.disabled = false;
            }
            
           
          }
        } else {
          field.disabled = !enableInClose.includes(field.name)
        }
      });
      setFields(fieldsCopy);
    }
  };
  const handleTicketSelect = (ticket: Ticket,isLink:boolean) => {
    if (hasChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmDiscard) return;
    }
   if((selectedTicketId!==ticket.ServiceRequestId.toString())){
    form.reset({...notifyValues})
    }
    if(!isLink){
    setSelectedTicketId(ticket.ServiceRequestId.toString())
    if (isEditing) {
      handleEdit("cancel")
    }
    commentForm.reset({comment:""})
    // window.history.replaceState(null, '', `/tickets/${ticket.ServiceRequestId}`);
    const parts = window.location.pathname.split('/');
    parts[parts.length - 1] = ticket.ServiceRequestId.toString();
    window.history.replaceState(null, '', parts.join('/'));

    }else{
      
     setSelectedTicketId(ticket.ChildServiceRequestId.toString())
    if (isEditing) {
      handleEdit("cancel")
    }
    commentForm.reset({comment:""})
        const parts = window.location.pathname.split('/');
    parts[parts.length - 1] = ticket.ChildServiceRequestId.toString();
    window.history.replaceState(null, '', parts.join('/'));
    // window.history.replaceState(null, '', `/tickets/${ticket.ChildServiceRequestId}`);
    }

  };
  const triggerAccordionItemsValidations=async()=>{
    await trigger(fields.filter(f => f.isAdditionalField && f.isRequired).map(f => f.name));
    setTriggerAccordionValidations(false);
  }
  useEffect(()=>{
    if(triggerAccordionValidations){
      triggerAccordionItemsValidations();
    }
  },[triggerAccordionValidations])
  const handleTriggerAccordionItemsValidations = ():void => {
    if(fields.filter(f => f.isAdditionalField && f.isRequired).length > 0 && showAccordion){
      const valid = fields.filter(f => f.isAdditionalField && f.isRequired).every(f=>form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
      if (!valid) {
        setAccordionOpen('additional-fields');
        setTriggerAccordionValidations(true);
        msg.warning('Please Fill All The Required Additional Fields!!');
      }
    } else {
      setAccordionOpen(undefined);
    }
  };
  return (
    <div className="h-full   bg-gray-50 flex flex-col ">
      <div className="flex flex-1 overflow-hidden   ">
        {/* Left Sidebar - Ticket Inbox */}
        {!isCreateMode &&
          <div className={`${isInboxCollapsed ? 'w-6 p-1' : 'w-34 p-2 mb-2 rounded-b-[5px]'} bg-white border-r    border-0 shadow-lg flex pb-3 flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
            <div className="pt-1 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                  Tickets ({filteredTickets.length})
                </h3>
                <div onClick={() => setIsInboxCollapsed(!isInboxCollapsed)} className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground  ${isInboxCollapsed ? 'me-2  py-1 ' : 'p-1'}`}>
                  {isInboxCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </div>
              </div>
              {!isInboxCollapsed && (
                <div className="space-y-2 pb-1">
                  {/* Status Filter */}
                  <ReusableDropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as string)}
                    placeholder="Filter by status..."
                    className=" min-h-[10px] rounded-md"
                    containerClassName="w-full h-8 rounded-md"

                    showSearch={false}
                  />
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>

            {!isInboxCollapsed && (
              <ScrollArea hideScrollbar={true} className="flex-1 min-h-0  mb-2 truncate max-w-[250px] block">
                <div className="py-2">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.ServiceRequestId}
                      className={`p-3 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedTicket?.ServiceRequestNo === ticket.ServiceRequestNo ? 'bg-blue-50 border-l-4 border-blue-500' : 'border border-gray-200'}`}
                      onClick={() => handleTicketSelect(ticket,false)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600">{ticket.ServiceRequestNo}</span>
                        <Badge className={getPriorityColor(ticket.Severity || '')} variant="secondary">
                          {ticket.Severity}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {ticket.Title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge className={getStatusColor(ticket.Status)} variant="outline">
                          {ticket.Status}
                        </Badge>
                        <span>•</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ticket.AssigneeSelectedUsers}>{ticket.AssigneeSelectedUsers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>}
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          {/* Navigation and Action Bar */}
          <div className="bg-white border-b  shadow-sm px-4 lg:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className=' text-gray-400 hover:text-blue-900 p-1 cursor-pointer' onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 text-current stroke-[3]" />
                </div>
                <span className="text-gray-600 text-sm">All Tickets</span>
                <span className="text-gray-400">|</span>
                {!isCreateMode && <span className="text-blue-600 font-medium">{selectedTicket?.Title || ''}</span>}
                <Badge className={getPriorityColor(watch('Severity'))}>{watch('Severity')}</Badge>
                {!isCreateMode && <Badge className={getStatusColor(selectedTicket?.Status)}>{selectedTicket?.Status || ''}</Badge>}
              </div>

              {isCreateMode && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">{watch('Title')}</h1>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && !isCreateMode ? (
                <ReusableButton
                  variant="primary"
                  size="small"
                  onClick={() => handleEdit('edit')}
                  icon={<Edit className="h-4 w-4" />}
                >
                  Edit
                </ReusableButton>
              ) : (
                <>
                  <ReusableButton
                    variant="text"
                    size="small"
                    onClick={() => handleEdit('cancel')}
                    icon={<X className="h-4 w-4" />}
                  >
                    Cancel
                  </ReusableButton>
                  <ReusableButton
                    size="small"
                    variant="primary"
                    onClick={isCreateMode
                      ? () => {
                        handleSubmit(handleSave)();
                        handleTriggerAccordionItemsValidations();
                      }
                      : () => {
                          handleSubmit(handleUpdate)();
                          handleTriggerAccordionItemsValidations();
                      }
                    }
                    icon={<Save className="h-4 w-4" />}
                  >
                    Save
                  </ReusableButton>
                </>
              )}
            </div>
          </div>
          
          {/* Content Grid with Individual Scroll Areas */}
          <div className="flex-1 p-3 overflow-hidden min-h-0  ">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-1 h-full">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-8 flex flex-col  min-h-0 ">
                <ScrollArea className="flex-1  ">
                  <div className="space-y-6 pr-3">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <div className='grid md:grid-cols-[2.2fr_1.8fr] sm:grid-cols-1 space-x-3 space-y-1'>
                            {getFieldsByNames(['Title', 'ServiceRequestType']).map((field) => (
                              <div key={field.name}>
                                {renderField(field)}
                              </div>
                            ))}
                          </div>
                          <div className='grid grid-cols-1 space-y-3'>
                            {getFieldsByNames(['Description', 'FileUploadURLs']).map(renderField)}
                            {
                              !isCreateMode && <div>
                                <div className="text-sm font-semibold mb-2 text-gray-700">Attachment:</div>

                                {uploadData && uploadData.length > 0 ? (
                                  <div className="my-2 flex flex-wrap gap-3">
                                    {uploadData.map((x) => (
                                      <div
                                        key={x.FileUploadId}
                                        className="flex items-center bg-gray-100 px-2 py-1 rounded-md space-x-2 max-w-xs"
                                      >
                                        {/* Icon + File Name */}
                                        <div
                                          className="flex items-center space-x-2 cursor-pointer"
                                          onClick={() => {
                                            const fileData = JSON.parse(x.ServiceDocumentFile);
                                            byteArrayToFile(
                                              fileData,
                                              x.FileUploadName.split(".")[0],
                                              x.FileConversionType,
                                              x.FileType
                                            );
                                          }}
                                        >
                                          {x.FileType === "pdf" && <BsFileEarmarkPdf size={22} />}
                                          {["xls", "xlsx"].includes(x.FileType) && (
                                            <PiMicrosoftExcelLogoFill size={23} />
                                          )}
                                          {["doc", "docx"].includes(x.FileType) && (
                                            <PiMicrosoftWordLogo size={23} />
                                          )}
                                          {["png", "jpg", "jpeg", "img"].includes(x.FileType) && (
                                            <PiImage size={23} />
                                          )}
                                          {["ppt", "pptx"].includes(x.FileType) && (
                                            <BsFiletypePptx size={23} />
                                          )}
                                          {["tex", "txt", "rtf", "odt"].includes(x.FileType) && (
                                            <BsFiletypeHtml size={23} />
                                          )}

                                          <span
                                            className="text-xs text-gray-800 truncate max-w-[120px]"
                                            title={x.FileUploadName}
                                          >
                                            {x.FileUploadName}
                                          </span>
                                        </div>

                                        {/* Delete Icon */}
                                        {isEditing &&
                                          <button
                                            onClick={() => {
                                              handleAttachmentDelete(x.FileUploadId)
                                            }}
                                            className="text-gray-600 hover:text-red-500 transition-colors"
                                          >
                                            <RxCross2 size={15} />
                                          </button>
                                        }
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No Attachments</p>
                                )}
                              </div>
                            }
                            {getFieldsByNames(['Customer']).map(renderField)}
                          </div>
                          {watch('Customer') && <div>
                            <div className='text-sm font-medium mb-1'>Subscription Details List:</div>
                            <ReusableTable
                              data={dataSource}
                              columns={cols}
                              enableExport={false}

                            />
                          </div>}
                           {!isCreateMode && selectedTicket.AssetId!==null  && <div>
                             <div className='text-sm font-medium mb-1'>Asset List:</div>
                            <ReusableTable
                              data={assetsData}
                              columns={assetCols}
                              enableExport={false}
                            />
                          </div>}
                        </div>
                      </CardContent>
                    </Card>
                    {(showAccordion && ticketStatus !== 'Closed') &&
                      <Card className='shadow-lg'>
                        <CardContent className="p-0">
                          <Accordion type="single" collapsible value={accordionOpen} onValueChange={setAccordionOpen}>
                            <AccordionItem value="additional-fields" className="border-none">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <Tag className="h-5 w-5" />
                                  <span className="font-semibold">Additional Fields</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 capitalize gap-4">
                                    {getAdditionalFields().map(renderField)}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    }
                    {/* Activity & Comments */}
                    {!isCreateMode && (
                      <Card className=" bg-white border-b  shadow-sm   mb-2  shadow-lg">
                        <CardHeader>
                          <CardTitle>Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="comments" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3 h-auto">
                              <TabsTrigger value="comments" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Comments</TabsTrigger>
                              <TabsTrigger value="history" className="text-xs sm:text-sm px-2 sm:px-4 py-2">History</TabsTrigger>
                              {/* <TabsTrigger value="worklog" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Work Log</TabsTrigger> */}
                            </TabsList>

                            <TabsContent value="comments" className="space-y-4">
                              <div className="space-y-4">
                                <form>
                                  <Controller
                                    name="comment"
                                    control={commentForm.control}
                                    render={({ field: ctrl }) => (
                                      <ReusableRichTextEditor
                                        value={ctrl.value}
                                        formats={['bold', 'italic', 'underline', 'strike']}
                                        onChange={ctrl.onChange}
                                        isRequired={false}
                                        modules={modules}
                                        showToolbar={true}
                                        minHeight={120}
                                        maxHeight={300}
                                      />
                                    )}
                                  />
                                  <div className="flex justify-end my-4">
                                    <ReusableButton
                                      size="small"
                                      onClick={commentForm.handleSubmit(postComment)}
                                    >
                                      Post Comment
                                    </ReusableButton>
                                  </div>
                                </form>
                              </div>

                              {comments?.map((comment) => (
                                <div key={comment.id} className="flex gap-3 p-4 border rounded">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                                    {comment?.CommenterName?.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{comment?.CommenterName}</span>
                                      <span className="text-sm text-gray-500">{comment?.RequestedDate}</span>
                                    </div>
                                    <div className="ql-editor sd-edit-comments">
                                      <div className='commentHistory ' dangerouslySetInnerHTML={{ __html: comment.Comment.toString() }} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </TabsContent>

                            <TabsContent value="history" className="space-y-4">
                              {commentHistory?.map((change, ind) => (
                                <div key={ind} className="flex gap-3 p-4 border rounded">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                                    {change.CommenterName.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{change.CommenterName}</span>
                                      <span className="text-sm text-gray-500">{change.RequestedDate}</span>
                                      {/* <Badge variant="outline" className="text-xs">
                                      </Badge> */}
                                    </div>
                                    <div className="text-sm">
                                      <div className='commentHistory ' dangerouslySetInnerHTML={{ __html: change.Comment }} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </TabsContent>

                            {/* <TabsContent value="worklog" className="space-y-4">
                              {activityLogs.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-8">No work log entries found</p>
                              )}
                              {activityLogs.map((log) => (
                                <div key={log.id} className="flex justify-between items-center p-4 border rounded">
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{log.user}</span>
                                      <span className="text-sm text-gray-500">{log.date}</span>
                                      <Badge variant="outline">{log.app}</Badge>
                                    </div>
                                    <p className="text-gray-700 truncate">{log.description}</p>
                                  </div>
                                  <div className="text-right shrink-0 ml-4">
                                    <p className="font-semibold">{log.hoursSpent}</p>
                                    <p className={`text-sm ${getActivityStatusColor(log.status)}`}>
                                      {log.status}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </TabsContent> */}
                          </Tabs>
                        </CardContent>
                      </Card>)}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Column - Details Panel */}
              <div className="xl:col-span-4 flex flex-col min-h-0">
                <ScrollArea className="flex-1 h-full">
                  <div className="pr-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-0">
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 rounded-t-lg">
                            <TabsTrigger value="details" className="text-xs data-[state=active]:shadow-lg data-[state=active]:shadow-gray-300">Details</TabsTrigger>
                            {!isCreateMode && <TabsTrigger value="linkedissues" className="text-xs data-[state=active]:shadow-lg data-[state=active]:shadow-gray-300">Links</TabsTrigger>}
                          </TabsList>

                          <TabsContent value="details" className="p-6 space-y-4">
                            {getFieldsByNames(['Status', 'AssigneeSelectedUsers', 'Severity', 'Priority', 'AssetId', 'RequestedDate', 'RequestedBy', 'Branch', 'CCListSelectedUsers', 'LinkTo','Notify']).map(renderField)}
                          
                          </TabsContent>
                          <TabsContent value="linkedissues" className="p-6 space-y-3">
                            {(childListData.length !== 0) ?
                              <>
                                {childListData?.map((obj) => (
                                  <div  onClick={()=>{handleTicketSelect(obj,true)}} key={obj.ChildServiceRequestNo} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                                    <Link className="h-4 w-4 text-blue-600" />
                                    <div className="flex-1">
                                      <span className="text-blue-600 font-medium text-sm">{obj.ChildServiceRequestNo}</span>
                                      <p className="text-xs text-gray-600">Click to view details</p>
                                    </div>
                                  </div>
                                ))}
                              </>
                              :
                              <p className="text-sm text-gray-500 text-center py-4">No linked tickets</p>
                            }
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* History Popup Dialog */}
      <Dialog open={isHistoryPopupOpen} onOpenChange={setIsHistoryPopupOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Subscription History
              {selectedRowForHistory && (
                <span className="text-sm font-normal text-gray-600 ml-2 mt-2">
                  (ID: {selectedRowForHistory.id || selectedRowForHistory.ID || Object.values(selectedRowForHistory)[0] || 'Unknown'})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-hidden ">
            <ScrollArea className="h-[60vh] w-full ">
              <ReusableTable
                data={historyData}
                columns={historyColumns}
              />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketView;