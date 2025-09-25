import { BaseField } from "../types/types";

export const REGISTRY_DB: BaseField[] = [
    {
    name: 'Software Name',
    label: 'Software Name',
    fieldType: 'text',
    placeholder: 'Enter Software Name',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
       {
    name: 'Version',
    label: 'Version',
    fieldType: 'text',
    placeholder: 'Enter Version',
    isRequired: false,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
       {
    name: 'Vendor',
    label: 'Vendor/Publisher',
    fieldType: 'text',
    placeholder: 'Enter Vendor/Publisher',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
     {
    label: "Category",
    fieldType: "dropdown",
    name: "Category",
    placeholder: "Select Category",
    isRequired: true,
    options: [],
    allowClear: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
  {
    label: "License Type",
    fieldType: "dropdown",
    name: "License Type",
    placeholder: "Select License Type",
    isRequired: true,
    options: [],
    allowClear: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
       {
    name: 'Number of Licenses',
    label: 'Number of Licenses',
    fieldType: 'text',
    placeholder: 'Enter Number of Licenses',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },

]