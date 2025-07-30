import React, { useState, useMemo, useCallback, useEffect, useRef, RefObject } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  Row,
  Column,
  Table as TanstackTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  GroupingState,
  ExpandedState,
  PaginationState,
  OnChangeFn,
  ColumnOrderState,
  ColumnSizingState,
} from '@tanstack/react-table';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  Moon, 
  Sun, 
  Columns, 
  RefreshCw, 
  PrinterIcon,
  FileSpreadsheet,
  FileImage,
  Keyboard,
  Volume2,
  Calendar,
  Users,
  Shield,
  History,
  Globe,
  Save,
  Undo,
  Redo,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

// Enhanced types for enterprise features
export interface TablePermissions {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canExport: boolean;
  canAdd?: boolean;
  canBulkEdit?: boolean;
  canInlineEdit?: boolean;
  canManageColumns?: boolean;
}

export interface TableTheme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent?: string;
  surface?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  tooltip?: string;
}

export interface AuditTrail {
  timestamp: Date;
  user: string;
  action: string;
  rowId: string;
  changes?: Record<string, { from: any; to: any }>;
}

export interface FilterOperator {
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
}

export interface AdvancedFilter {
  column: string;
  operator: string;
  value: any;
  condition?: 'AND' | 'OR';
}

export interface TablePreferences {
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
  grouping: GroupingState;
  filters: AdvancedFilter[];
  pageSize: number;
}

export interface ReusableTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  permissions?: TablePermissions;
  actions?: TableAction<T>[];
  onAdd?: () => void;
  onRefresh?: () => void;
  onBulkDelete?: (selectedRows: T[]) => void;
  onBulkEdit?: (selectedRows: T[]) => void;
  onRowEdit?: (row: T, changes: Partial<T>) => void;
  onAuditLog?: (entry: AuditTrail) => void;
  enableSelection?: boolean;
  enableSearch?: boolean;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enableInlineEdit?: boolean;
  enableKeyboardNav?: boolean;
  enableVirtualScrolling?: boolean;
  enableAdvancedFilters?: boolean;
  enableAuditTrail?: boolean;
  enablePrintMode?: boolean;
  pageSize?: number;
  virtualItemHeight?: number;
  className?: string;
  storageKey?: string;
  customActions?: React.ReactNode;
  emptyMessage?: string;
  theme?: TableTheme;
  locale?: string;
  timezone?: string;
  rowHeight?: 'compact' | 'normal' | 'comfortable';
  aggregationFunctions?: Record<string, (values: any[]) => any>;
}

// Custom hooks
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Components
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
    <AlertCircle className="w-5 h-5" />
    <span>{message}</span>
  </div>
);

const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }, (_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-muted rounded"></div>
      </td>
    ))}
  </tr>
);

interface ActionMenuProps<T = any> {
  row: T;
  actions?: TableAction<T>[];
  permissions?: TablePermissions;
}

