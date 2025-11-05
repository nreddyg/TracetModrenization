
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/common/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GetAdditionalDepreciationBookDetails, GetDepreciationBookDetails } from '@/services/BookServices';
import dayjs from 'dayjs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Controller, useForm } from 'react-hook-form';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { ReusableRichTextEditor } from '@/components/ui/reusable-rich-text-editor';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { BOOKS_DB } from '@/Local_DB/Form_JSON_Data/BooksDB';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
// import { Select } from '@radix-ui/react-select';

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
    CategoryRate:"0",
    Usefullife:"0",
    SalvageValueRate:"0",
    ShiftApplicable:"NO",
    DoubleShiftRate:"0",
    TripleShiftRate:"0"

    // cellsData: cellsData,
};
const fieldsToDisable = ["DepreciateWith", "DepreciationLevel", "SalvageValueToConsider", "LifeToConsider", "FYStartDate"]

const AddBook = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [booksData, setBooksData] = useState([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [fields, setFields] = useState<BaseField[]>(BOOKS_DB);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('BookDetails');
  const [effectiveFrom,setEffectiveFrom]=useState("")
      const [dataSource, setDatasource] = useState([]);
      const [isFinancialYearOpen,setIsFinancialYearOpen]=useState(false)
  const navigate = useNavigate()
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
    reValidateMode:"onChange"
  });
  
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const [formData, setFormData] = useState({
    bookName: '',
    description: '',
    depreciationBasedOn: '',
    defaultDepreciationMethod: '',
    fyStartDate: null as Date | null,
    fyEndDate: null as Date | null,
    depreciateWith: '',
    depreciationLevel: '',
    salvageValueToConsider: '',
    salvageValue: '0',
    salvageValueUnit: '%',
    firstYearConventions: '',
    forexGainLoss: false,
    revaluationApplicable: false,
    writeOffApplicable: false,
    backdatedEntry: false,
    dependentAsset: false,
    roundOffValue: '2',
  });


