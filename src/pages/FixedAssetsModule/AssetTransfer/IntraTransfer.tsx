import { useMessage } from '@/components/ui/reusable-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/store';
import { useAppDispatch } from '@/store/reduxStore';
import React, { useCallback, useEffect, useState } from 'react'
import { FaAngleRight } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReusableTable, { TablePermissions } from '@/components/ui/reusable-table';
import { getAssetTansferColumns, getAssetTransferAssets } from '@/services/assetTransferAssetServices';
import { setLoading } from '@/store/slices/projectsSlice';
import { ColumnDef, FilterFn, VisibilityState } from '@tanstack/react-table';

interface ColumnApiResponse {
    [section: string]: {
        [columnName: string]: "true" | "false";
    };
}

const IntraTransfer = () => {
    const [activeTab, setActiveTab] = useState('assets');
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState([]);
    console.log(selectedAssetIds,"29")
    const msg = useMessage()
    const dispatch = useAppDispatch();
    // Define table permissions

    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: true,
    };

    const getIntraTransferList = async (branchname: string, compid: string) => {
        dispatch(setLoading(true));
        await getAssetTransferAssets(branchname, compid).then((res) => {
            if (res.data && res.success) {
                if (res.data?.AssetTransferListDetails?.length > 0) {
                    setDataSource(res.data?.AssetTransferListDetails)
                }
                else {
                    setDataSource([]);
                }
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    useEffect(() => {
        if (companyId && branch) {
            getIntraTransferList(branch, companyId);
            fetchAssetTransferColumns(branch, companyId)
        }
    }, [companyId, branch])

    const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
        const selected = Array.isArray(filterValue) ? filterValue : [];
        if (selected.length === 0) return true;
        const cell = row.getValue(columnId);
        if (cell == null) return false;
        if (Array.isArray(cell)) return cell.some(v => selected.includes(String(v)));
        return selected.includes(String(cell));
    };

    const getAccessorKey=(x:string)=>{
        let accessorKey:string;
         if (x === "Purchased Price (₹)")
                accessorKey = "PurchasedPrice";
            else if (x === "Manufacturer")
                accessorKey = "Manufacturer"
            else if (x === "Year Of Manufacturer")
                accessorKey = "YearOfManufacturer"
            else if (x === "Salvage Value (₹)")
                accessorKey = "SalvageValue"
            else if (x === "Description")
                accessorKey = "Description"
            else if(x==="Is Asset Tagable")
                accessorKey="IsAssetTaggable"
            else if(x==="Depreciation Applicable")
                accessorKey="DepricationApplicable"
            // else if (x === allLastLevelsDetailsFromStore["Branch"])
            //     accessorKey = "Branch"
            // else if (hierarchyLevels[1] && hierarchyLevels[1].LevelName && x === hierarchyLevels[1].LevelName[0]?.LevelName)
            //     accessorKey = "LocName_100"
            // else if (hierarchyLevels[1] && hierarchyLevels[1].LevelName && x === hierarchyLevels[1].LevelName[1]?.LevelName)
            //     accessorKey = "LocName_101"
            // else if (hierarchyLevels[1] && hierarchyLevels[1].LevelName && x === hierarchyLevels[1].LevelName[2]?.LevelName)
            //     accessorKey = "LocName_102"
            // else if (hierarchyLevels[1] && hierarchyLevels[1].LevelName && x === hierarchyLevels[1].LevelName[3]?.LevelName)
            //     accessorKey = "LocName_103"
            // else if (hierarchyLevels[1] && hierarchyLevels[1].LevelName && x === hierarchyLevels[1].LevelName[4]?.LevelName)
            //     accessorKey = "LocName_104"
            // else if (hierarchyLevels[3] && hierarchyLevels[3].LevelName && x === hierarchyLevels[3].LevelName[0]?.LevelName)
            //     accessorKey = "DepName_100"
            // else if (hierarchyLevels[3] && hierarchyLevels[3].LevelName && x === hierarchyLevels[3].LevelName[1]?.LevelName)
            //     accessorKey = "DepName_101"
            // else if (hierarchyLevels[3] && hierarchyLevels[3].LevelName && x === hierarchyLevels[3].LevelName[2]?.LevelName)
            //     accessorKey = "DepName_102"
            // else if (hierarchyLevels[3] && hierarchyLevels[3].LevelName && x === hierarchyLevels[3].LevelName[3]?.LevelName)
            //     accessorKey = "DepName_103"
            // else if (hierarchyLevels[3] && hierarchyLevels[3].LevelName && x === hierarchyLevels[3].LevelName[4]?.LevelName)
            //     accessorKey = "DepName_104"
            // else if (hierarchyLevels[2] && hierarchyLevels[2].LevelName && x === hierarchyLevels[2].LevelName[0]?.LevelName)
            //     accessorKey = "CostName_100"
            // else if (hierarchyLevels[2] && hierarchyLevels[2].LevelName && x === hierarchyLevels[2].LevelName[1]?.LevelName)
            //     accessorKey = "CostName_101"
            // else if (hierarchyLevels[2] && hierarchyLevels[2].LevelName && x === hierarchyLevels[2].LevelName[2]?.LevelName)
            //     accessorKey = "CostName_102"
            // else if (hierarchyLevels[2] && hierarchyLevels[2].LevelName && x === hierarchyLevels[2].LevelName[3]?.LevelName)
            //     accessorKey = "CostName_103"
            // else if (hierarchyLevels[2] && hierarchyLevels[2].LevelName && x === hierarchyLevels[2].LevelName[4]?.LevelName)
            //     accessorKey = "CostName_104"
            else {
                accessorKey = x.split(" ").map((word, index) => {
                    return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
                }).join('');
            }



            return accessorKey

    }

    function buildColumnsFromApi<T extends Record<string, any>>(
        apiResponse: ColumnApiResponse,
        editableColumns: string[] = [],
        typeMapper: Record<string, "text" | "number" | "date" | "select"> = {}
    ): { columns: ColumnDef<T>[]; initialVisibility: VisibilityState } {
        const [_, columnsMeta] = Object.entries(apiResponse)[0];

        const columns: ColumnDef<T>[] = Object.entries(columnsMeta).map(
            ([colName], index) => {
                // Ensure we have a valid column name
                if (!colName || !colName.trim()) {
                    console.warn(`Column at index ${index} has empty name, skipping`);
                    return null;
                }
                return {
                    accessorKey: getAccessorKey(colName),
                    id:  getAccessorKey(colName),
                    header: colName,
                    cell: (info) => info.getValue() ?? "",
                    enableHiding: true,
                    enableColumnFilter: true,
                    filterFn: multiSelectFilter,
                    meta: {
                        editable: editableColumns.includes(colName),
                        editType: typeMapper[colName] || "text",
                    },
                } as ColumnDef<T>;
            }
        ).filter(Boolean) as ColumnDef<T>[]; // Remove null entries

        // build VisibilityState (true/false per column)
        const initialVisibility: VisibilityState = {};
        Object.entries(columnsMeta).forEach(([colName, visible]) => {
            if (colName && colName.trim()) {
                initialVisibility[colName] = visible === "true";
            }
        });

        return { columns, initialVisibility };
    }

    async function fetchAssetTransferColumns(branchname: string, compid: string) {
        dispatch(setLoading(true))
        await getAssetTansferColumns(branchname, compid).then(res => {
            if (res.success && res.data) {
                const tempCols = buildColumnsFromApi(res.data)
                console.log(tempCols, "tempCols")
                // setColumnVisibility(tempCols.initialVisibility)
                setColumns(tempCols.columns)
            } else {
                // msg.warning(`${res.data.message}`)
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    const handleSelectionChange = useCallback((selectionInfo: any) => {
        console.log(selectionInfo.selectedRows,"137")
        const selectedIds=selectionInfo?.selectedRows.map((row)=>row.AssetID)
        setSelectedAssetIds(selectedIds)
    
    }, []);

       const getRowId = useCallback((row: any, index: number) => {
            // Try different ID fields that might exist in your data
            if (row.id) return row.id.toString();
            if (row.assetId) return row.assetId.toString();
            if (row.AssetId) return row.AssetId.toString();
            if (row.ID) return row.ID.toString();
            // Fallback to index
            return index.toString();
        }, []);
    return (
        <ScrollArea className='h-full'>
            <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Asset Transfer</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Fixed Assets</span>
                            <FaAngleRight />
                            <span className="text-gray-900 font-medium">Asset Transfer</span>
                        </div>
                    </div>
                </div>
                <div className="pt-0">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2 pt-2">
                            <div className='mt-1 py-2'>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <TabsList>
                                            <TabsTrigger value="assets">Assets</TabsTrigger>
                                            <TabsTrigger value="history">History</TabsTrigger>
                                        </TabsList>
                                        <ReusableButton
                                            variant="primary"
                                            // icon={<Plus className="h-4 w-4" />}
                                            onClick={null}
                                            className='btn-submit-style'
                                        >
                                            Transfer
                                        </ReusableButton>
                                    </div>

                                    <TabsContent value="assets" className="">
                                        <ReusableTable
                                            data={dataSource}
                                            columns={columns}
                                            enableSelection={true}
                                            selectionMode="multiple" // or "single" if you want single selection
                                            enableSelectAll={true}
                                            onSelectionChange={handleSelectionChange}
                                            getRowId={getRowId} // Memoized custom row ID getter

                                            permissions={tablePermissions}
                                            title=""
                                            // onRefresh={handleRefresh}
                                            enableSearch={false}
                                            enableColumnVisibility={true}
                                            enablePagination={true}
                                            enableSorting={true}
                                            enableFiltering={true}
                                            pageSize={10}
                                            emptyMessage="No user groups found"
                                            rowHeight="normal"
                                            storageKey="usergroups-table"
                                        />
                                    </TabsContent>

                                    <TabsContent value="history" className="">
                                        <ReusableTable
                                            data={[]}
                                            columns={[]}
                                            // actions={tableActions2}
                                            // permissions={tablePermissions}
                                            title=""
                                            //    onRefresh={handleRefresh}
                                            enableSearch={false}
                                            enableSelection={false}
                                            // enableExport={false}
                                            enableColumnVisibility={true}
                                            enablePagination={true}
                                            enableSorting={true}
                                            enableFiltering={true}
                                            pageSize={10}
                                            emptyMessage="No user groups found"
                                            rowHeight="normal"
                                            storageKey="usergroups-table"
                                        />

                                    </TabsContent>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    )
}

export default IntraTransfer