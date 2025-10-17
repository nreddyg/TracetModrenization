import React, { useState } from 'react';
import PageLayout from '@/components/common/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainLocation {
    id: string;
    name: string;
}

interface SubLocation {
    id: string;
    name: string;
    mainLocationId: string;
}

const ServiceLocations = () => {
    const [activeTab, setActiveTab] = useState('main');
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
    const [selectedMainLocation, setSelectedMainLocation] = useState('');
    const [mainLocationName, setMainLocationName] = useState('');
    const [subLocationName, setSubLocationName] = useState('');

    const [mainLocations] = useState<MainLocation[]>([
        { id: '1', name: 'serloc7' },
        { id: '2', name: 'serloc2' },
        { id: '3', name: 'Hyd' },
        { id: '4', name: 'loc' },
    ]);

    const [subLocations] = useState<SubLocation[]>([]);

    const mainLocationColumns = [
        // {
        //     id: 'name',
        //     header: 'Name',
        //     accessorKey: 'name',
        //     enableSorting: true,
        // },
        // {
        //     id: 'actions',
        //     header: 'Actions',
        //     cell: ({ row }: any) => (
        //         <div className="flex gap-2">
        //             <ReusableButton
        //                 icon={<Edit className="h-4 w-4" />}
        //                 variant="text"
        //                 onClick={() => { }}
        //             />
        //             <ReusableButton
        //                 icon={<Trash2 className="h-4 w-4" />}
        //                 variant="text"
        //                 danger
        //                 onClick={() => { }}
        //             />
        //         </div>
        //     ),
        // },

        
            {
              accessorKey: 'UserGroup',
              header: 'User Group',
              cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('UserGroup')}</span>
              ),
            },
            {
              accessorKey: 'Users',
              header: 'Users',
              cell: ({ row }) => (
                <span className="text-gray-700 text-sm">{row.getValue('Users')}</span>
              ),
            },
            {
              accessorKey: 'Description',
              header: 'Description',
              cell: ({ row }) => (
                <span className="text-gray-700 text-sm">{row.getValue('Description')}</span>
              ),
            },
           
        ]

    const subLocationColumns = [
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'name',
            enableSorting: true,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <ReusableButton
                        icon={<Edit className="h-4 w-4" />}
                        variant="text"
                        onClick={() => { }}
                    />
                    <ReusableButton
                        icon={<Trash2 className="h-4 w-4" />}
                        variant="text"
                        danger
                        onClick={() => { }}
                    />
                </div>
            ),
        },
    ];

    const filteredSubLocations = selectedMainLocation
        ? subLocations.filter(sub => sub.mainLocationId === selectedMainLocation)
        : [];

    const handleAddMainLocation = () => {
        console.log('Add main location:', mainLocationName);
        setIsMainDialogOpen(false);
        setMainLocationName('');
    };

    const handleAddSubLocation = () => {
        console.log('Add sub location:', subLocationName);
        setIsSubDialogOpen(false);
        setSubLocationName('');
    };

    // const tableActions:TableAction<MainLocation>[] = [
    //     {
    //       label: 'Edit',
    //       icon: Edit,
    //       onClick: ()=>{},
    //       variant: 'default',
    //     },
    //     {
    //       label: 'Delete',
    //       icon: Trash2,
    //       onClick: ()=>{},
    //       variant: 'destructive',
    //     },
    //   ];

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
        // <PageLayout>
        //   <PageHeader
        //     title="Service Maintenance Locations"
        //     breadcrumbs={[
        //       { label: 'Masters', href: '/masters' },
        //       { label: 'Service Maintenance', href: '#' },
        //       { label: 'Service Locations' },
        //     ]}
        //   />

        //   <div className="">
        // <Tabs value={activeTab} onValueChange={setActiveTab}>
        //   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        //     <TabsList>
        //       <TabsTrigger value="main">Main Location</TabsTrigger>
        //       <TabsTrigger value="sub">Sub Location</TabsTrigger>
        //     </TabsList>
        //     <ReusableButton
        //       variant="primary"
        //       icon={<Plus className="h-4 w-4" />}
        //       onClick={() => activeTab === 'main' ? setIsMainDialogOpen(true) : setIsSubDialogOpen(true)}
        //     >
        //       Add
        //     </ReusableButton>
        //   </div>

        //   <TabsContent value="main" className="space-y-4">
        //     {/* <ReusableTable
        //       columns={mainLocationColumns}
        //       data={mainLocations}
        //     /> */}
        //   </TabsContent>

        //   <TabsContent value="sub" className="space-y-4">
        //     <div className="mb-4">
        //       <ReusableDropdown
        //         placeholder="Select Main Location"
        //         options={mainLocations.map(loc => ({ label: loc.name, value: loc.id }))}
        //         value={selectedMainLocation}
        //         onChange={(value) => setSelectedMainLocation(value as string)}
        //       />
        //     </div>
        //     {/* <ReusableTable
        //       columns={subLocationColumns}
        //       data={filteredSubLocations}
        //     /> */}
        //   </TabsContent>
        // </Tabs>
        //   </div>

        //   {/* Main Location Dialog */}
        //   <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        //     <DialogContent>
        //       <DialogHeader>
        //         <DialogTitle>Add Main Location</DialogTitle>
        //       </DialogHeader>
        //       <div className="space-y-4">
        //         <ReusableInput
        //           label="Location Name"
        //           value={mainLocationName}
        //           onChange={(e) => setMainLocationName(e.target.value)}
        //           required
        //         />
        //         <div className="flex justify-end gap-2">
        //           <ReusableButton onClick={() => setIsMainDialogOpen(false)}>
        //             Cancel
        //           </ReusableButton>
        //           <ReusableButton variant="primary" onClick={handleAddMainLocation}>
        //             Save
        //           </ReusableButton>
        //         </div>
        //       </div>
        //     </DialogContent>
        //   </Dialog>

        //   {/* Sub Location Dialog */}
        //   <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
        //     <DialogContent>
        //       <DialogHeader>
        //         <DialogTitle>Add Sub Location</DialogTitle>
        //       </DialogHeader>
        //       <div className="space-y-4">
        //         <div>
        //           <Label>Main Location <span className="text-red-500">*</span></Label>
        //           <ReusableDropdown
        //             placeholder="Select Main Location"
        //             options={mainLocations.map(loc => ({ label: loc.name, value: loc.id }))}
        //           />
        //         </div>
        //         <ReusableInput
        //           label="Sub Location Name"
        //           value={subLocationName}
        //           onChange={(e) => setSubLocationName(e.target.value)}
        //           required
        //         />
        //         <div className="flex justify-end gap-2">
        //           <ReusableButton onClick={() => setIsSubDialogOpen(false)}>
        //             Cancel
        //           </ReusableButton>
        //           <ReusableButton variant="primary" onClick={handleAddSubLocation}>
        //             Save
        //           </ReusableButton>
        //         </div>
        //       </div>
        //     </DialogContent>
        //   </Dialog>
        // </PageLayout>

        <div className="h-full overflow-y-scroll bg-gray-50/30">
            
            <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Masters</span>
                        <span>/</span>
                        <span>Service Maintenance</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Service Locations</span>
                    </div>
                </div>
            </header>
