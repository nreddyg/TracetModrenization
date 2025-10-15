import { BaseField } from "../types/types";

export const ORGANIZATION_DETAILS: BaseField[] = [
    {
        label: 'Organization Name',
        name: 'OrganizationName',
        fieldType: 'text',
        placeholder: 'Enter Organization Name',
        isRequired: true,
    },
    {
        label: 'Organization Code',
        name: 'OrganizationKnownAs',
        fieldType: 'text',
        placeholder: 'Enter Organization Known As',
        maxLength: 20,
        isRequired: true,
    },
    {
        label: 'Organization Type',
        fieldType: 'dropdown',
        name: 'OrganizationType',
        defaultValue: "Private Limited",
        options: [

            {
                label: "Private Limited",
                value: "Private Limited",
            },
            {
                label: "Public Limited",
                value: "Public Limited",
            },
            {
                label: "Partnership",
                value: "Partnership",
            },
            {
                label: "Educational Institute",
                value: "Educational Institute",
            },

        ],
        placeholder: "Select Organization Type",
        isRequired: true,
    },
    {
        label: 'Registration / PAN',
        fieldType: 'text',
        name: 'PanNumber',
        isRequired: false,
    },
    {
        label: 'Email Id',
        fieldType: 'text',
        name: 'OrganizationEmail',
        isRequired: true,
    },
    {
        label: 'Phone No',
        fieldType: 'text',
        name: 'OrganizationPhone',
        isRequired: true,
    },
    {
        label: 'Organization Domain',
        fieldType: 'text',
        name: 'OrganizationDomain',
        isRequired: false,
    },

    {
        label: 'Website',
        fieldType: 'text',
        name: 'Website',
        isRequired: false,
    },
    {
        label: 'Country',
        fieldType: "dropdown",
        name: "CountryName",
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
        isRequired: true,
    },
    {
        label: 'Currency',
        fieldType: 'text',
        name: 'Currency',
        isRequired: false,
        disabled: true
    },
    {
        label: 'Currency Symbol',
        fieldType: 'text',
        name: 'CurrencySymbol',
        isRequired: false,
        disabled: true
    },
     {
        label: 'Organization Logo',
        fieldType: 'upload',
        name: 'OrganizationLogo',
        filelist: [],
        check: [".png", ".jpg", ".jpeg"],
        accept:".png,.jpg,.jpeg",
        info: 'Files allowed to Upload are .png, .jpg, .jpeg',
        isRequired: false,
    },
    {
        fieldType: "heading",
        "text": "Address Details"
    },
    {
        label: 'Address Line 1',
        fieldType: 'text',
        name: 'AddressLine1',
        isRequired: true,
    },
    {
        label: 'Address Line 2',
        fieldType: 'text',
        name: 'AddressLine2',
        isRequired: false,
    },
    {
        label: 'City',
        fieldType: 'text',
        name: 'City',
        isRequired: true,
    },
    {
        label: 'State',
        fieldType: 'text',
        name: 'State',
        isRequired: true,
    },

    {
        label: 'Zip Code',
        fieldType: 'number',
        name: 'ZipCode',
        isRequired: true,
    },
]
