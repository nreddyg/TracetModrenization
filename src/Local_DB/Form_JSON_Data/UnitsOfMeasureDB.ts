import { BaseField } from "../types/types";
export const UNITS_OF_MEASURE_DB:BaseField[]=[
    {
        name:'Name',
        fieldType:'text',
        label:'Name',
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
        name: 'Description',
        label: 'Description',
        fieldType: 'textarea',
        placeholder: 'EnterDescription',
        isRequired: false,
    },
]