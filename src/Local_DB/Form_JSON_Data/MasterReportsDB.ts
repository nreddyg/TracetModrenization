import { BaseField } from "../types/types";

export const MASTER_REPORTS_DB: BaseField[] = [
    {
        name: 'RangePicker',
        label: 'Select Date Range',
        fieldType: 'rangepicker',
        isRequired: false,
        jsontype:'common'
    },
    {
        name: 'CompanyHierarchy',
        label: 'Company Hierarchy',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Company Hierarchy'
    },
    {
        name: 'Department',
        label: 'Department',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Department'
    },
    {
        name: 'AssetLocation',
        label: 'Asset Location',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Asset Location'
    },
    {
        name: 'CostCenter',
        label: 'Cost Center',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Cost Center'
    },
    {
        name: 'AssetCategory',
        label: 'Asset Category',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Asset Category'
    },
    {
        name: 'User',
        label: 'User',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'User'
    },
    {
        name: 'VendorType',
        label: 'VendorType',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Vendor'
    },
    {
        name: 'VendorName',
        label: 'Vendor Name',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Vendor'
    },
    {
        name: 'Customer',
        label: 'Customer',
        fieldType: 'multiselect',
        isRequired: false,
        jsontype:'Customer'
    },
    {
        name: 'ServiceLocations',
        label: 'Service Locations',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Service Locations'
    },
    {
        name: 'CustomerLocations',
        label: 'Customer Locations',
        fieldType: 'treeselect',
        treeData: [],
        isRequired: false,
        jsontype:'Customer Locations'
    },
]