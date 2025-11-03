import { BaseField } from "../types/types";

export const BOOKS_DB: BaseField[] = [

    {
        label: 'Book Name',
        fieldType: 'text',
        name: 'BookName',
        placeholder: 'Book Name',
        value: "",
        isRequired: true,
        isDisplay: true,
        maxLength: 100
    },
    {
        label: 'Description',
        fieldType: 'text',
        name: 'Description',
        placeholder: '',
        value: "",
        isRequired: false,
        isDisplay: true,
        maxLength: 100
    },
    {
        label: 'Depreciation Based On',
        fieldType: "dropdown",
        name: 'DepreciationBasedOn',
        placeholder: 'Select Depreciate From ',
        defaultValue: "Purchase Date",
        isRequired: true,
        options: [{
            label: 'Purchase Date',
            value: 'Purchase Date'
        }, {
            label: 'Placed In Service Date',
            value: 'Placed In Service Date'
        }, {
            label: 'Capitalization Date',
            value: 'Capitalization Date'
        }],
        isDisplay: true,
        selectAll: true,
    },
    {
        label: 'Default Depreciation Method',
        fieldType: "dropdown",
        name: 'DefaultDepreciationMethod',
        placeholder: 'Select Method',
        defaultValue: "SLM",
        isRequired: true,
        options: [{
            label: 'SLM',
            value: 'SLM'
        }, {
            label: 'WDV',
            value: 'WDV'
        }],
        isDisplay: true,
        selectAll: true,
    },
    {
        label: 'FY Start Date',
        fieldType: "date",
        name: 'FYStartDate',
        placeholder: 'DD/MM/YYYY',
        format: 'DD/MM/YYYY',
        isRequired: true,
        isDisplay: true,

    },
    {
        label: 'FY End Date',
        fieldType: "date",
        name: 'FYEndDate',
        placeholder: 'DD/MM/YYYY',
        value: null,
        format: 'DD/MM/YYYY',
        disabled: true,
        isDisplay: true

    },

    {
        label: 'Depreciate With',
        fieldType: "dropdown",
        name: 'DepreciateWith',
        placeholder: 'Select Depreciate With ',
        defaultValue: "Rate",
        isRequired: true,
        options: [{
            label: 'Rate',
            value: 'Rate'
        },
        {
            label: 'Useful Life',
            value: 'Useful life'
        }
        ],
        isDisplay: true

    },
    {
        label: 'Depreciation Level',
        fieldType: "dropdown",
        name: 'DepreciationLevel',
        placeholder: 'Select Depreciate Level',
        defaultValue: "Asset",
        options: [
            { label: "Asset", value: "Asset" },
            { label: "Book Category", value: "Book Category" }],
        disabled: false,
        isRequired: true,
  isDisplay: true
    },
    {
        label: 'Salvage Value To Consider',
        fieldType: "dropdown",
        name: 'SalvageValueToConsider',
        placeholder: 'Salvage Value To Consider',
        defaultValue: "Book Category",
        options: [
            { label: 'Asset', value: 'Asset' },
            { label: 'Book Category', value: 'Book Category' }
        ],
        isDisplay: false
    },
    {
        label: 'Life To consider ',
        fieldType: "dropdown",
        name: 'LifeToConsider',
        placeholder: 'Life To Consider ',
        defaultValue: "Book Category",
        isRequired: true,
        options: [
            { label: 'Asset', value: 'Asset' },
            { label: 'Book Category', value: 'Book Category' }
        ],
        isDisplay: false
    },
   

    {
        label: 'Salvage Value',
        fieldType: 'numeric',
        name: 'SalvageValueRate',
        placeholder: '',
        value: "0",
        isDisplay: false

    },
    {
        label: 'First-Year Depreciation Conventions',
        fieldType: "dropdown",
        name: 'FirstYearDepreciationConventions',
        value: '',
        placeholder: 'First Year Depreciation Conventions',

        isRequired: true,
        options: [
            { label: "AD - Actual Days In Service", value: "AD - Actual days in service" },
            { label: "ADL - Actual Days In Service With Leap Year", value: "ADL - Actual days in service with leap year" },
            { label: "HY 180D - <=180Days", value: "HY 180D - <=180Days" },
            { label: "Full Month Write Off", value: "Full Month Write Off" },
        ],
        isDisplay: true
    },
    {
         label: '100% Write Off Applicable',
        name:"IsWriteOffApplicable",
        fieldType:'checkbox',
        value: false,
        isDisplay: true,
        defaultChecked:false,
    },
      {
    label: '100% Write-Off Value',
    fieldType: 'numeric',
    name: 'WriteOffValue',
    placeholder: 'Enter Write Off Value',
    value: "",
    isDisplay: false

  },
   {
    label: 'Write-Off Type',
    fieldType: "dropdown",
    name: "WriteOffType",
    defaultValue: "Proportionate Dep Calculation",
    options: [
      {
        label: "Proportionate Dep Calculation",
        value: "Proportionate Dep Calculation"
      },
      {
        label: "Full Write Off in the selected dates",
        value: "Full Write Off in the selected dates"
      }
    ],
    isDisplay: false
  },
  {
    label: 'Forex Gain/Loss Applicable',
    fieldType: "checkbox",
    name: "IsForexApplicable",
    value: false,
    isDisplay: true

  },
  {
    label: 'Revaluation Applicable',
    fieldType: "checkbox",
    name: "IsRevaluationApplicable",
    value: false,
    isDisplay: true

  },
  {
    label: 'Dependent Asset To Be Calculated Separately',
    fieldType: "checkbox",
    name: "AssetIndependentCalulation",
    value: false,
    isDisplay: true

  },
  {
    label: 'Backdated Entry Applicable',
    fieldType: "checkbox",
    name: "IsRequiredBackDateEntry",
    value: false,
    isDisplay: true
  },
  {
    label: 'Depreciated Value Round Off Up-To',
    fieldType: 'numeric',
    name: 'DepreciatedValueRoundOffUpTo',
    placeholder: 'Enter Write Off Value',
    value: "2",
    isRequired: true,
    isDisplay: true,
   
  },
  {
    label: 'Calculate Rate Based ON',
    fieldType: 'dropdown',
    name: 'FormulaCalculationTypeId',
    placeholder: 'Select',
    defaultValue: "Net Book Value & Remaining Useful Life",
  
    options: [
      { label: 'Net Book Value & Remaining Useful Life', value: 'Net Book Value & Remaining Useful Life' },
      { label: 'Purchased Price & Total Life', value: 'Purchased Price & Total Life' }
    ],
    isDisplay: false

  },




]