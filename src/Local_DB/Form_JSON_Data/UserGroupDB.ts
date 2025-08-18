import { BaseField } from "../types/types";

export const USER_GROUP_DB: BaseField[] = [
    {
        name: 'userGroupName',
        label: 'User Group Name',
        fieldType: 'text',
        placeholder: 'Enter user group name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
    {
        label: "Select Users",
        fieldType: "multiselect",
        name: "Users",
        placeholder: "Select Users",
        isRequired: true,
        options: [],
        defaultValue:[],
        // selectAll: true,
    },
    {
        label: "Status",
        fieldType: "dropdown",
        name: "status",
        placeholder: "Select Status",
        isRequired: false,
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'InActive', label: 'InActive' },
        ],
        defaultValue: "Active",
        allowClear: true,
    },
    {
        label: 'Description',
        placeholder: "Enter Description",
        defaultValue: '',
        isRequired: false,
        name: "description",
        fieldType: 'textarea',
        maxLength: 500,
    }
];