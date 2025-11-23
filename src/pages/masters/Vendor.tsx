

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, Plus, Edit, ChevronRight, ChevronLeft, Search, ArrowLeft, X, Save } from 'lucide-react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { deleteVendorByCompanyId, GetCountryList, getEditVendorListByCompanyId, GetVendorList, postNewVendor, updateVendor } from '@/services/vendorServices';
import { VENDOR_DETAILS } from '@/Local_DB/Form_JSON_Data/VendorDB';
import { useMessage } from '@/components/ui/reusable-message';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { FaAngleRight } from 'react-icons/fa';
interface VendorData {
  "VendorID": number | string,
  "VendorName": string,
  "VendorTypeID": number | string,
  "VendorType": string,
  "VendorCode": string,
  "PanNo": string,
  "GSTIN": string,
  "AddressID": number,
  "Address": string,
  "City": string,
  "State": string,
  "Country": string,
  "ZipCode": string,
  "Phone": string,
  "Mobile": string,
  "VendorEmailId": string,
  "Description": string,
  "ContactPerson": string
}

const Vendor = () => {
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<VendorData[]>([]);
  const [fields, setFields] = useState<BaseField[]>(VENDOR_DETAILS);
  const [selectedVendorData, setSelectedVendorData] = useState<VendorData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false)
  const [deletingVendorData, setDeletingVendorData] = useState(null)
  let msg = useMessage()
  const filteredOrgs = dataSource.filter(vend => {
    const matchesSearch = vend.VendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vend.VendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vend.VendorType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  useEffect(() => {
    if (companyId) fetchAllVendorsList();
    fetchCountryList()
  }, [companyId]);

  const handleSelect = (e, data: VendorData) => {

    setSelectedVendorData(data);
    getVendorDataAPI(data.VendorID)

  }
  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name) {
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
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
                dropdownClassName={true ? 'z-[10001]' : ''}
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
                dragAndDrop={false}
                fieldClassName="w-full"
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
              <ReusableCheckbox
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
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
  const setLookupsDataInJson = (data: any, key: string) => {
    const updatedFields = fields.map(field => {
      if (field.name === key) {
        return { ...field, options: data };
      }
      return field;
    });
    setFields(updatedFields);
  }
  const handleDelete = (e, vend) => {
    e.stopPropagation();
    setDeletingVendorData(vend)

    setIsDelModalOpen(true)

  }
  const handleReset = () => {
    //       setSelectedVendorData(null);
    // setDataSource([{ OrganizationLogo: "", OrganizationLogoName: "", OrganizationLogoType: "", OrganizationLogoConversionType: "" }]);
    form.reset({ "VendorName": "", "VendorType": "", "VendorCode": "", "PhoneNo": "", "Address": "", "City": "", "State": "", "Country": "", "ZipCode": "", "EmailId": "", "PAN": "", "GSTIN": "", "Description": "", "ContactPerson": "" });
    setSelectedVendorData(null)
    setDeletingVendorData(null)
  };

  const handleSave = (data) => {
    const payload = {
      VendorCustomerDetails: [
        {
          "Vendor Name": data["VendorName"],
          "Vendor Type": data["VendorType"] ? data["VendorType"].join(',') : "",
          "Vendor Code": data["VendorCode"],
          "Mobile no": "",
          "Phone no": data["PhoneNo"],
          Address: data["Address"],
          City: data["City"],
          State: data["State"],
          Country: data["Country"],
          "Zip Code": data["ZipCode"],
          "Email Id": data["EmailId"],
          "Reg / PAN": data["PAN"],
          "GSTIN/UIN": data["GSTIN"],
          Description: data["Description"],
          "Contact Person": data["ContactPerson"]
        }
      ],
    };
    if (selectedVendorData) {
      UpdateVendorAPI(payload, selectedVendorData?.VendorID)
    } else {
      AddVendorAPI(payload)
    }

  }
  //API Calls
  //fetch all vendors list
  const fetchAllVendorsList = async () => {
    dispatch(setLoading(true));
    await GetVendorList(companyId).then(res => {
      if (res.success && res.data && res.data.Vendors && Array.isArray(res.data.Vendors)) {
        setDataSource(res.data?.Vendors?.reverse());
      } else {
        setDataSource([]);
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  //fetch Country List as dropdown lookup
  const fetchCountryList = async () => {
    dispatch(setLoading(true));
    await GetCountryList().then(res => {
      if (res.success && res.data && Array.isArray(res.data.CountryList)) {
        const countryOptions = res.data.CountryList.map((country: any) => ({
          label: country.CountryName,
          value: country.CountryName,
        }));
        setLookupsDataInJson(countryOptions, "Country");
      } else {
        msg.warning("No Country Data Found !!");
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  //Add Vendor
  const AddVendorAPI = async (payload) => {
    dispatch(setLoading(true))
    await postNewVendor(companyId, payload).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message || "Vendor Added Successfully !!");
          fetchAllVendorsList();
          handleReset();
        } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
          msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to Add Vendor !!');
        } else {
          msg.warning('Failed to Add Vendor !!')
        }
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  //update Vendor
  //Add Vendor
  const UpdateVendorAPI = async (payload, VendorId) => {
    dispatch(setLoading(true))
    await updateVendor(companyId, VendorId, payload).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message || "Vendor Updated Successfully !!");
          fetchAllVendorsList();
          handleReset();
        } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
          msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to Update Vendor !!');
        } else {
          msg.warning('Failed to Update Vendor !!')
        }
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  //get particular vendor Details
  const getVendorDataAPI = async (Id) => {
    dispatch(setLoading(true));
    await getEditVendorListByCompanyId(companyId, Id).then(res => {
      if (res.success && res.data && res.data.status == undefined) {

        form.reset({ ...form.getValues(), ...res.data[0], VendorType: res.data[0]["VendorType"]?.split(",") })

      } else {
        msg.warning("No Vendor Data Found !!");
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const deleteVendorAPI = async (id) => {
    dispatch(setLoading(true))
    await deleteVendorByCompanyId(companyId, id).then(res => {
      if (res.success) {
        if (res.data && res.data[0].status) {
          msg.success(res.data[0].message || "Vendor Deleted Successfully!!");
          fetchAllVendorsList();
          handleReset();
        } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
          msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to Delete Vendor !!');
        } else {
          msg.warning('Failed to Delete Vendor !!')
        }
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  return (
    <div className="h-full overflow-y-auto  flex flex-col ">
      <div className="flex flex-1 overflow-hidden   ">
        {/* Left Sidebar - Ticket Inbox */}
        {/* <div className={`${isInboxCollapsed ? 'w-6 p-1' : 'w-34 p-2 mb-2 rounded-b-[5px]'} bg-white border-r    border-0 shadow-lg flex pb-3 flex-col transition-all duration-300 shrink-0 hidden lg:flex`}> */}
        { dataSource?.length>0 &&<div
          className={`
    ${isInboxCollapsed ? 'w-6 p-1' : 'w-64 p-2 mb-2 rounded-b-[5px]'}
   bg-white border border-gray-200 border-t-0 border-t-transparent shadow-xl flex flex-col pb-3 transition-all duration-300 shrink-0
    md:relative
    ${isInboxCollapsed ? 'relative' : 'fixed md:relative'}
    ${isInboxCollapsed ? '' : 'top-15 left-0 h-full z-50 md:top-auto md:left-auto md:h-auto'}
  `}
        >
          <div className="pt-1 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                Vendors ({dataSource.length})
              </h3>
              <div onClick={() => setIsInboxCollapsed(!isInboxCollapsed)} className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground  ${isInboxCollapsed ? 'me-2  py-1 ' : 'p-1'}`}>
                {isInboxCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </div>
            </div>
            {!isInboxCollapsed && (
              <div className="space-y-2 pb-1">

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search Vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {!isInboxCollapsed && (
            <ScrollArea hideScrollbar={true} className="flex-1 min-h-0 mb-2 truncate max-w-[250px] block">
              <div className="py-2">
                {filteredOrgs.map((vend) => (
                  <div
                    key={vend.VendorID}
                    className={`p-2.5 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedVendorData?.VendorID === vend.VendorID
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'border border-gray-200'
                      }`}
                    onClick={(e) => handleSelect(e, vend)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-blue-600 me-2 ms-1">{vend?.VendorName}</span>
                      {/* <Badge
                        title={`Vendor Type: ${vend.VendorType}`}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 text-center truncate inline-block w-[90px] text-[11px] px-2 py-0.5"
                      >
                        {vend.VendorType}
                      </Badge> */}
                    </div>

                    {/* <h3
                      className="text-xs font-medium text-gray-900 mb-1 truncate"
                      title={"next"}
                    >
                      {vend?.VendorEmailId}
                    </h3> */}

                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-gray-500">
                      <Badge
                        title="Vendor Type"
                        variant="outline"
                        className="bg-green-100 text-green-800 text-[11px] px-2 py-0.5"
                      >
                        {vend.VendorType}
                      </Badge>
                      {/* <h3
                      className="text-xs font-medium text-gray-900 mb-1 truncate"
                      title={"next"}
                    >
                      {vend?.VendorEmailId}
                    </h3> */}

                      <div>
                        <span
                          title={vend.VendorName}
                          className="block max-w-[90px] truncate text-[11px] text-gray-500"
                        >
                          <Trash2 onClick={(e) => handleDelete(e, vend)} height={18} className='text-red-400'></Trash2>
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

          )}
        </div>
}
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          {/* Navigation and Action Bar */}
          <div className="px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
            
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Masters</span>
                  <FaAngleRight />
                  <span>Company</span>
                  <FaAngleRight />
                  <span className="text-gray-900 font-medium">Vendor</span>
                </div>
             
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <ReusableButton
                variant="text"
                // size="small"
                onClick={() => { handleReset() }}
                icon={<X className="h-4 w-4" />}
                className='btn-reset-clear-style'

              >
                {selectedVendorData ? "Cancel" : "Clear"}
              </ReusableButton>
              <ReusableButton
                // size="small"
                variant="primary"
                onClick={() => { handleSubmit(handleSave)() }}
                icon={<Save className="h-4 w-4" />}
                className='btn-submit-style'

              >
                {selectedVendorData ? "Update" : "Save"}
              </ReusableButton>
            </div>
          </div>

          {/* Content Grid with Individual Scroll Areas */}
          <div className="flex-1 p-3 pt-0 overflow-hidden min-h-0  ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-12 flex flex-col min-h-0 text-card-foreground bg-card rounded-lg border border-border overflow-hidden  pt-2 ">
                <ScrollArea className="flex-1  " scrollStyle={'flex-[0.8] '}>
                  <div className="space-y-6 pr-1">
                    <Card className="border-0 pt-0">
                      <CardContent className="pt-0 p-2 px-4">
                        <div className="space-y-6">

                          <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                            {
                              fields.map(obj => {
                                if (obj.fieldType === "heading") {
                                  return <h3 key={obj.text} className='text-lg font-semibold text-gray-900 border-b col-span-full pb-2'>{obj.text}</h3>
                                }
                                return (
                                  <div key={obj.name}>
                                    {renderField(obj)}
                                  </div>
                                )
                              })
                            }
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm the action</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete vendor {deletingVendorData?.VendorName}?

            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <ReusableButton
              variant="default"
              onClick={() => setIsDelModalOpen(false)}
            >
              Cancel
            </ReusableButton>
            <ReusableButton
              variant="primary"
              danger={true}
              onClick={() => { deleteVendorAPI(deletingVendorData.VendorID); setIsDelModalOpen(false) }}
            >
              Delete
            </ReusableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendor;






// import { useCallback, useEffect, useState } from 'react';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
// import { Trash2, Plus, Edit } from 'lucide-react';
// import { ColumnDef } from '@tanstack/react-table';
// import { useToast } from '@/hooks/use-toast';
// import { ReusableButton } from '@/components/ui/reusable-button';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setLoading } from '@/store/slices/projectsSlice';
// import { GetVendorList } from '@/services/vendorServices';
// interface VendorData {
//    VendorID: number,
//    VendorName: string,
//    VendorTypeID: number,
//    VendorType: string,
//    VendorCode: string,
//    PanNo: string | null,
//    GSTIN: string | null,
//    AddressID: number,
//    Address: string | null,
//    City: string | null,
//    State: string | null,
//    Country:string | null,
//    ZipCode: string | null,
//    Phone: string | null,
//    Mobile: string | null,
//    VendorEmailId: string | null,
//    Description: string | null,
//    ContactPerson: string | null,
// }

// const Vendor = () => {
//   const { toast } = useToast();
//   const dispatch = useAppDispatch();
//   const companyId = useAppSelector(state => state.projects.companyId)
//   const [dataSource, setDataSource] = useState<VendorData[]>([]);
//   const [columns, setColumns] = useState<ColumnDef<VendorData>[]>([
//     { id: 'VendorName', accessorKey: "VendorName", header: "Vendor Name" },
//     { id: 'VendorType', accessorKey: "VendorType", header: "Vendor Type" },
//     { id: 'VendorCode', accessorKey: "VendorCode", header: "Vendor Code" },
//     { id: 'PanNo', accessorKey: "PanNo", header: "Reg / PAN" },
//     { id: 'GSTIN', accessorKey: "GSTIN", header: "GSTIN / UIN" },
//     { id: 'Address', accessorKey: "Address", header: "Address" },
//     { id: 'City', accessorKey: "City", header: "City" },
//     { id: 'State', accessorKey: "State", header: "State" },
//     { id: 'Country', accessorKey: "Country", header: "Country" },
//     { id: 'ZipCode', accessorKey: "ZipCode", header: "ZipCode" },
//     { id: 'VendorEmailId', accessorKey: "VendorEmailId", header: "Email ID" },
//     { id: 'ContactPerson', accessorKey: "ContactPerson", header: "Contact Person" },
//     { id: 'Phone', accessorKey: "Phone", header: "Phone Number" },
//     { id: 'Description', accessorKey: "Description", header: "Description" },
//   ])

//   useEffect(() => {
//     if (companyId) fetchAllVendorsList();
//   }, [companyId]);
//   //fetch all vendors list
//   const fetchAllVendorsList = async () => {
//     dispatch(setLoading(true));
//     await GetVendorList(companyId).then(res => {
//       if (res.success && res.data && res.data.Vendors && Array.isArray(res.data.Vendors)) {
//         setDataSource(res.data.Vendors);
//       }else{
//         setDataSource([]);
//       }
//     }).catch(err => {}).finally(() => {
//       dispatch(setLoading(false));
//     });
//   }
//   const handleDelete = (data: VendorData): void => {
//   }
//   const handleEdit = (data: VendorData): void => {
//   }
//   const tableActions: TableAction<VendorData>[] = [
//     {
//       label: 'Edit',
//       icon: Edit,
//       onClick: handleEdit,
//       variant: 'default',
//     },
//     {
//       label: 'Delete',
//       icon: Trash2,
//       onClick: handleDelete,
//       variant: 'destructive',
//     },
//   ];
//   // handle refresh
//   const handleReset = useCallback(() => {
//       toast({ title: "Data Refreshed", description: "All vendors data has been updated", });
//       fetchAllVendorsList();
//   }, [toast]);
//   // Define table permissions
//   const tablePermissions: TablePermissions = {
//     canEdit: true,
//     canDelete: true,
//     canView: true,
//     canExport: false,
//     canAdd: true,
//     canManageColumns: true,
//   };
//   return (
//     <div className="h-full overflow-y-scroll bg-gray-50 transition-all duration-300 ease-in-out">
//       <header className="bg-white border-b px-6 py-4 shadow-sm">
//         <div className="flex items-center gap-4">
//           <SidebarTrigger />
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span>Masters</span><span>/</span><span>Company</span><span>/</span><span className="text-gray-900 font-medium">User</span>
//           </div>
//         </div>
//       </header>
//       <div className="p-6 space-y-6 animate-fade-in">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
//           <ReusableButton
//             htmlType="button"
//             variant="default"
//             onClick={null}
//             iconPosition="left"
//             size="middle"
//             className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
//           >
//             <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Vendor</div>
//           </ReusableButton>
//         </div>
//         <Card className="shadow-sm">
//           <CardHeader className="pb-4">
//           </CardHeader>
//           <CardContent>
//             <ReusableTable
//               data={dataSource} columns={columns}
//               permissions={tablePermissions}
//               title="Vendors List"
//               onRefresh={handleReset} enableSearch={true}
//               enableSelection={false} enableExport={true}
//               enableColumnVisibility={true} enablePagination={true}
//               enableSorting={true} enableFiltering={true}
//               pageSize={10} emptyMessage="No Data found"
//               rowHeight="normal" storageKey="vendor-master-list-table"
//               actions={tableActions}
//               enableColumnPinning
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Vendor;
