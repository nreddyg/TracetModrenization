import { BaseField } from "../types/types";
import { modules } from "./CreateTicketDB";

export const CONFIGURATION_DB:BaseField[]=[
    {
        name:'CustomerCheckbox',
        fieldType:'checkbox',
        label:'Display Customer Field in Create Service Request',
        defaultChecked:true,
    },
    {
        name:'AssetFieldCheckbox',
        fieldType:'checkbox',
        label:'Display Asset Field in Create Service Request',
        defaultChecked:true,
    },
    {
        name:'NotifyUsersCheckbox',
        fieldType:'checkbox',
        label:'Notify below Users On Service Request Edit',
        defaultChecked:true, 
    },
    {
        label: "",
        fieldType: "multiselect",
        name: "Notify",
        placeholder: "Select User",
        isRequired: false,
        options:[
            {label:'Requester', value:'100'},
            {label:'CC List', value:'101'},
            {label:'Assigned To', value:'102'},
        ],
        defaultValue:['102','100'],
        selectAll:true,
        show:false,
        dependsOn:'NotifyUsersCheckbox'
    },
    {
        name:'AllowWOCreationCheckbox',
        fieldType:'checkbox',
        label:'Allow Work Order Creation',
        defaultChecked:true,
    },
    {
        name:'PauseSLACheckbox',
        fieldType:'checkbox',
        label:'Pause SLA calculation',
        defaultChecked:false,
    },
    {
        label: "Service Request Status List",
        fieldType: "multiselect",
        name: "ServiceRequestStatusList",
        placeholder: "Select Service Request Status",
        isRequired: false,
        options: [{ label: 'Open', value: 'open' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Closed', value: 'closed' }],
        defaultValue:[],
        selectAll:true,
        show:false,
        dependsOn:'PauseSLACheckbox'
    },
    {
        name:'ServiceRequestType',
        label:'Service Request Type',
        fieldType:'text',
        isRequired:true,
        placeholder:'Enter Service Request Type',
    },
    {
        label: "User Group",
        fieldType: "multiselect",
        name: "UserGroup",
        placeholder: "Select User Group",
        isRequired: false,
        options: [],
        selectAll:true,
    },
    {
        label: "Vendor",
        fieldType: "multiselect",
        name: "Vendor",
        placeholder: "Select Vendor",
        isRequired: false,
        options: [],
        selectAll:true,
    },
    {
        name:'SLAHoursMinutes',
        label:'SLA Hours/Minutes',
        fieldType:'text',
        isRequired:false,
        placeholder:'HH:MM'
    },
    {
        name:'ReminderForSLA',
        label:'Reminder For SLA',
        fieldType:'text',
        isRequired:false,
        placeholder:'HH:MM'
    },
    {
        label: "Escalation To",
        fieldType: "multiselect",
        name: "EscalationTo",
        placeholder: "Select Escalation To",
        isRequired: false,
        options: [],
        selectAll:true,
    },
    {
        label: "Set Status To Calculate SLA",
        fieldType: "dropdown",
        name: "SetStatusToCalculateSLA",
        placeholder: "Select Status",
        isRequired: false,
        options: [],
        selectAll:true,
    },
    {
        label: "Service Request Type Admin",
        fieldType: "multiselect",
        name: "ServiceRequestTypeAdmin",
        placeholder: "Select Service Request Type Admin",
        isRequired: false,
        options: [],
        defaultValue:[],
        value: [],
        selectAll:true,
        groupSelectAll:true,
        groupedOptions: [],
    },
    {
        name: 'Description',
        label: 'Description',
        fieldType: 'textarea',
        placeholder: 'Enter Description',
        isRequired: false,
    },
    {
        name: 'Status',
        label: 'Status Type',
        fieldType: 'text',
        placeholder: 'Enter Status Type',
        isRequired: true,
    }

]