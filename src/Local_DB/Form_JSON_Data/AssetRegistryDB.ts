import { BaseField } from "../types/types";

export const REGISTRY_DB: BaseField[] = [
    {
    name: 'SoftwareName',
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

    label: 'Vendor/Publisher',
    fieldType: "dropdown",
    name: 'VendorId',
    placeholder: "Select Category",
    isRequired: true,
    options: [],
    allowClear: true,
    disabled:false,

    // fieldType: 'text',
    // placeholder: 'Enter Vendor/Publisher',
    // isRequired: true,
    // // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    // disabled:false
  },
     {
    label: "Category",
    fieldType: "dropdown",
    name: "CategoryId",
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
    name: "LicenseType",
    placeholder: "Select License Type",
    isRequired: true,
    options: [],
    allowClear: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
       {
    name: 'NumberOfLicenses',
    label: 'Number of Licenses',
    fieldType: 'text',
    placeholder: 'Enter Number of Licenses',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },

]
export const cellsData: BaseField[] =[
     {
    name: 'SoftwareName',
    label: 'Software Name',
    fieldType: 'text',
    placeholder: 'Enter Software Name',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
  {
   
    fieldType: "dropdown",
    name: "New",
    placeholder: "Select License Type",
    isRequired: true,
    options: [],
    allowClear: true,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
     
 

]