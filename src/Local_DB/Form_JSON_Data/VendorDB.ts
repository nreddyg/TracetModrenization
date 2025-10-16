import { BaseField } from "../types/types";

export const VENDOR_DETAILS: BaseField[] = [
       {
        "fieldType": "heading",
        "text": "Vendor Details"

    },
      {
        label: 'Vendor Type',
        fieldType: 'multiselect',
        name: 'VendorType',
        defaultValue: "Private Limited",
         "options": [
            {
                label: "Manufacturer",
                value: "Manufacturer",
            },
            {
                label: "Insurance",
                value: "Insurance",
            },

            {
                label: "Seller",
                value: "Seller",
            },

            {
                label: "Maintenance",
                value: "Maintenance",
            },

            {
                label: "Other",
                value: "Other",
            },

            {
                label: "Service Maintenance",
                value: "Service Maintenance",
            },
        ],
        placeholder: "Select Vendor Type",
        isRequired: true,
    },
    {
        label: 'Vendor Name',
        name: 'VendorName',
        fieldType: 'text',
        placeholder: 'Enter Vendor Name',
        isRequired: true,
    },
    {
        label: 'Vendor Code',
        name: 'VendorCode',
        fieldType: 'text',
        placeholder: '',
        maxLength: 50,
        isRequired: false,
    },
  
    {
        label: 'Registration / PAN',
        fieldType: 'text',
        name: 'PAN',
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
        label: 'Description',
        fieldType: 'textarea',
        name: 'Description',
        isRequired: false,
    },
// Contact person
   {
        fieldType: "heading",
        "text": "Contact Person Details"
    },
    {
        label: 'Name',
        fieldType: 'text',
        name: 'ContactPerson',
        isRequired: false,
    },
     {
        label: 'Phone No',
        fieldType: 'text',
        name: 'PhoneNo',
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
        name: 'Address',
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
        label: 'Country',
        fieldType: "dropdown",
        name: "Country",
        defaultValue: "INDIA",
        options: [
            {
                label: "India",
                value: "india",
            },
            {
                label: "Japan",
                value: "japan",
            },
            {
                label: "England",
                value: "england",
            }
        ],
        placeholder: "Select Country",
        isRequired: false,
    },
 ,
    {
        label: 'Zip Code',
        fieldType: 'number',
        name: 'ZipCode',
        isRequired: false,
    },
]
