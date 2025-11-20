import { BaseField } from "../types/types";


export const ADD_ASSET_DB: BaseField[] = [
    {
        label: 'Name',
        fieldType: 'text',
        name: 'AssetName',
        isRequired: true,
        jsontype:'assetdetails'
    },
    {
        label: 'Acquisition Type',
        fieldType: 'dropdown',
        name: 'AcquisitionType',
        defaultValue: "Purchased",
        placeholder: "Select Acquisition Type",
        isRequired: true,
        options: [],
        jsontype:'assetdetails'
    },
    {
        label: 'Working Condition',
        fieldType: "dropdown",
        name: "WorkingStatus",
        defaultValue: "Working",
        options: [],
        placeholder: "Select Condition",
        isRequired: true,
        jsontype:'assetdetails'
    },
    {
        label: 'Quantity',
        fieldType: 'number',
        name: 'Quantity',
        defaultValue: 1,
        isRequired: false,
        jsontype:'assetdetails'
    },
    {
        label: 'Split Quantity',
        fieldType: 'checkbox',
        name: 'SplitQuantity',
        defaultValue: false,
        isRequired: false,
        jsontype:'assetdetails'
    },
    {
        label: 'Dependency Type',
        fieldType: 'dropdown',
        name: 'DependencyType',
        placeholder: "Select Type",
        defaultValue: "Independent",
        options: [],
        isRequired: true,
        jsontype:'assetdetails'
    },

    {
        label: 'Parent Asset',
        fieldType: 'text',
        name: 'ParentAssetCode',
        defaultValue: "",
        isRequired: false,
        jsontype:'assetdetails'
    },
    {
        label: 'Is Asset Taggable',
        fieldType: "dropdown",
        name: "IsAssetTagable",
        defaultValue: "",
        options: [],
        placeholder: "Select",
        isRequired: false,
        jsontype:'assetdetails'
    },
    {
        label: 'Main Category',
        fieldType: 'dropdown',
        name: 'MainCategory',
        defaultValue: "",
        options: [],
        placeholder: "Select Main Category",
        isRequired: true,
        jsontype:'assetdetails'
    },
    {
        label: 'Sub Category',
        fieldType: 'dropdown',
        name: 'SubCategory',
        defaultValue: "",
        options: [],
        placeholder: "Select Sub Category",
        disabled: true,
        isRequired: true,
        jsontype:'assetdetails'
    },

    // {
    //     label: 'Upload Files',
    //     type: 'file',
    //     name: 'logo',
    //     value: "",
    //     error: false,
    //     errormsg: "",
    //     isRequired: false,
    // },
    {
        label: 'Barcode Option',
        fieldType: "dropdown",
        name: "BarcodeOption",
        defaultValue: "Other",
        jsontype:'assetdetails',
        options: [
            {
                label: "Asset code",
                value: "Asset code",
            },
            {
                label: "Customer Asset No",
                value: "Customer Asset No",
            },
            {
                label: "Other",
                value: "Other",
            }
        ],
        placeholder: "Select Barcode Option",
        isRequired: true,
    },
    {
        label: 'Customer Asset No',
        fieldType: 'text',
        name: 'CustomerAssetNo',
        defaultValue: "",
        isRequired: false,
        jsontype:'assetdetails'
    },
    {
        label: 'Barcode No',
        fieldType: 'text',
        name: 'BarcodeNo',
        value: "",
        isRequired: true,
        jsontype:'assetdetails'
    },
    {
        label: "Description",
        fieldType: "textarea",
        numberOfRows: 2,
        numberOfColumns: 19,
        name: "AssetDescription",
        info: "true",
        defaultValue: "",
        isRequired: false,
        jsontype:'assetdetails'
    },
        {
        label: 'Purchase Price Per Unit (₹) ',
        fieldType: 'number',
        name: 'PurchasedPrice',
        defaultValue: 0,
        isRequired: true,
        jsontype:'purchase'
    },
    {
        label: 'Purchase Date',
        fieldType: 'date',
        name: 'PurchasedDate',
        format: 'DD/MM/YYYY',
        placeholder: 'Purchase Date',
        isRequired: true,
        jsontype:'purchase'
    },
    {
        label: 'Capitalization Date',
        fieldType: 'date',
        placeholder: 'Capitalization Date',
        name: 'CapitalizationDate',
        format: 'DD/MM/YYYY',
        isRequired: true,
        jsontype:'purchase'
    },
    {
        label: 'Placed In Service ',
        fieldType: 'date',
        name: 'PlacedInServiceDate',
        format: 'DD/MM/YYYY',
        isRequired: true,
        jsontype:'purchase'
    },
    {
        label: 'Received Date',
        fieldType: 'date',
        name: 'ReceivedDate',
        format: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Warranty Upto',
        fieldType: 'date',
        name: 'WarrantyUpto',
        format: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Bill No',
        fieldType: 'text',
        name: 'BillNo',
        placeholder: 'Enter Bill Number.',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Bill Date',
        fieldType: "date",
        name: "BillDate",
        format: 'DD/MM/YYYY',
        placeholder: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'P.O Number',
        fieldType: 'text',
        name: 'PONumber',
        placeholder: 'Enter P.O Number',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'P.O Date',
        fieldType: "date",
        name: "PODate",
        format: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Seller',
        fieldType: "dropdown",
        name: "Seller",
        placeholder: 'Select Seller',
        options: [],
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: "Manufacturer",
        fieldType: "dropdown",
        name: "Manufacture",
        placeholder: 'Select Manufacturer',
        value: "",
        isRequired: false,
        options: [],
        jsontype:'purchase'
    },
    {
        label: 'Model Number',
        fieldType: 'text',
        name: 'ModelNumber',
        placeholder: 'Enter Model Number',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Date Of Mfg',
        fieldType: "date",
        name: "YearofManufacturer",
        format: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Capacity',
        fieldType: 'text',
        name: 'Capacity',
        placeholder: 'Enter Capacity',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Serial Number',
        fieldType: 'text',
        name: 'SerialNumber',
        placeholder: 'Enter Serial Number',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'GL Account',
        fieldType: 'text',
        name: 'GLAccount',
        placeholder: 'Enter GL Account',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'HSN Code',
        fieldType: 'number',
        name: 'HSNCode',
        placeholder: 'Enter HSNCode',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Lease Vendor Name',
        fieldType: 'text',
        name: 'LeasedVendorName',
        placeholder: 'Enter Leased Vendor Name',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Lease Expiry Date',
        fieldType: 'date',
        name: 'LeaseExpiryDate',
        placeholder: 'DD/MM/YYYY',
        format: 'DD/MM/YYYY',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Party Name',
        fieldType: 'text',
        name: 'PartyName',
        placeholder: 'Enter Party Name',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Proposal Number',
        fieldType: 'number',
        name: 'ProposalNumber',
        placeholder: 'Enter Proposal Number',
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Asset Acquistition Account',
        fieldType: 'text',
        name: 'AssetAcquisitionAccount',
        disabled: true,
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Asset Depreciation Account',
        fieldType: 'text',
        name: 'AssetDepreciationAccount',
        disabled: true,
        isRequired: false,
        jsontype:'purchase'
    },
    {
        label: 'Depreciation Account',
        fieldType: 'text',
        name: 'DepreciationAccount',
        disabled: true,
        isRequired: false,
        jsontype:'purchase'
    },
      {
        label: 'Asset Location',
        fieldType: 'treeselect',
        name: 'AssetLocation',
        options: [],
        disabled: false,
        isRequired: true,
        jsontype:'allocation',
        placeholder:'Select Location'
    },
    {
        label: 'Department',
        fieldType: 'treeselect',
        name: 'Department',
        treeData: [],
        isRequired: true,
        jsontype:'allocation',
        placeholder:'Select Department'
    },
    {
        label: 'Cost Center',
        fieldType: 'treeselect',
        name: 'CostCenter',
        treeData: [],
        isRequired: false,
        jsontype:'allocation',
        placeholder:'Select Cost Center'
    },
    {
        label: 'Assign To',
        fieldType: 'dropdown',
        name: 'EmpId',
        placeholder: 'Select User',
        treeData: [],
        isRequired: false,
        jsontype:'allocation'
    },
    {
        label: 'Asset Owner',
        fieldType: 'dropdown',
        name: 'AssetOwner',
        placeholder: 'Select Asset Owner',
        options: [],
        isRequired: false,
        jsontype:'allocation'
    },
     {
        label: 'Dep. Applicable',
        fieldType: 'checkbox',
        name: 'DepreciationApplicable',
        defaultChecked: true,
        isRequired: false,
        jsontype:'depreciation'
    },
    {
        label: 'Forex Gain/Loss Adjustment',
        fieldType: 'checkbox',
        name: 'ForexApplicable',
        defaultChecked: false,
        isRequired: false,
        jsontype:'depreciation'
    },
    {
        label: 'Salvage Value',
        fieldType: 'number',
        name: 'SalvageValue',
        defaultValue: 0,
        isRequired: false,
        jsontype:'depreciation'
    },
    {
        label: 'Useful Life (Years)',
        fieldType: 'number',
        name: 'AssetUsefulLife',
        defaultValue: 1,
        isRequired: true,
    },
    {
        label: 'Expected Life End Date',
        fieldType: 'date',
        name: 'ExpectedLifeEndDate',
        format: 'DD/MM/YYYY',
        placeholder: 'DD/MM/YYYY',
        isRequired: true,
        jsontype:'depreciation'
    },
        {
        label: '',
        fieldType: 'text',
        name: 'AssetCode',
        placeholder: 'Asset Code',
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'text',
        name: 'BarcodeNo',
        placeholder: 'Barcode No',
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'text',
        name: 'CustomerAssetNo',
        placeholder: 'Customer Asset No',
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'multiselect',
        name: 'AssetLocation',
        placeholder: 'Asset Location',
        defaultValue: [],
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'multiselect',
        name: 'Department',
        placeholder: "Department",
        defaultValue: [],
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'multiselect',
        name: 'CostCenter',
        placeholder: 'Cost Center',
        defaultValue: [],
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'dropdown',
        name: 'MainCategory',
        options: [],
        placeholder: "Main Category",
        isRequired: false,
    },
    {
        label: '',
        fieldType: 'dropdown',
        name: 'SubCategory',
        options: [],
        placeholder: "Sub Category",
        isRequired: false,
    },
]





export const costBreakupDB = [
    {
        name: "Value",
        type: "text",
        label: "",
        value: "",
        isRequired: false,
        placeholder: "",
        error: false,
        errormsg: ''
    },
    {
        "name": "VendorName",
        "label": "",
        "type": "dropdown",
        "value": "",
        "isRequired": false,
        "options": [],
        "default": "Select Vendor",
        error: false,
        errormsg: '',
        "allowClear": true,
    },

    {
        label: "",
        type: "date",
        name: "DateValue",
        value: null,
        default: "",
        format: "DD/MM/YYYY",
        isRequired: false,
        error: false,
        errormsg: '',
        placeholder: "DD/MM/YYYY",
    },
]