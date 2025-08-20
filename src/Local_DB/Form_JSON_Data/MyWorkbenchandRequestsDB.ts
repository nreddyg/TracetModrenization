import { BaseField } from "../types/types";

export const workbench_Filter_DB: BaseField[] = [


    {
        label: 'Ticket Category',
        fieldType: "dropdown",
        name: "TicketCategory",
        placeholder: "Select fieldType",
        isRequired: true,
        options: [
            {
                label:"SLA Violated",
                value:"100"
            },
             {
                label:"Open",
                value:"101"
            },
             {
                label:"Tickets In My Groups",
                value:"102"
            },
             {
                label:"Closed",
                value:"103"
            },
            
        ],
        defaultValue:"101",
        disabled: false,
        className: " min-h-[20px] rounded-md",
        containerClassName: "w-full h-9 rounded-md"
    },

    {
        label: 'Date Range',
        fieldType: "rangepicker",
        name:"CreatedDate",    
        allowClear: true,
        disabled: false
    }
]

export const MyRequest_Filter_DB: BaseField[] = [


    {
        label: 'Ticket Category',
        fieldType: "dropdown",
        name: "TicketCategory",
        placeholder: "Select fieldType",
        isRequired: true,
        options: [
            
             {
                label:"Open",
                value:"104"
            },
             
             {
                label:"Closed",
                value:"105"
            },
            
        ],
        defaultValue:"104",
        disabled: false,
        className: " min-h-[20px] rounded-md",
        containerClassName: "w-full h-9 rounded-md"
    },

    {
        label: 'Date Range',
        fieldType: "rangepicker",
        name:"CreatedDate",    
        allowClear: true,
        disabled: false
    }
]