const ActionMenu = <T,>({ 
  row,
  actions,
  permissions 
}: ActionMenuProps<T>) => {
  if (!actions || actions.length === 0) return null;
  
  const visibleActions = actions.filter(action => !action.hidden?.(row));
  
  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(row)}
              className={cn(
                action.variant === 'destructive' && 'text-destructive focus:text-destructive'
              )}
            >
              {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const GlobalFilter = ({ 
  globalFilter, 
  setGlobalFilter 
}: { 
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
      placeholder="Search all columns..."
      className="pl-10"
    />
  </div>
);

const ColumnFilter = ({ 
  column, 
  table 
}: { 
  column: Column<any, unknown>;
  table: TanstackTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();
  
  return (
    <Input
      value={(columnFilterValue as string) ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder={`Filter ${column.id}`}
      className="w-full h-8 text-xs"
    />
  );
};

const ColumnVisibilityManager = ({ 
  table 
}: { 
  table: TanstackTable<any>;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns className="w-4 h-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          {table.getAllLeafColumns().map((column) => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={column.getToggleVisibilityHandler()}
                id={column.id}
              />
              <label htmlFor={column.id} className="text-sm font-medium capitalize">
                {column.id.replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Advanced Filter Builder Component
const AdvancedFilterBuilder = ({ 
  columns, 
  filters, 
  onFiltersChange 
}: { 
  columns: ColumnDef<any>[];
  filters: AdvancedFilter[];
  onFiltersChange: (filters: AdvancedFilter[]) => void;
}) => {
  const filterOperators: FilterOperator[] = [
    { label: 'Contains', value: 'contains', type: 'text' },
    { label: 'Equals', value: 'equals', type: 'text' },
    { label: 'Starts with', value: 'startsWith', type: 'text' },
    { label: 'Ends with', value: 'endsWith', type: 'text' },
    { label: 'Greater than', value: 'gt', type: 'number' },
    { label: 'Less than', value: 'lt', type: 'number' },
    { label: 'Between', value: 'between', type: 'number' },
    { label: 'Is empty', value: 'isEmpty', type: 'text' },
    { label: 'Is not empty', value: 'isNotEmpty', type: 'text' },
  ];

  const addFilter = () => {
    const newFilter: AdvancedFilter = {
      column: '',
      operator: 'contains',
      value: '',
      condition: 'AND'
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<AdvancedFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    onFiltersChange(newFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters {filters.length > 0 && `(${filters.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Advanced Filters</h4>
            <Button size="sm" onClick={addFilter}>
              <Plus className="w-4 h-4 mr-1" />
              Add Filter
            </Button>
          </div>
          
          {filters.map((filter, index) => (
            <div key={index} className="space-y-2 p-3 border rounded">
              {index > 0 && (
                <Select value={filter.condition} onValueChange={(value) => updateFilter(index, { condition: value as 'AND' | 'OR' })}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex gap-2">
                <Select value={filter.column} onValueChange={(value) => updateFilter(index, { column: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col: any) => (
                      col.id && (
                        <SelectItem key={col.id} value={col.id}>
                          {col.id.replace(/([A-Z])/g, ' $1').trim()}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filter.operator} onValueChange={(value) => updateFilter(index, { operator: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOperators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={filter.value}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                  placeholder="Value"
                />

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFilter(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filters.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No filters applied. Click "Add Filter" to start.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Enhanced Export Menu with multiple formats
const ExportMenu = ({ 
  data, 
  selectedRows,
  permissions,
  filename = 'export',
  columns
}: { 
  data: any[];
  selectedRows: any[];
  permissions?: TablePermissions;
  filename?: string;
  columns?: ColumnDef<any>[];
}) => {
  const exportToCSV = (exportData: any[]) => {
    if (exportData.length === 0) return;
    
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = (exportData: any[]) => {
    // Create Excel-compatible TSV format
    if (exportData.length === 0) return;
    
    const headers = Object.keys(exportData[0] || {});
    const tsvContent = [
      headers.join('\t'),
      ...exportData.map(row => 
        headers.map(header => String(row[header] || '')).join('\t')
      )
    ].join('\n');
    
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (exportData: any[]) => {
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const tableData = selectedRows.length > 0 ? selectedRows : data;
    const headers = Object.keys(tableData[0] || {});
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table - ${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            h1 { color: #333; margin-bottom: 10px; }
            .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <div class="meta">
            Generated on ${new Date().toLocaleString()}
            ${selectedRows.length > 0 ? `(${selectedRows.length} selected rows)` : `(${data.length} total rows)`}
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableData.map(row => 
                `<tr>${headers.map(header => `<td>${String(row[header] || '')}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  if (!permissions?.canExport) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportToCSV(data)}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export All to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel(data)}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export All to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON(data)}>
          <FileImage className="w-4 h-4 mr-2" />
          Export All to JSON
        </DropdownMenuItem>
        {selectedRows.length > 0 && (
          <>
            <DropdownMenuItem onClick={() => exportToCSV(selectedRows)}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Selected to CSV ({selectedRows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToExcel(selectedRows)}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Selected to Excel ({selectedRows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToJSON(selectedRows)}>
              <FileImage className="w-4 h-4 mr-2" />
              Export Selected to JSON ({selectedRows.length})
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={printTable}>
          <PrinterIcon className="w-4 h-4 mr-2" />
          Print Table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Inline Edit Cell Component
const InlineEditCell = ({ 
  value, 
  onSave, 
  type = 'text',
  options = [],
  disabled = false 
}: {
  value: any;
  onSave: (newValue: any) => void;
  type?: 'text' | 'number' | 'select' | 'date';
  options?: { label: string; value: any }[];
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (disabled || !isEditing) {
    return (
      <div
        className={cn(
          "min-h-[32px] flex items-center cursor-pointer hover:bg-muted/50 rounded px-2 py-1",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setIsEditing(true)}
      >
        {String(value)}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <Select value={editValue} onValueChange={setEditValue} onOpenChange={(open) => !open && handleSave()}>
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className="h-8 text-sm"
      />
      <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
        <Check className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

// Virtual Scrolling Component
const VirtualizedTableBody = ({ 
  rows, 
  columns, 
  itemHeight = 48,
  containerHeight = 400 
}: {
  rows: any[];
  columns: ColumnDef<any>[];
  itemHeight?: number;
  containerHeight?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = rows.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, rows.length);
  const visibleRows = rows.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
      className="border-t"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleRows.map((row, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="flex items-center border-b hover:bg-muted/50"
            >
              {row.getVisibleCells().map((cell: any) => (
                <div
                  key={cell.id}
                  className="px-4 flex-1 text-sm"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Keyboard Navigation Hook
const useKeyboardNavigation = (
  tableRef: RefObject<HTMLTableElement>, 
  enabled: boolean = false
) => {
  useEffect(() => {
    if (!enabled || !tableRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const table = tableRef.current;
      if (!table) return;

      const focusedElement = document.activeElement as HTMLElement;
      const cells = Array.from(table.querySelectorAll('td, th')) as HTMLElement[];
      const currentIndex = cells.indexOf(focusedElement);

      if (currentIndex === -1) return;

      const columns = table.rows[0]?.cells.length || 0;
      const rows = table.rows.length;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex % columns < columns - 1) {
            cells[currentIndex + 1]?.focus();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex % columns > 0) {
            cells[currentIndex - 1]?.focus();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex + columns < cells.length) {
            cells[currentIndex + columns]?.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex - columns >= 0) {
            cells[currentIndex - columns]?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          if (e.ctrlKey) {
            cells[0]?.focus();
          } else {
            const rowStart = Math.floor(currentIndex / columns) * columns;
            cells[rowStart]?.focus();
          }
          break;
        case 'End':
          e.preventDefault();
          if (e.ctrlKey) {
            cells[cells.length - 1]?.focus();
          } else {
            const rowStart = Math.floor(currentIndex / columns) * columns;
            cells[rowStart + columns - 1]?.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, tableRef]);
};

const Pagination = ({ table }: { table: TanstackTable<any> }) => (
  <div className="flex items-center justify-between px-4 py-3 border-t">
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
        {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
        {table.getFilteredRowModel().rows.length} results
      </span>
    </div>
    
    <div className="flex items-center gap-2">
      <Select
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map(size => (
            <SelectItem key={size} value={size.toString()}>
              {size} per page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      
      <span className="text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  </div>
);

// Main Reusable Table Component
export function ReusableTable<T = any>({
  data,
  columns,
  loading = false,
  error = null,
  title,
  permissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
    canExport: true,
    canAdd: false,
    canBulkEdit: false,
    canInlineEdit: false,
    canManageColumns: true
  },
  actions = [],
  onAdd,
  onRefresh,
  onBulkDelete,
  onBulkEdit,
  onRowEdit,
  onAuditLog,
  enableSelection = false,
  enableSearch = true,
  enableColumnVisibility = true,
  enableExport = true,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true,
  enableGrouping = false,
  enableInlineEdit = false,
  enableKeyboardNav = false,
  enableVirtualScrolling = false,
  enableAdvancedFilters = false,
  enableAuditTrail = false,
  enablePrintMode = false,
  pageSize = 10,
  virtualItemHeight = 48,
  className,
  storageKey = 'reusable-table',
  customActions,
  emptyMessage = 'No data available',
  theme,
  locale = 'en-US',
  timezone = 'UTC',
  rowHeight = 'normal',
  aggregationFunctions = {}
}: ReusableTableProps<T>) {
  // State management
  const [sorting, setSorting] = useLocalStorage<SortingState>(`${storageKey}-sorting`, []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(`${storageKey}-visibility`, {});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useLocalStorage<GroupingState>(`${storageKey}-grouping`, []);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(`${storageKey}-column-order`, []);
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(`${storageKey}-column-sizing`, {});
  const [pagination, setPagination] = useLocalStorage<PaginationState>(`${storageKey}-pagination`, {
    pageIndex: 0,
    pageSize,
  });
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useLocalStorage<AdvancedFilter[]>(`${storageKey}-advanced-filters`, []);
  const [auditTrail, setAuditTrail] = useLocalStorage<AuditTrail[]>(`${storageKey}-audit-trail`, []);
  
  // Table ref for keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Enable keyboard navigation
  useKeyboardNavigation(tableRef, enableKeyboardNav);
  
  // Row height classes
  const rowHeightClasses = {
    compact: 'py-1',
    normal: 'py-3',
    comfortable: 'py-4'
  };

  // Enhanced columns with selection and actions
  const enhancedColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // Selection column
    if (enableSelection) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      });
    }

    // Add original columns
    cols.push(...columns);

    // Actions column
    if (actions.length > 0) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <ActionMenu row={row.original} actions={actions} permissions={permissions} />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 100,
      });
    }

    return cols;
  }, [columns, actions, permissions, enableSelection]);

  // Table instance
  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      expanded,
      globalFilter,
      columnOrder,
      columnSizing,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: enableSelection,
    enableGrouping,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
  });

  // Get selected rows data
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedRows.length === 0 || !onBulkDelete) return;
    onBulkDelete(selectedRows);
    setRowSelection({});
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {(title || onAdd || onRefresh || customActions) && (
        <div className="flex justify-between items-center">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          <div className="flex items-center gap-2">
            {customActions}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            {onAdd && permissions.canAdd && (
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        {enableSearch && (
          <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        )}
        {enableAdvancedFilters && (
          <AdvancedFilterBuilder 
            columns={enhancedColumns} 
            filters={advancedFilters} 
            onFiltersChange={setAdvancedFilters} 
          />
        )}
        {enableColumnVisibility && permissions.canManageColumns && (
          <ColumnVisibilityManager table={table} />
        )}
        {enableExport && (
          <ExportMenu 
            data={data} 
            selectedRows={selectedRows} 
            permissions={permissions}
            filename={title?.toLowerCase().replace(/\s+/g, '-') || 'export'}
            columns={enhancedColumns}
          />
        )}

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md">
            <span className="text-sm font-medium">{selectedRows.length} selected</span>
            {onBulkDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
            {onBulkEdit && permissions.canBulkEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkEdit(selectedRows)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Selected
              </Button>
            )}
          </div>
        )}

        {/* Accessibility and keyboard shortcuts info */}
        {enableKeyboardNav && (
          <Button variant="ghost" size="sm" className="text-xs">
            <Keyboard className="w-4 h-4 mr-1" />
            Keyboard Nav
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b relative"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {enableSorting && header.column.getCanSort() ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 font-medium"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp className="w-4 h-4 ml-1" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown className="w-4 h-4 ml-1" />
                                ) : (
                                  <ArrowUpDown className="w-4 h-4 ml-1" />
                                )}
                              </Button>
                            ) : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
                          </div>
                          {enableFiltering && header.column.getCanFilter() && (
                            <ColumnFilter column={header.column} table={table} />
                          )}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-1 bg-border cursor-col-resize opacity-0 hover:opacity-100"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <SkeletonRow key={i} columns={enhancedColumns.length} />
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={enhancedColumns.length} className="px-4 py-8 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map(cell => {
                      const column = cell.column;
                      const columnMeta = column.columnDef.meta as any;
                      const isEditable = enableInlineEdit && permissions.canInlineEdit && columnMeta?.editable;
                      
                      return (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm"
                          style={{ width: cell.column.getSize() }}
                        >
                          {isEditable ? (
                            <InlineEditCell
                              value={cell.getValue()}
                              onSave={(newValue) => {
                                if (onRowEdit) {
                                  onRowEdit(row.original, { [column.id]: newValue } as Partial<T>);
                                }
                              }}
                              type={columnMeta.editType || 'text'}
                              options={columnMeta.options || []}
                            />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && <Pagination table={table} />}
      </div>
    </div>
  );
}

export default ReusableTable;