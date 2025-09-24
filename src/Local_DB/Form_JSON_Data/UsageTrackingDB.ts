import { BaseField } from "../types/types";

export const USAGE_TRACKING_DB: BaseField[] = [
    {
        name: 'Software',
        label: '',
        fieldType: 'text',
        placeholder: 'Search Software...',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "",
        fieldType: "dropdown",
        name: "Employee",
        placeholder: "Select Employee",
        isRequired: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: false,
    },
    {
        label: "",
        fieldType: "dropdown",
        name: "Compliance",
        placeholder: "Compliance Status",
        isRequired: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: false,
    },
    {
        label: '',
        fieldType: "rangepicker",
        name: "DateRange",
        allowClear: true,
        disabled: false,
        className: "w-full h-9 rounded-md"
    }

]