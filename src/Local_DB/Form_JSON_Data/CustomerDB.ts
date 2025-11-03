import { BaseField } from "../types/types";

export const CUSTOMER_DETAILS: BaseField[] = [
       {
        "fieldType": "heading",
        "text": "Customer Details"

    },
   
    {
        label: 'Customer Name',
        name: 'CustomerName',
        fieldType: 'text',
        isRequired: true,
    },
  
    {
        label: 'Registration / PAN',
        fieldType: 'text',
        name: 'PAN',
        isRequired: false,
    },
     {
        label: 'Country',
        fieldType: "dropdown",
        name: "Country",
        defaultValue: "INDIA",
        options: [ ],
        placeholder: "Select Country",
        isRequired: false,
    },
      {
        label: 'GSTIN/UAN',
        fieldType: 'text',
        name: 'GSTIN',
        isRequired: false,
    },
    {
        label: 'Email Id',
        fieldType: 'text',
        name: 'EmailId',
        isRequired: false,
    },
       {
        label: 'Phone No',
        fieldType: 'text',
        name: 'PhoneNo',
        isRequired: false,
    },
   
       {
        label: 'Contact Person',
        fieldType: 'text',
        name: 'ContactPerson',
        isRequired: false,
    },

 
  
    //Address Details
     {
        fieldType: "heading",
        "text": "Address Details"
    },
    {
        label: 'Address',
        fieldType: 'text',
        name: 'AddOnAddress',
        isRequired: false,
    },
      
     {
        label: 'Main Location',
        fieldType: 'text',
        name: 'MainLocation',
        options:[],
        isRequired: true,
    },
     {
        label: 'Sub Location',
        fieldType: 'text',
        name: 'SubLocation',
        options:[],
        isRequired: true,
        disabled:true
    },
    {
        label: 'Branch',
        fieldType: "multiselect",
        name: "BranchName",
        defaultValue:[],
        options: [],
        placeholder: "Select Country",
        isRequired: false,
    },

    {
        label: 'City',
        fieldType: 'text',
        name: 'City',
        isRequired: false,
    },
    {
        label: 'State',
        fieldType: 'text',
        name: 'State',
        isRequired: false,
    },
   
 
    {
        label: 'Zip Code',
        fieldType: 'text',
        name: 'ZipCode',
        isRequired: false,
    },
     {
        label: 'Description',
        fieldType: 'textarea',
        name: 'Description',
        isRequired: false,
    },
]
