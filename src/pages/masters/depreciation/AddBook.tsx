
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
import { Select, SelectContent, SelectItem, SelectTrigger , SelectValue} from '@/components/ui/select';
import { } from '@radix-ui/react-select';
// import { Select } from '@radix-ui/react-select';

interface Book {
  id: string;
  name: string;
  depreciateWith: string;
  depreciateLevel: string;
  depreciationOn: string;
  fyStartDate: string;
}

const booksData: Book[] = [
  {
    id: '1',
    name: 'Basic Dep Rules',
    depreciateWith: 'Rate',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '01/04/2024',
  },
  {
    id: '2',
    name: 'importBook9',
    depreciateWith: 'Rate',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '01/03/2025',
  },
  {
    id: '3',
    name: 'test1',
    depreciateWith: 'Rate',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '05/03/2025',
  },
  {
    id: '4',
    name: 'book1',
    depreciateWith: 'Rate',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '07/03/2025',
  },
  {
    id: '5',
    name: 'book2',
    depreciateWith: 'Useful life',
    depreciateLevel: 'Asset',
    depreciationOn: 'Placed In Service Date',
    fyStartDate: '12/03/2025',
  },
  {
    id: '6',
    name: 'book3',
    depreciateWith: 'Rate',
    depreciateLevel: 'Book Category',
    depreciationOn: 'Purchase Date',
    fyStartDate: '11/03/2025',
  },
  {
    id: '7',
    name: 'hj',
    depreciateWith: 'Useful life',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '18/03/2025',
  },
  {
    id: '8',
    name: 'book5',
    depreciateWith: 'Rate',
    depreciateLevel: 'Asset',
    depreciationOn: 'Purchase Date',
    fyStartDate: '24/03/2025',
  },
];

const depreciationBasedOnOptions = [
  { value: 'purchase-date', label: 'Purchase Date' },
  { value: 'placed-in-service', label: 'Placed In Service Date' },
];

const depreciationMethodOptions = [
  { value: 'slm', label: 'SLM' },
  { value: 'wdv', label: 'WDV' },
  { value: 'units-of-production', label: 'Units Of Production' },
];

const depreciateWithOptions = [
  { value: 'rate', label: 'Rate' },
  { value: 'useful-life', label: 'Useful life' },
];

const depreciationLevelOptions = [
  { value: 'asset', label: 'Asset' },
  { value: 'book-category', label: 'Book Category' },
];

const salvageValueOptions = [
  { value: 'book-category', label: 'Book Category' },
  { value: 'asset', label: 'Asset' },
];

