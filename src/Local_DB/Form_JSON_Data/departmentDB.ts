import { BaseField } from "../types/types";

export const DEPARTMENT_DB: BaseField[] = [
    {
        label: 'Department Name',
        fieldType: 'text',
        name: 'depname',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',    },
    {
        label: 'Department Code',
        fieldType: 'text',
        name: 'depcode',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    }
];