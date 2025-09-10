import { BaseField } from "../types/types";

export const TASK_CREATE_DB: BaseField[] = [
  {
    name: 'Title',
    label: 'Summary',
    fieldType: 'text',
    placeholder: 'Enter task summary here...',
    isRequired: true,
    className:'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    disabled:false
  },
  {
    name: 'Description',
    label: 'Description',
    fieldType: 'textarea',
    placeholder: 'Enter description...',
    isRequired: true,
    numberOfRows:4
  },
  {
    label: "Attachments",
    fieldType: "upload",
    name: "Attachments",
    isRequired: false,
    filelist: [],
    maxCount: Infinity,
    check: [
      ".doc", ".docx", ".odt", ".pdf", ".tex", ".txt", ".xls", ".xlsx",
      ".jpg", ".jpeg", ".png", ".pptx", ".rtf", ".wpd", "._zip"
    ],
    accept: ".doc,.docx,.odt,.pdf,.tex,.txt,.xls,.xlsx,.jpg,.jpeg,.png,.pptx,.rtf,.wpd,._zip",
    info: "Files allowed to Upload are .doc,.docx,.odt,.pdf,.tex,.txt,.rtf,.xls,.xlsx,.wpd,.jpg,.jpeg,.png,.pptx,._zip.",
    disabled:false
  },
  {
    label: "Type",
    fieldType: "dropdown",
    name: "Type",
    placeholder: "Select Type",
    isRequired: true,
    options: [{ label: "Task", value: "Task" }, { label: "Bug", value: "Bug" }, { label: "Story", value: "Story" }],
    defaultValue:'Task',
    show:true,
    allowClear: true,
    disabled:false,
  },
  {    
    label: "Status",
    fieldType: "dropdown",
    name: "Status",
    placeholder: "Select Status",
    isRequired: false,
    allowClear: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    defaultValue:'Medium',
    show:false,
    disabled:false
  },
  {    
    label: "Priority",
    fieldType: "dropdown",
    name: "Priority",
    placeholder: "Select Priority",
    isRequired: false,
    allowClear: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    defaultValue:'Medium',
    show:false,
    disabled:false
  },
  {
    label: "Assign To",
    fieldType: "multiselect",
    name: "AssigneeSelectedUsers",
    placeholder: "Select Assignee",
    isRequired: false,
    options: [{ label: "Ganesh Kalyanam", value: "Ganesh Kalyanam" }, { label: "Deva", value: "Deva" }, { label: "Gnapik", value: "Gnapik" }],
    defaultValue:[],
    value: [],
    selectAll:true,
    // groupSelectAll:true,
    // groupedOptions: [],
    disabled:false
  },
]