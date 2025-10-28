import React, { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';

interface Book {
  id: string;
  name: string;
  depreciateWith: string;
  depreciateLevel: string;
  depreciationOn: string;
  fyStartDate: string;
}

const mockBooks: Book[] = [
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

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('book-details');
  const navigate=useNavigate()
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

  const filteredBooks = mockBooks.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.depreciateWith.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.depreciateLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      id: 'name',
      header: 'Book Name',
      accessorKey: 'name',
      enableSorting: true,
    },
    {
      id: 'depreciateWith',
      header: 'Depreciate With',
      accessorKey: 'depreciateWith',
      enableSorting: true,
    },
    {
      id: 'depreciateLevel',
      header: 'Depreciate Level',
      accessorKey: 'depreciateLevel',
      enableSorting: true,
    },
    {
      id: 'depreciationOn',
      header: 'Depreciation On',
      accessorKey: 'depreciationOn',
      enableSorting: true,
    },
    {
      id: 'fyStartDate',
      header: 'FY Start Date',
      accessorKey: 'fyStartDate',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <ReusableButton
            variant="text"
            size="small"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => setSelectedBook(row.original)}
          />
          <ReusableButton
            variant="text"
            size="small"
            danger
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => console.log('Delete book:', row.original.id)}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Book data:', formData, bookCategoryData);
    setIsAddDialogOpen(false);
  };

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

  return (
    // <PageLayout>
    //   <PageHeader 
    //     title="Books" 
    //     breadcrumbs={[
    //       { label: 'Masters', href: '/masters' },
    //       { label: 'Depreciation', href: '/masters/depreciation' },
    //       { label: 'Book', href: '/masters/book' }
    //     ]}
    //   />

    //   <div className="space-y-6">
    //     {/* Search and Actions */}
    //     <div className="flex justify-between items-center">
    //       <ReusableInput
    //         size="middle"
    //         placeholder="Search books..."
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //         prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
    //         allowClear
    //         containerClassName="w-96"
    //       />
          
    //       <div className="flex gap-2">
    //         <ReusableButton
    //           variant="primary"
    //           className="bg-orange-500 hover:bg-orange-600 border-orange-500"
    //           onClick={()=>{navigate("/masters/depreciation/book/additionaldepreciation")}}
    //         >
    //           Additional Depreciation
    //         </ReusableButton>
            

    //         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
    //           <DialogTrigger asChild>
    //             <ReusableButton
    //               variant="primary"
    //               icon={<Plus className="h-4 w-4" />}
    //               className="bg-orange-500 hover:bg-orange-600 border-orange-500"
    //             >
    //               Add
    //             </ReusableButton>
    //           </DialogTrigger>
    //           <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    //             <DialogHeader>
    //               <DialogTitle>Add Book</DialogTitle>
    //             </DialogHeader>
                
    //             <form onSubmit={handleSubmit}>
    //               <Tabs value={activeTab} onValueChange={setActiveTab}>
    //                 <TabsList className="grid w-full grid-cols-2">
    //                   <TabsTrigger value="book-details">Book Details</TabsTrigger>
    //                   <TabsTrigger value="book-category-details">Book Category Details</TabsTrigger>
    //                 </TabsList>
                    
    //                 <TabsContent value="book-details" className="space-y-4 mt-4">
    //                   <div className="grid grid-cols-3 gap-4">
    //                     <ReusableInput
    //                       label="Book Name"
    //                       value={formData.bookName}
    //                       onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
    //                       required
    //                     />
    //                     <ReusableTextarea
    //                       label="Description"
    //                       value={formData.description}
    //                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    //                       numberOfRows={1}
    //                     />
    //                     <div>
    //                       <Label>Depreciation Based On *</Label>
    //                       <ReusableDropdown
    //                         options={depreciationBasedOnOptions}
    //                         value={formData.depreciationBasedOn}
    //                         onChange={(value) => setFormData({ ...formData, depreciationBasedOn: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="grid grid-cols-3 gap-4">
    //                     <div>
    //                       <Label>Default Depreciation Method *</Label>
    //                       <ReusableDropdown
    //                         options={depreciationMethodOptions}
    //                         value={formData.defaultDepreciationMethod}
    //                         onChange={(value) => setFormData({ ...formData, defaultDepreciationMethod: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                     <ReusableDatePicker
    //                       label="FY Start Date"
    //                       value={formData.fyStartDate}
    //                       onChange={(value) => setFormData({ ...formData, fyStartDate: value })}
    //                       placeholder="DD/MM/YYYY"
    //                     />
    //                     <ReusableDatePicker
    //                       label="FY End Date"
    //                       value={formData.fyEndDate}
    //                       onChange={(value) => setFormData({ ...formData, fyEndDate: value })}
    //                       placeholder="DD/MM/YYYY"
    //                     />
    //                   </div>

    //                   <div className="grid grid-cols-3 gap-4">
    //                     <div>
    //                       <Label>Depreciate With *</Label>
    //                       <ReusableDropdown
    //                         options={depreciateWithOptions}
    //                         value={formData.depreciateWith}
    //                         onChange={(value) => setFormData({ ...formData, depreciateWith: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                     <div>
    //                       <Label>Depreciation Level *</Label>
    //                       <ReusableDropdown
    //                         options={depreciationLevelOptions}
    //                         value={formData.depreciationLevel}
    //                         onChange={(value) => setFormData({ ...formData, depreciationLevel: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                     <div>
    //                       <Label>Salvage Value To Consider</Label>
    //                       <ReusableDropdown
    //                         options={salvageValueOptions}
    //                         value={formData.salvageValueToConsider}
    //                         onChange={(value) => setFormData({ ...formData, salvageValueToConsider: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="grid grid-cols-3 gap-4">
    //                     <div>
    //                       <Label>Salvage Value</Label>
    //                       <div className="flex gap-2">
    //                         <ReusableInput
    //                           value={formData.salvageValue}
    //                           onChange={(e) => setFormData({ ...formData, salvageValue: e.target.value })}
    //                           type="number"
    //                           className="flex-1"
    //                         />
    //                         <ReusableDropdown
    //                           options={[{ value: '%', label: '%' }, { value: 'value', label: 'Value' }]}
    //                           value={formData.salvageValueUnit}
    //                           onChange={(value) => setFormData({ ...formData, salvageValueUnit: value as string })}
    //                           className="w-24"
    //                         />
    //                       </div>
    //                     </div>
    //                     <div>
    //                       <Label>First-Year Depreciation Conventions *</Label>
    //                       <ReusableDropdown
    //                         options={[{ value: 'full-year', label: 'Full Year' }, { value: 'half-year', label: 'Half Year' }]}
    //                         value={formData.firstYearConventions}
    //                         onChange={(value) => setFormData({ ...formData, firstYearConventions: value as string })}
    //                         placeholder="Select"
    //                       />
    //                     </div>
    //                     <ReusableInput
    //                       label="Depreciated Value Round Off Up-To"
    //                       value={formData.roundOffValue}
    //                       onChange={(e) => setFormData({ ...formData, roundOffValue: e.target.value })}
    //                       type="number"
    //                     />
    //                   </div>

    //                   <div className="grid grid-cols-2 gap-4">
    //                     <div className="flex items-center space-x-2">
    //                       <Checkbox
    //                         checked={formData.forexGainLoss}
    //                         onCheckedChange={(checked) => setFormData({ ...formData, forexGainLoss: checked as boolean })}
    //                       />
    //                       <label className="text-sm">Forex Gain/Loss Applicable</label>
    //                     </div>
    //                     <div className="flex items-center space-x-2">
    //                       <Checkbox
    //                         checked={formData.revaluationApplicable}
    //                         onCheckedChange={(checked) => setFormData({ ...formData, revaluationApplicable: checked as boolean })}
    //                       />
    //                       <label className="text-sm">Revaluation Applicable</label>
    //                     </div>
    //                   </div>

    //                   <div className="grid grid-cols-2 gap-4">
    //                     <div className="flex items-center space-x-2">
    //                       <Checkbox
    //                         checked={formData.writeOffApplicable}
    //                         onCheckedChange={(checked) => setFormData({ ...formData, writeOffApplicable: checked as boolean })}
    //                       />
    //                       <label className="text-sm">100% Write Off Applicable</label>
    //                     </div>
    //                     <div className="flex items-center space-x-2">
    //                       <Checkbox
    //                         checked={formData.dependentAsset}
    //                         onCheckedChange={(checked) => setFormData({ ...formData, dependentAsset: checked as boolean })}
    //                       />
    //                       <label className="text-sm">Dependent Asset To Be Calculated Separately</label>
    //                     </div>
    //                   </div>

    //                   <div className="flex items-center space-x-2">
    //                     <Checkbox
    //                       checked={formData.backdatedEntry}
    //                       onCheckedChange={(checked) => setFormData({ ...formData, backdatedEntry: checked as boolean })}
    //                     />
    //                     <label className="text-sm">Backdated Entry Applicable</label>
    //                   </div>
    //                 </TabsContent>
                    
    //                 <TabsContent value="book-category-details" className="space-y-4 mt-4">
    //                   <div className="flex items-center justify-between">
    //                     <div className="flex items-center gap-4">
    //                       <ReusableDatePicker
    //                         label="Effective From"
    //                         value={bookCategoryData.effectiveFrom}
    //                         onChange={(value) => setBookCategoryData({ ...bookCategoryData, effectiveFrom: value })}
    //                         placeholder="DD/MM/YYYY"
    //                       />
    //                       <div className="flex items-center gap-2 mt-6">
    //                         <span className="text-blue-600 cursor-pointer">Add New Financial Year</span>
    //                         <ReusableButton variant="default" size="small" icon={<ChevronLeft className="h-4 w-4" />} />
    //                         <ReusableButton variant="default" size="small" icon={<ChevronRight className="h-4 w-4" />} className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white" />
    //                       </div>
    //                     </div>
    //                     <div className="flex gap-2">
    //                       <ReusableButton variant="default">Copy From</ReusableButton>
    //                       <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500">Add Group</ReusableButton>
    //                       <ReusableButton variant="primary" className="bg-orange-500 hover:bg-orange-600 border-orange-500" onClick={handleAddCategory}>Add Category</ReusableButton>
    //                     </div>
    //                   </div>

    //                   <div className="border rounded-lg overflow-hidden">
    //                     <table className="w-full">
    //                       <thead className="bg-gray-50 border-b">
    //                         <tr>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">S.No</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Book category</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Group</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Depreciation Method</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Salvage value (%)</th>
    //                           <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         {bookCategoryData.categories.map((category, index) => (
    //                           <tr key={index} className="border-b">
    //                             <td className="px-4 py-3">{category.sNo}</td>
    //                             <td className="px-4 py-3">
    //                               <ReusableInput
    //                                 value={category.bookCategory}
    //                                 onChange={(e) => {
    //                                   const newCategories = [...bookCategoryData.categories];
    //                                   newCategories[index].bookCategory = e.target.value;
    //                                   setBookCategoryData({ ...bookCategoryData, categories: newCategories });
    //                                 }}
    //                                 size="small"
    //                               />
    //                             </td>
    //                             <td className="px-4 py-3">
    //                               <ReusableDropdown
    //                                 options={[]}
    //                                 value={category.group}
    //                                 onChange={(value) => {
    //                                   const newCategories = [...bookCategoryData.categories];
    //                                   newCategories[index].group = value as string;
    //                                   setBookCategoryData({ ...bookCategoryData, categories: newCategories });
    //                                 }}
    //                                 placeholder="Select"
    //                               />
    //                             </td>
    //                             <td className="px-4 py-3">
    //                               <ReusableDropdown
    //                                 options={depreciationMethodOptions}
    //                                 value={category.depreciationMethod}
    //                                 onChange={(value) => {
    //                                   const newCategories = [...bookCategoryData.categories];
    //                                   newCategories[index].depreciationMethod = value as string;
    //                                   setBookCategoryData({ ...bookCategoryData, categories: newCategories });
    //                                 }}
    //                               />
    //                             </td>
    //                             <td className="px-4 py-3">
    //                               <ReusableInput
    //                                 value={category.rate}
    //                                 onChange={(e) => {
    //                                   const newCategories = [...bookCategoryData.categories];
    //                                   newCategories[index].rate = e.target.value;
    //                                   setBookCategoryData({ ...bookCategoryData, categories: newCategories });
    //                                 }}
    //                                 type="number"
    //                                 size="small"
    //                               />
    //                             </td>
    //                             <td className="px-4 py-3">
    //                               <ReusableInput
    //                                 value={category.salvageValue}
    //                                 onChange={(e) => {
    //                                   const newCategories = [...bookCategoryData.categories];
    //                                   newCategories[index].salvageValue = e.target.value;
    //                                   setBookCategoryData({ ...bookCategoryData, categories: newCategories });
    //                                 }}
    //                                 type="number"
    //                                 size="small"
    //                               />
    //                             </td>
    //                             <td className="px-4 py-3">
    //                               <ReusableButton
    //                                 variant="text"
    //                                 size="small"
    //                                 danger
    //                                 icon={<Trash2 className="h-4 w-4" />}
    //                                 onClick={() => handleRemoveCategory(index)}
    //                               />
    //                             </td>
    //                           </tr>
    //                         ))}
    //                       </tbody>
    //                     </table>
    //                     <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
    //                       Showing 1 to {bookCategoryData.categories.length} of {bookCategoryData.categories.length} entries
    //                     </div>
    //                   </div>
    //                 </TabsContent>
    //               </Tabs>
                  
    //               <div className="flex justify-end gap-2 mt-6">
    //                 <ReusableButton 
    //                   variant="default" 
    //                   onClick={() => setIsAddDialogOpen(false)}
    //                 >
    //                   Clear
    //                 </ReusableButton>
    //                 <ReusableButton 
    //                   htmlType="submit" 
    //                   variant="primary"
    //                   className="bg-orange-500 hover:bg-orange-600 border-orange-500"
    //                 >
    //                   Submit
    //                 </ReusableButton>
    //               </div>
    //             </form>
    //           </DialogContent>
    //         </Dialog>
    //       </div>
    //     </div>

    //     {/* Table */}
    //     <div className="bg-card rounded-lg border">
    //       <ReusableTable
    //         data={filteredBooks}
    //         columns={columns}
    //       />
    //     </div>
    //   </div>
    // </PageLayout>
  <div className="h-full overflow-y-scroll  bg-gray-50 flex flex-col ">
      {/* <div className="flex flex-1 overflow-hidden   "> */}
     <div className="flex-1 flex flex-col min-w-0 ">
              {/* Navigation and Action Bar */}
              <div className="bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Masters</span>
                      <span>/</span>
                      <span>Depreciation</span>
                      <span>/</span>
                      <span className="text-gray-900 font-medium">Books</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <ReusableButton
              variant="primary"
              className="bg-orange-500 hover:bg-orange-600 border-orange-500"
              onClick={()=>{navigate("/masters/depreciation/book/additionaldepreciation")}}
            >
              Additional Depreciation
            </ReusableButton>
                 <ReusableButton
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                >
                  Add
                </ReusableButton>
                </div>
              </div>
    
              {/* Content Grid with Individual Scroll Areas */}
              <div className="flex-1 p-3 overflow-hidden min-h-0  ">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                    <ScrollArea className="flex-1  ">
                      <div className="space-y-6 pr-1">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                          <CardContent className="pt-6">
                            <div className="space-y-6">
    
                              {/* <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '> */}
                                    <div className="">
          <ReusableTable
            data={filteredBooks}
            columns={columns}
          />
        </div>
                              {/* </div> */}
    
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
               {/* </div> */}
               </div>
  );
};

export default Books;