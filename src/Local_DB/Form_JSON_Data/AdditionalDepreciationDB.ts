import { BaseField } from "../types/types";

export const Additional_Depreciation_DB: BaseField[] = [
    {
    name: 'Name',
    label: 'Name',
    fieldType: 'text',
    placeholder: 'Enter Name',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
       {
    name: 'Description',
    label: 'Description',
    fieldType: 'text',
    placeholder: 'Enter Version',
    isRequired: false,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false,
      maxLength:500
  },
       {

    label: 'Applicable For',
    fieldType: "dropdown",
    name: 'ApplicableFor',
    placeholder: "",
    isRequired: true,
    options:[{
      label: 'First Year Acquisition',
      value: 'First Year Acquisition'
    }, {
      label: 'All Financial Years',
      value: 'All Financial Years'
    }
    ],
    allowClear: true,
    disabled:false,

  },
     {
    label: "Condition",
    fieldType: "dropdown",
    name: "Condition",
    placeholder: "Select",
    isRequired: true,
    options:[{
      label: 'Full rate for more than or equal to 180 days and Half rate for less than 180 days',
      value: 'Full rate for more than or equal to 180 days and Half rate for less than 180 days'
    }, {
      label: 'Full rate for all the days',
      value: 'Full rate for all the days'
    },],
    allowClear: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
  {
    label: "Rate of Additional Depreciation",
    fieldType: "numeric",
    name: "AdditionalDepreciationRate",
    placeholder: "Enter Rate of Additional Depreciation",
    isRequired: true,
    disabled:false,
      // className: " min-h-[40px]",
      // containerClassName: "w-full h-10 rounded-md"
  },
       {
    name: 'UptoDateRange',
    label: 'Date Range upto Financial year',
    fieldType:'text',
    placeholder: 'Enter Number of Licenses',
    isRequired: true,
    // className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },

]
