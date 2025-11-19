import { useMessage } from '@/components/ui/reusable-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/store';
import { useAppDispatch } from '@/store/reduxStore';
import React, { useState } from 'react'
import { FaAngleRight } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReusableTable, { TablePermissions } from '@/components/ui/reusable-table';

const IntraTransfer = () => {
    const [activeTab, setActiveTab] = useState('assets');
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const msg = useMessage()
    const dispatch = useAppDispatch();
    // Define table permissions

    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: false,
    };
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
                                            data={[]}
                                            columns={[]}
                                            // actions={tableActions}
                                            // permissions={tablePermissions}
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