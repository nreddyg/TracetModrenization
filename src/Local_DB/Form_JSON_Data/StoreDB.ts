import { BaseField } from "../types/types";
export const STORE_DB:BaseField[]=[
    {
        name:'StoreName',
        fieldType:'text',
        label:'Store Name',
        // defaultChecked:false,
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
        name: 'StoreDescription',
        label: ' Store Description',
        fieldType: 'textarea',
        placeholder: 'Enter Store Description',
        isRequired: false,
    },
]