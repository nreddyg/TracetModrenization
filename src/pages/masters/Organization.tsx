import {useEffect, useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Search, X, Save } from 'lucide-react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { AddOrganization, GetCountryList, GetCurrency, GetOrganizationsList, UpdateOrganization } from '@/services/organizationServices';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject, UploadFileInput } from '@/Local_DB/types/types';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { ORGANIZATION_DETAILS } from '@/Local_DB/Form_JSON_Data/OrganizationDB';
import { useMessage } from '@/components/ui/reusable-message';
import { convertOrgLogoFromApi, fileToByteArray } from '@/_Helper_Functions/HelperFunctions';
import axios from 'axios';
interface OrganizationData {
  OrganizationId: number,
  OrganizationName: string,
  ParentId: number | null,
  OrganizationKnownAs: string,
  CompanyCode: string,
  OrganizationTypeId: number,
  OrganizationType: string,
  OrganizationDomain: string | null,
  PanNumber: string,
  AddressLine1: string,
  AddressLine2: string | null,
  City: string,
  State: string,
  CountryID: number,
  CountryName: string,
  ZipCode: string,
  OrganizationEmail: string,
  OrganizationPhone: string,
  Website: string | null,
  CurrencyId: number,
  Currency: string,
  CurrencySymbol: string,
  OrganizationLogo: string | null,
  OrganizationLogoName: string | null,
  OrganizationLogoType: string | null,
  OrganizationLogoConversionType: string | null
}

type UploadedFileOutput = {
  OrganizationLogo: string,
  OrganizationLogoName: string,
  OrganizationLogoType: string,
  OrganizationLogoConversionType: string
};


