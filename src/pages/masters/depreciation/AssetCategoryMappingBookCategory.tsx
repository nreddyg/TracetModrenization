import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/common/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import ReusableTable, { TablePermissions } from '@/components/ui/reusable-table';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { Asset_Category_Book_Category_Mapping_DB } from '@/Local_DB/Form_JSON_Data/AssetCategoryMappingBookCategoryDB';
import { useAppDispatch, useAppSelector } from '@/store/reduxStore';
import { useMessage } from '@/components/ui/reusable-message';
import { getAssetCatBasedOnYear, getAssetCategoryBookMappingDetails, getDateList, getDepBookDetails, getDownloadAssetCatData, getDropdownOptions, postExcelData, postOrUpdtAddNewFinancialYear } from '@/services/assetcatMappingBookServices';
import { setLoading } from '@/store/slices/projectsSlice';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

interface AssetCatBookCat {
    AssetMainCategoryName: string;
    AssetSubCategoryName: string;
    BookCategory: string;
}

// const mockMappings: CategoryMapping[] = [
//     { mainCategory: 'Chairs', subCategory: 'SFs', bookCategory: '' },
//     { mainCategory: 'Chairs', subCategory: 'Sofas', bookCategory: '' },
//     { mainCategory: 'Chairs', subCategory: 'new cost', bookCategory: '' },
//     { mainCategory: 'Chairs', subCategory: 'one more', bookCategory: '' },
//     { mainCategory: 'Chairs', subCategory: 'unique', bookCategory: '' },
// ];

const bookOptions = [
    { value: 'basic-dep-rules', label: 'Basic Dep Rules' },
    { value: 'importbook9', label: 'importBook9' },
    { value: 'test1', label: 'test1' },
    { value: 'book1', label: 'book1' },
];

const bookCategoryOptions = [
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'equipment', label: 'Equipment' },
];

const EFFECTIVE_FROM =
{
    label: "Effective From",
    fieldType: "date",
    name: "effetiveFrominModal",
    placeholder: "",
    isRequired: false,
    format: "DD/MM/YYYY",
    allowClear: false,
    // defaultValue:new Date(),
}

