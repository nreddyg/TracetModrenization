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
import { Card, CardContent } from '@/components/ui/card';
import { DeleteDepreciationBook, GetAdditionalDepreciationBookDetails, GetDepreciationBookDetails } from '@/services/BookServices';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppSelector } from '@/store';

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

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [booksData,setBooksData]=useState([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
 const [isMainDelOpen, setIsMainDelOpen] = useState(false)
 const [deleteRow,setDeleteRow]=useState(null)
  const [activeTab, setActiveTab] = useState('book-details');
     const companyId = useAppSelector(state => state.projects.companyId);
  const msg=useMessage()
  const dispatch=useDispatch()
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

  const filteredBooks = booksData.filter(book =>
    book.BookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.DepreciateWith.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.DepreciateLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

useEffect(()=>{
getBookDataAPI()
},[])

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
                          setIsMainDelOpen(true);
                          setDeleteRow(row.original);

                        }}
                     >
                         Delete
                     </ReusableButton>
                 </div>
             ),
         },
  ];

const handleCancel=()=>{
  setDeleteRow(null)
        setIsMainDelOpen(false);
}
  //apis

     const handleMainDelete = async (ID) => {
                  dispatch(setLoading(true));
                  await DeleteDepreciationBook(companyId,ID)
                      .then((res) => {
                          if (res.data.status !== undefined) {
                              if (res.data.status === true) {
                                  msg.success(res.data.message);
                                  getBookDataAPI();
                                  handleCancel();
                              
                              }
                              else {
                                  msg.warning(res.data.message);
                              }
                          } else {
                              msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                          }
                      })
                      .catch((err) => {
                          // TracetMessage("error","1vh","Failed to Delete Asset Category","assetcategorydelete");   
                      })
                      .finally(() => {
                          dispatch(setLoading(false));
                      });
               
                  
              };
  
  let getBookDataAPI=async ()=>{
//  dispatch(loaderEnable());
    await GetDepreciationBookDetails("111").then((res) => {
      if (res.success && res.data) {
        if(Array.isArray(res.data.BookDetails)){
            setBooksData(res.data.BookDetails)
        }else{
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

  return (
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
                  onClick={()=>{navigate("/masters/depreciation/book/addbook")}}
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
      
                   <Dialog open={isMainDelOpen} onOpenChange={() => handleCancel()}> 
                                               <DialogContent>
                                                   <DialogHeader>
                                                       <DialogTitle>Confirm the action</DialogTitle>
                                                   </DialogHeader>
                                                   <div className="space-y-4">
                                                       <h4>{`Are you sure want to delete ${deleteRow?.BookName} Book`}</h4>
                                                       <div className="flex justify-end gap-2">
                                                           <ReusableButton onClick={() =>{
                                                            setIsMainDelOpen(false);
                                                            handleCancel()

                                                           }}>
                                                               Cancel
                                                           </ReusableButton>
                                                           <ReusableButton variant="primary" onClick={() =>{
                                                                   handleMainDelete(deleteRow.BookID)
                                                      }
                                                        }>
                                                               Delete
                                                           </ReusableButton>
                                                       </div>
                                                   </div>
                                               </DialogContent>
                                           </Dialog>
               </div>
  );
};

export default Books;