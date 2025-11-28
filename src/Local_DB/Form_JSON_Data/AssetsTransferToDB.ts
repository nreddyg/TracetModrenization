import { BaseField } from "../types/types";

export const ASSET_TRANSFER_TO_DB: BaseField[] = [
    {
        fieldType: "dropdown",
        name: "levelfivecompany",
        label: "",
        placeholder: "",
        isRequired: true,
        options: [],
        allowClear: true,
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivedepartment',
        label: '',
        placeholder: '',
        treeData: [],
        isRequired: false,
        allowClear: true,
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivecostcenter',
        label: '',
        placeholder: '',
        treeData: [],
        isRequired: false,
        allowClear: true,
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivelocation',
        label: '',
        placeholder: '',
        treeData: [],
        isRequired: true,
        allowClear: true,
        disabled: false,
        errormsg: true,
    },
    {
        label: "Transfer Date",
        fieldType: "date",
        name: "transferdate",
        placeholder: "Select Date",
        isRequired: true,
        format: "DD-MM-YYYY",
    },
    {
        label: "Place Of Supply",
        fieldType: "text",
        name: "placeofsupply",
        placeholder: "",
        isRequired: false,
        disabled:true
    },
    {
        label: "Remarks",
        fieldType: "text",
        name: "remarks",
        placeholder: "",
        isRequired: false,
    },
    {
        label: "Invoice No.",
        fieldType: "text",
        name: "invoiceno",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
     {
        label: "Invoice Date",
        fieldType: "date",
        name: "invoicedate",
        placeholder: "Select Date",
        isRequired: false,
        format: "DD-MM-YYYY",
    },
     {
        label: "Delivery Challan Date",
        fieldType: "date",
        name: "deliverychalldate",
        placeholder: "Select Date",
        isRequired: true,
        format: "DD-MM-YYYY",
    },
    {
        label: "Remarks",
        fieldType: "text",
        name: "remarksindialog",
        placeholder: "",
        isRequired: false,
    },
    {
        label: "Mode Of Transport",
        fieldType: "text",
        name: "modeoftransport",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
    {
        label: "Transport Namwe",
        fieldType: "text",
        name: "transportname",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
    {
        label: "Vehicle Reg No.",
        fieldType: "text",
        name: "registrationno",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
    {
        label: "LR No",
        fieldType: "text",
        name: "license",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
    {
        label: "Driver Name",
        fieldType: "text",
        name: "drivername",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
    {
        label: "Contact number",
        fieldType: "text",
        name: "contacts",
        placeholder: "",
        isRequired: false,
        disabled:false
    },
]