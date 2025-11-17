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
import { useMessage } from '@/components/ui/reusable-message';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { CUSTOMER_DETAILS } from '@/Local_DB/Form_JSON_Data/CustomerDB';
import { deleteCustomerByCompanyId, getBranchList, GetCountryList, getCustomerLocations, GetCustomersList, getEditCustomerListByCompanyId, postNewCustomer, updateCustomer } from '@/services/customerServices';
import { NavLink } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
interface CustomerData {
  "CustomerID": number | string,
  "CustomerName": string,
  "CustomerTypeId": number | string,
  "CustomerType": string,
  "PAN": string,
  "GSTIN": string,
  "AddOnAddressId": number,
  "AddOnAddress": string,
  "City": string,
  "State": string,
  "Country": string,
  "ZipCode": string,
  "PhoneNo": string,
  "MobileNo": string,
  "EmailId": string,
  "MainLocationId": number,
  "MainLocation": string,
  "SubLocationId": number,
  "SubLocation": string,
  "Description": string,
  "ContactPerson": string,
  "BillingAddress": string,
  "BranchName": string,
  "Attachment1": string,
  "Attachment2": string,
  "Attachment3": string

}

const Customer = () => {
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<CustomerData[]>([]);
  const [fields, setFields] = useState<BaseField[]>(CUSTOMER_DETAILS);
  const [selectedCustomerData, setSelectedCustomerData] = useState<CustomerData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false)
  const [deletingCustomerData, setDeletingCustomerData] = useState(null)
  const branchName = useAppSelector(state => state.projects.branch);
  const branchesList = useAppSelector(state => state.projects.branchList);
  const [subLocOptions, setSubLocOptions] = useState([])
  const [mainLocOptions, setMainLocOptions] = useState([])
  let msg = useMessage()
  const filteredOrgs = dataSource.filter(cust => {
    const matchesSearch = cust.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.MainLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.EmailId.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (companyId && branchName) fetchAllCustomerList();
  }, [companyId, branchName]);
  useEffect(() => {
    fetchCountryList()
  }, [branchesList])
  useEffect(() => {
    let fieldData = [...fields]
    let mainLoc = watch("MainLocation")
    if (mainLoc && selectedCustomerData?.CustomerID) {
      let mainLocationId = mainLocOptions.filter((o) => (o.value === mainLoc && o.CustomerId == selectedCustomerData.CustomerID))
      let opts = subLocOptions.filter((o) => o.Parent == (mainLocationId[0].LocationId))
      let subObjInd = fieldData.findIndex((x) => x.name === "SubLocation");
      fieldData[subObjInd].options = opts
      fieldData[subObjInd].value = ""
      setFields(fieldData)
    }
  }, [watch("MainLocation")])
  useEffect(() => {
    const mainLocation = watch("MainLocation");
    const isEmpty = !mainLocation || mainLocation.length === 0;
    const updatedFields = fields.map(field =>
      field.name === "SubLocation"
        ? { ...field, disabled: isEmpty }
        : field
    );
    setFields(updatedFields);
  }, [watch("MainLocation")]);
  const handleSelect = (e, data: CustomerData) => {
    setSelectedCustomerData(data);
    getCustomerDataAPI(data.CustomerID)
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
          name={name} control={control}

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
  const setLookupsDataInJson = (data: any, key: string, data2?: any, key2?: string) => {
    const updatedFields = fields.map(field => {
      if (field.name === key) {
        return { ...field, options: data };
      }
      if (field.name === key2) {
        return { ...field, options: data2 };
      }
      return field;
    });
    setFields(updatedFields);
  }
  const handleDelete = (e, vend) => {
    e.stopPropagation();
    setDeletingCustomerData(vend)
    setIsDelModalOpen(true)
  }
  const handleReset = () => {
    form.reset({ "CustomerName": "", "PAN": "", "GSTIN": "", "EmailId": "", "PhoneNo": "", "ContactPerson": "", "AddOnAddress": "", "MainLocation": "", "SubLocation": "", "City": "", "State": "", "ZipCode": "", "Description": "" });
    let formfields = [...fields]
    formfields.forEach((obj) => {
      if (obj.name == "MainLocation" || obj.name == "SubLocation") {
        obj.fieldType = "text"
        obj.options = []
      }
    })
    setFields(formfields)
    setSelectedCustomerData(null)
    setDeletingCustomerData(null)
  };
  const handleSave = (data) => {
    const payload = {
      VendorCustomerDetails: [
        {
          "Customer Name": data["CustomerName"],
          "Reg / PAN": data["PAN"],
          "GSTIN/UIN": data["GSTIN"],
          Address: data["AddOnAddress"],
          City: data["City"],
          State: data["State"],
          Country: data["Country"],
          "Zip Code": data["ZipCode"],
          "Mobile no": "",
          "Phone no": data["PhoneNo"],
          "Email Id": data["EmailId"],
          "Main Location": data["MainLocation"],
          "Sub Location": data["SubLocation"],
          Description: data["Description"],
          "Contact Person": data["ContactPerson"],
          "Billing Address": "",
          Branch: data["BranchName"] ? data["BranchName"].join() : "",
          Attachment1: "",
          Attachment2: "",
          Attachment3: "",
        }
      ],
    };
    if (selectedCustomerData) {
      UpdateCustomerAPI(payload, selectedCustomerData.CustomerID)
    } else {
      AddCustomerAPI(payload)
    }
  }
  const settingDropOptions = (mainOpts, subOpts, data, id) => {
    let jsonData = structuredClone(fields);
    let mainLocOpts = [];
    let subLocOpts = [];
    let mainLocationId = [];
    for (let e of mainOpts) {
      if (e.CustomerId === id) mainLocOpts.push(e)
    }
    for (let e of subOpts) {
      if (e.CustomerId === id) subLocOpts.push(e)
    }
    jsonData.forEach((obj) => {
      if (obj.name === "MainLocation") {
        let mainLocationName = data.MainLocation ? data.MainLocation : "F"
        mainLocationId = mainLocOpts.filter((o) => o.value === mainLocationName)
        obj.options = mainLocOpts
        obj.fieldType = "dropdown"
      } else if (obj.name === "SubLocation") {
        let opts = subLocOpts.filter((o) => o.Parent == (mainLocationId[0]?.LocationId))
        obj.fieldType = "dropdown"
        obj.options = opts
        obj.disabled = false
      }
    })
    setFields(jsonData)
  }
  //API Calls
  //fetch all Customer list
  const fetchAllCustomerList = async () => {
    dispatch(setLoading(true));
    await GetCustomersList(companyId, branchName).then(res => {
      if (res.success && res.data && res.data.Customers && Array.isArray(res.data.Customers)) {
        setDataSource(res.data?.Customers?.reverse());
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
        let branchopts = branchesList.slice(1)
        setLookupsDataInJson(countryOptions, "Country", branchopts, "BranchName");
      } else {
        msg.warning("No Country Data Found !!");
        if (branchesList?.length > 0) {
          let branchopts = branchesList.slice(1)
          setLookupsDataInJson(branchopts, "BranchName");
        }
      }
    }).catch(err => {
      if (branchesList?.length > 0) {
        let branchopts = branchesList.slice(1)
        setLookupsDataInJson(branchopts, "BranchName");
      }
    }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  //Add Customer
  const AddCustomerAPI = async (payload) => {
    dispatch(setLoading(true))
    await postNewCustomer(companyId, payload).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message || "Customer Added Successfully !!");
          fetchAllCustomerList();
          handleReset();
        } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
          msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to Add Customer !!');
        } else {
          msg.warning('Failed to Add Customer !!')
        }
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  //Update Customer
  const UpdateCustomerAPI = async (payload, CustomerId) => {
    dispatch(setLoading(true))
    await updateCustomer(companyId, CustomerId, payload).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message || "Customer Updated Successfully !!");
          fetchAllCustomerList();
          handleReset();
        } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
          msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to Update Customer !!');
        } else {
          msg.warning('Failed to Update Customer !!')
        }
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  //get particular Customer Details
  const getCustomerDataAPI = async (Id) => {
    dispatch(setLoading(true));
    await getEditCustomerListByCompanyId(companyId, Id, branchName).then(res => {
      if (res.success && res.data && res.data.status == undefined) {
        form.reset({ ...form.getValues(), ...res.data[0], BranchName: res.data[0]["BranchName"]?.split(",") })
        getCustomerLocationData(res.data[0], Id)
      } else {
        msg.warning("No Customer Data Found !!");
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  // get customer location data
  const getCustomerLocationData = async (SelectedData, id) => {
    dispatch(setLoading(true));
    await getCustomerLocations(companyId).then(res => {
      if (res.success && res.data && res.data.status == undefined) {
        if (res.data.CustomerLocation) {
          let mainarr = []
          let subarr = []
          if (res.data !== undefined) {
            res.data?.CustomerLocation?.map((obj) => {
              if (obj.Parent === "#") {
                mainarr.push({
                  ...obj,
                  label: obj.LocationName,
                  value: obj.LocationName
                })
              } else {
                subarr.push({
                  ...obj,
                  label: obj.LocationName,
                  value: obj.LocationName
                })
              }
            })
            setSubLocOptions(subarr)
            setMainLocOptions(mainarr)
            settingDropOptions(mainarr, subarr, SelectedData, id)
          }
        }
      } else {
        msg.warning("No Customer Data Found !!");
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const deleteCustomerAPI = async (id) => {
    dispatch(setLoading(true))
    await deleteCustomerByCompanyId(companyId, id).then(res => {
      if (res.success) {
        if (res.data && Array.isArray(res.data) && res.data.length !== 0 && res.data[0].status) {
          msg.success(res.data[0].message || "Customer Deleted Successfully!!");
          fetchAllCustomerList();
          handleReset();
        } else {
          msg.warning(res.data.message || 'Failed to Delete Customer !!')
        }
      }
    }).catch(err => { console.error(err) }).finally(() => { dispatch(setLoading(false)) })
  }
  return (
    <div className="h-full overflow-y-auto    flex flex-col ">
      <div className="flex flex-1 overflow-hidden   ">
        {/* Left Sidebar - Ticket Inbox */}
{dataSource?.length>0 &&
        <div
          className={`
    ${isInboxCollapsed ? 'w-6 p-1' : 'w-64 p-2 mb-2 rounded-b-[5px]'}
   bg-white border border-gray-200 border-t-0 border-t-transparent shadow-xl flex flex-col pb-3 transition-all duration-300 shrink-0
    md:relative
    ${isInboxCollapsed ? 'relative' : 'fixed md:relative'}
    ${isInboxCollapsed ? '' : 'top-15 left-0 h-full z-50 md:top-auto md:left-auto md:h-auto'}
  `}
        >
          {/* Header */}
          <div className="pt-1 shrink-0 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''
                  }`}
              >
                Customers ({dataSource.length})
              </h3>
              <div
                onClick={() => setIsInboxCollapsed(!isInboxCollapsed)}
                className={`cursor-pointer transition-colors hover:bg-gray-100 rounded ${isInboxCollapsed ? 'me-2 py-1' : 'p-1'
                  }`}
              >
                {isInboxCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </div>
            </div>

            {!isInboxCollapsed && (
              <div className="space-y-2 pb-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search Customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Scrollable area */}
          {!isInboxCollapsed && (
            <ScrollArea hideScrollbar={true} className="flex-1 min-h-0 mb-2 truncate max-w-[250px] block">
              <div className="py-2">
                {filteredOrgs.map((cust) => (
                  <div
                    key={cust.CustomerID}
                    className={`p-2.5 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedCustomerData?.CustomerID === cust.CustomerID
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'border border-gray-200'
                      }`}
                    onClick={(e) => handleSelect(e, cust)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs font-medium truncate text-blue-600 me-2 ms-1"
                        title={cust?.CustomerName}
                      >
                        {cust?.CustomerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-gray-500">
                      <Badge
                        title="Customer EmailId"
                        variant="outline"
                        className="bg-green-100 text-green-800 text-[11px] px-2 py-0.5"
                      >
                        {cust?.EmailId}
                      </Badge>

                      <Trash2
                        onClick={(e) => handleDelete(e, cust)}
                        height={18}
                        className="text-red-400 cursor-pointer"
                      />
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
          <div className="px-4 lg:px-6 py-4 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Masters</span>
                  <FaAngleRight />
                  <span>Company</span>
                  <FaAngleRight />
                  <span className="text-gray-900 font-medium">Customer</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReusableButton
                variant="text"
                // size="small"
                onClick={() => { handleReset() }}
                icon={<X className="h-4 w-4" />}
                className='btn-reset-clear-style'
              >
                {selectedCustomerData ? "Cancel" : "Clear"}
              </ReusableButton>
              <ReusableButton
                // size="small"
                variant="primary"
                onClick={() => { handleSubmit(handleSave)() }}
                icon={<Save className="h-4 w-4" />}
                className='btn-submit-style'
              >
                {selectedCustomerData ? "Update" : "Save"}
              </ReusableButton>
            </div>
          </div>

          {/* Content Grid with Individual Scroll Areas */}
          <div className="flex-1 p-3 pt-0 overflow-hidden min-h-0  ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                <ScrollArea className="flex-1  ">
                  <div className="space-y-6 pr-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="space-y-6">

                          <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                            {
                              fields.map(obj => {
                                if (obj.fieldType === "heading") {
                                  return <h3 key={obj.text} className='text-lg font-semibold text-gray-900 border-b col-span-full pb-2'>{obj.text}</h3>
                                }
                                if (obj.fieldType === "dropdown" && obj.name === "MainLocation") {
                                  return (
                                    <div key={obj.name}>

                                      {renderField(obj)}
                                      <div className='text-xs text-cyan-500 font-bold flex justify-end'>
                                        <NavLink to="/layout/masters/company/customer/customer-location" state={{ selectedCustomerData }} >Add Locations</NavLink>
                                      </div>
                                    </div>
                                  )
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
              Are you sure you want to delete Customer {deletingCustomerData?.CustomerName}?

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
              onClick={() => { deleteCustomerAPI(deletingCustomerData.CustomerID); setIsDelModalOpen(false) }}
            >
              Delete
            </ReusableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Customer;



// import React, { useCallback, useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
// import { Edit2, Trash2, Plus, Edit } from 'lucide-react';
// import { ReusableButton } from '@/components/ui/reusable-button';
// import { ColumnDef } from '@tanstack/react-table';
// import { toast } from 'sonner';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setLoading } from '@/store/slices/projectsSlice';
// import { GetCustomersList } from '@/services/customerServices';
// import { useToast } from '@/hooks/use-toast';

// interface CustomerData {
//   CustomerID: Number,
//   CustomerName: string,
//   CustomerTypeID: number,
//   CustomerType: string,
//   PAN: string,
//   GSTIN: string,
//   AddOnAddressID: 12350,
//   AddOnAddress: string,
//   City: string,
//   State: string,
//   Country: string,
//   ZipCode: string,
//   PhoneNo: string,
//   MobileNo: string,
//   EmailId: string,
//   MainLocationId: 0,
//   MainLocation: string,
//   SubLocationId: 0,
//   SubLocation: string,
//   Description: string,
//   ContactPerson: string,
//   BillingAddress: string,
//   BranchName: string,
//   Attachment1: string,
//   Attachment2: string,
//   Attachment3: string
// }
// interface OrganizationData {
//   id: string;
//   assetCode: string;
//   assetName: string;
//   customerAssetNo: string;
//   barcodeNo: string;
//   acquisition: 'Purchased' | 'Leased';
// }

// const mockData: OrganizationData[] = [
//   {
//     id: '1',
//     assetCode: 'AI/904/924/000128',
//     assetName: 'Test Mob2',
//     customerAssetNo: 'wer23r32r_1',
//     barcodeNo: 'AI/904/924/000128',
//     acquisition: 'Purchased'
//   },
//   {
//     id: '2',
//     assetCode: 'AI/904/111/000002',
//     assetName: 'Test Mob',
//     customerAssetNo: 'gsdrg_2',
//     barcodeNo: 'AI/904/111/000002',
//     acquisition: 'Purchased'
//   },
//   {
//     id: '3',
//     assetCode: 'AI/904/111/000001',
//     assetName: 'Test Mob',
//     customerAssetNo: 'gsdrg_1',
//     barcodeNo: 'AI/904/111/000001',
//     acquisition: 'Purchased'
//   },
//   {
//     id: '4',
//     assetCode: 'AI/IT/LP/000002',
//     assetName: 'Printer',
//     customerAssetNo: '123456',
//     barcodeNo: '123456',
//     acquisition: 'Leased'
//   },
//   {
//     id: '5',
//     assetCode: 'ITC/IT/TB/000001',
//     assetName: 'Tablet',
//     customerAssetNo: 'ITC/IT/TB/000001',
//     barcodeNo: '3600001586',
//     acquisition: 'Purchased'
//   },
//   {
//     id: '6',
//     assetCode: 'ITC/IT/COM/000003',
//     assetName: 'COMPUTER',
//     customerAssetNo: 'ITC/IT/COM/000003',
//     barcodeNo: '3800001751',
//     acquisition: 'Purchased'
//   },
//   {
//     id: '7',
//     assetCode: 'ITC/IT/COM/000002',
//     assetName: 'COMPUTER',
//     customerAssetNo: 'ITC/IT/COM/000002',
//     barcodeNo: '3800008370',
//     acquisition: 'Purchased'
//   },
// ];

//   const CustomerColumns = [
//     { id: 'CustomerName', accessorKey: "CustomerName", header: "Customer Name" },
//     { id: 'EmailId', accessorKey: "EmailId", header: "Email Id" },
//     { id: 'MobileNo', accessorKey: "MobileNo", header: "MobileNo" },
//     { id: 'FirstName', accessorKey: "FirstName", header: "First Name" },
//   ]
// const Customer = () => {
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const companyId = useAppSelector(state => state.projects.companyId)
//   const branchName = useAppSelector(state => state.projects.branch);
//   const { toast } = useToast();
//   const itemsPerPage = 7;
//   const [dataSource, setDataSource] = useState<CustomerData[]>([]);
//   const [columns, setColumns] = useState<ColumnDef<CustomerData>[]>(CustomerColumns);
//   const dispatch = useAppDispatch();

//   const toggleSelectAll = () => {
//     if (selectedItems.length === mockData.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(mockData.map(item => item.id));
//     }
//   };

//   const toggleSelectItem = (id: string) => {
//     setSelectedItems(prev =>
//       prev.includes(id)
//         ? prev.filter(item => item !== id)
//         : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     if (companyId && branchName) {
//       fetchAllCustomerList();
//     }
//   }, [companyId, branchName])

//   const fetchAllCustomerList = async () => {
//     dispatch(setLoading(true));
//     await GetCustomersList(companyId, branchName).then(res => {
//       if (res.data && res.data.Customers.length > 0) {
//         setDataSource(res.data.Customers);
//       } else {
//         setDataSource([]);
//       }
//     }).catch(err => {}).finally(() => {
//       dispatch(setLoading(false));
//     });
//   }

//   const handleDelete = (data: CustomerData): void => {
//   }
//   const handleEdit = (data: CustomerData): void => {
//   }
//   const tableActions: TableAction<CustomerData>[] = [
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
//   const handleRefresh = useCallback(() => {
//     toast({ title: "Data Refreshed", description: "All users data has been updated", });
//     fetchAllCustomerList();
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
//             <span>Masters</span>
//             <span>/</span>
//             <span>Company</span>
//             <span>/</span>
//             <span className="text-gray-900 font-medium">Customer</span>
//           </div>
//         </div>
//       </header>

//       <div className="p-6 space-y-6 animate-fade-in">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <ReusableButton
//             htmlType="button"
//             variant="default"
//             onClick={null}
//             iconPosition="left"
//             size="middle"
//             className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
//           >
//             <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Customer</div>
//           </ReusableButton>
//         </div>
//         <Card className="shadow-sm">
//           <CardHeader className="pb-4">
//           </CardHeader>
//           <CardContent>
//             <ReusableTable
//               data={dataSource} columns={columns}
//               // permissions={""}
//               permissions={tablePermissions}
//               title="Customers List"
//               onRefresh={handleRefresh}
//               enableSearch={true}
//               enableSelection={false}
//               enableExport={true}
//               enableColumnVisibility={true}
//               enablePagination={true}
//               enableSorting={true}
//               enableFiltering={true}
//               pageSize={10}
//               emptyMessage="No Data found"
//               rowHeight="normal"
//               storageKey="service-request-type-list-table"
//               actions={tableActions}
//               enableColumnPinning
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Customer;
