
import React, { useEffect, useState } from 'react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, Save, LeafyGreen, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AddDepBookMasterDetails, AddGroupCategoryDetails, DeleteGroupById, GetAdditionalDepreciationBookDetails, GetBookCatListById, GetBookDetailsById, GetDepreciationBookDetails, GetGroupByBookIdDetails, UpdateGroupCategoryDetails } from '@/services/BookServices';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Controller, useForm } from 'react-hook-form';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { BOOKS_DB } from '@/Local_DB/Form_JSON_Data/BooksDB';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { useMessage } from '@/components/ui/reusable-message';
import { setLoading } from '@/store/slices/projectsSlice';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { formatDates } from '@/_Helper_Functions/HelperFunctions';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReUsableSelect } from '@/components/ui/re-usable-select';


interface Book {
  id: string;
  name: string;
  depreciateWith: string;
  depreciateLevel: string;
  depreciationOn: string;
  fyStartDate: string;
}


const defaultRow = {
  key: 1,
  CategoryName: '',
  GroupName: "",
  DepreciationMethodName: "SLM",
  AdditionalDepreciationName: "",
  CategoryLife: "0",
  CategoryRate: "0",
  Usefullife: "0",
  SalvageValueRate: "0",
  ShiftApplicable: "NO",
  DoubleShiftRate: "0",
  TripleShiftRate: "0"

  // cellsData: cellsData,
};
const fieldsToDisable = ["DepreciateWith", "DepreciationLevel", "SalvageValueToConsider", "LifeToConsider", "FYStartDate"]

