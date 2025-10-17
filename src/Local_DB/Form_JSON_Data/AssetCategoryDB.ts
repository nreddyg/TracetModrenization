import { BaseField } from "../types/types";

export const Asset_Main_Category_DB: BaseField[] = [
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
        label: 'AssetAcquisitionAccount',
        fieldType: 'text',
        name: 'assetacquisitionaccount',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'AssetDepreciationAccount',
        fieldType: 'text',
        name: 'assetdepreciationaccount',
        placeholder: '',
        className: 'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Depreciation Account',
        fieldType: 'text',
        name: 'depreciationaccount',
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
];