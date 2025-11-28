import { BaseField } from "../types/types";
export const CHANGE_DB:BaseField[]=[
     {
        label: "Source Main Category",
        fieldType: "dropdown",
        name: "SourceMainCategory",
        placeholder: "Select Source Main Category",
        isRequired: true,
        options: [],
    },
     {
        label: "Target Main Category",
        fieldType: "dropdown",
        name: "TargetMainCategory",
        placeholder: "Select Target Main Category",
        isRequired: true,
        options: [],
    },
    {
        label: "Source Sub Category",
        fieldType: "dropdown",
        name: "SourceSubCategory",
        placeholder: "Select Source Main Category",
        isRequired: true,
        options: [],
    },
     {
        label: "Target Sub Category",
        fieldType: "dropdown",
        name: "SourceSubCategory",
        placeholder: "Select Target Main Category",
        isRequired: true,
        options: [],
    },

    {
        name:'AssetCode',
        fieldType:'text',
        label:'',
        placeholder:"Asset Code",
        isRequired:false
        // defaultChecked:false,
    },
    {
        name:'BarCode',
        fieldType:'text',
        label:'',
        placeholder:"Bar Code",
        isRequired:false
        // defaultChecked:false,
    },
     {
        label: "",
        fieldType: "treeselect",
        name: "LevelFiveLocation",
        placeholder: "Location",
        isRequired: false,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
        
    },
    {
        label: "",
        fieldType: "treeselect",
        name: "LevelFiveDepartment",
        placeholder: "Department",
        isRequired: false,
        visible: false,
        options: [],
        defaultValue: [],
        selectAll: true,
        show: true,
        
    },
]
