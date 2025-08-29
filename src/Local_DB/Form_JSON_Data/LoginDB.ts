import { BaseField } from "../types/types";

export const LOGIN_PAGE_DB: BaseField[] = [
    {
        label: 'Company Code',
        fieldType: 'text',
        name: 'CompanyCode',
        isRequired: true,
        placeholder: 'Enter Company Code',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
        

    },
    {
        label: 'User Name',
        fieldType: 'text',
        name: 'Username',
        isRequired: true,
        placeholder: 'Enter Your User Name',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Password',
        fieldType: 'password',
        name: 'password',
        placeholder: 'Enter Your Password',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'
    },
];