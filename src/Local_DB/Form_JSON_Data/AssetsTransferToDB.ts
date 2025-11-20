import { BaseField } from "../types/types";

export const ASSET_TRANSFER_TO_DB: BaseField[] = [
    {
        label: "level five company",
        fieldType: "dropdown",
        name: "levelfivecompany",
        placeholder: "level five company",
        isRequired: true,
        options: [],
        allowClear: true,
        disabled: false,
    },
     {
        fieldType: 'treeselect',
        name: 'levelfivedepartment',
        label: 'Level Five Department',
        placeholder: 'Select Department',
        treeData: [],
        isRequired: false,
        allowClear: true,
        disabled: false,
        errormsg: false,
    },
     {
        fieldType: 'treeselect',
        name: 'levelfivecostcenter',
        label: 'Level Five Cost Center',
        placeholder: 'Select Location',
        treeData: [],
        isRequired: false,
        allowClear: true,
        disabled: false,
        errormsg: false,
    },
     {
        fieldType: 'treeselect',
        name: 'levelfivelocation',
        label: 'Level Five Location',
        placeholder: 'Select Location',
        treeData: [],
        isRequired: false,
        allowClear: true,
        disabled: false,
        errormsg: false,
    },
       {
        label: "Transfer Date",
        fieldType: "date",
        name: "transferdate",
        placeholder: "Select Date",
        isRequired: false,
        format: "DD-MM-YYYY",
        disabled: true,
        jsontype: 'servicerequestDetails'
    }
]