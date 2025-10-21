import { BaseField } from "../types/types";

 
export const USER_DETAILS:BaseField[] = [
    {
        fieldType: 'heading',
        text: 'User Details'
    },
    {
        label: 'First Name',
        fieldType: 'text',
        name: 'FirstName',
        placeholder: '',
        isRequired: true,
    },
    {
        label: 'Last Name',
        fieldType: 'text',
        name: 'LastName',
        placeholder: '',
        isRequired: true
    },
    {
        label: 'Employee Id',
        fieldType: 'text',
        name: 'EmployeeId',
        placeholder: '',
        isRequired: true,
    },
    {
        label: 'User Name',
        fieldType: 'text',
        name: 'UserName',
        placeholder: 'User Name (4-50 Characters)',
        isRequired: true,
    },
    {
        label: 'Password',
        fieldType: 'password',
        name: 'Password',
        placeholder: 'Password (8-50 Characters)',
        isRequired: true,
        info: "(Make the password at least 8 characters long. Include atleast one Upper & Lower case characters, Numbers and symbols (e.g. a-z A-Z, 0-9  !@@# $ %^&*-()_+=\\{}[<>?/)."
    },
    {
        label: 'Confirm Password',
        fieldType: 'password',
        name: 'ConfirmPassword',
        placeholder: '',
        isRequired: true,
        dependsOn: "Password",
    },
    {
        label: 'Phone No',
        fieldType: 'text',
        name: 'PhoneNumber',
        placeholder: '',
        isRequired: false,
    },
    {
        label: 'Email Id',
        fieldType: 'email',
        name: 'Email',
        placeholder: '',
        isRequired: true,
    },
      {
        label: 'Device Name',
        fieldType: 'text',
        name: 'DeviceName',
        placeholder: 'Device Name',
        isRequired: false,
    },
    {
        label: 'Joining Date',
        fieldType: 'date',
        name: 'JoinDate',
        placeholder: 'DD-MM-YYYY',
        format: 'DD-MM-YYYY',
        isRequired: false,
    },
    {
        fieldType: 'heading',
        text: 'Role Details'
    },
    {
        label: 'Role',
        fieldType: "dropdown",
        name: "RoleName",
        default: "Select Role",
        isRequired: true,
    },
    {
        label: 'Service Desk User',
        fieldType: "checkbox",
        name: "IsServiceDesk",
        isRequired: false
    },
    {
        label: 'Branch',
        fieldType: "multiselect",
        name: "Branch",
        placeholder: "Select Branch",
        isRequired: true,
        dependsOn:'RoleName',
    },
    {
        label: 'Department',
        fieldType: "multiselect",
        name: "Department",
        placeholder: "Select Department",
        isRequired: true,
        dependsOn:'RoleName',
    },
    {
        label: 'Categories',
        fieldType: "multiselect",
        name: "Categories",
        placeholder: "Select Category",
        isRequired: false,
        dependsOn:'RoleName',
    },
    {
        label: 'Deactive',
        fieldType: "checkbox",
        name: "Deactive",
        isRequired: false,
    },
    {
        label: 'Deactive Date',
        fieldType: 'date',
        name: 'DeactiveDate',
        placeholder: 'DD-MM-YYYY',
        format: 'DD-MM-YYYY',
        isRequired: false,
        dependsOn: "Deactive",
    },
]
