
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  parent?: string;
}

interface TreeSelectProps {
  label?: string;
  tooltip?: string;
  placeholder?: string;
  data: TreeNode[];
  value: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  expandAll?: boolean;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  label,
  tooltip,
  placeholder = "Select items...",
  data,
  value,
  onChange,
  multiSelect = true,
  disabled = false,
  className = "",
  required = false,
  error,
  expandAll = false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    expandAll ? new Set(data.map(node => node.id)) : new Set()
  );
  const [open, setOpen] = useState(false);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const selectNode = (nodeId: string) => {
    if (multiSelect) {
      const newValue = value.includes(nodeId)
        ? value.filter(id => id !== nodeId)
        : [...value, nodeId];
      onChange(newValue);
    } else {
      onChange([nodeId]);
      setOpen(false);
    }
  };

  const getSelectedLabels = () => {
    const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return value.map(id => findNodeById(data, id)?.label).filter(Boolean);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = value.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="w-full">
        <div
          className={cn(
            "flex items-center py-1 px-2 hover:bg-gray-100 rounded",
            `ml-${level * 4}`
          )}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 mr-2"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex items-center space-x-2 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => selectNode(node.id)}
            />
            <label className="text-sm cursor-pointer flex-1" onClick={() => selectNode(node.id)}>
              {node.label}
            </label>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-8 text-sm",
              selectedLabels.length === 0 && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={disabled}
          >
            {selectedLabels.length > 0 ? (
              <span className="truncate">
                {selectedLabels.length === 1 
                  ? selectedLabels[0] 
                  : `${selectedLabels.length} items selected`}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <ScrollArea className="h-64">
            <div className="p-2">
              {data.map(node => renderTreeNode(node))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TreeSelect;
