import { BaseField } from "../types/types";

export const SOFTWARE_DB: BaseField[] = [
    {
        label: "Employee ID",
        fieldType: "dropdown",
        name: "employeeID",
        placeholder: "Select Employee",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
        jsontype: 'employeeID'
    },
    {
        label: "Department",
        fieldType: "dropdown",
        name: "department",
        placeholder: "Select Department",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
        jsontype: 'department'
    },
    {
        label: "Software",
        fieldType: "dropdown",
        name: "software",
        placeholder: "Select Software",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
        jsontype: 'software'
    },
    {
        label: "Assignment Date",
        fieldType: "date",
        name: "assignmentDate",
        placeholder: "Pick a date",
        isRequired: true,
        format: "DD-MM-YYYY",
        disabled: false,
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

]