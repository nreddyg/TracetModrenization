import { BaseField } from "../types/types";

export const TICKET_PROGRESS_DB: BaseField[] = [
    {
        label: 'Project',
        fieldType: 'dropdown',
        name: 'Project',
        placeholder: 'Select Project',
        isRequired: false,
        options: [
            {
                label: 'All Projects',
                value: 'All Projects'
            },
            {
                label: 'ERP System Upgrade',
                value: 'ERP System Upgrade'
            },
            {
                label: 'Mobile App Development',
                value: 'Mobile App Development'
            },
            {
                label: 'Security Audit',
                value: 'Security Audit'
            }],
        allowClear: true,
        defaultValue: '',

    },
    {
        label: 'Status',
        fieldType: 'dropdown',
        name: 'Status',
        placeholder: 'Select Status',
        isRequired: false,
        options: [
            {
                label: 'All Status',
                value: 'All Status',
            },
            {
                label: 'Open',
                value: 'Open',
            },
            {
                label: 'In Progress',
                value: 'In Progress',
            },
            {
                label: 'Resolved',
                value: 'Resolved',
            },
            {
                label: 'Closed',
                value: 'Closed',
            }
        ],
        allowClear: true,
        defaultValue: '',
    },

    {
        label: 'Category',
        fieldType: 'dropdown',
        name: 'Category',
        placeholder: 'Select Category',
        isRequired: false,
        options: [],
        allowClear: true,
        defaultValue: '',
    },
    {
        label: 'Search',
        fieldType: 'text',
        name: 'Search',
        isRequired: false,
        placeholder: 'Search Tickets...',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
        disabled: false,

    },
    {
        label: 'Start Date',
        fieldType: 'date',
        name: 'StartDate',
        placeholder: 'Select Start Date',
        format: 'DD/MM/YYYY',
        isRequired: false,
        defaultValue: '',
    },

    {
        label: 'End Date',
        fieldType: 'date',
        name: 'EndDate',
        placeholder: 'Select End Date',
        format: 'DD/MM/YYYY',
        isRequired: false,
        defaultValue: '',
    },
    {
        label: "Assignees",
        fieldType: "multiselect",
        name: "Assignees",
        placeholder: "Select Asignees",
        isRequired: false,
        options: [],
        defaultValue: [],
        value: [],
        selectAll: true,
        groupSelectAll: true,
        groupedOptions: [],
    },
];