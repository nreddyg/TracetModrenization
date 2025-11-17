// import { BaseField } from "../types/types";

// export const Asset_Main_Category_DB: BaseField[] = [
//     {
//         label: 'Name',
//         fieldType: 'text',
//         name: 'name',
//         isRequired: true,
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
//     {
//         label: 'Code',
//         fieldType: 'text',
//         name: 'code',
//         isRequired: true,
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
//     {
//         label: 'AssetAcquisitionAccount',
//         fieldType: 'text',
//         name: 'assetacquisitionaccount',
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
//     {
//         label: 'AssetDepreciationAccount',
//         fieldType: 'text',
//         name: 'assetdepreciationaccount',
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
//     {
//         label: 'Depreciation Account',
//         fieldType: 'text',
//         name: 'depreciationaccount',
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
//     {
//         label: 'Description',
//         fieldType: 'text',
//         name: 'description',
//         placeholder: '',
//         className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
//     },
// ];

import { BaseField } from "../types/types";

export const Asset_Main_Category_DB: BaseField[] = [
    {
        label: 'Name',
        fieldType: 'text',
        name: 'name',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Code',
        fieldType: 'text',
        name: 'code',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'AssetAcquisitionAccount',
        fieldType: 'text',
        name: 'assetacquisitionaccount',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'AssetDepreciationAccount',
        fieldType: 'text',
        name: 'assetdepreciationaccount',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Depreciation Account',
        fieldType: 'text',
        name: 'depreciationaccount',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Description',
        fieldType: 'text',
        name: 'description',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: '',
        fieldType: 'dropdown',
        name: 'mainCatdropdown',
        placeholder: "Select Main Category",
        isRequired: false,
        options: [],
        selectAll: true
    },
    {
        label: 'Name',
        fieldType: 'text',
        name: 'subname',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Code',
        fieldType: 'text',
        name: 'subcode',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "Attribute Group",
        fieldType: "multiselect",
        name: "attributegroup",
        placeholder: "Select Attribute Group",
        isRequired: false,
        visible: false,
        options: [
            {
                label: "112",
                value: "sachin"
            },
            {
                label: "113",
                value: "rashmi"
            },
            {
                label: "114",
                value: "udutha"
            }
        ],
        defaultValue: [],
        // selectAll: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "Cost BreakUp Group",
        fieldType: "dropdown",
        name: "costbreakgroup",
        placeholder: "Select Cost BreakUp Group",
        isRequired: false,
        visible: false,
        options: [
            {
                label: "112",
                value: "sachin"
            },
            {
                label: "113",
                value: "rashmi"
            },
            {
                label: "114",
                value: "udutha"
            }
        ],
        // defaultValue: [],
        // selectAll: true,
        show: true,
        allowClear: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Life Span',
        fieldType: 'numeric',
        name: 'lifespan',
        defaultValue: '0.00',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Salvage Value',
        fieldType: 'text',
        name: 'salvagevalue',
        defaultValue: "0.00",
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "",
        fieldType: "dropdown",
        name: "salvagevalue_unit",
        placeholder: "",
        isRequired: false,
        visible: false,
        options: [
            {
                label: "%",
                value: "%"
            },
            {
                label: "@",
                value: "@"
            },
        ],
        defaultValue: "%",
        // selectAll: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Description',
        fieldType: 'text',
        name: 'subdescription',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
];