const Organization = () => {
  const dispatch = useAppDispatch();
  const msg = useMessage();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<OrganizationData[]>([]);
  const [fields, setFields] = useState<BaseField[]>(ORGANIZATION_DETAILS);
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationData | null>(null);
  const [selectedOrganizationData, setSelectedOrganizationData] = useState<OrganizationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedData, setUploadedData] = useState<UploadedFileOutput[]>([{
    OrganizationLogo: "",
    OrganizationLogoName: "",
    OrganizationLogoType: "",
    OrganizationLogoConversionType: ""
  }]);

  const filteredOrgs = dataSource.filter(org => {
    const matchesSearch = org.OrganizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.CompanyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.OrganizationKnownAs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.State.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.CountryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  useEffect(() => {
    if (companyId) fetchAllOrganizationsList();
    fetchCountryList();
  }, [companyId]);
  useEffect(() => {
    if (watch("CountryName")) {
      fetchCurrencyBasedOnCountry(watch("CountryName"));
    }
  }, [watch("CountryName")])
  useEffect(() => {
    if (form.watch("OrganizationLogo")) {
      const process = async () => {
        const result = await multipleFileUpload(form.watch("OrganizationLogo"));
      };
      process();
    }
  }, [form.watch("OrganizationLogo")]);
  useEffect(() => {
    if (selectedOrganizationData?.OrganizationLogo) {
      const loadFile = async () => {
        const file = await convertOrgLogoFromApi(selectedOrganizationData);
        if (file) {
          form.setValue("OrganizationLogo", [file]);
          setUploadedData([
            {
              OrganizationLogo: selectedOrganizationData.OrganizationLogo,
              OrganizationLogoName: selectedOrganizationData.OrganizationLogoName,
              OrganizationLogoType: selectedOrganizationData.OrganizationLogoType,
              OrganizationLogoConversionType: selectedOrganizationData.OrganizationLogoConversionType,
            },
          ]);
        }
      };
      loadFile();
    }
  }, [selectedOrganizationData]);


  const multipleFileUpload = async (filelist: UploadFileInput[]): Promise<void> => {
    const fileArray = Array.isArray(filelist) ? filelist : [];
    if (fileArray.length === 0) {
      return;
    }
    const files: (UploadedFileOutput | null)[] = await Promise.all(
      fileArray.map(async (file, index) => {
        try {
          if (!file.url) throw new Error(`Missing file URL for file at index ${index}`);
          const response = await axios.get<Blob>(file.url, { responseType: "blob" });
          const byteArray = await fileToByteArray(response.data);
          const byteArrayAsArray = Array.from(byteArray);
          const jsonArrayString = JSON.stringify(byteArrayAsArray);
          const fileType = file.name.split(".").pop() || "";
          return {
            OrganizationLogo: jsonArrayString,
            OrganizationLogoName: file.name,
            OrganizationLogoType: fileType,
            OrganizationLogoConversionType: file.type,
          };
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error);
          return null;
        }
      })
    );
    const validFiles = files.filter(
      (file): file is UploadedFileOutput => file !== null
    );
    setUploadedData(validFiles);
  };
  //fetch all users list
  const fetchAllOrganizationsList = async (orgId?: number) => {
    dispatch(setLoading(true));
    await GetOrganizationsList(orgId).then(res => {
      if (res.success && res.data && res.data.organizations && Array.isArray(res.data.organizations)) {
        if (orgId) {
          form.reset({ ...res.data.organizations[0], OrganizationLogo: [] });
          setUploadedData([{
            OrganizationLogo: res.data.organizations[0].OrganizationLogo || "",
            OrganizationLogoName: res.data.organizations[0].OrganizationLogoName || "",
            OrganizationLogoType: res.data.organizations[0].OrganizationLogoType || "",
            OrganizationLogoConversionType: res.data.organizations[0].OrganizationLogoConversionType || ""
          }])
          setSelectedOrganizationData(res.data.organizations[0]);
        } else {
          setDataSource(res.data.organizations);
        }
      } else {
        if (orgId) {
          form.reset();
          setSelectedOrganizationData(null);
        } else {
          setDataSource([]);
        }
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  function setLookupsDataInJson(data: any, key: string) {
    const updatedFields = fields.map(field => {
      if (field.name === key) {
        return { ...field, options: data };
      }
      return field;
    });
    setFields(updatedFields);
  }
  const fetchCountryList = async () => {
    dispatch(setLoading(true));
    await GetCountryList().then(res => {
      if (res.success && res.data && Array.isArray(res.data.CountryList)) {
        const countryOptions = res.data.CountryList.map((country: any) => ({
          label: country.CountryName,
          value: country.CountryName,
        }));
        setLookupsDataInJson(countryOptions, "CountryName");
      } else {
        msg.warning("No Country Data Found !!");
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const fetchCurrencyBasedOnCountry = async (Country: string) => {
    dispatch(setLoading(true));
    await GetCurrency(Country).then(res => {
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const currencyData = res.data[0];
        setValue("Currency", currencyData.CurrencyName);
        setValue("CurrencySymbol", currencyData.CurrencySymbol);
      } else {
        setValue("Currency", "");
        setValue("CurrencySymbol", "");
        msg.warning("No Currency Data Found For This Country !!");
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const handleSelect = (data: OrganizationData) => {
    // handleReset();
    setSelectedOrganization(data);
    fetchAllOrganizationsList(data.OrganizationId);
  }
  const handleSave = async (formData: GenericObject) => {
    const isValid = await trigger();
    if (!isValid) {
      msg.error("Please fix the validation errors before submitting.");
      return;
    }
    let uploadData = uploadedData[0];
    let payload = {
      "OrganizationDetails": [
        {
          "OrganizationName": watch("OrganizationName"),
          "OrganizationKnownAs": watch("OrganizationKnownAs"),
          "OrganizationType": watch("OrganizationType"),
          "OrganizationDomain": watch("OrganizationDomain"),
          "PanNumber": watch("PanNumber"),
          "AddressLine1": watch("AddressLine1"),
          "AddressLine2": watch("AddressLine2"),
          "City": watch("City"),
          "State": watch("State"),
          "CountryName": watch("CountryName"),
          "ZipCode": watch("ZipCode"),
          "OrganizationEmail": watch("OrganizationEmail"),
          "OrganizationPhone": watch("OrganizationPhone"),
          "Website": watch("Website"),
          ...uploadData,
        }
      ]
    }
    if (selectedOrganizationData) {
      dispatch(setLoading(true));
      await UpdateOrganization(payload).then(res => {
        if (res.success) {
          if (res.data.status) {
            msg.success(res.data.message || "Organization Updated Successfully !!");
            fetchAllOrganizationsList();
            handleReset();
          } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
            msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to update organization !!');
          } else {
            msg.warning('Failed to update organization !!')
          }
        }
      }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    } else {
      dispatch(setLoading(true));
      await AddOrganization(payload).then(res => {
        if (res.success) {
          if (res.data.status) {
            msg.success(res.data.message || "Organization Added Successfully !!");
            fetchAllOrganizationsList();
            handleReset();
          } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
            msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to add organization !!');
          } else {
            msg.warning('Failed to add organization !!')
          }
        }
      }).catch(err => console.log(err)).finally(() => { dispatch(setLoading(false)) })
    }
  }
  const handleReset = () => {
    setSelectedOrganization(null);
    setSelectedOrganizationData(null);
    setUploadedData([{ OrganizationLogo: "", OrganizationLogoName: "", OrganizationLogoType: "", OrganizationLogoConversionType: "" }]);
    form.reset({
      OrganizationName: '', OrganizationKnownAs: '', OrganizationType: '', PanNumber: '',
      OrganizationEmail: '', OrganizationPhone: '', OrganizationDomain: '', Website: '', CountryName: '',
      Currency: '', CurrencySymbol: '', OrganizationLogo: [], AddressLine1: '', AddressLine2: '', City: '', State: '', ZipCode: ''
    });
  };

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
          <>
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
                  multiple={false}
                  fieldInfo={'Files allowed to upload are .png, .jpg, .jpeg'}
                />
              )}
            />
          </>
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
  return (
    <div className="h-full   bg-gray-50 flex flex-col ">
      <div className="flex flex-1 overflow-hidden   ">
        {/* Left Sidebar - Ticket Inbox */}
        {dataSource.length!==0 && <div className={`${isInboxCollapsed ? 'w-6 p-1' : 'w-34 p-2 mb-2 rounded-b-[5px]'} bg-white border-r    border-0 shadow-lg flex pb-3 flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
          <div className="pt-1 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                Organizations ({dataSource.length})
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
                    placeholder="Search Organizations..."
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
                {filteredOrgs.map((org) => (
                  <div
                    key={org.OrganizationId}
                    className={`p-2.5 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedOrganization?.OrganizationId === org.OrganizationId
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'border border-gray-200'
                      }`}
                    onClick={() => handleSelect(org)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-blue-600 me-2">{org.CompanyCode}</span>
                      <Badge
                        title={`Organization Known As : ${org.OrganizationKnownAs}`}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 text-center truncate inline-block w-[90px] text-[11px] px-2 py-0.5"
                      >
                        {org.OrganizationKnownAs}
                      </Badge>
                    </div>

                    <h3
                      className="text-xs font-medium text-gray-900 mb-1 truncate"
                      title={org?.OrganizationName}
                    >
                      {org?.OrganizationName}
                    </h3>

                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-gray-500">
                      <Badge
                        title="Organization Type"
                        variant="outline"
                        className="bg-green-100 text-green-800 text-[11px] px-2 py-0.5"
                      >
                        {org.OrganizationType}
                      </Badge>
                      <div>
                        <span
                          title={org.CountryName}
                          className="block max-w-[90px] truncate text-[11px] text-gray-500"
                        >
                          •{' '}
                          {org.CountryName}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

          )}
        </div>}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          {/* Navigation and Action Bar */}
          <div className="bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Masters</span>
                  <span>/</span>
                  <span>Company</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">Organization</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReusableButton
                variant="text"
                size="small"
                onClick={handleReset}
                icon={<X className="h-4 w-4" />}
              >
                {selectedOrganizationData ? "Cancel" : "Reset"}
              </ReusableButton>
              <ReusableButton
                size="small"
                variant="primary"
                onClick={(data) => handleSubmit(handleSave)(data)}
                icon={<Save className="h-4 w-4" />}
              >
                {selectedOrganizationData ? "Update" : "Save"}
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
    </div>
  );
};

export default Organization;

// import { useCallback, useEffect, useState } from 'react';
// import { SidebarTrigger } from '@/components/ui/sidebar';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
// import { Trash2, Plus, Edit } from 'lucide-react';
// import { ColumnDef } from '@tanstack/react-table';
// import { useToast } from '@/hooks/use-toast';
// import { ReusableButton } from '@/components/ui/reusable-button';
// import { GetUsersList } from '@/services/userServices';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setLoading } from '@/store/slices/projectsSlice';
// import { GetOrganizationsList } from '@/services/organizationServices';
// interface OrganizationData {
//   OrganizationId: number,
//   OrganizationName: string,
//   ParentId: number | null,
//   OrganizationKnownAs:string,
//   CompanyCode: string,
//   OrganizationTypeId: number,
//   OrganizationType: string,
//   OrganizationDomain: string | null,
//   PanNumber: string,
//   AddressLine1: string,
//   AddressLine2: string | null,
//   City: string,
//   State: string,
//   CountryID: number,
//   CountryName: string,
//   ZipCode: string,
//   OrganizationEmail: string,
//   OrganizationPhone: string,
//   Website: string | null,
//   CurrencyId: number,
//   Currency: string,
//   CurrencySymbol:string,
//   OrganizationLogo: string | null,
//   OrganizationLogoName:  string | null,
//   OrganizationLogoType:  string | null,
//   OrganizationLogoConversionType: string | null
// }

// const Organization = () => {
//   const { toast } = useToast();
//   const dispatch = useAppDispatch();
//   const companyId = useAppSelector(state => state.projects.companyId)
//   const [dataSource, setDataSource] = useState<OrganizationData[]>([]);
//   const [columns, setColumns] = useState<ColumnDef<OrganizationData>[]>([
//     { id: 'OrganizationName', accessorKey: "OrganizationName", header: "Organization Name" },
//     { id: 'CompanyCode', accessorKey: "CompanyCode", header: "Company Code" },
//     { id: 'OrganizationKnownAs', accessorKey: "OrganizationKnownAs", header: "Known As" },
//     { id:'City', accessorKey:"City", header:"City" },
//     { id:'State', accessorKey:"State", header:"State" },   
//   ])

//   useEffect(() => {
//     if (companyId) fetchAllOrganizationsList();
//   }, [companyId]);
//   //fetch all users list
//   const fetchAllOrganizationsList = async () => {
//     dispatch(setLoading(true));
//     await GetOrganizationsList(companyId).then(res => {
//       if (res.success && res.data && res.data.organizations && Array.isArray(res.data.organizations)) {
//         setDataSource(res.data.organizations);
//       }else{
//         setDataSource([]);
//       }
//     }).catch(err => console.log(err)).finally(() => {
//       dispatch(setLoading(false));
//     });
//   }
//   const handleDelete = (data: OrganizationData): void => {
//   }
//   const handleEdit = (data: OrganizationData): void => {
//   }
//   const tableActions: TableAction<OrganizationData>[] = [
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
//       toast({ title: "Data Refreshed", description: "All organizations data has been updated", });
//       fetchAllOrganizationsList();
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
//             <span>Masters</span><span>/</span><span>Company</span><span>/</span><span className="text-gray-900 font-medium">Organization</span>
//           </div>
//         </div>
//       </header>
//       <div className="p-6 space-y-6 animate-fade-in">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
//           <ReusableButton
//             htmlType="button"
//             variant="default"
//             onClick={null}
//             iconPosition="left"
//             size="middle"
//             className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
//           >
//             <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Organization</div>
//           </ReusableButton>
//         </div>
//         <Card className="shadow-sm">
//           <CardHeader className="pb-4">
//           </CardHeader>
//           <CardContent>
//             <ReusableTable
//               data={dataSource} columns={columns}
//               permissions={tablePermissions}
//               title="Organization List"
//               onRefresh={handleRefresh} enableSearch={true}
//               enableSelection={false} enableExport={true}
//               enableColumnVisibility={true} enablePagination={true}
//               enableSorting={true} enableFiltering={true}
//               pageSize={10} emptyMessage="No Data found"
//               rowHeight="normal" storageKey="organization-master-list-table"
//               actions={tableActions}
//               enableColumnPinning
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Organization;
