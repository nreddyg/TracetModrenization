import { OptionGroup } from "@/components/ui/reusable-multi-select";
import { TreeNode } from "@/components/ui/reusable-treeSelect";
 
 
export type FieldType = 'text' | 'dropdown' | 'multiselect' | 'textarea' | 'heading' | "date" | "upload"
  | "richtext" | "checkbox" | "table" | "separator" | 'radiobutton' | 'numeric'|"rangepicker" | 
  "timepicker" | 'password' | 'treeselect';

export interface DropdownOption {
    label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}
export interface Options {
  label: string;
  value: string;
  group?: string;
  disabled?: boolean;
  children?: Options[];
  icon?: React.ReactNode;
  description?: string;
}
 
export interface field {
  numberOfColumns?: number;
  isAlwaysOnDisabled?:boolean;
  checked?:boolean,
  uniqueId?:number,
  numberOfRows?:number;
  containerClassName?: string;
  type?:FieldType;
  fieldType: FieldType;
  name?: string;
  label?: string;
  placeholder?: string;
  jsontype?:string;
  rangeplaceholder?:string[];
  value?: any;
  defaultValue?:any;
  isRequired?: boolean;
  disabled?: boolean;
  className?:string;
  visible?: boolean;
  allowClear?: boolean;
  options?: Options[];
  groupSelectAll?:boolean;
  selectAll?:boolean;
  groupedOptions?:OptionGroup[];
  default?: string | number;
  maxLength?: number;
  format?: string;
  filelist?: File[] | any[];
  maxCount?: number;
  check?: string[];
  accept?: string;
  listeners?: string[];
  info?: string | boolean;
  error?: string;
  text?: string;
  formats?: string[]; // For richtext, e.g., ['bold', 'italic', 'underline', 'link']
  maxHeight?:number;
  minHeight?:number;
  showToolbar?:boolean;
  modules?:any;
  isAdditionalField?: boolean; // For additional fields
  show?:boolean;
  defaultChecked?:boolean
  treeData?: TreeNode[];
  tooltip?:string;
  errormsg?:boolean;
  dependsOn?:string;
  validationPattern?:string;
  patternErrorMessage?:string;
}
 
export type BaseField = field;
 
export type UploadedFileOutput = {
  FileName: string;
  ServiceDocumentFile: string; // stringified byte array
  FileType: string;
  FileConversionType: string;
  ServiceRequestId?:string
};
export type UploadFileInput = {
      id?: string;
  name: string;
  size?: number;
  type: string;
  url?: string;
  file?: File;
  // name: string;
  // type: string;
  // url: string;
  // UploadFile
};
 
export type QuillModules = {
  toolbar?: any;
  clipboard?: any;
  history?: any;
  keyboard?: any;
};
 
export type GenericObject={
  [key:string]:any
}
 