const AddBook = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [booksData, setBooksData] = useState([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [fields, setFields] = useState<BaseField[]>(BOOKS_DB);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('BookDetails');
  const navigate = useNavigate()
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
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

  const [bookCategoryData, setBookCategoryData] = useState({
    effectiveFrom: null as Date | null,
    categories: [
      {
        sNo: 1,
        bookCategory: '',
        group: '',
        depreciationMethod: 'slm',
        rate: '0',
        salvageValue: '0',
      },
    ],
  });

  const filteredBooks = booksData.filter(book =>
    book.BookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.DepreciateWith.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.DepreciateLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getBookDataAPI()
  }, [])
  useEffect(() => {
    let calculatedDate = getDateAfterYears(watch("FYStartDate"));
    form.setValue("FYEndDate", calculatedDate)
  }, [watch("FYStartDate")])
  const columns = [
    {
      id: 'BookName',
      header: "Book Name",
      accessorKey: 'BookName',

    },
    {
      id: 'DepreciateWith',
      header: 'Depreciate With',
      accessorKey: 'DepreciateWith',

    },
    {
      id: 'DepreciationLevel',
      header: 'Depreciate Level',
      accessorKey: 'DepreciationLevel',
    },
    {
      id: 'DepreciationBasedOn',
      header: 'Depreciation On',
      accessorKey: 'DepreciationBasedOn',

    },
    {
      id: 'FYStartDate',
      header: 'FY Start Date',
      accessorKey: 'FYStartDate',
      cell:
        ({ row }) => (

          dayjs(row.getValue('FYStartDate')).format('DD/MM/YYYY')
        ),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <ReusableButton
            variant="text"
            size="small"
            //   icon={<Edit className="h-4 w-4" />}
            onClick={() => {
              // setSelectedStore(row.original);setRecordToEditId(row.original.StoreId);fetchStoreDataByStoreId(companyId,row.original.StoreId) 
            }}
          >
            Edit
          </ReusableButton>
          <ReusableButton
            variant="text"
            size="small"
            danger
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => {
              // setIsDelModalOpen(true);setRecordToEditId(row.original.StoreId);console.log(row.original),"C"
            }}
          >
            Delete
          </ReusableButton>
        </div>
      ),
    },
  ];

  //handling change dependencies
  useEffect(()=>{
    let  depMethod=watch("DefaultDepreciationMethod")
          let depreciateWith=watch("DepreciateWith")
      let  depreciationLevel=watch("DepreciationLevel")
      let fieldData=structuredClone(fields)
   if(depMethod=='SLM' ){
    {   
      if(depreciateWith=="Rate" ){
      fieldData.forEach((o)=>{
        if(depreciationLevel=="Asset"){
         if((o.name!=="FormulaCalculationTypeId" && o.name!=="LifeToConsider") ){o.isDisplay=true;o.disabled=false}
        }else if(depreciationLevel=="Book Category"){
         if((o.name==="LifeToConsider" || o.name=="SalvageValueToConsider"|| o.name=="SalvageValueRate"|| o.name=="FirstYearDepreciationConventions" ||o.name=="FirstYearDepreciationConventions"||o.name=="IsWriteOffApplicable"||o.name=="IsForexApplicable"||o.name=="IsRevaluationApplicable"||o.name=="AssetIndependentCalulation"||o.name=="AssetIndependentCalulation"||o.name=="IsRequiredBackDateEntry"||o.name=="FormulaCalculationTypeId") ){o.isDisplay=false;setValue(o.name,"")}
        }
         })
      }else if(depreciateWith=="Useful life")
      {
 fieldData.forEach((o)=>{
  if(o.name==="DepreciationLevel"){
    o.disabled=true;
    o.defaultValue="Asset";
    form.setValue(o.name,"Asset")
  }
  if(o.name!=="FormulaCalculationTypeId" && o.name!=="DepreciationLevel"){
o.isDisplay=true;o.disabled=false
  }
  
         })



        
      }else{

        fieldData.forEach((o)=>{
                if(o.name=="SalvageValueRate" || o.name=="SalvageValueToConsider" || o.name=="FormulaCalculationTypeId" || o.name=="LifeToConsider") {o.isDisplay=false;form.setValue(o.name,"")}
              })
      }
    }
    
    





   if(watch("IsWriteOffApplicable")){
      fieldData.forEach((o)=>{
                if(o.name=="WriteOffValue" || o.name=="WriteOffType" ) {o.isDisplay=true;}else{

                }
              })
   }else{
        fieldData.forEach((o)=>{
                if(o.name=="WriteOffValue" || o.name=="WriteOffType" ) {o.isDisplay=false;form.setValue(o.name,"")}else{

                }
              })
   }
  
  }
  setFields(fieldData)
  },[watch("DefaultDepreciationMethod"),watch("DepreciateWith"),watch("DepreciationLevel"),watch("IsWriteOffApplicable")])

 
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Book data:', formData, bookCategoryData);
  //   setIsAddDialogOpen(false);
  // };

  const handleAddCategory = () => {
    setBookCategoryData({
      ...bookCategoryData,
      categories: [
        ...bookCategoryData.categories,
        {
          sNo: bookCategoryData.categories.length + 1,
          bookCategory: '',
          group: '',
          depreciationMethod: 'slm',
          rate: '0',
          salvageValue: '0',
        },
      ],
    });
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = bookCategoryData.categories.filter((_, i) => i !== index);
    setBookCategoryData({
      ...bookCategoryData,
      categories: newCategories.map((cat, i) => ({ ...cat, sNo: i + 1 })),
    });
  };
  console.log("booksData", booksData, "cols", columns)

  const renderField = (field: BaseField) => {
    let fieldsToShowInEdit: string[] = ['Status', 'Notify']
    const { name, label, fieldType, isRequired, show = true } = field;
    //  const overrideShow = !show && fieldsToShowInEdit.includes(name) && !isCreateMode;
    //  const branchLabel=lastLevelsData?.Branch
     if (!field.isDisplay) {
       return null;
     }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };

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
                  addonAfter={ctrl.name==="SalvageValueRate"? selectAfter:undefined}
                  addonAfterClassName={ctrl.name==="SalvageValueRate"?"w-20":""}
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
        defaultValue={"%"}  className='parent [&>div:first-child]:pr-0 rounded-tl-none rounded-bl-none rounded-br-md rounded-tr-md' />
        

       

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
                      onClick={() => { }
                        // activeTab === 'main' ? handleModalOpen(true) : handleModalOpen(false)
                      }
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
                                         if(!(obj.name == "salvagevalue_unit"))
                                    { return(renderField(obj)) }
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
                        value={bookCategoryData.effectiveFrom}
                        onChange={(value) => setBookCategoryData({ ...bookCategoryData, effectiveFrom: value })}
                        placeholder="DD/MM/YYYY"
                      />
                      <div className="flex items-center gap-2 mt-6">
                        <span className="text-blue-600 cursor-pointer">Add New Financial Year</span>
                        <ReusableButton variant="default" size="small" icon={<ChevronLeft className="h-4 w-4" />} />
                        <ReusableButton variant="default" size="small" icon={<ChevronRight className="h-4 w-4" />} className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ReusableButton variant="default">Copy From</ReusableButton>
                      <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500">Add Group</ReusableButton>
                      <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500" onClick={handleAddCategory}>Add Category</ReusableButton>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">S.No</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Book category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Group</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Depreciation Method</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Salvage value (%)</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookCategoryData.categories.map((category, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-3">{category.sNo}</td>
                            <td className="px-4 py-3">
                              <ReusableInput
                                value={category.bookCategory}
                               
                                onChange={(e) => {
                                  const newCategories = [...bookCategoryData.categories];
                                  newCategories[index].bookCategory = e.target.value;

                                  setBookCategoryData({ ...bookCategoryData, categories: newCategories });
                                }}
                                size="small"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <ReusableDropdown
                                options={[]}
                                value={category.group}
                                onChange={(value) => {
                                  const newCategories = [...bookCategoryData.categories];
                                  newCategories[index].group = value as string;
                                  setBookCategoryData({ ...bookCategoryData, categories: newCategories });
                                }}
                                placeholder="Select"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <ReusableDropdown
                                options={depreciationMethodOptions}
                                value={category.depreciationMethod}
                                onChange={(value) => {
                                  const newCategories = [...bookCategoryData.categories];
                                  newCategories[index].depreciationMethod = value as string;
                                  setBookCategoryData({ ...bookCategoryData, categories: newCategories });
                                }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <ReusableInput
                                value={category.rate}
                                onChange={(e) => {
                                  const newCategories = [...bookCategoryData.categories];
                                  newCategories[index].rate = e.target.value;
                                  setBookCategoryData({ ...bookCategoryData, categories: newCategories });
                                }}
                                type="number"
                                size="small"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <ReusableInput
                                value={category.salvageValue}
                                onChange={(e) => {
                                  const newCategories = [...bookCategoryData.categories];
                                  newCategories[index].salvageValue = e.target.value;
                                  setBookCategoryData({ ...bookCategoryData, categories: newCategories });
                                }}
                                type="number"
                                size="small"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <ReusableButton
                                variant="text"
                                size="small"
                                danger
                                icon={<Trash2 className="h-4 w-4" />}
                                onClick={() => handleRemoveCategory(index)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                      Showing 1 to {bookCategoryData.categories.length} of {bookCategoryData.categories.length} entries
                    </div>
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

    </div>




  )
}

export default AddBook