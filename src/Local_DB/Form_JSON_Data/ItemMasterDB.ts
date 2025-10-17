import { BaseField } from "../types/types";
export const ITEM_MASTER_DB:BaseField[]=[
    {
        name:'ItemName',
        fieldType:'text',
        label:'Item Name',
        // defaultChecked:false,
    },
    {
        name:'ItemCode',
        fieldType:'text',
        label:'Item Code',
        // defaultChecked:false,
    },
     {
        label: "Main Category",
        fieldType: "dropdown",
        name: "MainCategory",
        placeholder: "Select Branch",
        isRequired: false,
        options: [],
        // selectAll:true,
    },
    {
        label: "Sub Category",
        fieldType: "dropdown",
        name: "SubCategory",
        placeholder: "Select Branch",
        isRequired: false,
        options: [],
        // selectAll:true,
    },
    {
        label: "Unit of Measure",
        fieldType: "dropdown",
        name: "UnitofMeasure",
        placeholder: "Select Branch",
        isRequired: false,
        options: [],
        // selectAll:true,
    },
  
    {
        name:'UnitPrice',
        fieldType:'text',
        label:'Unit Price',
        // defaultChecked:false,
    },
    
    {
        name:'ReorderLevel',
        fieldType:'text',
        label:'Reorder Level',
        // defaultChecked:false,
    },
    {
        name: 'ItemDescription',
        label: 'Description',
        fieldType: 'textarea',
        placeholder: 'Enter Store Description',
        isRequired: false,
    },
]