const AddBook = () => {
   const { id } = useParams()
  const [booksData, setBooksData] = useState([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [fields, setFields] = useState<BaseField[]>(BOOKS_DB);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('BookDetails');
  const [effectiveFrom, setEffectiveFrom] = useState("")
  const [dataSource, setDataSource] = useState([]);
  const msg = useMessage()
  const [validationTrigger, setValidationTrigger] = useState(false)
  const [isFinancialYearOpen, setIsFinancialYearOpen] = useState(false)
  const [isCopyFromOpen, setIsCopyFromOpen] = useState(false);
   const [isDepRan, setIsDepRan] = useState(false)
  const [isAddGroupOpen,setIsAddGroupOpen]=useState(false);
  const [selectedGroup,setSelectedGroup]=useState<string|number|(string | number)[]>("")
  const [groupOptions,setGroupOptions]=useState([])
  const [copyDepBookOpts,setCopyDepBookOpts]=useState([])
  const [bookCatForEdit,setBookCatForEdit]=useState([])
  const [modalDatasource, setModalDatasource] = useState([{}]);
  const [isNewFYOpen,setIsNewFYOpen]=useState(false)
  
  const companyId = useAppSelector(state => state.projects.companyId);

  const [editingRecordId,setEditingRecordId]=useState(id||"");
  const [salvalueType,setSalvalueType]=useState<string|number|(string | number)[]>("%")
  const [additionalDepOptions, setAdditionalDepOptions] = useState([
      {
        "value": "None",
        "label": "None",
      }
    ],)
  const dispatch=useDispatch()

  const navigate = useNavigate()
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
    reValidateMode: "onChange"
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
console.log("id",id,editingRecordId)
  useEffect(() => {
    if (activeTab == "BookDetails") {
      if (validationTrigger) {
        setTimeout(() => {
          triggerAccordionItemsValidations()
          setValidationTrigger(false)
        }, 10)
      }
    }
  }, [activeTab])

useEffect(() => {
  if(companyId){
  getBookDataAPI()
  }
  }, [companyId,watch("DepreciationLevel")])

  useEffect(()=>{
    if(companyId){
    getAdditionalDepreciationListAPI()
    }
  },[companyId])

  const handleCopyFromSubmit = () => {
    GetBookCatListByIdAPI(companyId, selectedGroup)
  }
   
    const financialYearColumns= 
[
    {
      header: "S.No",
      accessorKey: "key",
      id: "key",
      size: 50,
      // key: "key",
    },
    {
      accessorKey: "CategoryName",
      header: "Book category",

      cell: ({ row }) => (

        <span className='flex'>
          <ReusableInput
            value={row.original.CategoryName}
            onChange={(e) => handleChange(e.target.value, row.id, "CategoryName")}
            name='CategoryName'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "GroupName",
      header: "Group",
      cell: ({ row }) => (

        <span className='flex'>
         
           <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder="GroupName"
            options={groupOptions.reverse()}
            allowClear={false}
            defaultValue={row.original.GroupName}
            onChange={(e) => handleChange(e, row.id, "GroupName")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>
             <div className="relative w-full">
                              <ReUsableSelect
                              name='Hello'
                              clearable={true}
                              value={''}
                              onChange={null}
                              options={[{label:'Hi',value:'hi'}]}
                              placeholder='Hello Pallavi'
                              />
  
                          </div>

        </span>
      )
    },

    {
      accessorKey: "DepreciationMethodName",
      header: "Depreciation Method",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder=" "
            options={[
              { label: "SLM", value: "SLM" }, { label: "WDV", value: "WDV" },
            ]}
            allowClear={false}
            defaultValue={row.original.DepreciationMethodName}
            onChange={(e) => handleChange(e, row.id, "DepreciationMethodName")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>

        </span>
      )
    },

    ...(form.watch("DepreciationLevel") == "Book Category" ? [
      {
        accessorKey: "AdditionalDepreciationName",
        header: "Additional Depreciation",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableDropdown
              containerClassName=" p-2"
              className='h-8 border-2 '
              placeholder=" "
              options={additionalDepOptions.reverse()}
              allowClear={false}
              defaultValue={row.original.AdditionalDepreciationName}
              onChange={(e) => handleChange(e, row.id, "AdditionalDepreciationName")}
              backgroundColor="white"
              size={"small"}

            >

            </ReusableDropdown>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciateWith") == "Rate" ? [
      {
        accessorKey: "CategoryRate",
        header: "Rate",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.CategoryRate}
              onChange={(e) => handleChange(e.target.value, row.id, "CategoryRate")}
              name='CategoryRate'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciateWith") === "Useful life" && form.watch("LifeToConsider") === "Book Category" ? [
      {
        accessorKey: "CategoryLife",
        header: "Useful life",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.CategoryLife}
              onChange={(e) => handleChange(e.target.value, row.id, "CategoryLife")}
              name='CategoryLife'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciationLevel") === "Asset" && form.watch("SalvageValueToConsider") === "Book Category" ? [
      {
        accessorKey: "SalvageValueRate",
        header: "Salvage value (%)",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.SalvageValueRate}
              onChange={(e) => handleChange(e.target.value, row.id, "SalvageValueRate")}
              name='SalvageValueRate'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),

    {
      accessorKey: "ShiftApplicable",
      header: "Shifts applicable",

      cell: ({ row }) => (

        <span>
          <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder=" "
            options={[
      {
        "value": "Yes",
        "label": "Yes",
      },
      {
        "value": "No",
        "label": "No",
      }
    ]}
    
            allowClear={false}
            defaultValue={row.original.ShiftApplicable}
            onChange={(e) => handleChange(e, row.id, "ShiftApplicable")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>

        </span>
      )
    },
    {
      accessorKey: "DoubleShiftRate",
      header: "Double Shift Rate",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableInput
            value={row.original.DoubleShiftRate}
            onChange={(e) => handleChange(e.target.value, row.id, "DoubleShiftRate")}
            name='DoubleShiftRate'
            type='number'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "TripleShiftRate",
      header: "Triple Shift Rate",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableInput
            value={row.original.TripleShiftRate}
            onChange={(e) => handleChange(e.target.value, row.id, "TripleShiftRate")}
            name='TripleShiftRate'
            type='number'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "Actions",
      header: "Actions  ",
      size: 100,
      cell: ({ row }) => (
        <div className={cn('flex justify-start', "justify-center")}>

          {<Trash2 height={18} className='text-red-400 cursor-pointer '
            onClick={() => handleRowDelete(row)} />}


        </div>
      )
    },


  ]
  const tableColumnsData = [
    {
      header: "S.No",
      accessorKey: "key",
      id: "key",
      size: 50,
      // key: "key",
    },
    {
      accessorKey: "CategoryName",
      header: "Book category",

      cell: ({ row }) => (

        <span className='flex'>
          <ReusableInput
            value={row.original.CategoryName}
            onChange={(e) => handleChange(e.target.value, row.id, "CategoryName")}
            name='CategoryName'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "GroupName",
      header: "Group",
      cell: ({ row }) => (

        <span className='flex'>
         
           <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder="GroupName"
            options={groupOptions.reverse()}
            allowClear={false}
            defaultValue={row.original.GroupName}
            onChange={(e) => handleChange(e, row.id, "GroupName")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>

        </span>
      )
    },

    {
      accessorKey: "DepreciationMethodName",
      header: "Depreciation Method",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder=" "
            options={[
              { label: "SLM", value: "SLM" }, { label: "WDV", value: "WDV" },
            ]}
            allowClear={false}
            defaultValue={row.original.DepreciationMethodName}
            onChange={(e) => handleChange(e, row.id, "DepreciationMethodName")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>

        </span>
      )
    },

    ...(form.watch("DepreciationLevel") == "Book Category" ? [
      {
        accessorKey: "AdditionalDepreciationName",
        header: "Additional Depreciation",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableDropdown
              containerClassName=" p-2"
              className='h-8 border-2 '
              placeholder=" "
              options={additionalDepOptions.reverse()}
              allowClear={false}
              defaultValue={row.original.AdditionalDepreciationName}
              onChange={(e) => handleChange(e, row.id, "AdditionalDepreciationName")}
              backgroundColor="white"
              size={"small"}

            >

            </ReusableDropdown>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciateWith") == "Rate" ? [
      {
        accessorKey: "CategoryRate",
        header: "Rate",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.CategoryRate}
              onChange={(e) => handleChange(e.target.value, row.id, "CategoryRate")}
              name='CategoryRate'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciateWith") === "Useful life" && form.watch("LifeToConsider") === "Book Category" ? [
      {
        accessorKey: "CategoryLife",
        header: "Useful life",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.CategoryLife}
              onChange={(e) => handleChange(e.target.value, row.id, "CategoryLife")}
              name='CategoryLife'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),
    ...(form.watch("DepreciationLevel") === "Asset" && form.watch("SalvageValueToConsider") === "Book Category" ? [
      {
        accessorKey: "SalvageValueRate",
        header: "Salvage value (%)",
        cell: ({ row }) => (

          <span className='flex' >
            <ReusableInput
              value={row.original.SalvageValueRate}
              onChange={(e) => handleChange(e.target.value, row.id, "SalvageValueRate")}
              name='SalvageValueRate'
              type='number'
              // placeholder='Enter License key'
              isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>

          </span>
        )
      }
    ] : []),

    {
      accessorKey: "ShiftApplicable",
      header: "Shifts applicable",

      cell: ({ row }) => (

        <span>
          <ReusableDropdown
            containerClassName=" p-2"
            className='h-8 border-2 '
            placeholder=" "
            options={[
      {
        "value": "Yes",
        "label": "Yes",
      },
      {
        "value": "No",
        "label": "No",
      }
    ]}
    
            allowClear={false}
            defaultValue={row.original.ShiftApplicable}
            onChange={(e) => handleChange(e, row.id, "ShiftApplicable")}
            backgroundColor="white"
            size={"small"}

          >

          </ReusableDropdown>

        </span>
      )
    },
    {
      accessorKey: "DoubleShiftRate",
      header: "Double Shift Rate",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableInput
            value={row.original.DoubleShiftRate}
            onChange={(e) => handleChange(e.target.value, row.id, "DoubleShiftRate")}
            name='DoubleShiftRate'
            type='number'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "TripleShiftRate",
      header: "Triple Shift Rate",
      cell: ({ row }) => (

        <span className='flex' >
          <ReusableInput
            value={row.original.TripleShiftRate}
            onChange={(e) => handleChange(e.target.value, row.id, "TripleShiftRate")}
            name='TripleShiftRate'
            type='number'
            // placeholder='Enter License key'
            isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>

        </span>
      )
    },
    {
      accessorKey: "Actions",
      header: "Actions  ",
      size: 100,
      cell: ({ row }) => (
        <div className={cn('flex justify-start', "justify-center")}>

          {<Trash2 height={18} className='text-red-400 cursor-pointer '
            onClick={() => handleRowDelete(row)} />}


        </div>
      )
    },


  ]
  
  const handleRowDelete = (row) => {
    const data = [...dataSource]
    data.splice(row.id, 1)
    if (data.length <= 0) {
      settingFieldDependencies()
    }
    setDataSource(data)



  }
  function handleChange(val, id, accessorKey) {
    let data = dataSource
    //  data.forEach((obj)=>{
    //     if(obj.key==id){
    //         obj[accessorKey]=val
    //     }
    //  })
    data[parseInt(id)][accessorKey] = val
    setDataSource(data)
  }

  useEffect(() => {
    let calculatedDate = getDateAfterYears(watch("FYStartDate"));
    form.setValue("FYEndDate", calculatedDate)
    setEffectiveFrom(calculatedDate)
  }, [watch("FYStartDate")])

  //handling change dependencies
  useEffect(() => {
    // if(editingRecordId){
    //   if(bookCatForEdit?.length>0){
    //     settingFieldDependencies()
    //   }
    // }else{
      
         settingFieldDependencies()
    // }
  
  }, [watch("DefaultDepreciationMethod"), watch("DepreciateWith"), watch("DepreciationLevel"), watch("IsWriteOffApplicable"),bookCatForEdit])

  const settingFieldDependencies = () => {
  
    let depMethod = watch("DefaultDepreciationMethod")
    let depreciateWith = watch("DepreciateWith")
    let depreciationLevel = watch("DepreciationLevel")
    let fieldData = structuredClone(fields)
    console.log("useEffect of dependencies",depMethod,depreciateWith,depreciationLevel)

    if (depreciateWith == "Rate") {
      fieldData.forEach((o) => {
        if (depreciationLevel == "Asset") {
          if ((o.name !== "FormulaCalculationTypeId" && o.name !== "LifeToConsider")) { o.isDisplay = true; (o.name == "FYEndDate") ? o.disabled = true : o.disabled = false } else {
            o.isDisplay = false, form.setValue(o.name, o.name == "FormulaCalculationTypeId" ? "Net Book Value & Remaining Useful Life" : "Book Category")
          }
        } else if (depreciationLevel == "Book Category") {

          if ((o.name === "LifeToConsider" || o.name == "SalvageValueToConsider" || o.name == "SalvageValueRate" || o.name == "FirstYearDepreciationConventions" || o.name == "FirstYearDepreciationConventions" || o.name == "IsWriteOffApplicable" || o.name == "IsForexApplicable" || o.name == "IsRevaluationApplicable" || o.name == "AssetIndependentCalulation" || o.name == "AssetIndependentCalulation" || o.name == "IsRequiredBackDateEntry" || o.name == "FormulaCalculationTypeId")) {
            o.isDisplay = false;
            setValue(o.name, o.name == "LifeToConsider" || o.name == "SalvageValueToConsider" ? "Book Category" : o.name == "SalvageValueRate" ? "0" : o.name == "FormulaCalculationTypeId" ? "Net Book Value & Remaining Useful Life" : "")
          } else {
            o.isDisplay = true; (o.name == "FYEndDate") ? o.disabled = true : o.disabled = false
          }
        }
      })
    } else if (depreciateWith == "Useful life") {

      fieldData.forEach((o) => {
        if (o.name === "DepreciationLevel") {
          o.disabled = true; o.defaultValue = "Asset"; form.setValue(o.name, "Asset")
        }
        if ((o.name == "FormulaCalculationTypeId" && depMethod == "WDV") || (o.name !== "DepreciationLevel")) {
          o.isDisplay = true; o.disabled = false

        }
        if (o.name == "FormulaCalculationTypeId" && depMethod == "SLM") {
          o.isDisplay = false; form.setValue(o.name, "Net Book Value & Remaining Useful Life")
        }

      })




    } else {

      fieldData.forEach((o) => {
        if (o.name == "SalvageValueRate" || o.name == "SalvageValueToConsider" || o.name == "FormulaCalculationTypeId" || o.name == "LifeToConsider") { o.isDisplay = false; form.setValue(o.name, "") }
      })
    }



    if (watch("IsWriteOffApplicable")) {
      fieldData.forEach((o) => {
        if (o.name == "WriteOffValue" || o.name == "WriteOffType") { o.isDisplay = true; } 
        if (fieldsToDisable.includes(o.name) && bookCatForEdit.length>0) {
          o.disabled = true
        }
      })
    } else {
      fieldData.forEach((o) => {
        if (o.name == "WriteOffValue" || o.name == "WriteOffType") { o.isDisplay = false; form.setValue(o.name, (o.name == "WriteOffType") ? "Proportionate Dep Calculation" : "") }
      
        if (fieldsToDisable.includes(o.name) &&  bookCatForEdit.length>0) {
          o.disabled = true
        }
      })
     
      if(editingRecordId){

      }

    }
    setFields(fieldData)
  }
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsAddDialogOpen(false);
  // };
  const triggerAccordionItemsValidations = async () => {

    await trigger();
    // handleSubmit(()=>{})()

  }
  const handleAddCategory = (e) => {
    if (dataSource.length === 0) {
      const isValidationFailed = fields.filter(f => f.isDisplay && f.isRequired).every(f => form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
      triggerAccordionItemsValidations()
      if (!isValidationFailed) {
        setValidationTrigger(true)
        msg.warning("Please fill all the required fields");
        return;
      }
    }

    if (dataSource.length === 0) {
      let form = fields
      form.forEach((obj) => {
        if (fieldsToDisable.includes(obj.name)) {
          obj.disabled = true
        }
      })

      setFields(form)
    }
    setDataSource([...dataSource, { ...defaultRow, key: (dataSource.length + 1), DepreciationMethodName: watch("DefaultDepreciationMethod") }])
  };



  const renderField = (field: BaseField) => {
    let fieldsToShowInEdit: string[] = ['Status', 'Notify']
    const { name, label, fieldType, isRequired, validationPattern, patternErrorMessage, show = true } = field;
    //  const overrideShow = !show && fieldsToShowInEdit.includes(name) && !isCreateMode;
    //  const branchLabel=lastLevelsData?.Branch
    if (!field.isDisplay) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is required` : false,
      ...(name === "DepreciatedValueRoundOffUpTo" && {
        validate: (value) => {
          return value >= 0 && value <= 2 ? true : "Value should be between 0 and 2";
        },
      }),
    }



    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}

                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableTextarea
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                defaultValue={name === 'salvagevalue_unit' ? '%' : ''}
                // usePortal={false}
                {...field}
                // disabled={}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'multiselect':
        return (
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              rules={validationRules}
              render={({ field: ctrl }) => (
                <ReusableMultiSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  error={errors[name]?.message as string}

                />
              )}
            />
          </div>
        );

      case 'upload':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableUpload
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'numeric':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                type="number"
                addonAfter={ctrl.name === "SalvageValueRate" ? selectAfter : undefined}
                addonAfterClassName={ctrl.name === "SalvageValueRate" ? "w-20" : ""}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}

              />
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableSingleCheckbox
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
              />
            )}
          />
        );

      case 'radiobutton': return (
        <Controller
          key={name}
          name={name}
          control={control}
          rules={validationRules}
          render={({ field: ctrl }) => (
            <ReusableRadio
              {...field}
              value={ctrl.value}
              onChange={ctrl.onChange}
              error={errors[name]?.message as string}
            />
          )}
        />
      );
      default:
        return null;
    }
  };

  const getDateAfterYears = (date: string | Date | null): string | null => {
    const months = 12;
    let result: string | null = null;

    if (date) {
      const inputDate = new Date(date);

      if (isNaN(inputDate.getTime())) {
        console.error("Invalid date format:", date);
        return null;
      }

      const futureDate = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth() + months,
        inputDate.getDate()
      );

      const previousDay = new Date(futureDate.getTime() - 24 * 60 * 60 * 1000);

      result = `${previousDay.getDate().toString().padStart(2, '0')}/${(previousDay.getMonth() + 1).toString().padStart(2, '0')
        }/${previousDay.getFullYear()}`;
    }

    return result;
  };

  const selectAfter = (

    <ReusableDropdown
      placeholder=' '
      options={[
        {
          label: "%",
          value: "%"
        },
        {
          label: "@",
          value: "@"
        },
      ]}
      onChange={(e) => { setSalvalueType(e) }}
      defaultValue={"%"} 
      className='parent [&>div:first-child]:pr-0 rounded-tl-none rounded-bl-none rounded-br-md rounded-tr-md' />
     




  )
  const settingOptions=(getdata,optionlabel, optionvalue,)=>{

    let opt1 = []
    let opt2 = []
    let opts;
    getdata?.forEach((element) => {
      if ("Book Category" === element.DepreciationLevel) {
        opt1.push(
          {
            "label": element[optionlabel],
            "value": element[optionvalue],
            "obj": element
          }
        )

      }
      if ("Asset" === element.DepreciationLevel) {
        opt2.push(
          {
            "label": element[optionlabel],
            "value": element[optionvalue],
            "obj": element
          }
        )
      }

    });

    if (watch("DepreciationLevel")  === "Book Category") {
      // opts = (bookId) ? opt1.filter((o) => o.value !== bookId) : opt1
      opts=opt1
    } else {
      // opts = (bookId) ? opt2.filter((o) => o.value !== bookId) : opt2
      opts=opt2
    }

     setCopyDepBookOpts(opts )
  }
   const settingCopyFromToDataSource = (catdata) => {
    if (catdata.length !== 0) {

      if (dataSource.length === 0) {
        let form = fields
      form.forEach((obj) => {
        if (fieldsToDisable.includes(obj.name) && obj.name!=="FYStartDate") {
          obj.disabled = true
        }
      })

      setFields(form)
      }
     
      let cd=catdata.map((i, ind) => {
        return { ...i, key: dataSource.length + (ind + 1),  }
      })

      setDataSource([...dataSource, ...cd]);

      setIsCopyFromOpen(false) 
    } else {
      msg.warning("There are no categories in the selected book");
    }

  }


      const handleSubmitFunction = () => {
let isBookCatScreen=(activeTab=="BookCat")

        if(!isBookCatScreen){
          //  if (!bookId) {
                submit()
          //   } else{
              // updateSubmit()}
        }else{

            const isValidationFailed = fields.filter(f => f.isDisplay && f.isRequired).every(f => form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
   
      if (!isValidationFailed) {
        setValidationTrigger(true)
       msg.warning("Please Enter Mandatory Fields In Book");
        return;
      }else{
          submit()
        //  UpdateBookCategory()
      }
        }
     
 
    };
     const submit = () => {
        var payloadObj = {
            "BookDetails": getPayLoadForBooks(""),
            "CategoryDetails": getPayLoadForcatDetails("")
        

        };
        console.log(payloadObj)
        addDepBookMasterDetailsAPI(companyId, payloadObj)
    }


      const settingBookCatForEdit=(data)=>{
        let catList=[]
       data.forEach((obj,i)=>{
          catList.push({...defaultRow,Key:i+1,...obj})
       })
       setDataSource(catList)
      }
     const getPayLoadForcatDetails = (key) => {
        let categoryDetails = [];
        if (dataSource.length != 0) {
            if (key === "update") {
                categoryDetails = dataSource.map((record, ind) => {
                    return {
                        "CategoryName": record["CategoryName"],
                        "GroupName": record["GroupName"],
                        "AdditionalDepreciationName": record["AdditionalDepreciationName"],
                        "DepreciationMethodName": record["DepreciationMethodName"],
                        "CategoryLife": record["CategoryLife"],
                        "CategoryRate": Number(record["CategoryRate"]),
                        "SalvageValueRate": Number(record["SalvageValueRate"]),
                        "ShiftApplicable": record["ShiftApplicable"],
                        "DoubleShiftRate": Number(record["DoubleShiftRate"]),
                        "TripleShiftRate": Number(record["TripleShiftRate"]),
                    }
                })
            } else {
                categoryDetails = dataSource.map((record, ind) => {
                    return {
                        "CategoryName": record["CategoryName"],
                        "GroupName":  record["GroupName"],
                        "AdditionalDepreciationName": record["AdditionalDepreciationName"],
                        "DepreciationMethodName": record["DepreciationMethodName"],
                        "CategoryLife": record["CategoryLife"],
                        "CategoryRate":record["CategoryRate"],
                        "SalvageValueRate": record["SalvageValueRate"],
                        "ShiftApplicable": record["ShiftApplicable"],
                        "DoubleShiftRate": record["DoubleShiftRate"],
                        "TripleShiftRate": record["TripleShiftRate"],
                    }
                })
            }
        }
        return (categoryDetails)

    }

     const getPayLoadForBooks = (key) => {
      let fyStartDate= watch("FYStartDate")
      let FYEndDate=watch("FYEndDate")
        return ([{
            "BookName": watch("BookName"),
            "Description": watch("Description"),
            "DepreciateBasedOn": watch("DepreciationBasedOn"),
            "DepreciationMethod": watch("DefaultDepreciationMethod"),
            "FirstFinancialYearStartDate": (typeof (fyStartDate) == "string") ? fyStartDate : formatDates(fyStartDate, 'DD/MM/YYYY'),
            "DepreciateWith": watch("DepreciateWith"),
            "DepreciationLevel": watch("DepreciationLevel"),
            "OverwriteSalvageValueFrom": watch("SalvageValueToConsider"),
            "SalvageValueRate": watch("SalvageValueRate"),
            "SalvageValueType": salvalueType,
            "FirstYearConventionType": watch("FirstYearDepreciationConventions"),
            "OverWriteAssetLifeFrom": watch("LifeToConsider"),
            "IsWriteOffApplicable": watch("IsWriteOffApplicable")?true:false,
            "WriteOffValue": watch("WriteOffValue"),
            "WriteOffType": watch("WriteOffType"),
            "IsForexApplicable": watch("IsForexApplicable")?true:false,
            "IsRevaluationApplicable": watch("IsRevaluationApplicable")?true:false,
            "AssetIndependentCalulation": watch("AssetIndependentCalulation")?true:false,
            "IsRequiredBackDateEntry": watch("IsRequiredBackDateEntry")?true:false,
            "DepreciatedValueRoundOffUpTo": watch("DepreciatedValueRoundOffUpTo"),
            "FormulaCalculationTypeId": watch("FormulaCalculationTypeId"),
            "FirstFinancialYearEndDate": (key == "update") ?(typeof (FYEndDate) == "string") ? FYEndDate : formatDates(FYEndDate, 'DD/MM/YYYY'): undefined
        }])
    }


  //apis
    const getAdditionalDepreciationListAPI = async () => {
          dispatch(setLoading(true))
          await GetAdditionalDepreciationBookDetails(companyId).then(res => {
              if (res.success && res.data.status === undefined) {
                let data=res.data.AdditionalDepreciationDetails
                let opts=[]
                   data?.forEach((element) => {
                opts.push(
                    {
                        "label": element["Name"],
                        "value": element["Name"],
                        "obj": element
                    }
                )

            })
                opts.push({
                "value": "None",
                "label": "None",
            })

                  setAdditionalDepOptions(opts)
              } else {
                  setAdditionalDepOptions([
      {
        "value": "None",
        "label": "None",
      }
    ],);
              }
          })
              .catch(err => {
              }).finally(() => {
                  dispatch(setLoading(false));
              })
      }
  const addDepBookMasterDetailsAPI=async (companyId,payload)=>{
     dispatch(setLoading(true));
            await AddDepBookMasterDetails(companyId, payload).then(res => {
              if (res.success) {
                if (res.data.status) {
                  msg.success(res.data.message);
                 navigate("/masters/depreciation/book")
                } else if(res.data.status==false){
                  msg.warning(res.data.message || 'Failed to Add Book!!')
                }else {
                msg.warning(res.data.ErrorDetails[0]["Error Message"]||'Failed to Add Book !!')
              }
              } 
    
            }).catch(err => { { } }).finally(() => { dispatch(setLoading(false)) })
  }
  
   const GetBookCatListByIdAPI = async (compid, id) => {
    dispatch(setLoading(true));
    await GetBookCatListById(compid, id).then((res) => {

         if (res.success && res.data && res.data.status !== false) {
        if (Array.isArray(res.data.BookCategoryDetails)) {
               settingCopyFromToDataSource(res.data.BookCategoryDetails)
               if(id){
                settingBookCatForEdit(res.data.BookCategoryDetails)
                setBookCatForEdit(res.data.BookCategoryDetails)
               }
        } else {
          setBooksData([])
          setBookCatForEdit([])
        }

      } else {
        setBooksData([])
        setBookCatForEdit([[]])
      }

      
    }).catch(() => { })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }
  

  let getBookDataAPI = async () => {
    //  dispatch(loaderEnable());
    await GetDepreciationBookDetails(companyId).then((res) => {
      if (res.success && res.data) {
        if (Array.isArray(res.data.BookDetails)) {
        settingOptions(res.data.BookDetails,"BookName","BookID")
        } else {
          setBooksData([])
        }

      } else {
        setBooksData([])
      }
    }).catch(() => { })
      .finally(() => {
        // dispatch(loaderDisable());
      });

  }

  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
    const groupForm = useForm<GenericObject>({
    defaultValues:{GroupName:'',GroupDescription:''},
    mode: 'onChange',
    reValidateMode: "onChange"
  });

  //CRUD of Group Category By Ganesh Kalyanam
  const {control:groupControl, watch:groupWatch, setValue:groupSetValue,handleSubmit:groupHandleSubmit,reset:groupReset,formState:{errors:groupErrors}}=groupForm
  const [groupData,setGroupData]=useState([])
  const groupCols = [
    { header: "Group Name", accessorKey: "GroupName" },
    { header: "Description", accessorKey: "GroupDescription" },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <ReusableButton
            variant="text"
            size="small"
            onClick={() =>{ setEditingGroupData(row.original);groupReset({...row.original})}}
          >
            <Edit className="h-4 w-4" />
          </ReusableButton>
          <ReusableButton
            variant="text"
            size="small"
            danger
            onClick={() =>handleDeleteGroup( row.original?.GroupId)}
          >
            <Trash2 className="h-4 w-4" />
          </ReusableButton>
        </div>
      ),
    },
  ];
  const [editingGroupData,setEditingGroupData]=useState(null)
  useEffect(()=>{
    if(companyId && editingRecordId){
      getGroupCategoriesData()
      GetBookDetailsByIdAPI()

    }
  },[companyId,editingRecordId])
   const GetBookDetailsByIdAPI = async () => {
    dispatch(setLoading(true));
    try {
      const res = await GetBookDetailsById(companyId, String(editingRecordId));
      console.log(res.data)
      if(res.data && res.data?.status===undefined ){
       setValuesForEdit(res.data["BookDetails"][0])
      setIsDepRan(res.data["BookDetails"][0]["IsRanDep"])
      GetBookCatListByIdAPI(companyId, String(editingRecordId))
      }else{
        
      }
    } catch { } finally { dispatch(setLoading(false)) }
  }
   const setValuesForEdit = (details) => {
    console.log(details,"dd")
        setSalvalueType(details["SalvageValueType"])
       form.reset({...form.getValues(),...details})
    };

  useEffect(()=>{
   if(groupData){
    let groupOpts=[]
      groupData?.forEach((element) => {
                groupOpts.push(
                    {
                        "label": element["GroupName"],
                        "value": element["GroupName"],
                        "obj": element
                    })
            })

            setGroupOptions([])
   }
  },[groupData])

  const getGroupCategoriesData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await GetGroupByBookIdDetails(companyId, String(editingRecordId));
      if(res.data && res.data?.status===undefined && Array.isArray(res.data)){
        setGroupData(res.data);
      }else{
        setGroupData([])
      }
    } catch { } finally { dispatch(setLoading(false)) }
  }
  const handleSaveGroup = async () => {
    const payload = {
      GroupMasterDetails: [
        { GroupName: groupWatch('GroupName'), GroupDescription: groupWatch('GroupDescription') }
      ]
    }
    if (editingGroupData) {
      dispatch(setLoading(true))
      try {
        const res = await UpdateGroupCategoryDetails(companyId, String(editingRecordId), editingGroupData?.GroupId, payload);
        if (res?.data?.status) {
          msg.success(res.data.message);
          groupReset();
          getGroupCategoriesData();
          setEditingGroupData(null)
        } else {
          msg.warning(res?.data?.message || 'Unable to update group category!!')
        }
      } catch { } finally { dispatch(setLoading(false)) }
    } else {
      dispatch(setLoading(true))
      try {
        const res = await AddGroupCategoryDetails(companyId, String(editingRecordId), payload);
        if (res?.data?.status) {
          msg.success(res.data.message);
          groupReset();
          getGroupCategoriesData();
        } else {
          msg.warning(res?.data?.message || 'Unable to add group category!!')
        }
      } catch { } finally { dispatch(setLoading(false)); }
    }
  }
  const handleDeleteGroup=async(id)=>{
    dispatch(setLoading(true))
    try{
      const res = await DeleteGroupById(companyId,id);
      if(res?.data?.status){
        msg.success(res.data.message);
        getGroupCategoriesData();
      }else{
        msg.warning(res?.data?.message || 'Unable to delete group category !!')
      }
    }catch{}finally{dispatch(setLoading(false))}
  }
  return (



    <div className="h-full overflow-y-scroll bg-gray-50/30">
      <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Masters</span>
            <span>/</span>
            <span>Depreciation</span>
            <span>/</span>
            <span className='cursor-pointer' onClick={() => { navigate("/masters/depreciation/book") }}>Books</span>
            <span>/</span>
            <span className="text-foreground font-medium">Add Book</span>
          </div>
        </div>
      </header>
      <div className="p-4 pt-3 space-y-4">
        <div className='ps-3'>
          <h1 className="text-3xl font-bold text-gray-900">Add Book</h1>
        </div>
        <Card className="border-0 shadow-sm ">
          <CardHeader className="pb-2 pt-2">
            <div className='mt-2 p-2'>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="BookDetails">Book Details</TabsTrigger>
                    <TabsTrigger value="BookCat">Book Category Details</TabsTrigger>
                  </TabsList>
                  <div className='flex items-center gap-2'>
                    {/* <ReusableButton
                                                            variant="text"
                                                    
                                                            onClick={() => { navigate("/masters/company/customer")}}
                                                            icon={""}
                                                          >
                                                           Back
                                                          </ReusableButton> */}
                    <ReusableButton
                      variant="primary"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => { handleSubmit(handleSubmitFunction)()}}


                    >
                      Add
                    </ReusableButton>
                  </div>
                </div>

                <TabsContent value="BookDetails" className="space-y-4">
                  <div className="flex-1 flex flex-col min-w-0 ">

                    {/* Content Grid with Individual Scroll Areas */}
                    <div className="flex-1 p-3 overflow-hidden min-h-0  ">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                          <ScrollArea className="flex-1  ">
                            <div className="space-y-6 pr-1">
                              <div className="space-y-6">

                                <div className='grid md:grid-cols-3 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                                  {
                                    fields.map(obj => {
                                      if (obj.fieldType === "heading") {
                                        return <h3 key={obj.text} className='text-lg font-semibold text-gray-900 border-b col-span-full pb-2'>{obj.text}</h3>
                                      }
                                      // if (obj.name == "SalvageValueRate") {
                                      //   return (
                                      //     <React.Fragment key={obj.name}>
                                      //       {/* <div className='flex'>
                                      //         <div className='w-[20rem]'>{getFieldsByNames(['SalvageValueRate']).map(renderField)}</div>
                                      //         <div className='flex items-center mt-[28px]'>{getFieldsByNames(['salvagevalue_unit']).map(renderField)}</div>
                                      //       </div> */}


                                      //     </React.Fragment>
                                      //   )

                                      // }else

                                      if (!(obj.name == "salvagevalue_unit")) { return (renderField(obj)) }
                                    })
                                  }
                                </div>

                              </div>
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="BookCat" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ReusableDatePicker
                        label="Effective From"
                        value={effectiveFrom}
                        disabled={true}
                        onChange={() => { }}
                        placeholder="DD/MM/YYYY"
                      />
                      {
                        editingRecordId &&     <div className="flex items-center gap-2 mt-6">
                        <span className="text-blue-600 cursor-pointer" onClick={()=>{
                            // setIsFinancialYearOpen(true)
                            setIsNewFYOpen(true)
                          
                        }}>Add New Financial Year</span>
                        {/* <ReusableButton variant="default" size="small" icon={<ChevronLeft className="h-4 w-4" />} />
                        <ReusableButton variant="default" size="small" icon={<ChevronRight className="h-4 w-4" />} className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white" /> */}
                        <ReusableButton
                                                            variant="default"
                                                            size="small"
                                                            className={`bg-hsl(24.12deg 100% 80%)`}
                                                            onClick={() => { 
                                                              // handleWindow("Dec");
                                                             }}
                                                        >
                                                            <span>
                                                                {<FaAngleLeft className="h-2 w-2" />}
                                                            </span>
                                                        </ReusableButton>
                        
                                                        <ReusableButton
                                                            // variant=""
                                                            size="small"
                                                            className={`bg-hsl(24.12deg 100% 80%) `}
                                                            onClick={() => { 
                                                              // handleWindow("Inc"); 
                                                            }}
                                                        >
                                                            <span>
                                                                {<FaAngleRight className="h-2 w-2" />}
                                                            </span>
                                                        </ReusableButton>
                      </div>
                      }
                  
                    </div>
                    <div className="flex gap-2">
                      <ReusableButton variant="default" onClick={() => { setIsCopyFromOpen(true) }}>Copy From</ReusableButton>
                      {editingRecordId && <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500" onClick={()=>setIsAddGroupOpen(true)}>Add Group</ReusableButton>}
                      <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500" onClick={handleAddCategory}>Add Category</ReusableButton>
                    </div>
                  </div>

                  <div>
                    {dataSource?.length > 0 && <ReusableTable data={dataSource} columns={tableColumnsData} enableSearch={false}
                      enableColumnVisibility={false}
                      enableExport={false}
                      enableSorting={false}
                      enableFiltering={false}
                      headerContentClassName={"justify-center "}
                    />
                    }
                  </div>

                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
          </CardContent>
        </Card>

        {/* Main Category Dialog */}


      </div> 

      {/* financial Year modal */}
                          <Dialog open={isNewFYOpen}
                              onOpenChange={(open) => {
                                  setIsNewFYOpen(open);
                                  if (!open) {
                                      // handleCancel(); 
                                  }
                              }}
                          >
                              <DialogTrigger asChild>
                              </DialogTrigger>
                              <DialogContent className="w-full max-w-[60rem] h-[31rem]">
                                  <DialogHeader>
                                      <DialogTitle>Add New Financial Year</DialogTitle>
                                  </DialogHeader>
                                  <div className='grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                      <div className="flex items-center space-x-2">
                                           <ReusableDatePicker
                        label="Effective From"
                        value={effectiveFrom}
                        disabled={false}
                        onChange={() => { }}
                        placeholder="DD/MM/YYYY"
                      />
                                      </div>
                                  </div>
                                  <div className="pt-0 max-h-[400px] overflow-y-scroll">
                                      <ReusableTable
                                          data={modalDatasource}
                                          columns={financialYearColumns}
                                          // permissions={tablePermissions}
                                          title=""
                                          enableSearch={false}
                                          enableSelection={false}
                                          // enableExport={true}
                                          enableColumnVisibility={true}
                                          enablePagination={true}
                                          enableSorting={true}
                                          enableFiltering={true}
                                          pageSize={5}
                                          emptyMessage="No user groups found"
                                          rowHeight="normal"
                                          storageKey="usergroups-table"
                                      />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                      <ReusableButton
                                          htmlType="submit"
                                          variant="primary"
                                          className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                          onClick={()=>{}
                                            // handleSubmit(() =>
                                            //  submit("true")
                                            // )
                                            }
                                      >
                                          Save
                                      </ReusableButton>
                                  </div>
                              </DialogContent>
                          </Dialog>
      <Dialog open={isCopyFromOpen}
        onOpenChange={(open) => {
          setIsCopyFromOpen(open);
          if (!open) {
            // handleCancel();
          }
        }}
      >
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()} >
          <DialogHeader>
            <DialogTitle>Copy Book Categories</DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>

            <div className="flex items-center space-x-2">
              <ReusableDropdown
                usePortal={false}
                containerClassName=" p-2"
                className='h-8 border-2 '
                placeholder="select book"
                options={copyDepBookOpts}
                allowClear={false}
                defaultValue={""}
                onChange={(e) => { setSelectedGroup(e) }}
                backgroundColor="white"
                size={"small"}

              ></ReusableDropdown>

            </div>


          </div>
          <div className="flex justify-end gap-2">

            <ReusableButton
              htmlType="submit"
              variant="primary"
              className="bg-orange-500 hover:bg-orange-600 border-orange-500"
              onClick={
                handleCopyFromSubmit
              }
            >
              Submit
            </ReusableButton>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddGroupOpen}
        onOpenChange={(open) => {
          setIsAddGroupOpen(open);
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Group</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 overflow-hidden flex-1 p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Controller
                key="GroupName"
                name="GroupName"
                control={groupControl}
                render={({ field: ctrl }) => (
                  <ReusableInput
                    label="Group Name"
                    placeholder="Group Name"
                    maxLength={100}
                    value={ctrl.value}
                    onChange={ctrl.onChange}
                    error={groupErrors["GroupName"]?.message as string}
                  />
                )}
              />

              <Controller
                key="GroupDescription"
                name="GroupDescription"
                control={groupControl}
                render={({ field: ctrl }) => (
                  <ReusableInput
                    label="Group Description"
                    placeholder="Group Description"
                    maxLength={100}
                    value={ctrl.value}
                    onChange={ctrl.onChange}
                    error={groupErrors["GroupDescription"]?.message as string}
                  />
                )}
              />
            </div>
            <div className="flex justify-end gap-2 shrink-0">
              <ReusableButton variant="default" onClick={groupReset}>
                Clear
              </ReusableButton>

              <ReusableButton
                htmlType="submit"
                variant="primary"
                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                onClick={handleSaveGroup}
              >
                {editingGroupData?'Update':'Save'}
              </ReusableButton>
            </div>
            <ScrollArea className="flex-1 overflow-y-auto rounded-md border bg-gray-50/30">
              <ReusableTable
                title="List of Groups"
                data={groupData}
                columns={groupCols}
                enableExport={false}
              />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddBook