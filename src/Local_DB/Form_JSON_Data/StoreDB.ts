import { BaseField } from "../types/types";
export const STORE_DB:BaseField[]=[
    {
        name:'StoreName',
        fieldType:'text',
        label:'Store Name',
        placeholder: 'Enter Store Name',
        isRequired:true

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
        fieldType: 'text',
        placeholder: 'Enter Store Description',
        isRequired: false,
    },
]