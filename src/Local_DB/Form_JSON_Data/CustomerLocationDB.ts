import { BaseField } from "../types/types";

export const Customer_Location_DB: BaseField[] = [
    {
        label: 'Main Location',
        fieldType: 'text',
        name: 'LocationName',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
 {
       fieldType: "dropdown",
        "name": "mainLocationDropdown",
        // "label": "Select Main Location",
        "value": "",
        "allowClear":true,
        "options": [ ]
    },
      {
        label: "Sub Location",
        name: 'LocationNameSub',
        fieldType: "text",
        value: "",
       isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
      
    },
      
    {   label: 'Address',
        fieldType: 'text',
        name: 'Address',
        isRequired: false,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
      

    {
        label:"City",
        fieldType: 'text',
        name: 'City',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
       
     
    {
        label: 'State',
        fieldType: 'text',
        name: 'State',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
        {
        label: "Country",
        fieldType: "text",
        value: "",
        name: "Country",
         placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
       
    },
    {
        label: "Mobile No",
        fieldType: "text",
        value: "",
        name: "MobileNo",
         placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
      
    },
    {
        label: "ZipCode",
        fieldType: "text",
        value: "",
        name: "ZipCode",
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "TIN/GSTIN/UIN",
        fieldType: "text",
        value: "",
        name: "TIN_GSTIN_UIN",
       placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
  
];

 