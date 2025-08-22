import { BaseField } from "../types/types";

export const SUBSCRIPTION_DB: BaseField[] = [
    {
        label: 'Customer Name',
        fieldType: 'dropdown',
        name: 'CustomerName',
        placeholder: 'Select Role',
        isRequired: false,
        options: [],
        allowClear: true,
        defaultValue:'',
        
        },
    {
        label: 'Product Name',
        fieldType: 'dropdown',
        name: 'ProductName',
        placeholder: 'Select Role',
        isRequired: false,
        options: [],
        allowClear: true,
        defaultValue:'',
    },
];

export const SUBSCRIPTION_PAYMENT_DB: BaseField[] = [
    {
        label: 'Customer Name',
        fieldType: 'text',
        name: 'CustomerName',
        isRequired: false,
        placeholder: 'Customer Name',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
        disabled:false,

    },
    {
        label: 'Product Name',
        fieldType: 'text',
        name: 'ProductName',
        isRequired: false,
        placeholder: 'Product Name',
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
        disabled:false,

    },
    {
        label: 'Order Value',
        fieldType: 'text',
        name: 'OrderValue',
        placeholder: 'Enter Order Value',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'
    },
    //   {
    //     fieldType: 'heading',
    //     label: 'Payment',
    //     name: 'heading_payment',
    //   },
    {
        label: 'Payment Mode',
        fieldType: 'dropdown',
        name: 'PaymentDetails',
        placeholder: 'Select Payment Mode',
        isRequired: true,
        options: [
            { label: 'Cheque', value: 'Cheque' },
            { label: 'Cash', value: 'Cash' },
            { label: 'NEFT', value: 'NEFT' },
        ],
        allowClear: true,
        defaultValue:'Cheque',

    },

    {
        label: 'Bank Name',
        fieldType: 'text',
        name: 'BankName',
        placeholder: 'Enter Bank Name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'

    },
    {
        label: 'Cheque No',
        fieldType: 'text',
        name: 'ChequeNo',
        placeholder: 'Enter Cheque Number',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'
    },
    {
        label: 'Cheque Date',
        fieldType: 'date',
        name: 'ChequeDate',
        placeholder: 'Select Cheque Date',
        format: 'DD/MM/YYYY',
        isRequired: true,
        defaultValue: '',
    },
    {
        label: 'Amount',
        fieldType: 'text',
        name: 'Amount',
        placeholder: 'Enter Amount',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'
    },
    {
        label: 'Currency',
        fieldType: 'dropdown',
        name: 'Currency',
        placeholder: 'Select Currency',
        isRequired: true,
        options: [],
        allowClear: true,
        defaultValue:71,
    },

    {
        label: 'Currency Amount',
        fieldType: 'text',
        name: 'CurrencyAmount',
        placeholder: 'Enter Currency Amount',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'

    },
    {
        label: 'Type',
        fieldType: 'dropdown',
        name: 'Type',
        placeholder: 'Select Type',
        isRequired: true,
        options: [
            { label: 'Monthly', value: 'Monthly' },
            { label: 'Quarterly', value: 'Quarterly' },
            { label: 'Half Yearly', value: 'Half Yearly' },
            { label: 'Yearly', value: 'Yearly' },
        ],
        allowClear: true,
        defaultValue:'Monthly'
    },
    {
        label: 'Subscription From Date',
        fieldType: 'date',
        name: 'AMCFromDate',
        placeholder: 'Select AMC From Date',
        format: 'DD/MM/YYYY',
        isRequired: true,
        defaultValue: '',
        disabled:false,
    },
    {
        label: 'Subscription To Date',
        fieldType: 'date',
        name: 'AMCToDate',
        placeholder: 'Select To Date',
        format: 'DD/MM/YYYY',
        isRequired: true,
        defaultValue: '',
        disabled: false,
    },
    {
        label: 'Subscription Paid Date',
        fieldType: 'date',
        name: 'AMCPaidDate',
        placeholder: 'Select AMC Paid Date',
        format: 'DD/MM/YYYY',
        isRequired: true,
        defaultValue: '',
    },
    {
        label: 'Subscription Expiry Date',
        fieldType: 'date',
        name: 'AMCExpiryDate',
        placeholder: 'Select AMC Expiry Date',
        format: 'DD/MM/YYYY',
        isRequired: true,
        defaultValue: '',
    },
    {
        label: 'No of Count Details',
        fieldType: 'text',
        name: 'NoOfCountDetails',
        placeholder: 'Enter No of API Calls',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'
    },
    {
        label: 'Per Additional Count Cost',
        fieldType: 'text',
        name: 'PerAdditionalCountCost',
        placeholder: 'Enter Per API Cost',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'

    },
    {
        label: 'Over Usage Count',
        fieldType: 'text',
        name: 'OverUsageCount',
        placeholder: 'Enter Amount',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'

    },
    {
        label: 'Remark',
        fieldType: 'text',
        name: 'Remark',
        placeholder: 'Enter Remarks',
        isRequired: false,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background'

    },
];
