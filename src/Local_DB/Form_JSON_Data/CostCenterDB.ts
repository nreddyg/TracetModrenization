import { BaseField } from "../types/types";
 
type FormConfig = {
    [key: number]: BaseField[];
};
 
export const CostCenter_DB: FormConfig = {
    99: [
        {
            // heading: 'Company Details',
            label: 'Company Name',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            isRequired: false,
 
            disabled: false,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        },
        {
            label: 'Company Code',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: false,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
            disabled: false
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
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        }
    ],
    101: [
        {
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        }
    ],
    102: [{
        label: '',
        fieldType: 'text',
        name: 'Name',
        value: "",
        placeholder: "",
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
    },
    {
        label: '',
        fieldType: 'text',
        name: 'Code',
        placeholder: "",
        value: "",
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
    }
    ],
    103: [
        {
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        }
    ],
    104: [
        {
            label: '',
            fieldType: 'text',
            name: 'Name',
            value: "",
            placeholder: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        },
        {
            label: '',
            fieldType: 'text',
            name: 'Code',
            placeholder: "",
            value: "",
            isRequired: true,
            className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
 
        }
    ]
}
 
 
 