useEffect(()=>{
if(activeTab=="BookDetails"){
  if(dataSource.length!==0){
    setTimeout(()=>{
triggerAccordionItemsValidations()
    },10)

  }

}
},[activeTab])


     const tableColumnsData = [
       {
      header: "S.No",
      accessorKey: "key",
      id:"key",
         size:50,
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
                         <ReusableInput
                          value={row.original.GroupName}
                          onChange={(e) => handleChange(e.target.value, row.id, "GroupName")}
                          name='GroupName'
                          // placeholder='Enter License key'
                          isRequired={true}
                          className='m-2 mt-0 me-0 bg-white border-2'
                          size='small'
                      ></ReusableInput>
  
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
       
           ...(form.watch("DepreciationLevel") ==  "Book Category"? [
              {
                  accessorKey: "AdditionalDepreciationName",
                  header: "Additional Depreciation",
                  cell: ({ row }) => (
  
                      <span className='flex' >
                         <ReusableDropdown
                          containerClassName=" p-2"
                          className='h-8 border-2 '
                          placeholder=" "
                          options={[]}
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
        ...(form.watch("DepreciateWith") == "Rate"? [
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
      ...(form.watch("DepreciateWith") === "Useful life" && form.watch("LifeToConsider") ===  "Book Category" ? [
              {
                  accessorKey:"CategoryLife",
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
               ...(form.watch("DepreciationLevel") ===  "Asset" && form.watch("SalvageValueToConsider") ===  "Book Category" ? [
              {
                  accessorKey:"SalvageValueRate",
                  header:"Salvage value (%)",
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
                              { label: "Active", value: "Active" }, { label: "Expired", value: "Expired" }, { label: "Suspended", value: "Suspended" },
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
                  accessorKey:"DoubleShiftRate",
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
                  accessorKey:"TripleShiftRate",
                  header:"Triple Shift Rate",
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
  
                      { <Trash2 height={18} className='text-red-400 cursor-pointer '
                          onClick={() => handleRowDelete(row)} />}
  
             
                  </div>
              )
          },
  

      ]
      console.log(tableColumnsData,"tabledata",watch("depreciationLevel"))
      
         const handleRowDelete = (row) => {
        console.log("row", row.id)
        const data = [...dataSource]
        data.splice(row.id, 1)
        if(data.length<=0){
          settingFieldDependencies()
        }
        setDatasource(data)

     

    }
 function handleChange(val, id, accessorKey) {
        let data = dataSource
        //  data.forEach((obj)=>{
        //     if(obj.key==id){
        //         obj[accessorKey]=val
        //     }
        //  })
        data[parseInt(id)][accessorKey] = val
        setDatasource(data)
    }
  useEffect(() => {
    getBookDataAPI()
  }, [])
  useEffect(() => {
    let calculatedDate = getDateAfterYears(watch("FYStartDate"));
    form.setValue("FYEndDate", calculatedDate)
    setEffectiveFrom(calculatedDate)
  }, [watch("FYStartDate")])

  //handling change dependencies
  useEffect(() => {
settingFieldDependencies()
  }, [watch("DefaultDepreciationMethod"), watch("DepreciateWith"), watch("DepreciationLevel"), watch("IsWriteOffApplicable")])

const settingFieldDependencies=()=>{
    let depMethod = watch("DefaultDepreciationMethod")
    let depreciateWith = watch("DepreciateWith")
    let depreciationLevel = watch("DepreciationLevel")
    let fieldData = structuredClone(fields)
 
      
        if (depreciateWith == "Rate") {
          fieldData.forEach((o) => {
            if (depreciationLevel == "Asset") {
              if ((o.name !== "FormulaCalculationTypeId" && o.name !== "LifeToConsider")) { o.isDisplay = true;(o.name=="FYEndDate")?o.disabled = true:o.disabled = false }else{
                o.isDisplay=false,form.setValue(o.name,o.name=="FormulaCalculationTypeId"?"Net Book Value & Remaining Useful Life":"Book Category")
              }
            } else if (depreciationLevel == "Book Category") {
     
              if ((o.name === "LifeToConsider" || o.name == "SalvageValueToConsider" || o.name == "SalvageValueRate" || o.name == "FirstYearDepreciationConventions" || o.name == "FirstYearDepreciationConventions" || o.name == "IsWriteOffApplicable" || o.name == "IsForexApplicable" || o.name == "IsRevaluationApplicable" || o.name == "AssetIndependentCalulation" || o.name == "AssetIndependentCalulation" || o.name == "IsRequiredBackDateEntry" || o.name == "FormulaCalculationTypeId")) { 
                o.isDisplay = false; 
                setValue(o.name,o.name=="LifeToConsider"||o.name=="SalvageValueToConsider"? "Book Category":o.name=="SalvageValueRate"?"0":o.name=="FormulaCalculationTypeId"?"Net Book Value & Remaining Useful Life":"")
               }else{
                o.isDisplay = true; (o.name=="FYEndDate")?o.disabled = true:o.disabled = false
            }
            }
          })
        } else if (depreciateWith == "Useful life") {

          fieldData.forEach((o) => {
            if (o.name === "DepreciationLevel") {
              o.disabled = true;o.defaultValue = "Asset";form.setValue(o.name, "Asset")
            }
            if ((o.name == "FormulaCalculationTypeId" && depMethod=="WDV") || (o.name !== "DepreciationLevel") ) {
              o.isDisplay = true; o.disabled = false
          
            }
             if(o.name == "FormulaCalculationTypeId" && depMethod=="SLM"){
                o.isDisplay = false;form.setValue(o.name,"Net Book Value & Remaining Useful Life")
            }

          })




        } else {

          fieldData.forEach((o) => {
            if (o.name == "SalvageValueRate" || o.name == "SalvageValueToConsider" || o.name == "FormulaCalculationTypeId" || o.name == "LifeToConsider") { o.isDisplay = false; form.setValue(o.name, "") }
          })
        }
      

      if (watch("IsWriteOffApplicable")) {
        fieldData.forEach((o) => {
          if (o.name == "WriteOffValue" || o.name == "WriteOffType") { o.isDisplay = true; } else {

          }
        })
      } else {
        fieldData.forEach((o) => {
          if (o.name == "WriteOffValue" || o.name == "WriteOffType") { o.isDisplay = false; form.setValue(o.name,( o.name == "WriteOffType")?"Proportionate Dep Calculation": "") } else {

          }
        })
      

    }
    setFields(fieldData)
}
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Book data:', formData, bookCategoryData);
  //   setIsAddDialogOpen(false);
  // };
 const triggerAccordionItemsValidations=async()=>{
  
    await trigger();
    // handleSubmit(()=>{})()
   
  }
  const handleAddCategory = (e) => {

//     const isValidationFailed = fields.filter(f => f.isRequired).every(f=>form.getValues()[f.name] !== undefined && form.getValues()[f.name] !== null && form.getValues()[f.name] !== '');
// triggerAccordionItemsValidations()
//     if (!isValidationFailed) {
//       return;
//     }
      if (dataSource.length === 0) {
        let form = fields
        form.forEach((obj) => {
          if (fieldsToDisable.includes(obj.name)) {
            obj.disabled = true
          }
        })

        setFields(form)
      }
 setDatasource([...dataSource, { ...defaultRow, key: (dataSource.length+1),DepreciationMethodName:watch("DefaultDepreciationMethod") }]) 
  };



  const renderField = (field: BaseField) => {
    let fieldsToShowInEdit: string[] = ['Status', 'Notify']
    const { name, label, fieldType, isRequired,  validationPattern, patternErrorMessage, show = true } = field;
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
      defaultValue={"%"} className='parent [&>div:first-child]:pr-0 rounded-tl-none rounded-bl-none rounded-br-md rounded-tr-md' />




  )
  //apis
  let getBookDataAPI = async () => {
    //  dispatch(loaderEnable());
    await GetDepreciationBookDetails("111").then((res) => {
      if (res.success && res.data) {
        if (Array.isArray(res.data.BookDetails)) {
          setBooksData(res.data.BookDetails)
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
                          onClick={() => { handleSubmit(()=>{})() }}
                      
                      
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
                        onChange={()=>{}}
                        placeholder="DD/MM/YYYY"
                      />
                      <div className="flex items-center gap-2 mt-6">
                        <span className="text-blue-600 cursor-pointer" onClick={()=>{
                            // setIsFinancialYearOpen(true)
                          
                        }}>Add New Financial Year</span>
                        <ReusableButton variant="default" size="small" icon={<ChevronLeft className="h-4 w-4" />} />
                        <ReusableButton variant="default" size="small" icon={<ChevronRight className="h-4 w-4" />} className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ReusableButton variant="default">Copy From</ReusableButton>
                      {/* <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500">Add Group</ReusableButton> */}
                      <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500" onClick={handleAddCategory}>Add Category</ReusableButton>
                    </div>
                  </div>
              
                  <div>
                   {dataSource?.length>0 && <ReusableTable data={dataSource} columns={tableColumnsData} enableSearch={false}
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
          <Dialog open={isFinancialYearOpen}
                                    onOpenChange={(open) => {
                                        setIsFinancialYearOpen(open);
                                        if (!open) {
                                            // handleCancel();
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>{"Add Main Location"}</DialogTitle>
                                        </DialogHeader>
                                        <div>
                                                  <ReusableTable data={dataSource} columns={tableColumnsData} enableSearch={false}
                                                                enableColumnVisibility={false}
                                                                enableExport={false}
                                                                enableSorting={false}
                                                                enableFiltering={false}
                                                                headerContentClassName={"justify-center "}></ReusableTable>

                                    </div>
                                    </DialogContent>
                                </Dialog>

      </div>

    </div>




  )
}

export default AddBook