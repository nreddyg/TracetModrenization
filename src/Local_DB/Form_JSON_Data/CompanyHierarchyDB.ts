import { BaseField } from "../types/types";

type FormConfig = {
  [key: number | string]: BaseField[];

};

export const COMPANY_DB: FormConfig =  {
    99: [
        {
            heading: 'Company Details',
            label: 'Company Name',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            isRequired: false,
            disabled: true
        },
        {
            label: 'Company Code',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: false,
            disabled: true
        }
    ],
    100: [
        {
            // heading: "",
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            
            isRequired: true,
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        }
    ],
    101: [
        {
            // heading: "",
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        }
    ],
    102: [{
        // heading: "",
        label: '',
        fieldType: 'text',
        name: 'Name',
        value: "",
        placeholder: "",
        // error: false,
        // errormsg: "",
        isRequired: true,
    },
    {
        label: '',
        fieldType: 'text',
        name: 'Code',
        placeholder: "",
        value: "",
        // error: false,
        // errormsg: "",
        isRequired: true,
    }
    ],
    103: [
        {
            // heading: "",
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        }
    ],
    104: [
        {
            // heading: "",
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            // error: false,
            // errormsg: "",
            isRequired: true,
        }
    ]
}
 
 
 