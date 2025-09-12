import { BaseField, QuillModules } from "../types/types";
 
 
// Fixed modules configuration with all necessary features
export const modules: QuillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
  ],
  clipboard: {
    matchVisual: false,
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true
  }
};

export const CREATE_TICKET_DB: BaseField[] = [
   
  {
    name: 'Title',
    label: 'Title',
    fieldType: 'text',
    placeholder: 'Enter ticket title',
    isRequired: true,
    className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
    {
    label: "Service Request Type",
    fieldType: "dropdown",
    name: "ServiceRequestType",
    placeholder: "Select fieldType",
    isRequired: true,
    options: [],
    allowClear: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
  {
    name: 'Description',
    label: 'Description',
    fieldType: 'richtext',
    placeholder: 'Enter detailed description',
    isRequired: false,
    formats:[
      'header',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'list', 'bullet',
      'indent', 'align',
      'blockquote', 'code-block',
      'link', 'image'
    ],
    modules:modules,
    showToolbar:true,
    minHeight:120,
    maxHeight:300,
    disabled:false
  },
  {
    name: 'comment',
    label: 'Comments',
    fieldType: 'richtext',
    placeholder: 'Enter your comment here...',
    isRequired: false,
    disabled:false
  },
  {    
    label: "Status",
    fieldType: "dropdown",
    name: "Status",
    placeholder: "Select Status",
    isRequired: false,
    allowClear: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    defaultValue:'Medium',
    show:false,
    disabled:false
  },
  {
    label: "Assign To",
    fieldType: "multiselect",
    name: "AssigneeSelectedUsers",
    placeholder: "Select Assignee",
    isRequired: false,
    options: [],
    defaultValue:[],
    value: [],
    selectAll:true,
    groupSelectAll:true,
    groupedOptions: [],
    disabled:false
  },
  {    
    label: "Severity",
    fieldType: "dropdown",
    name: "Severity",
    placeholder: "Select Severity",
    isRequired: true,
    allowClear: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    defaultValue:'Medium',
    disabled:false
  },
  {    
    label: "Priority",
    fieldType: "dropdown",
    name: "Priority",
    placeholder: "Select Priority",
    isRequired: true,
    allowClear: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    defaultValue:'Medium',
    show:true,
    disabled:false,
  },
  {    
    label: "Asset Code",
    fieldType: "multiselect",
    name: "AssetId",
    placeholder: "Select Asset",
    isRequired: false,
    visible: false,
    options: [],
    defaultValue:[],
    selectAll:true,
    show:true,
    disabled:false
  },
   {
    label: "Requested Date",
    fieldType: "date",
    name: "RequestedDate",
    placeholder: "Select Date",
    isRequired: false,
    defaultValue:new Date(),
    format: "DD-MM-YYYY",
    disabled:true,
    isAlwaysOnDisabled:true
  },
  {
    label: "Requested By",
    fieldType: "dropdown",
    name: "RequestedBy",
    placeholder: "Select Requested By",
    allowClear: true,
    isRequired: true,
    options: [],
    disabled:false
  },
  {
    label: "Branch",
    fieldType: "dropdown",
    name: "Branch",
    placeholder: "Select Branch",
    isRequired: true,
    allowClear: true,
    options: [],
    disabled:false
  },
  {
    label: "CC List",
    fieldType: "multiselect",
    name: "CCListSelectedUsers",
    placeholder: "Select CC List",
    isRequired: false,
    defaultValue:[],
    groupSelectAll:true,
    selectAll:true,
    groupedOptions: [],
    disabled:false
  },
  {
    label: "Link To",
    fieldType: "dropdown",
    name: "LinkTo",
    allowClear: true,
    placeholder: "Select Service Request",
    isRequired: false,
    options: [],
    show:true,
    disabled:false
  },
  {
    name: "space",
    fieldType: "separator",
  },
  {
    label: "Upload Files",
    fieldType: "upload",
    name: "FileUploadURLs",
    isRequired: false,
    filelist: [],
    maxCount: Infinity,
    check: [
      ".doc", ".docx", ".odt", ".pdf", ".tex", ".txt", ".xls", ".xlsx",
      ".jpg", ".jpeg", ".png", ".pptx", ".rtf", ".wpd", "._zip"
    ],
    accept: ".doc,.docx,.odt,.pdf,.tex,.txt,.xls,.xlsx,.jpg,.jpeg,.png,.pptx,.rtf,.wpd,._zip",
    info: "Files allowed to Upload are .doc,.docx,.odt,.pdf,.tex,.txt,.rtf,.xls,.xlsx,.wpd,.jpg,.jpeg,.png,.pptx,._zip.",
    disabled:false
  },
  {
    label: "Customer",
    fieldType: "dropdown",
    name: "Customer",
    placeholder: "Select Customer",
    isRequired: false,
    allowClear: true,
    visible: false,
    options: [],
    show:true,
    disabled:false
  },
  {
    label:'Notify :',
    fieldType: 'checkbox',
    name: 'Notify',
    isRequired: false,
    show:false,
    options:[
      {label:'Requester', value:'100'},
      {label:'CC List', value:'101'},
      {label:'Assigned To', value:'102'}
    ]
  },
];
 