<div className="p-4 space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Service Maintenance Locations</h1>
            </div>
            <Card className="border-0 shadow-sm mt-2">
                      <CardHeader className="pb-2 pt-2">
                        <div className='mt-2 p-2'>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <TabsList>
                            <TabsTrigger value="main">Main Location</TabsTrigger>
                            <TabsTrigger value="sub">Sub Location</TabsTrigger>
                        </TabsList>
                        <ReusableButton
                            variant="primary"
                            icon={<Plus className="h-4 w-4" />}
                            onClick={() => activeTab === 'main' ? setIsMainDialogOpen(true) : setIsSubDialogOpen(true)}
                        >
                            Add
                        </ReusableButton>
                    </div>

                    <TabsContent value="main" className="space-y-4">
                 <ReusableTable
                               data={mainLocations}
                               columns={mainLocationColumns}
                            //    actions={tableActions}
                               permissions={tablePermissions}
                               title=""
                            //    onRefresh={handleRefresh}
                               enableSearch={false}
                               enableSelection={false}
                               enableExport={true}
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

                    <TabsContent value="sub" className="space-y-4">
                        <div className="mb-4">
                            <ReusableDropdown
                                placeholder="Select Main Location"
                                options={mainLocations.map(loc => ({ label: loc.name, value: loc.id }))}
                                value={selectedMainLocation}
                                onChange={(value) => setSelectedMainLocation(value as string)}
                            />
                        </div>
                        <ReusableTable
              columns={subLocationColumns}
              data={filteredSubLocations}
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
        
    );
};

export default ServiceLocations;
