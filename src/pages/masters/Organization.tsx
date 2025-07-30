
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface OrganizationData {
  id: string;
  assetCode: string;
  assetName: string;
  customerAssetNo: string;
  barcodeNo: string;
  acquisition: 'Purchased' | 'Leased';
}

const mockData: OrganizationData[] = [
  {
    id: '1',
    assetCode: 'AI/904/924/000128',
    assetName: 'Test Mob2',
    customerAssetNo: 'wer23r32r_1',
    barcodeNo: 'AI/904/924/000128',
    acquisition: 'Purchased'
  },
  {
    id: '2',
    assetCode: 'AI/904/111/000002',
    assetName: 'Test Mob',
    customerAssetNo: 'gsdrg_2',
    barcodeNo: 'AI/904/111/000002',
    acquisition: 'Purchased'
  },
  {
    id: '3',
    assetCode: 'AI/904/111/000001',
    assetName: 'Test Mob',
    customerAssetNo: 'gsdrg_1',
    barcodeNo: 'AI/904/111/000001',
    acquisition: 'Purchased'
  },
  {
    id: '4',
    assetCode: 'AI/IT/LP/000002',
    assetName: 'Printer',
    customerAssetNo: '123456',
    barcodeNo: '123456',
    acquisition: 'Leased'
  },
  {
    id: '5',
    assetCode: 'ITC/IT/TB/000001',
    assetName: 'Tablet',
    customerAssetNo: 'ITC/IT/TB/000001',
    barcodeNo: '3600001586',
    acquisition: 'Purchased'
  },
  {
    id: '6',
    assetCode: 'ITC/IT/COM/000003',
    assetName: 'COMPUTER',
    customerAssetNo: 'ITC/IT/COM/000003',
    barcodeNo: '3800001751',
    acquisition: 'Purchased'
  },
  {
    id: '7',
    assetCode: 'ITC/IT/COM/000002',
    assetName: 'COMPUTER',
    customerAssetNo: 'ITC/IT/COM/000002',
    barcodeNo: '3800008370',
    acquisition: 'Purchased'
  },
];

const Organization = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const toggleSelectAll = () => {
    if (selectedItems.length === mockData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockData.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Masters</span>
            <span>/</span>
            <span>Company</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Organization</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Organizations List:
                {selectedItems.length > 0 && (
                  <span className="ml-2 text-blue-600">{selectedItems.length} selected</span>
                )}
              </CardTitle>
              {selectedItems.length > 0 && (
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <div className="text-sm text-gray-600">
                Showing 1 to 7 of 7 entries
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700">
                      <Checkbox
                        checked={selectedItems.length === mockData.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-gray-700">ASSET CODE</th>
                    <th className="text-left p-3 font-medium text-gray-700">ASSET NAME</th>
                    <th className="text-left p-3 font-medium text-gray-700">CUSTOMER ASSET NO</th>
                    <th className="text-left p-3 font-medium text-gray-700">BARCODE NO</th>
                    <th className="text-left p-3 font-medium text-gray-700">ACQUISITION</th>
                    <th className="text-left p-3 font-medium text-gray-700">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                        />
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">{item.assetCode}</td>
                      <td className="p-3 text-sm text-gray-900">{item.assetName}</td>
                      <td className="p-3 text-sm text-gray-600">{item.customerAssetNo}</td>
                      <td className="p-3 text-sm text-gray-600">{item.barcodeNo}</td>
                      <td className="p-3">
                        <Badge 
                          variant={item.acquisition === 'Purchased' ? 'default' : 'secondary'}
                          className={item.acquisition === 'Purchased' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          }
                        >
                          {item.acquisition}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="h-4 w-4 text-gray-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing 1 to 7 of 7 entries
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Organization;
