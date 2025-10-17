import { BaseField } from "../types/types";
 
type FormConfig = {
    [key: number]: BaseField[];
};

export const SERVICE_LOCATION_DB: BaseField[] = [
    {
        name: 'LocationName',
        label: 'Location Name',
        fieldType: 'text',
        placeholder: 'Enter Location Name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },

    {
        label: "",
        fieldType: "dropdown",
        name: "SelectMainLocation",
        placeholder: "Select Main Location",
        isRequired: false,
        options: [
            // { value: 'Active', label: 'Active' },
            // { value: 'InActive', label: 'InActive' },
        ],
        defaultValue: "",
        allowClear: true,
    },
];

// export const MAIN_LOCATION_DROPDOWN:BaseField[] = [
//     {
//         label: "",
//         fieldType: "dropdown",
//         name: "SelectMainLocation",
//         placeholder: "Select Main Location",
//         isRequired: false,
//         options: [
//             // { value: 'Active', label: 'Active' },
//             // { value: 'InActive', label: 'InActive' },
//         ],
//         defaultValue: "",
//         allowClear: true,
//     },

// ]
