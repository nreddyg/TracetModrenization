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
  ColumnPinningState,
  FilterFn,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
  Minimize2,
  Pin,
  PinOff,
  FileText,
  Group,
  CheckSquare,
  Square,
  MoreVertical
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReusableMultiSelect } from './reusable-multi-select';

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

// NEW: Enhanced Selection interfaces
export interface SelectionInfo<T = any> {
  selectedRows: T[];
  selectedRowIds: string[];
  totalSelected: number;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}

export interface SelectionActions<T = any> {
  selectRow: (rowId: string) => void;
  deselectRow: (rowId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleRowSelection: (rowId: string) => void;
  selectMultiple: (rowIds: string[]) => void;
  deselectMultiple: (rowIds: string[]) => void;
  invertSelection: () => void;
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
  enableRowReordering?: boolean;
  onRowReorder?: (newData: T[]) => void;
  columnVisibility?: VisibilityState; // 👈 new
  onColumnVisibilityChange?: (updater: VisibilityState) => void; // 👈 new
  // NEW: Enhanced Selection Props
  selectedRowIds?: string[]; // Control selection from outside
  onSelectionChange?: (selectionInfo: SelectionInfo<T>) => void; // Get selection changes
  onSelectedRowsAction?: (action: string, selectedRows: T[]) => void; // Custom actions on selected rows
  getRowId?: (row: T, index: number) => string; // Custom row ID getter
  selectionMode?: 'single' | 'multiple'; // Single or multiple selection
  enableSelectAll?: boolean; // Enable/disable select all functionality
  maxSelectable?: number; // Maximum number of rows that can be selected
  selectableRowFilter?: (row: T) => boolean; // Filter which rows can be selected

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
  enableColumnPinning?: boolean;
  enableTreeData?: boolean;
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
  getSubRows?: (originalRow: T, index: number) => T[] | undefined;
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

// NEW: Enhanced Selection Hook
function useTableSelection<T = any>(
  data: T[],
  getRowId: (row: T, index: number) => string,
  selectionMode: 'single' | 'multiple' = 'multiple',
  maxSelectable?: number,
  selectableRowFilter?: (row: T) => boolean,
  initialSelectedIds?: string[]
) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    const initial: RowSelectionState = {};
    if (initialSelectedIds) {
      initialSelectedIds.forEach(id => {
        initial[id] = true;
      });
    }
    return initial;
  });

  // Get selectable rows
  const selectableRows = useMemo(() => {
    return data?.filter(selectableRowFilter || (() => true));
  }, [data, selectableRowFilter]);

  // Get selected rows data
  const selectedRows = useMemo(() => {
    return data?.filter((row, index) => {
      const id = getRowId(row, index);
      return rowSelection[id];
    });
  }, [data, rowSelection, getRowId]);

  // Get selected row IDs
  const selectedRowIds = useMemo(() => {
    return Object.keys(rowSelection).filter(id => rowSelection[id]);
  }, [rowSelection]);

  // Selection info
  const selectionInfo: SelectionInfo<T> = useMemo(() => {
    const totalSelectable = selectableRows?.length;
    const totalSelected = selectedRowIds?.length;
    const isAllSelected = totalSelectable > 0 && totalSelected === totalSelectable;
    const isPartiallySelected = totalSelected > 0 && totalSelected < totalSelectable;

    return {
      selectedRows,
      selectedRowIds,
      totalSelected,
      isAllSelected,
      isPartiallySelected
    };
  }, [selectedRows, selectedRowIds, selectableRows?.length]);

  // Selection actions
  const selectionActions: SelectionActions<T> = useMemo(() => ({
    selectRow: (rowId: string) => {
      if (selectionMode === 'single') {
        setRowSelection({ [rowId]: true });
      } else {
        if (maxSelectable && selectedRowIds.length >= maxSelectable) return;
        setRowSelection(prev => ({ ...prev, [rowId]: true }));
      }
    },

    deselectRow: (rowId: string) => {
      setRowSelection(prev => {
        const newSelection = { ...prev };
        delete newSelection[rowId];
        return newSelection;
      });
    },

    selectAll: () => {
      if (selectionMode === 'single') return;
      const newSelection: RowSelectionState = {};
      const rowsToSelect = maxSelectable
        ? selectableRows.slice(0, maxSelectable)
        : selectableRows;

      rowsToSelect.forEach((row, index) => {
        const id = getRowId(row, data.indexOf(row));
        newSelection[id] = true;
      });
      setRowSelection(newSelection);
    },

    deselectAll: () => {
      setRowSelection({});
    },

    toggleRowSelection: (rowId: string) => {
      setRowSelection(prev => {
        if (prev[rowId]) {
          const newSelection = { ...prev };
          delete newSelection[rowId];
          return newSelection;
        } else {
          if (selectionMode === 'single') {
            return { [rowId]: true };
          }
          if (maxSelectable && Object.keys(prev).length >= maxSelectable) {
            return prev;
          }
          return { ...prev, [rowId]: true };
        }
      });
    },

    selectMultiple: (rowIds: string[]) => {
      if (selectionMode === 'single') {
        if (rowIds.length > 0) {
          setRowSelection({ [rowIds[0]]: true });
        }
        return;
      }

      const newSelection = { ...rowSelection };
      const idsToSelect = maxSelectable
        ? rowIds.slice(0, Math.max(0, maxSelectable - selectedRowIds.length))
        : rowIds;

      idsToSelect.forEach(id => {
        newSelection[id] = true;
      });
      setRowSelection(newSelection);
    },

    deselectMultiple: (rowIds: string[]) => {
      const newSelection = { ...rowSelection };
      rowIds.forEach(id => {
        delete newSelection[id];
      });
      setRowSelection(newSelection);
    },

    invertSelection: () => {
      if (selectionMode === 'single') return;
      const newSelection: RowSelectionState = {};
      selectableRows.forEach((row, index) => {
        const id = getRowId(row, data.indexOf(row));
        if (!rowSelection[id]) {
          newSelection[id] = true;
        }
      });

      if (maxSelectable) {
        const selectedIds = Object.keys(newSelection).slice(0, maxSelectable);
        const limitedSelection: RowSelectionState = {};
        selectedIds.forEach(id => {
          limitedSelection[id] = true;
        });
        setRowSelection(limitedSelection);
      } else {
        setRowSelection(newSelection);
      }
    }
  }), [selectionMode, maxSelectable, selectedRowIds, selectableRows, rowSelection, data, getRowId]);

  return {
    rowSelection,
    setRowSelection,
    selectionInfo,
    selectionActions
  };
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
const ColumnVisibilityManager = ({ table }: { table: TanstackTable<any> }) => {
  const allColumns = table.getAllLeafColumns();

  // Only columns that the table allows hiding
  const toggleableColumns = allColumns.filter((col) => col.getCanHide());

  // Compute Select All state from toggleable columns only
  const allVisible =
    toggleableColumns.length > 0 &&
    toggleableColumns.every((col) => col.getIsVisible());
  const someVisible =
    toggleableColumns.some((col) => col.getIsVisible()) && !allVisible;

  // One-shot update for all columns to avoid multiple renders/flicker
  const handleToggleAll = (checked: boolean) => {
    table.setColumnVisibility((prev) => {
      const next = { ...prev };
      toggleableColumns.forEach((col) => {
        next[col.id] = checked; // true => show all, false => hide all
      });
      return next;
    });
  };

  // Individual toggle keeps Select All state in sync automatically
  const handleToggleColumn = (column: any, checked: boolean) => {
    column.toggleVisibility(checked);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns className="w-4 h-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2">
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "40vh" }}>
          {/* Select All */}
          <div className="flex items-center space-x-2 border-b pb-2 mb-2">
            <Checkbox
              id="select-all-columns"
              checked={allVisible ? true : someVisible ? "indeterminate" : false}
              onCheckedChange={(checked) => handleToggleAll(checked === true)}
            />
            <label htmlFor="select-all-columns" className="text-sm font-medium">
              Select All
            </label>
          </div>

          {/* Individual columns */}
          {allColumns.map((column) => {
            const canHide = column.getCanHide(); // false for locked columns
            const label =
              (column.columnDef.header as any)?.toString?.() ||
              column.id.replace(/([A-Z])/g, " $1").trim();

            return (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={column.getIsVisible()}
                  disabled={!canHide}
                  onCheckedChange={(checked) => {
                    if (canHide) handleToggleColumn(column, checked === true);
                  }}
                />
                <label
                  htmlFor={column.id}
                  className={`text-sm font-medium capitalize ${!canHide ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};



// Column Pinning Manager Component
const ColumnPinningManager = ({
  table
}: {
  table: TanstackTable<any>;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Pin className="w-4 h-4 mr-2" />
          Pin Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "40vh" }}>
          {table.getAllLeafColumns().map((column) => (
            <div key={column.id} className="flex items-center justify-between space-x-2">
              <label className="text-sm font-medium capitalize flex-1">
                {column.id.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={column.getIsPinned() === 'left' ? 'default' : 'outline'}
                  onClick={() => column.pin(column.getIsPinned() === 'left' ? false : 'left')}
                  className="h-6 w-6 p-0"
                >
                  ←
                </Button>
                <Button
                  size="sm"
                  variant={column.getIsPinned() === 'right' ? 'default' : 'outline'}
                  onClick={() => column.pin(column.getIsPinned() === 'right' ? false : 'right')}
                  className="h-6 w-6 p-0"
                >
                  →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Column Grouping Manager Component
const ColumnGroupingManager = ({
  table
}: {
  table: TanstackTable<any>;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Group className="w-4 h-4 mr-2" />
          Group By
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanGroup())
            .map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={column.getIsGrouped()}
                  onCheckedChange={() => column.toggleGrouping()}
                  id={`group-${column.id}`}
                />
                <label
                  htmlFor={`group-${column.id}`}
                  className="text-sm font-medium capitalize"
                >
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

// NEW: Enhanced Selection Controls Component
const SelectionControls = <T,>({
  selectionInfo,
  selectionActions,
  selectionMode,
  enableSelectAll,
  maxSelectable,
  onSelectedRowsAction
}: {
  selectionInfo: SelectionInfo<T>;
  selectionActions: SelectionActions<T>;
  selectionMode: 'single' | 'multiple';
  enableSelectAll: boolean;
  maxSelectable?: number;
  onSelectedRowsAction?: (action: string, selectedRows: T[]) => void;
}) => {
  if (selectionInfo.totalSelected === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md">
      <Badge variant="secondary">
        {selectionInfo.totalSelected} selected
        {maxSelectable && ` of ${maxSelectable} max`}
      </Badge>

      {selectionMode === 'multiple' && (
        <>
          {enableSelectAll && (
            <Button
              size="sm"
              variant="outline"
              onClick={selectionInfo.isAllSelected ? selectionActions.deselectAll : selectionActions.selectAll}
            >
              {selectionInfo.isAllSelected ? (
                <>
                  <Square className="w-4 h-4 mr-1" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-1" />
                  Select All
                </>
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={selectionActions.invertSelection}
          >
            Invert Selection
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={selectionActions.deselectAll}
      >
        Clear Selection
      </Button>

      {onSelectedRowsAction && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              Actions
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSelectedRowsAction('export', selectionInfo.selectedRows)}>
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectedRowsAction('duplicate', selectionInfo.selectedRows)}>
              <Plus className="w-4 h-4 mr-2" />
              Duplicate Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectedRowsAction('archive', selectionInfo.selectedRows)}>
              <History className="w-4 h-4 mr-2" />
              Archive Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
function getVisibleData(table: TanstackTable<any>, exportData: any[]) {
  const visibleCols = table.getAllLeafColumns().filter(col => col.getIsVisible());

  const headers = visibleCols.map(
    col => (col.columnDef.header as string) || col.id
  );

  const body = exportData.map(row =>
    visibleCols.map(col => {
      try {
        const tableRow = table.getRowModel().rows.find(r => r.original === row);
        return String(tableRow?.getValue(col.id) ?? "");
      } catch {
        return "";
      }
    })
  );

  return { headers, body };
}


// Enhanced Export Menu with multiple formats
const ExportMenu = ({
  data,
  selectedRows,
  permissions,
  filename = 'export',
  table,
}: {
  data: any[];
  selectedRows: any[];
  permissions?: TablePermissions;
  filename?: string;
  columns?: ColumnDef<any>[];
  table: TanstackTable<any>;
}) => {
  const exportToCSV = (exportData: any[], table: TanstackTable<any>) => {
    if (exportData.length === 0) return;

    const { headers, body } = getVisibleData(table, exportData);

    const csvContent = [
      headers.join(","),
      ...body.map(row =>
        row.map(val => `"${val.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const exportToExcel = (exportData: any[], table: TanstackTable<any>) => {
    if (exportData.length === 0) return;

    const { headers, body } = getVisibleData(table, exportData);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...body]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    worksheet["!cols"] = headers.map(() => ({ wch: 20 }));

    XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`);
  };


  const exportToPDF = (exportData: any[], table: TanstackTable<any>) => {
    if (exportData.length === 0) return;

    const doc = new jsPDF();
    const { headers, body } = getVisibleData(table, exportData);

    doc.setFontSize(14);
    doc.text(filename, 14, 20);

    autoTable(doc, {
      head: [headers],
      body,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 135, 245] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: "grid",
      margin: { top: 30 },
    });

    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
  };



  const exportToJSON = (exportData: any[], table: TanstackTable<any>) => {
    if (exportData.length === 0) return;

    const { headers, body } = getVisibleData(table, exportData);

    const jsonData = body.map(row =>
      Object.fromEntries(headers.map((h, i) => [h, row[i]]))
    );

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
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
        <DropdownMenuItem onClick={() => exportToCSV(data, table)}>
          Export All to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel(data, table)}>
          Export All to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON(data, table)}>
          Export All to JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToPDF(data, table)}>
          Export All to PDF
        </DropdownMenuItem>

        {selectedRows.length > 0 && (
          <>
            <DropdownMenuItem onClick={() => exportToCSV(selectedRows, table)}>
              Export Selected to CSV ({selectedRows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToExcel(selectedRows, table)}>
              Export Selected to Excel ({selectedRows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToJSON(selectedRows, table)}>
              Export Selected to JSON ({selectedRows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToPDF(selectedRows, table)}>
              Export Selected to PDF ({selectedRows.length})
            </DropdownMenuItem>
          </>
        )}

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
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-t gap-2">
    <div className="text-sm text-muted-foreground">
      Showing{' '}
      {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
      {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
      {table.getFilteredRowModel().rows.length} results
    </div>

    <div className="flex flex-wrap items-center gap-2">
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
function DraggableRow({ row, children }: { row: any; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={row.getIsSelected() ? "bg-primary/5 hover:bg-muted/50" : "hover:bg-muted/50"}
    >
      {children}
    </tr>
  );
}

// Main Reusable Table Component
export function ReusableTable<T = any>({
  data,
  columns,
  loading = false,
  error = null,
  title,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
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

  // NEW: Enhanced Selection Props
  selectedRowIds: controlledSelectedRowIds,
  onSelectionChange,
  onSelectedRowsAction,
  getRowId = (row: T, index: number) => String(index),
  selectionMode = 'multiple',
  enableSelectAll = true,
  maxSelectable,
  selectableRowFilter,

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
  enableColumnPinning = false,
  enableTreeData = false,
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
  aggregationFunctions = {},
  getSubRows,
  enableRowReordering = false,
  onRowReorder,
}: ReusableTableProps<T>) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(`${storageKey}-visibility`, {});
  const [uncontrolledColumnVisibility, setUncontrolledColumnVisibility] = useState<VisibilityState>({});
  const isColumnVisibilityControlled = controlledColumnVisibility !== undefined;
  const columnVisibility: VisibilityState = isColumnVisibilityControlled
    ? (controlledColumnVisibility as VisibilityState)
    : uncontrolledColumnVisibility;
  // const [openColumnId, setOpenColumnId] = useState<string | null>(null)):
  const [grouping, setGrouping] = useLocalStorage<GroupingState>(`${storageKey}-grouping`, []);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(`${storageKey}-column-order`, []);
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(`${storageKey}-column-sizing`, {});
  const [pagination, setPagination] = useLocalStorage<PaginationState>(`${storageKey}-pagination`, {
    pageIndex: 0,
    pageSize,
  });
  const [openColumnId, setOpenColumnId] = useState<string | null>(null)

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useLocalStorage<AdvancedFilter[]>(`${storageKey}-advanced-filters`, []);
  const [auditTrail, setAuditTrail] = useLocalStorage<AuditTrail[]>(`${storageKey}-audit-trail`, []);
  const [columnPinning, setColumnPinning] = useLocalStorage<ColumnPinningState>(`${storageKey}-column-pinning`, {
    left: [],
    right: []
  });
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    const prev = columnVisibility;
    const next = typeof updater === 'function' ? (updater as any)(prev) : updater;

    if (!isColumnVisibilityControlled) {
      setUncontrolledColumnVisibility(next);
    }
    // Notify parent with the final map of visibilities
    onColumnVisibilityChange?.(next as VisibilityState);
  };
  // NEW: Enhanced Selection Management
  const {
    rowSelection,
    setRowSelection,
    selectionInfo,
    selectionActions
  } = useTableSelection(
    data,
    getRowId,
    selectionMode,
    maxSelectable,
    selectableRowFilter,
    controlledSelectedRowIds
  );

  // NEW: Sync external selection changes
  useEffect(() => {
    if (controlledSelectedRowIds && Array.isArray(controlledSelectedRowIds)) {
      const newSelection: RowSelectionState = {};
      controlledSelectedRowIds.forEach(id => {
        newSelection[id] = true;
      });
      setRowSelection(newSelection);
    }
  }, [controlledSelectedRowIds, setRowSelection]);

  // NEW: Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectionInfo);
    }
  }, [selectionInfo, onSelectionChange]);

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
        header: ({ table }) => {
          // Check if we're in single selection mode or if select all is disabled
          if (selectionMode === 'single' || !enableSelectAll) {
            return null;
          }

          return (
            <Checkbox
              checked={selectionInfo.isAllSelected}
              ref={(el) => {
                if (el && 'indeterminate' in el) {
                  (el as HTMLInputElement).indeterminate = selectionInfo.isPartiallySelected;
                }
              }}
              onCheckedChange={(checked) => {
                if (checked) {
                  selectionActions.selectAll();
                } else {
                  selectionActions.deselectAll();
                }
              }}
              aria-label="Select all"
            />
          );
        },
        cell: ({ row }) => {
          const rowId = getRowId(row.original, row.index);
          const isSelectable = !selectableRowFilter || selectableRowFilter(row.original);
          const isSelected = rowSelection[rowId] || false;

          if (!isSelectable) {
            return <div className="w-4 h-4" />;
          }

          return (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => selectionActions.toggleRowSelection(rowId)}
              aria-label="Select row"
              disabled={!isSelectable || (maxSelectable && !isSelected && selectionInfo.totalSelected >= maxSelectable)}
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
        size: 50,
      });
    }

    // Add original columns
    cols.push(
      ...columns.map(col => ({
        ...col,
        // keep any explicit filterFn, otherwise use multi-select
        filterFn: (col as any).filterFn ?? 'multiSelect',
      }))
    );

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
  }, [columns, actions, permissions, enableSelection, selectionMode, enableSelectAll, selectionInfo, rowSelection, selectionActions, getRowId, selectableRowFilter, maxSelectable]);
  interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    table: TanstackTable<TData>
    title: string
    enableSorting: boolean
    enableFiltering: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
  }
const headerRef = React.useRef<HTMLDivElement>(null);
const [calculatedMinWidth, setCalculatedMinWidth] = React.useState<number>(150);
function getMinWidthFromChars(charCount: number, font: string = '12px Arial'): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 48; // fallback minimum width

  context.font = font;
  const avgCharWidth = context.measureText('M').width; // Use 'M' as average char width
  return Math.ceil(avgCharWidth * charCount + 32); // +32 for padding
}
  function DataTableColumnHeader<TData, TValue>({
    column,
    table,
    title,
    enableSorting,
    enableFiltering,
  }: DataTableColumnHeaderProps<TData, TValue>) {
useEffect(() => {
  if (headerRef.current) {
    const actualWidth = headerRef.current.offsetWidth + 16;

    const minCharsWidth = getMinWidthFromChars(10);  // Minimum width based on 4 chars
    const calculated = Math.max(actualWidth, minCharsWidth);

    setCalculatedMinWidth(calculated);
  }
}, [title]);
    const [tempFilter, setTempFilter] = React.useState<string[]>(
      Array.isArray(column.getFilterValue()) ? (column.getFilterValue() as string[]) : []
    );



    // Build option list from the column's data (faceted uniques when available)
    const options = React.useMemo(() => {
      const rawValues = Array.from(
        new Set(
          table
            .getPreFilteredRowModel()
            .flatRows
            .map(r => r.getValue(column.id))
        )
      );

      return rawValues
        .filter(v => v !== undefined && v !== null && v !== '')
        .map(v => ({
          label: String(v),
          value: String(v),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }, [column.id, table]);



    // Row selection column → header checkbox only
    if (column.id === "select") {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      )
    }

    // Actions column → just title
    if (column.id === "actions") {
      return <span>{title}</span>
    }

    // Normal columns → title + popover
    return (
      <div ref={headerRef} className="flex items-center space-x-1 min-w-0">
        <span className="font-medium capitalize truncate flex-1 min-w-10" title={title}>{title}</span>

        <Popover open={openColumnId === column.id} onOpenChange={(open) => {
          setOpenColumnId(open ? column.id : null);
        }}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-60 p-4 space-y-4"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if ((e.target as HTMLElement).closest("input,button,textarea,select")) {
                e.preventDefault()
              }
            }}
          >
            {/* Sorting */}
{enableSorting && column.getCanSort() && (
  <div className="space-y-2">
    <p className="text-sm font-medium">Sort</p>
    <div className="flex gap-2">
      {/* Ascending Button */}
      <Button
        variant={
          column.getIsSorted() === 'asc'
            ? 'default' // active
            : 'outline' // inactive
        }
        size="sm"
        className={cn(
          "flex-1",
          column.getIsSorted() === 'asc'
            ? "bg-primary text-white hover:bg-primary/90"
            : "text-foreground"
        )}
        onClick={() => {
          if (column.getIsSorted() === 'asc') {
            column.clearSorting(); // reset to original
          } else {
            column.toggleSorting(false); // sort asc
          }
        }}
      >
        <ArrowUp className="w-4 h-4 mr-1" />
        Asc
      </Button>

      {/* Descending Button */}
      <Button
        variant={
          column.getIsSorted() === 'desc'
            ? 'default'
            : 'outline'
        }
        size="sm"
        className={cn(
          "flex-1",
          column.getIsSorted() === 'desc'
            ? "bg-primary text-white hover:bg-primary/90"
            : "text-foreground"
        )}
        onClick={() => {
          if (column.getIsSorted() === 'desc') {
            column.clearSorting(); // reset to original
          } else {
            column.toggleSorting(true); // sort desc
          }
        }}
      >
        <ArrowDown className="w-4 h-4 mr-1" />
        Desc
      </Button>
    </div>
  </div>
)}



            {/* Filtering */}
            {enableFiltering && column.getCanFilter() && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Filter</label>

                <ReusableMultiSelect
                  options={options}
                  value={tempFilter}
                  onChange={(vals) => setTempFilter(vals as string[])}
                  placeholder={`Filter ${title}`}
                  selectAll   // ✅
                  searchable
                  className="w-full"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempFilter([]);
                      column.setFilterValue(undefined);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      column.setFilterValue(tempFilter.length ? tempFilter : undefined)
                      setOpenColumnId(null);
                    }
                    }
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    )
  }
  const multiSelectFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const selected: string[] = Array.isArray(filterValue) ? filterValue : [];
    if (!selected.length) return true;

    const raw = row.getValue(columnId);
    if (raw == null) return false;

    if (Array.isArray(raw)) {
      const asStrings = raw.map(String);
      return selected.some(v => asStrings.includes(String(v)));
    }
    return selected.includes(String(raw));
  };
  const safeGetFacetedUniqueValues = () => (table, columnId) => {
    const getter = getFacetedUniqueValues()(table, columnId);
    return () => {
      const map = getter();
      for (const key of [...map.keys()]) {
        if (key === null) {
          map.delete(key); // remove null keys entirely
        }
      }
      return map;
    };
  };

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
      columnPinning,

    },
    filterFns: { multiSelect: multiSelectFilterFn },
    getFacetedRowModel: getFacetedRowModel(), // ✅
    getFacetedUniqueValues: safeGetFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: enableSelection,
    enableGrouping,
    enableColumnResizing: true,
    enableColumnPinning,
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
    getSubRows: enableTreeData ? getSubRows : undefined,
    getRowId: enableSelection ? (row, index) => getRowId(row, index) : undefined,
  });

  // Get selected rows data - use selectionInfo from the hook
  const selectedRows = selectionInfo.selectedRows;

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedRows.length === 0 || !onBulkDelete) return;
    onBulkDelete(selectedRows);
    selectionActions.deselectAll();
  };

  const handleBulkEdit = () => {
    if (selectedRows.length === 0 || !onBulkEdit) return;
    onBulkEdit(selectedRows);
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
    <div className={cn("space-y-2", className)}>
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
        {enableColumnPinning && permissions.canManageColumns && (
          <ColumnPinningManager table={table} />
        )}
        {enableGrouping && (
          <ColumnGroupingManager table={table} />
        )}
        {enableExport && (
          <ExportMenu
            data={table?.getCoreRowModel().rows.map(r => r.original)}
            selectedRows={selectedRows}
            permissions={permissions}
            filename={title || 'export'}
            columns={enhancedColumns}
            table={table}
          />
        )}

        {/* Accessibility and keyboard shortcuts info */}
        {enableKeyboardNav && (
          <Button variant="ghost" size="sm" className="text-xs">
            <Keyboard className="w-4 h-4 mr-1" />
            Keyboard Nav
          </Button>
        )}
      </div>

      {/* NEW: Enhanced Selection Controls */}
      {enableSelection && (
        <SelectionControls
          selectionInfo={selectionInfo}
          selectionActions={selectionActions}
          selectionMode={selectionMode}
          enableSelectAll={enableSelectAll}
          maxSelectable={maxSelectable}
          onSelectedRowsAction={onSelectedRowsAction}
        />
      )}

      {/* Legacy selection controls for backward compatibility */}
      {selectedRows?.length > 0 && (onBulkDelete || onBulkEdit) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-md">
          <span className="text-sm font-medium">Legacy Actions: {selectedRows.length} selected</span>
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
              onClick={handleBulkEdit}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Selected
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full  table-fixed">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="ps-4 px-2 py-1 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b relative bg-background z-10"
                      style={{
                        width: header.getSize(),
                        minWidth: `${calculatedMinWidth}px`,
                        maxWidth: header.column.columnDef.maxSize ?? 1000,
                        position: header.column.getIsPinned() ? "sticky" : "relative",
                        whiteSpace: 'nowrap',
                        left: header.column.getIsPinned() === "left" ? header.column.getStart("left") : undefined,
                        right: header.column.getIsPinned() === "right" ? header.column.getStart("right") : undefined,
                        zIndex: header.column.getIsPinned() ? 20 : 1,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* {enableSorting && header.column.getCanSort() ? (
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
                            )} */}
                            <DataTableColumnHeader
                              column={header.column}
                              table={table}
                              title={String(flexRender(header.column.columnDef.header, header.getContext()))}
                              enableSorting={enableSorting}
                              enableFiltering={enableFiltering}
                              isOpen={openColumnId === header.column.id}
                              onOpenChange={(open) =>
                                setOpenColumnId(open ? header.column.id : null)
                              }
                            />
                          </div>
                          {/* {enableFiltering && header.column.getCanFilter() && (
                            <ColumnFilter column={header.column} table={table} />
                          )} */}
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
            {enableRowReordering ? (
              <DndContext
                sensors={useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor))}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (over && active.id !== over.id) {
                    const oldIndex = table.getRowModel().rows.findIndex(r => r.id === active.id);
                    const newIndex = table.getRowModel().rows.findIndex(r => r.id === over.id);
                    const newData = arrayMove([...data], oldIndex, newIndex);
                    onRowReorder?.(newData);
                  }
                }}
              >
                <SortableContext
                  items={table.getRowModel().rows.map(r => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="bg-background divide-y divide-border">
                    {table.getRowModel().rows.map(row => {
                      const rowId = getRowId(row.original, row.index);
                      const isSelected = rowSelection[rowId] || false;
                      const isSelectable = !selectableRowFilter || selectableRowFilter(row.original);

                      return (
                        <DraggableRow key={row.id} row={row}>
                          {row.getVisibleCells().map(cell => {
                            const column = cell.column;
                            const columnMeta = column.columnDef.meta as any;
                            const isEditable =
                              enableInlineEdit &&
                              permissions.canInlineEdit &&
                              columnMeta?.editable;

                            return (
                              <td
                                key={cell.id}
                                className={cn(
                                  "px-4 py-3 text-sm bg-background",
                                  rowHeightClasses[rowHeight]
                                )}
                                style={{
                                  width: cell.column.getSize(),
                                  position: cell.column.getIsPinned() ? "sticky" : "relative",
                                  left:
                                    cell.column.getIsPinned() === "left"
                                      ? cell.column.getStart("left")
                                      : undefined,
                                  right:
                                    cell.column.getIsPinned() === "right"
                                      ? cell.column.getAfter("right")
                                      : undefined,
                                  zIndex: cell.column.getIsPinned() ? 10 : 1,
                                }}
                              >
                                {isEditable ? (
                                  <InlineEditCell
                                    value={cell.getValue()}
                                    onSave={(newValue) => {
                                      if (onRowEdit) {
                                        onRowEdit(row.original, { [column.id]: newValue } as Partial<T>);
                                      }
                                    }}
                                    type={columnMeta.editType || "text"}
                                    options={columnMeta.options || []}
                                  />
                                ) :

                                  <div
                                    className="overflow-hidden"
                                    style={{
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      textOverflow: 'ellipsis',
                                    }}
                                    title={String(cell.getValue())}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </div>
                                }
                              </td>
                            );
                          })}
                        </DraggableRow>
                      );
                    })}
                  </tbody>
                </SortableContext>
              </DndContext>
            ) : (
              <tbody className="bg-background divide-y divide-border">
                {table.getRowModel().rows.map(row => {
                  const rowId = getRowId(row.original, row.index);
                  const isSelected = rowSelection[rowId] || false;
                  const isSelectable = !selectableRowFilter || selectableRowFilter(row.original);

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "hover:bg-muted/50",
                        isSelected && "bg-primary/5",
                        !isSelectable && "opacity-50"
                      )}
                    >
                      {row.getVisibleCells().map(cell => {
                        const column = cell.column;
                        const columnMeta = column.columnDef.meta as any;
                        const isEditable =
                          enableInlineEdit && permissions.canInlineEdit && columnMeta?.editable;

                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-4 py-3 text-sm bg-background",
                              rowHeightClasses[rowHeight]
                            )}
                            style={{
                              width: cell.column.getSize(),
                              position: cell.column.getIsPinned() ? "sticky" : "relative",
                              left:
                                cell.column.getIsPinned() === "left"
                                  ? cell.column.getStart("left")
                                  : undefined,
                              right:
                                cell.column.getIsPinned() === "right"
                                  ? cell.column.getAfter("right")
                                  : undefined,
                              zIndex: cell.column.getIsPinned() ? 10 : 1,
                            }}
                          >
                            {isEditable ? (
                              <InlineEditCell
                                value={cell.getValue()}
                                onSave={(newValue) => {
                                  if (onRowEdit) {
                                    onRowEdit(row.original, { [column.id]: newValue } as Partial<T>);
                                  }
                                }}
                                type={columnMeta.editType || "text"}
                                options={columnMeta.options || []}
                              />
                            ) : <div
                              className="overflow-hidden"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                              }}
                              title={String(cell.getValue())}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}

          </table>
        </div>

        {/* Pagination */}
        {enablePagination && <Pagination table={table} />}
      </div>
    </div>
  );
}

// NEW: Export additional types and hooks for external use
// export { useTableSelection, type SelectionInfo, type SelectionActions };
export default ReusableTable;