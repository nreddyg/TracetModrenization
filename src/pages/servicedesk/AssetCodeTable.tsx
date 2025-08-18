import ReusableTable from '@/components/ui/reusable-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; // Fixed: Correct import
import { getManageAssetsList } from '@/services/ticketServices';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import { ReusableButton } from '@/components/ui/reusable-button';
 
const AssetCodeTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]); // Will contain full row data
    const [selectedRecordIds, setSelectedRecordIds] = useState([]); // Will contain just IDs
 
    const { flag } = location.state;
 
    useEffect(() => {
        fetchAssetList("All", 111)
    }, [])
 
    // Removed the problematic useEffect that was causing infinite loops
    // useEffect(() => {
    //     recordSelection(selectedRecords)
    // }, [selectedRecords])
 
    async function fetchAssetList(BranchName: string, compId: number) {
        try {
            const res = await getManageAssetsList(BranchName, compId);
            if (res.success && res.data["AssetsListDetails"]) {
                setDataSource(res.data.AssetsListDetails);
            }
        } catch (err) {
            console.error('Error fetching subscription by customer:', err);
        }
    }
 
    function generateColumnsFromData<T extends Record<string, any>>(
        data: T[],
        includeActions: boolean = true
    ): ColumnDef<T>[] {
        if (!data || data.length === 0) return [];
 
        const sample = data[0];
 
        const columns: ColumnDef<T>[] = Object.keys(sample).map((key) => {
            const value = sample[key];
 
            let editType: 'text' | 'number' | 'date' | 'select' = 'text';
            if (typeof value === 'number') {
                editType = 'number';
            } else if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                editType = 'date';
            }
 
            return {
                accessorKey: key,
                header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                meta: {
                    editable: true,
                    editType,
                },
            } as ColumnDef<T>;
        });
 
        return columns;
    }
 
    // Memoized functions to prevent unnecessary re-renders
    const recordSelection = useCallback((selectedRows: any[]) => {
        // Add your bulk edit logic here
        // This function is now stable and won't cause re-renders
    }, []);
 
    // Memoized getRowId function
    const getRowId = useCallback((row: any, index: number) => {
        // Try different ID fields that might exist in your data
        if (row.id) return row.id.toString();
        if (row.assetId) return row.assetId.toString();
        if (row.AssetId) return row.AssetId.toString();
        if (row.ID) return row.ID.toString();
        // Fallback to index
        return index.toString();
    }, []);
 
    // Memoized navigation function
    const navigateBacktoMain = useCallback(() => {
        navigate("/tickets/TKT-001", { state: { data: selectedRecords } })
    }, [navigate, selectedRecords]);
 
    // Memoized selection change handler
    const handleSelectionChange = useCallback((selectionInfo: any) => {
        // Only update state if there's actually a change
        setSelectedRecords(selectionInfo.selectedRows);
        setSelectedRecordIds(selectionInfo.selectedRowIds);
    }, []);
console.log(selectedRecords,"ID")
    // Memoized columns generation
    const columns = useMemo(() => generateColumnsFromData(dataSource), [dataSource]);
 
    return (
        <>
            <div className='bg-white p-5 h-[85vh]'>
                <div className='px-2' style={{display:'flex',justifyContent:"space-between",}}>
                    <h1>Asset Codes List</h1>
                    <div>
                        <ReusableButton
                        title='Submit'
                        onClick={()=>navigateBacktoMain()}
                        >Submit</ReusableButton>
                    </div>
                </div>
                <div className='mt-4'>
                    <ScrollArea className='h-[70vh] w-full'>
                        <ReusableTable
                            data={dataSource}
                            columns={columns}
                            enableSelection={true}
                            selectionMode="multiple" // or "single" if you want single selection
                            enableSelectAll={true}
                            getRowId={getRowId} // Memoized custom row ID getter
                            onSelectionChange={handleSelectionChange}
                            // Optional: Handle custom actions on selected rows
                            onSelectedRowsAction={(action, selectedRows) => {
                                // Handle actions without console logs to avoid loops
                                if (action === 'export') {
                                    // Handle export of selected rows
                                } else if (action === 'duplicate') {
                                    // Handle duplication
                                } else if (action === 'archive') {
                                    // Handle archiving
                                }
                            }}
                            // Custom actions in header
                            // customActions={
                            //     <div className="flex gap-2">
                            //         {selectedRecords.length > 0 && (
                            //             <>
                            //                 <Button
                            //                     size="sm"
                            //                     onClick={() => {
                            //                         // Process selected records without causing loops
                            //                         if (selectedRecords.length > 0) {
                            //                             recordSelection(selectedRecords);
                            //                             // You can add more processing logic here
                            //                         }
                            //                     }}
                            //                     className="bg-green-600 hover:bg-green-700 text-white"
                            //                 >
                            //                     Process Selected ({selectedRecords.length})
                            //                 </Button>
                                           
                            //                 <Button
                            //                     size="sm"
                            //                     onClick={() => {
                            //                         if (selectedRecords.length > 0) {
                            //                             navigateBacktoMain();
                            //                         }
                            //                     }}
                            //                     className="bg-blue-600 hover:bg-blue-700 text-white"
                            //                 >
                            //                     <FaSearch style={{ fontSize: "13px" }} className="mr-2"/>
                            //                     Navigate with Selected
                            //                 </Button>
                            //             </>
                            //         )}
                            //     </div>
                            // }
                        />
                    </ScrollArea>
                </div>
            </div>
        </>
    )
}
 
export default AssetCodeTable;
 
 