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
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivedepartment',
        label: 'Level Five Department',
        placeholder: 'Select Department',
        treeData: [],
        isRequired: false,
        allowClear: true,
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivecostcenter',
        label: 'Level Five Cost Center',
        placeholder: 'Select Location',
        treeData: [],
        isRequired: false,
        allowClear: true,
    },
    {
        fieldType: 'treeselect',
        name: 'levelfivelocation',
        label: 'Level Five Location',
        placeholder: 'Select Location',
        treeData: [],
        isRequired: false,
        allowClear: true,
        // disabled: false,
        // errormsg: false,
    },
    {
        label: "Transfer Date",
        fieldType: "date",
        name: "transferdate",
        placeholder: "Select Date",
        isRequired: false,
        format: "DD-MM-YYYY",
    },
    {
        label: "Place Of Supply",
        fieldType: "dropdown",
        name: "placeofsupply",
        placeholder: "",
        isRequired: false,
    },
    {
        label: "Remarks",
        fieldType: "text",
        name: "remarks",
        placeholder: "",
        isRequired: false,
    }
]