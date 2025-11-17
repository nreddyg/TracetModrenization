import { BaseField } from "../types/types";
export const UNITS_OF_MEASURE_DB:BaseField[]=[
    {
        name:'Name',
        fieldType:'text',
        label:'Name',
        placeholder: 'Enter Name',
        isRequired:true
    },
    //  {
    //     label: "Branch",
    //     fieldType: "dropdown",
    //     name: "Branch",
    //     placeholder: "Select Branch",
    //     isRequired: false,
    //     options: [],
    //     // selectAll:true,
    // },
    {
        name: 'Description',
        label: 'Description',
        fieldType: 'text',
        placeholder: 'EnterDescription',
        isRequired: false,
    },
]
export const MANAGE_UNITS_OF_MEASURE_DB:BaseField[]=[
    {
        name:'base',
        fieldType:'text',
        label:'Base Value',
        isRequired:true,
        defaultValue:"1",
        disabled:true
        // defaultChecked:false,
    },
     {
        label: 'UOM',
        fieldType: 'dropdown',
        name: 'baseUOM',
        placeholder: 'Select UOM',
        isRequired: false,
        options: [],
        allowClear: true,
        defaultValue:'',
    },
    {
        
        fieldType: 'equals',
        name:"equals"
        
    },

     {
        name:'target',
        fieldType:'text',
        label:'Target Value',
        isRequired:true

        // defaultChecked:false,
    },
     {
        label: 'UOM',
        fieldType: 'dropdown',
        name: 'targetUOM',
        placeholder: 'Select UOM',
        isRequired: false,
        options: [],
        allowClear: true,
        defaultValue:'',
    },
    
]