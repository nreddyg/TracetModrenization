import { BaseField } from "../types/types";

export const CHANGE_PASSWORD_DB: BaseField[] = [
    {
        label: "Current Password",
        fieldType: "password",
        name: "currentpassword",
        placeholder: "Enter Current Password",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
    },
    {
        label: "New Password",
        fieldType: "password",
        name: "newpassword",
        placeholder: "Enter New Password",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
    },
     {
        label: "Confirm Password",
        fieldType: "password",
        name: "confirmpassword",
        placeholder: "Enter Confirm Password",
        isRequired: true,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
    }
]