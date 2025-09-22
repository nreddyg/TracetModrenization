import { BaseField } from "../types/types";

export const SMTP_DB: BaseField[] = [
    {
        name: 'SMTPHost',
        label: 'SMTP Host',
        fieldType: 'text',
        placeholder: 'Enter SMTP Host',
        isRequired: true,
        className: '',
        disabled: false
    },
    {
        name: 'SMTPPort',
        label: 'SMTP Port',
        fieldType: 'text',
        placeholder: 'Enter SMTP Port',
        isRequired: true,
        className: '',
        disabled: false
    },
    {
        name: 'SMTPFromMail',
        label: 'SMTP From Mail',
        fieldType: 'text',
        placeholder: 'Enter SMTP From Mail',
        isRequired: true,
        className: '',
        disabled: false
    },
    ,
    {
        name: 'SMTPFromPassword',
        label: 'SMTP From Password',
        fieldType: 'password',
        placeholder: 'Enter SMTP From Password',
        isRequired: true,
        className: '',
        disabled: false
    },

    {
        name: 'SSLApplicable',
        fieldType: 'checkbox',
        label: 'SSL Applicable',
        defaultChecked: false,
    },





]