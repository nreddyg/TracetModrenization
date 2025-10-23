import { BaseField } from "../types/types";

export const ITEM_CATEGORY_DB: BaseField[] = [
    {
        label: 'Name',
        fieldType: 'text',
        name: 'name',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Code',
        fieldType: 'text',
        name: 'code',
        isRequired: true,
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Description',
        fieldType: 'text',
        name: 'description',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "Cost BreakUp Group",
        fieldType: "dropdown",
        name: "costbreakgroup",
        placeholder: "Select Cost BreakUp Group",
        isRequired: false,
        visible: false,
        options: [],
        show: true,
        allowClear: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    }
];