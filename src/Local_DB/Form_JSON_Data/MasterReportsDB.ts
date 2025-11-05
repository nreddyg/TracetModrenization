import { BaseField } from "../types/types";

export const MASTER_REPORTS_DB: BaseField[] = [
    {
        name: 'RangePicker',
        label: 'Select Date Range',
        fieldType: 'rangepicker',
        isRequired: false,
        jsontype:'common',
        allowClear:true,
        defaultValue:{from:'',to:''}
    },
    {
        name: 'CompanyHierarchy',
        label: 'Company Hierarchy',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Company Hierarchy',
        defaultValue:[],
        placeholder:'Select Company Hierarchy'
    },
    {
        name: 'Department',
        label: 'Department',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Department',
        defaultValue:[],
        placeholder:'Select Departments'
    },
    {
        name: 'AssetLocation',
        label: 'Asset Location',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Asset Location',
        defaultValue:[],
        placeholder:'Select Asset Locations'
    },
    {
        name: 'CostCenter',
        label: 'Cost Center',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Cost Center',
        defaultValue:[],
        placeholder:'Select Cost Centers'
    },
    {
        name: 'AssetCategory',
        label: 'Asset Category',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Asset Category',
        defaultValue:[],
        selectAll:true,
        placeholder:'Select Asset Category'
    },
    {
        name: 'User',
        label: 'User',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'User',
        defaultValue:[],
        placeholder:'Select Users'
    },
    {
        name: 'VendorType',
        label: 'Vendor Type',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Vendor',
        defaultValue:[],
        placeholder:'Select Vendor Types'
    },
    {
        name: 'VendorName',
        label: 'Vendor Name',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Vendor',
        defaultValue:[],
        placeholder:'Select Vendors'
    },
    {
        name: 'Customer',
        label: 'Customer',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Customer',
        defaultValue:[],
        placeholder:'Select Customers'
    },
    {
        name: 'ServiceLocations',
        label: 'Service Locations',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Service Locations',
        defaultValue:[],
        selectAll:true,
        placeholder:'Select Service Locations'
    },
    {
        name: 'CustomerLocations',
        label: 'Customer Locations',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Customer Locations',
        defaultValue:[],
        selectAll:true,
        placeholder:'Select Customer Locations'
    },
]