const AssetCategoryMappingBookCategory = () => {
    const [selectedBook, setSelectedBook] = useState('basic-dep-rules');
    // const [effectiveFrom, setEffectiveFrom] = useState<Date | null>(new Date('2024-04-01'));
    // const [mappings, setMappings] = useState<CategoryMapping[]>(mockMappings);
    const [fields, setFields] = useState<BaseField[]>(Asset_Category_Book_Category_Mapping_DB);
    // const [effetiveFrom, setEffectiveFrom] = useState(EFFECTIVE_FROM)
    const [isRanDep, setIsRanDep] = useState(false);
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [modalDatasource, setModalDatasource] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [downloadData, setDownloadData] = useState([]);
    const [bookData, setBookData] = useState([]);
    const [windowCount, setWindowCount] = useState(0);
    const [tabDropOptions, setTabDropOptions] = useState([])
    const [dateList, setDateList] = useState([]);
    const [afterFyDate, setAfterFyDate] = useState("");
    const [FYStartDate, setFYStartDate] = useState('');
    const [newUploadModal, setUploadModal] = useState(false);

    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const msg = useMessage()
    const dispatch = useAppDispatch();

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
    });
    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    const selectedBookId = watch("book");

    useEffect(() => {
        if (companyId) getDepreciationBookDetails(companyId)
    }, [companyId])

    useEffect(() => {
        if (companyId && selectedBookId && FYStartDate) getDropOptionsInTab(selectedBookId, companyId, FYStartDate);
    }, [companyId, selectedBookId, FYStartDate])

    useEffect(() => {
        if (companyId && FYStartDate && selectedBookId) {
            GetExcelData(FYStartDate, selectedBookId, companyId);
        }
    }, [FYStartDate, selectedBookId, companyId])
    useEffect(() => {
        if (selectedBookId && companyId) {
            getAssetCategoryBookCatMapping(selectedBookId, companyId)
            // setWindowCount(0);
        } else {
            setDataSource([])
        }
    }, [companyId, selectedBookId])

    useEffect(() => {
        if (companyId && FYStartDate && selectedBookId) {
            GetAssetMapPrevNextDateDetails(companyId, FYStartDate, selectedBookId)
        }
    }, [companyId, selectedBookId, FYStartDate])

    useEffect(() => {
        if (companyId && selectedBookId) {
            getEffectiveFromDateList(companyId, selectedBookId);
        }
    }, [companyId, selectedBookId, FYStartDate])

    useEffect(() => {
        if (!selectedBookId) return;
        const bookObj = bookData.find((obj) => obj.BookID === selectedBookId);
        if (bookObj?.FYStartDate) {
            const formattedDate = timestampToDateConversion(bookObj.FYStartDate);
            setFYStartDate(formattedDate);
            setValue("effectivefrom", formattedDate);
        }
    }, [selectedBookId, bookData, setValue]);

    // conversion of date
    function timestampToDateConversion(dateStr: string): string {
        const date = new Date(dateStr);
        const formatted =
            date.getDate().toString().padStart(2, "0") + "/" +
            (date.getMonth() + 1).toString().padStart(2, "0") + "/" +
            date.getFullYear();

        return formatted;
    }

    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
        if (!name || !show) return null;
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
        };

        switch (fieldType) {
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
                                    fieldInfo={'Files allowed to Upload .xls,.xlsx'}
                                />
                            )}
                        />
                    </>
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
                                usePortal={false}
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
                                usePortal={false}
                                defaultValue={null}
                                {...field}
                                // disabled={(name === "costbreakgroup" && subRecord.CostBreakupGroupNames) ? true : false}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
                            />
                        )}
                    />
                );
        }
    }

    const assetCatBookCatMappingCols: ColumnDef<AssetCatBookCat>[] = [
        {
            accessorKey: 'AssetMainCategoryName',
            header: 'Asset Main category',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetMainCategoryName')}</span>
            ),
        },
        {
            accessorKey: 'AssetSubCategoryName',
            header: 'Asset Sub Category',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetSubCategoryName')}</span>
            ),
        },
        {
            accessorKey: 'BookCategory',
            header: 'Book Category',
            cell: ({ row }) => {
                return (
                    <span>
                        <ReusableDropdown
                            containerClassName="p-2"
                            className="h-8 border-2"
                            // disabled={isRanDep}
                            placeholder=" "
                            defaultValue={row.original.BookCategory == "-- Select Book Category --" ? "--Select Book Category--" : row.original.BookCategory}
                            disabled={isRanDep}
                            options={tabDropOptions}
                            allowClear={false}
                            onChange={(newValue) => {
                                handleChange(newValue, row.id, "BookCategory", "false")
                            }}
                            backgroundColor="white"
                            size="small"
                        />
                    </span>
                );
            },
        }
    ]

    const financialYearColumns: ColumnDef<AssetCatBookCat>[] = [
        {
            accessorKey: 'AssetMainCategoryName',
            header: 'Asset Main category',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetMainCategoryName')}</span>
            ),
        },
        {
            accessorKey: 'AssetSubCategoryName',
            header: 'Asset Sub Category',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetSubCategoryName')}</span>
            ),
        },
        // {
        //     accessorKey: 'BookCategory',
        //     header: 'Book Category',
        //     cell: ({ row }) => {
        //         return (
        //             <span>
        //                 <ReusableDropdown
        //                     // usePortal={isMainDialogOpen ? true : true}
        //                     usePortal={true}
        //                     containerClassName="p-2"
        //                     className="h-8 border-2"
        //                     placeholder=" "
        //                     defaultValue={row.original.BookCategory == "-- Select Book Category --" ? "--Select Book Category--" : row.original.BookCategory}
        //                     disabled={isRanDep}
        //                     options={tabDropOptions}
        //                     allowClear={false}
        //                     onChange={(newValue) => {
        //                         handleChange(newValue, row.id, "BookCategory", "true")
        //                     }}
        //                     backgroundColor="white"
        //                     size="small"
        //                 />
        //             </span>
        //         );

        //     },
        // }
        {
            accessorKey: 'BookCategory',
            header: 'Book Category',
            cell: ({ row }) => {
                return (
                    <span>
                        {/* <select
                            className="h-8 border-2 border-gray-300 rounded-md px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={row.original.BookCategory === "-- Select Book Category --" ? "" : row.original.BookCategory}
                            disabled={isRanDep}
                            onChange={(e) => handleChange(e.target.value, row.id, "BookCategory", "true")}
                        >
                            <option value="">-- Select Book Category --</option>
                            {tabDropOptions.map((opt, index) => (
                                <option key={index} value={opt.value || opt.label}>
                                    {opt.label}
                                </option>
                            ))}
                        </select> */}
                        <div className="relative w-full">
                            <select
                                value={row.original.BookCategory === "-- Select Book Category --" ? "" : row.original.BookCategory}
                                onChange={(e) => handleChange(e.target.value, row.id, "BookCategory", "true")}
                                disabled={isRanDep}
                                className="w-full h-8 text-sm px-2 pr-8 rounded-md border border-[hsl(214.29deg_31.82%_91.37%)] transition-colors appearance-none focus:outline-none focus:ring-2 focus:border-blue-400 hover:border-blue-400 cursor-pointer"
                                style={{
                                    backgroundColor: isRanDep ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)',
                                    borderColor: 'hsl(214.29deg 31.82% 91.37%)',
                                    opacity: isRanDep ? 0.6 : 1,
                                }}
                            >
                                <option value="">-- Select Book Category --</option>
                                {tabDropOptions.map((opt, index) => (
                                    <option key={index} value={opt.value || opt.label}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {/* Chevron Icon */}
                            <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
                                <ChevronDown size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </span>
                );
            },
        }

    ]

    const handleChange = (value, id, key, flag) => {
        let data = (flag === "true") ? [...modalDatasource] : [...dataSource];
        data[parseInt(id)][key] = value;

        if (flag !== "true") {
            setDataSource(data);
        } else {
            setModalDatasource(data);
        }
    }
    //getAssetCategory by id
    const getAssetCategoryBookCatMapping = async (id, companyId) => {
        dispatch(setLoading(true))
        await getAssetCategoryBookMappingDetails(id, companyId).then(res => {
            if (res.data && res.data.AssetCatBookCatMappingDetails.length > 0) {
                setDataSource(res.data.AssetCatBookCatMappingDetails.map((obj, index) => ({ ...obj, uniqueKey: index })));
            } else {
                setDataSource([])
                msg.warning('no data found')
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }

    // get BookCategoryDetails to render in dropdown of table
    const getDropOptionsInTab = async (compId, bookId, FYStartDate) => {
        dispatch(setLoading(true))
        await getDropdownOptions(compId, bookId, FYStartDate)
            .then((res) => {
                if (res.data) {
                    if (res.data.PrevNextFinancialYearBookCategoryDetails) {
                        let respdata = res.data.PrevNextFinancialYearBookCategoryDetails
                        const apiDropOptions = respdata.map((item) => ({
                            value: item.CategoryName,
                            label: item.CategoryName,
                        }))
                        let tabOpts = [
                            {
                                "value": '--Select Book Category--',
                                'label': '--Select Book Category--',
                            },
                            {
                                "value": 'Non depreciable',
                                'label': 'Non depreciable'
                            },
                            {
                                "value": 'Not applicable',
                                'label': 'Not applicable'
                            },]
                        setTabDropOptions([
                            ...tabOpts,
                            ...apiDropOptions,
                        ])
                    }
                    else { setTabDropOptions([]) }
                }
                else {
                    setTabDropOptions([]);
                }
            }).catch(() => { }).finally(() => { dispatch(setLoading()) })
    }

    // get AssetData based on year
    const GetAssetMapPrevNextDateDetails = async (compId, FYStartDate, selectedBookId) => {
        dispatch(setLoading(true));
        await getAssetCatBasedOnYear(compId, FYStartDate, selectedBookId)
            .then((res) => {
                if (res.data && res.data.PrevNextFinancialYearBookCategoryMappingDetails.length > 0) {
                    // if (modalOpen) {
                    // setModalDatasource(res.data.PrevNextFinancialYearBookCategoryMappingDetails.map((obj, index) => ({ ...obj, uniqueKey: index })));
                    // } else {
                    setDataSource(res.data.PrevNextFinancialYearBookCategoryMappingDetails.map((obj, index) => ({ ...obj, uniqueKey: index })));
                    setIsRanDep(res.data.IsRanDep);
                    // }
                }
                else {
                    setDataSource([]);
                }
            }).catch(() => { })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }

    // getEffectiveFrom DateList
    const getEffectiveFromDateList = async (companyId, selectedBookId) => {
        dispatch(setLoading(true))
        await getDateList(companyId, selectedBookId)
            .then((res) => {
                if (res.data !== undefined) {
                    if (res.data.EffectiveFromList) {
                        setDateList(res.data.EffectiveFromList);
                    }
                    else {
                        setDateList([]);
                    }
                }
                else {
                    setDateList([])
                }
            }).catch(() => { }).finally(() => { dispatch(setLoading(false)) })
    }

    // data needed to download excel
    const GetExcelData = async (FYStartDate, selectedBookId, companyId) => {
        try {
            dispatch(setLoading(true));
            const res = await getDownloadAssetCatData(FYStartDate, selectedBookId, companyId);
            if (res?.data) {
                setDownloadData(res.data);
            } else {
                setDownloadData([]);
            }
        } catch (error) {
            console.error("Error fetching Excel data:", error);
            setDownloadData([]);
        } finally {
            dispatch(setLoading(false));
        }
    };

    //getBooks whole Data
    const getDepreciationBookDetails = async (companyId) => {
        dispatch(setLoading(true))
        await getDepBookDetails(companyId)
            .then(res => {
                if (res.data && res.data.BookDetails.length > 0) {
                    setBookData(res.data.BookDetails);
                    const options = res.data.BookDetails.map((main: any) => ({
                        value: main?.BookID,
                        label: main?.BookName,
                        bookDate: main?.FYStartDate
                    }));
                    setFields((prev) =>
                        prev.map((f) =>
                            f.name === "book" ? { ...f, options } : f
                        )
                    );
                } else {
                    msg.warning('no data found')
                }
            })
            .catch(err => { })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    // creation of payload
    function AllTabData(key) {
        let arr = [];
        let apiData = [];
        if (key === true) {
            apiData.push(...dataSource);
        }
        // else if (key === false) {
        //   apiData.push(...modalDatasource);
        // }
        apiData.map((obj) => {
            arr.push({
                "AssetCategoryId": obj.AssetSubCategoryId,
                "BookCategory": obj.BookCategory,
            })
        })
        return arr;
    }

    const submit = async (key) => {
        let payload1 = {
            "AssetCatBookCatMappingDetails": AllTabData(true)
        }
        // let payload2 = {
        //     "AssetCatBookCatMappingDetails": AllTabData(false)
        // }

        // for mainTable
        if (key !== "true") {
            dispatch(setLoading(true));
            await postOrUpdtAddNewFinancialYear(selectedBookId, FYStartDate, companyId, payload1)
                .then((res) => {
                    if (res.data !== undefined) {
                        if (res.data.status === true) {
                            msg.success(res.data.message);
                            GetAssetMapPrevNextDateDetails(companyId, FYStartDate, selectedBookId);
                        } else {
                            msg.warning(res.data.message);
                        }
                    }
                }).catch(err => { }).finally(() => { dispatch(setLoading(false)); })
        }
        // for modal Table
        // else {
        //   dispatch(loaderEnable());
        //   await AddorUpdNewFinYearData(bookId, effectFromValue, compId, payload2).then((res) => {
        //     if (res.data !== undefined) {
        //       if (res.data.status === true) {
        //         TracetMessage("success", "40vh", res.data.message, "assetMappingBookCategory");
        //         handleFinancialYearCancel();
        //         getEffectiveFromDates(bookId, compId);
        //       } else {
        //         TracetMessage("success", "40vh", res.data.message, "assetMappingBookCategory");
        //       }
        //     }
        //   }).catch(err => { }).finally(() => { dispatch(loaderDisable()); })
        // }
        if (key === "filesUpload") {
            const assetExcelValue = watch('assetcattemplate');
            if (assetExcelValue && assetExcelValue[0].file.status !== "removed") {
                handleFileProcessing(assetExcelValue);
                setUploadModal(false);
            }
        }
    }

    // uploadAPI
    const postUpload = async (e, data) => {
        dispatch(setLoading(true))
        let payload = { 'Details': data }
        await postExcelData(FYStartDate, selectedBookId, companyId, payload).then((res) => {
            if (res.data !== undefined) {
                if (res.data) {
                    // navigate("/layout/utilities/backgroundjobstatus");
                    msg.success("yeah i got posted");
                }
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: false,
    };

    // function to increase and decrease arrow button
    const handleWindow = (key) => {
        let ind = windowCount
        if (key === "Inc") {
            if (windowCount < dateList.length - 1) {
                ind += 1
            }
        } else {
            if (windowCount > 0) {
                ind -= 1
            }
        }
        setWindowCount(ind)
        setFYStartDate(dateList[ind]);
        setValue("effectivefrom", dateList[ind]);
        setFields(fields);
    }

    // function to increasse date by one year
    const getDateAfterYears = (fyDate) => {
        let months = 12
        let day = null
        if (fyDate) {
            let inputDateParts;
            if (fyDate.includes('-')) {
                inputDateParts = fyDate.split('-');
            } else if (fyDate.includes('/')) {
                inputDateParts = fyDate.split('/');
            }
            const inputDate = new Date(`${inputDateParts[2]}-${inputDateParts[1]}-${inputDateParts[0]}`);
            const futureDate = new Date(inputDate.setMonth(inputDate.getMonth() + months));
            day = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;
        }
        // effectiveYearValidation(day)
        setAfterFyDate(day);
        return day
    }

    // add new financial year modal 
    function handleFinancialModal() {
        const filterEffectFrom = watch("effectivefrom");
        const updatedDate = getDateAfterYears(filterEffectFrom);
        setValue("effectivefromInModal", updatedDate)
        setModalDatasource(dataSource)
        setIsMainDialogOpen(true);
    }

    function handleUploadFileModal() {
        setUploadModal(true);
    }
    //export to excel download template
    const downloadExcel = () => {
        console.log("sachin");
        if (dataSource.length !== 0) {
            let keys = Object.keys(dataSource[0]).filter(k => k !== 'BookCategoryId' && k !== 'AssetMainCategoryId' && k !== 'AssetSubCategoryId' && k !== 'IsRanDep');
            let bookCategoryKeys = Object.keys(dataSource[0]);
            handleExport(keys, dataSource, bookCategoryKeys, downloadData);
        }
    }
    const handleExport = async (tableKeys, table, bookCategoryKeys, downloadData) => {
        const workbook = new ExcelJS.Workbook();
        const worksheetLevelheaders = workbook.addWorksheet('Asset Category Book Category Mapping')
        const workSheetBookCategoryName = workbook.addWorksheet('Book Category Master Data')
        const worksheet = workbook.addWorksheet('Asset Category Master Data');

        const staticBookCatColumns = ["Book Category Name", "Method"];
        const staticMainSubCatColumns = ["Main Category Name", "Main Category Code", "Sub Category Name", "Sub Category Code",]

        // SHEET1
        const columnWidthLevelHeaders = [30, 30, 30];
        const headerRowlevelName = worksheetLevelheaders.addRow(downloadData.AssetCategoryBookCategoryMapping)
        headerRowlevelName.height = 20;
        headerRowlevelName.eachCell((cell, colNumber) => {
            cell.font = { size: 11, color: { argb: 'FFFFFF' }, bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
            worksheetLevelheaders.getColumn(colNumber).width = columnWidthLevelHeaders[colNumber - 1]; // -1 to adjust for 1-based index
        })

        // SHEET-2
        const BookCategoryData = workSheetBookCategoryName.addRow(staticBookCatColumns);
        BookCategoryData.height = 20;
        BookCategoryData.eachCell((cell, colNumber) => {
            cell.font = { size: 11, color: { argb: 'FFFFFF' }, bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            }
        });
        const BookCatcolumnWidths = staticBookCatColumns.map(key => key.length);
        downloadData.BookCategoryMasterData.forEach((dataRow, i) => {
            const row = workSheetBookCategoryName.addRow([dataRow.CategoryName || '', dataRow.DepreciationMethodName || '',]);
            row.height = 20;
            row.eachCell((cell, colNumber) => {
                const cellValue = String(cell.value);
                const currentColumnWidth = BookCatcolumnWidths[colNumber - 1];
                const cellLength = cellValue.length;
                BookCatcolumnWidths[colNumber - 1] = Math.max(currentColumnWidth, cellLength);
                cell.font = { size: 11 };
                cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            });
        });

        staticBookCatColumns.forEach((key, index) => {
            workSheetBookCategoryName.getColumn(index + 1).width = BookCatcolumnWidths[index] + 2;
        });

        //SHEET-3 for code and name;
        const headerRow = worksheet.addRow(staticMainSubCatColumns);
        headerRow.height = 20;
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { size: 11, color: { argb: 'FFFFFF' }, bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
        })
        const columnWidths = staticMainSubCatColumns.map(key => key.length);
        downloadData.AssetCategoryMasterData.forEach((dataRow, i) => {
            const row = worksheet.addRow([dataRow.maincategory || '', dataRow.MainCategoryCode || '', dataRow.subcategory || '', dataRow.SubCategoryCode || '']);
            row.height = 20;
            row.eachCell((cell, colNumber) => {
                const cellValue = String(cell.value);
                const currentColumnWidth = columnWidths[colNumber - 1];
                const cellLength = cellValue.length;
                columnWidths[colNumber - 1] = Math.max(currentColumnWidth, cellLength);
                cell.font = { size: 11 };
                cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            });
        });

        staticMainSubCatColumns.forEach((key, index) => {
            worksheet.getColumn(index + 1).width = columnWidths[index] + 2;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AssetCategoryBookCategoryMapping.xlsx`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
    // processing excel data to json data
    const handleFileProcessing = (event) => {
        console.log("event", event);
        if (event[0].file) {
            let fileObj = event[0].file;
            let fileName = fileObj.name;
            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx" || fileName.slice(fileName.lastIndexOf('.') + 1) === " xls") {
                let filereader = new FileReader();
                filereader.readAsArrayBuffer(fileObj);
                filereader.onload = (event) => {
                    let data = event.target.result;
                    let workbook = XLSX.read(data, { type: 'binary' });
                    workbook.SheetNames.forEach((sheet, i) => {
                        let workSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" });
                        if (i === 0) {
                            postUpload('', workSheetData)
                        }
                    });
                }
            }
            else {
                msg.warning(`${fileName} is not supported format`)
            }
        }
    };

    return (
        <PageLayout className='h-full overflow-y-scroll bg-gray-50/30 min-h-[100px]'>
            <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Masters</span>
                        <span>/</span>
                        <span>depreciation</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">asset-category-book-mapping</span>
                    </div>
                </div>
            </header>
            <div className="space-y-6 mt-3">
                {/* Top Section */}
                <div className="bg-card rounded-lg border p-6 space-y-6">
                    <div className='flex justify-between items-center pb-3'>
                        <h1 className="text-3xl font-bold text-gray-900">Asset Category Mapping With Book Category</h1>
                        <ReusableButton
                            htmlType="submit"
                            variant="primary"
                            className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                            onClick={handleSubmit(() => submit(false))}
                        >
                            Submit
                        </ReusableButton>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {getFieldsByNames(['book', 'effectivefrom']).map((renderField))}
                    </div>

                    {/* Action Buttons */}
                    {selectedBookId &&
                        <div className="flex justify-end items-center gap-5">
                            <div className='flex w-full justify-end'>
                                <button
                                    onClick={handleUploadFileModal}
                                    className="text-blue-600 hover:text-blue-700 underline flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload File
                                </button>
                            </div>
                            <div className="flex items-center gap-2 flex justify-end w-full">
                                <button
                                    onClick={handleFinancialModal}
                                    className="text-blue-600 cursor-pointer border-0 hover:bg-0">
                                    Add New Financial Year
                                </button>
                                <ReusableButton
                                    variant="default"
                                    size="small"
                                    className={`bg-hsl(24.12deg 100% 80%) ${(windowCount === 0) ? "cursor-not-allowed bg-[#929292] hover:bg-[#929292]" : "hover:bg-[hsl(24.12deg_100%_70%)]"}`}
                                    onClick={() => { handleWindow("Dec"); }}
                                >
                                    <span>
                                        {<FaAngleLeft className="h-2 w-2" />}
                                    </span>
                                </ReusableButton>

                                <ReusableButton
                                    // variant=""
                                    size="small"
                                    className={`bg-hsl(24.12deg 100% 80%) ${(windowCount === (dateList.length - 1)) ? "cursor-not-allowed bg-[#929292] hover:bg-[#929292]" : "hover:bg-[hsl(24.12deg_100%_70%)]"}`}
                                    onClick={() => { handleWindow("Inc"); }}
                                >
                                    <span>
                                        {<FaAngleRight className="h-2 w-2" />}
                                    </span>
                                </ReusableButton>
                            </div>
                        </div>
                    }
                    {/* financial Year modal */}
                    <Dialog open={isMainDialogOpen}
                        onOpenChange={(open) => {
                            setIsMainDialogOpen(open);
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
                                    {getFieldsByNames(['effectivefromInModal', 'inmodaldrop']).map((renderField))}
                                </div>
                            </div>
                            <div className="pt-0 max-h-[400px] overflow-y-scroll">
                                <ReusableTable
                                    data={modalDatasource}
                                    columns={financialYearColumns}
                                    permissions={tablePermissions}
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
                                    onClick={null}
                                >
                                    Save
                                </ReusableButton>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={newUploadModal}
                        onOpenChange={(open) => {
                            setUploadModal(open);
                            if (!open) {
                                // handleCancel();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            {/* your trigger here */}
                        </DialogTrigger>

                        <DialogContent className="max-w-lg w-full rounded-md p-6">
                            <DialogHeader>
                                <DialogTitle>Upload File</DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col mt-6 gap-6">
                                {/* Step 1 */}
                                <div className="flex items-center gap-6">
                                    <h5 className="w-20 text-right font-medium">Step 1</h5>
                                    <ReusableButton onClick={downloadExcel}>Download Template</ReusableButton>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center gap-6">
                                    <h5 className="w-20 text-right font-medium">Step 2</h5>
                                    <div className="flex-1 max-w-xs">
                                        {getFieldsByNames(['assetcattemplate']).map(renderField)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <ReusableButton
                                    htmlType="submit"
                                    variant="primary"
                                    className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                    // onClick={handleSave}
                                    onClick={handleSubmit(() => submit("filesUpload"))}
                                >
                                    Save
                                </ReusableButton>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {
                        <span className={`text-[#ef4d56] text-[12px] font-dark mt-2 ${(isRanDep === false) ? "hidden" : ''}`}>
                            Depreciation ran for this year, so below grid is not editable
                        </span>
                    }
                    {/* Asset Category Details Section */}
                    <div style={{ marginTop: "0" }}>
                        {selectedBookId &&
                            (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Asset Category Details :</h3>
                                    {/* Table */}
                                    <div className="pt-0 overflow-hidden">
                                        <ReusableTable
                                            data={dataSource}
                                            columns={assetCatBookCatMappingCols}
                                            // actions={tableActions}
                                            permissions={tablePermissions}
                                            title=""
                                            //    onRefresh={handleRefresh}
                                            enableSearch={false}
                                            enableSelection={false}
                                            // enableExport={true}
                                            enableColumnVisibility={true}
                                            enablePagination={true}
                                            enableSorting={true}
                                            enableFiltering={true}
                                            pageSize={10}
                                            emptyMessage="No user groups found"
                                            rowHeight="normal"
                                            storageKey="usergroups-table"
                                        />
                                    </div>
                                </>
                            )
                        }
                    </div>
                    {/* } */}
                </div>
            </div>
        </PageLayout>
    );
};

export default AssetCategoryMappingBookCategory;