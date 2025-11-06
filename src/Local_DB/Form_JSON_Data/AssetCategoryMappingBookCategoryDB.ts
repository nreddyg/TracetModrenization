import { BaseField } from "../types/types";

export const Asset_Category_Book_Category_Mapping_DB: BaseField[] = [
    {
        label: "Select Book",
        fieldType: "dropdown",
        name: "book",
        placeholder: "Select Book",
        isRequired: true,
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
        allowClear: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Select File',
        fieldType: 'upload',
        name: 'assetcattemplate',
        filelist: [],
        check: [".xlsx", ".xls"],
        accept: ".xlsx,.xls",
        info: 'Files allowed to Upload .xls,.xlsx',
        isRequired: true,
    },
    {
        label: "Effective From",
        fieldType: "date",
        name: "effectivefrom",
        placeholder: "",
        isRequired: false,
        format: "DD/MM/YYYY",
        allowClear: false,
        disabled: true
        // defaultValue:new Date(),
    },
    {
        label: "Effective From",
        fieldType: "date",
        name: "effectivefromInModal",
        placeholder: "",
        isRequired: false,
        format: "DD/MM/YYYY",
        allowClear: false,
        // defaultValue:new Date(),
    },
    {
        label: "Select Book",
        fieldType: "dropdown",
        name: "bookinmodal",
        placeholder: "Select Book",
        isRequired: true,
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
        allowClear: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "Select Book",
        fieldType: "dropdown",
        name: "inmodaldrop",
        placeholder: "Select Book",
        isRequired: true,
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
        allowClear: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
];