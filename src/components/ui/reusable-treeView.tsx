import React, { useState, useCallback, useMemo, KeyboardEvent } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Check, Minus } from 'lucide-react';

// Utility function for conditional classnames
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Custom Checkbox Component
interface CustomCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(e);
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={cn(
        "w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-all",
        disabled ? "opacity-50 cursor-not-allowed border-gray-300" : "border-gray-400 hover:border-blue-500",
        (checked || indeterminate) && !disabled && "bg-blue-500 border-blue-500"
      )}
      onClick={handleClick}
    >
      {indeterminate ? (
        <Minus className="w-3 h-3 text-white" />
      ) : checked ? (
        <Check className="w-3 h-3 text-white" />
      ) : null}
    </div>
  );
}

// Custom Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

// Types
export interface TreeNodeData {
  key: string;
  title: string;
  children?: TreeNodeData[];
  icon?: React.ReactNode;
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
}

export interface TreeConfig {
  isCheckable?: boolean;
  expandAll?: boolean;
  showLine?: boolean;
  Multiple?: boolean;
  showIcon?: boolean;
}

export interface TreeViewProps {
  treeData: TreeNodeData[];
  config?: TreeConfig;
  selectKeys?: string[];
  onSelect?: (selectedKeys: string[], info: { selected: boolean; selectedNodes: TreeNodeData[]; node: TreeNodeData; event: Event }) => void;
  onCheck?: (checkedKeys: string[], info: { checked: boolean; checkedNodes: TreeNodeData[]; node: TreeNodeData; halfCheckedKeys: string[] }) => void;
  expandedKeys?: string[];
  onExpand?: (expandedKeys: string[], info: { expanded: boolean; node: TreeNodeData }) => void;
  autoExpandParent?: boolean;
  titleRender?: (node: TreeNodeData) => React.ReactNode;
  defaultSelectedKeys?: string[];
  defaultExpandedKeys?: string[];
  defaultCheckedKeys?: string[];
}

// TreeNode Component
interface TreeNodeProps {
  node: TreeNodeData;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  isChecked: boolean;
  isHalfChecked: boolean;
  config: TreeConfig;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string, event: React.MouseEvent) => void;
  onCheck: (key: string, checked: boolean) => void;
  titleRender?: (node: TreeNodeData) => React.ReactNode;
  showLine: boolean;
  isLast: boolean;
  parentLines: boolean[];
  expandedKeys: Set<string>;
  selectedKeys: Set<string>;
  checkedKeys: Set<string>;
  halfCheckedKeys: Set<string>;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  isChecked,
  isHalfChecked,
  config,
  onToggleExpand,
  onSelect,
  onCheck,
  titleRender,
  showLine,
  isLast,
  parentLines,
  expandedKeys,
  selectedKeys,
  checkedKeys,
  halfCheckedKeys
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = node.isLeaf || !hasChildren;
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (hasChildren) {
        onToggleExpand(node.key);
      } else {
        onSelect(node.key, e as any);
      }
    } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      onToggleExpand(node.key);
    } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
      onToggleExpand(node.key);
    }
  };

  const renderIcon = () => {
    if (!config.showIcon) return null;
    
    if (node.icon) {
      return <span className="w-4 h-4 flex items-center justify-center">{node.icon}</span>;
    }
    
    if (hasChildren) {
      return isExpanded ? 
        <FolderOpen className="h-4 w-4 text-yellow-600" /> : 
        <Folder className="h-4 w-4 text-yellow-600" />;
    }
    return <File className="h-4 w-4 text-yellow-600" />;
  };

  const renderTitle = () => {
    const titleContent = titleRender ? titleRender(node) : node.title;
    
    return (
      <Tooltip content={node.title}>
        <span className="truncate">{titleContent}</span>
      </Tooltip>
    );
  };

  const renderLines = () => {
    if (!showLine || level === 0) return null;
    
    return (
      <div className="absolute left-0 top-0 bottom-0 flex">
        {parentLines.map((hasLine, index) => (
          <div
            key={index}
            className="w-6 relative"
          >
            {hasLine && (
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300" />
            )}
          </div>
        ))}
        <div className="w-6 relative">
          {/* Vertical line */}
          {!isLast && (
            <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-300" />
          )}
          {/* Horizontal line */}
          <div className="absolute left-3 top-3 w-3 h-px bg-gray-300" />
        </div>
      </div>
    );
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer transition-colors relative",
          isSelected && "bg-blue-50 border-blue-200",
          node.disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={(e) => !node.disabled && onSelect(node.key, e)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
      >
        {renderLines()}
        
        {/* Expand/Collapse Icon */}
        <div className="w-6 h-6 flex items-center justify-center mr-1">
          {hasChildren && (
            <button
              className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.key);
              }}
              tabIndex={-1}
              aria-label={isExpanded ? "Collapse node" : "Expand node"}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Checkbox */}
        {config.isCheckable && !node.disableCheckbox && (
          <div className="mr-2">
            <CustomCheckbox
              checked={isChecked}
              indeterminate={isHalfChecked}
              onChange={(checked) => onCheck(node.key, checked)}
              disabled={node.disabled}
            />
          </div>
        )}

        {/* Icon */}
        <div className="mr-2">
          {renderIcon()}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          {renderTitle()}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child, index) => (
            <TreeNode
              key={child.key}
              node={child}
              level={level + 1}
              config={config}
              isExpanded={expandedKeys.has(child.key)}
              isSelected={selectedKeys.has(child.key)}
              isChecked={checkedKeys.has(child.key)}
              isHalfChecked={halfCheckedKeys.has(child.key)}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onCheck={onCheck}
              titleRender={titleRender}
              showLine={showLine}
              isLast={index === node.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              checkedKeys={checkedKeys}
              halfCheckedKeys={halfCheckedKeys}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main TreeView Component
export function TreeView(props: TreeViewProps): React.ReactElement {
  const {
    treeData,
    config = {},
    selectKeys,
    onSelect,
    onCheck,
    expandedKeys,
    onExpand,
    autoExpandParent = false,
    titleRender,
    defaultSelectedKeys = [],
    defaultExpandedKeys = [],
    defaultCheckedKeys = []
  } = props;

  // Helper function to get all keys
  const getAllKeys = useCallback((nodes: TreeNodeData[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodeList: TreeNodeData[]) => {
      nodeList.forEach(node => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return keys;
  }, []);

  // State management
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string>>(() => {
    // FIX: respect initial controlled value instead of starting from empty
    if (expandedKeys !== undefined) return new Set(expandedKeys); // Controlled mode initial
    if (defaultExpandedKeys.length > 0) return new Set(defaultExpandedKeys);
    if (config.expandAll) return new Set(getAllKeys(treeData));
    return new Set();
  });
  
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string>>(() => {
    // Minor improvement for consistency with controlled pattern
    if (selectKeys !== undefined) return new Set(selectKeys);
    return new Set(defaultSelectedKeys);
  });
  
  const [internalCheckedKeys, setInternalCheckedKeys] = useState<Set<string>>(
    new Set(defaultCheckedKeys)
  );

  // Get all node keys that should be auto-expanded
  const getParentKeys = useCallback((targetKey: string, nodes: TreeNodeData[]): string[] => {
    const parentKeys: string[] = [];
    
    const findParents = (nodeList: TreeNodeData[], parents: string[] = []): boolean => {
      for (const node of nodeList) {
        const currentPath = [...parents, node.key];
        
        if (node.key === targetKey) {
          parentKeys.push(...parents);
          return true;
        }
        
        if (node.children && findParents(node.children, currentPath)) {
          return true;
        }
      }
      return false;
    };
    
    findParents(nodes);
    return parentKeys;
  }, []);

  // Find a node by key
  const findNode = useCallback((nodes: TreeNodeData[], targetKey: string): TreeNodeData | null => {
    for (const node of nodes) {
      if (node.key === targetKey) return node;
      if (node.children) {
        const found = findNode(node.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Calculate half-checked keys
  const halfCheckedKeys = useMemo(() => {
    const halfChecked = new Set<string>();
    
    const checkHalfChecked = (node: TreeNodeData): { checked: boolean; hasCheckedChildren: boolean } => {
      if (!node.children || node.children.length === 0) {
        const isChecked = internalCheckedKeys.has(node.key);
        return { checked: isChecked, hasCheckedChildren: isChecked };
      }
      
      let allChecked = true;
      let someChecked = false;
      
      for (const child of node.children) {
        const childResult = checkHalfChecked(child);
        if (childResult.hasCheckedChildren) {
          someChecked = true;
        }
        if (!childResult.checked) {
          allChecked = false;
        }
      }
      
      const isNodeChecked = internalCheckedKeys.has(node.key);
      
      if (someChecked && !allChecked && !isNodeChecked) {
        halfChecked.add(node.key);
      }
      
      return { 
        checked: isNodeChecked || allChecked, 
        hasCheckedChildren: someChecked || isNodeChecked 
      };
    };
    
    treeData.forEach(node => checkHalfChecked(node));
    return halfChecked;
  }, [internalCheckedKeys, treeData]);

  // Controlled vs uncontrolled keys for render
  const currentExpandedKeys = expandedKeys !== undefined ? new Set(expandedKeys) : internalExpandedKeys;
  const currentSelectedKeys = selectKeys !== undefined ? new Set(selectKeys) : internalSelectedKeys;

  // Handle expand/collapse
  const handleToggleExpand = useCallback((key: string) => {
    const newExpandedKeys = new Set(currentExpandedKeys);
    
    if (newExpandedKeys.has(key)) {
      newExpandedKeys.delete(key);
    } else {
      newExpandedKeys.add(key);
      
      // Auto expand parents if needed
      if (autoExpandParent) {
        const parents = getParentKeys(key, treeData);
        parents.forEach(parentKey => newExpandedKeys.add(parentKey));
      }
    }

    const node = findNode(treeData, key);

    // In controlled mode, do not mutate internal state; just notify parent.
    if (expandedKeys !== undefined) {
      if (onExpand && node) {
        onExpand(Array.from(newExpandedKeys), { expanded: !currentExpandedKeys.has(key), node });
      }
      return;
    }

    // Uncontrolled: update internal state and notify
    setInternalExpandedKeys(newExpandedKeys);
    
    if (onExpand && node) {
      onExpand(Array.from(newExpandedKeys), { expanded: !currentExpandedKeys.has(key), node });
    }
  }, [currentExpandedKeys, expandedKeys, autoExpandParent, getParentKeys, treeData, onExpand, findNode]);

  // Handle selection
  const handleSelect = useCallback((key: string, event: React.MouseEvent) => {
    // If selectKeys is provided (controlled mode), let parent handle it
    if (selectKeys !== undefined) {
      const node = findNode(treeData, key);
      if (onSelect && node) {
        // Calculate what the new selection would be
        const newSelectedKeys = new Set(currentSelectedKeys);
        if (config.Multiple) {
          if (newSelectedKeys.has(key)) {
            newSelectedKeys.delete(key);
          } else {
            newSelectedKeys.add(key);
          }
        } else {
          newSelectedKeys.clear();
          newSelectedKeys.add(key);
        }
        
        const findNodes = (nodes: TreeNodeData[], keys: Set<string>): TreeNodeData[] => {
          const result: TreeNodeData[] = [];
          const traverse = (nodeList: TreeNodeData[]) => {
            nodeList.forEach(node => {
              if (keys.has(node.key)) result.push(node);
              if (node.children) traverse(node.children);
            });
          };
          traverse(nodes);
          return result;
        };
        
        const selectedNodes = findNodes(treeData, newSelectedKeys);
        onSelect(Array.from(newSelectedKeys), {
          selected: newSelectedKeys.has(key),
          selectedNodes,
          node,
          event: event.nativeEvent
        });
      }
      return;
    }
    
    const newSelectedKeys = new Set(currentSelectedKeys);
    
    if (config.Multiple) {
      if (newSelectedKeys.has(key)) {
        newSelectedKeys.delete(key);
      } else {
        newSelectedKeys.add(key);
      }
    } else {
      newSelectedKeys.clear();
      newSelectedKeys.add(key);
    }
    
    setInternalSelectedKeys(newSelectedKeys);
    
    // Find selected nodes for callback
    const findNodes = (nodes: TreeNodeData[], keys: Set<string>): TreeNodeData[] => {
      const result: TreeNodeData[] = [];
      const traverse = (nodeList: TreeNodeData[]) => {
        nodeList.forEach(node => {
          if (keys.has(node.key)) result.push(node);
          if (node.children) traverse(node.children);
        });
      };
      traverse(nodes);
      return result;
    };
    
    const selectedNodes = findNodes(treeData, newSelectedKeys);
    const clickedNode = findNode(treeData, key);
    
    if (onSelect && clickedNode) {
      onSelect(Array.from(newSelectedKeys), {
        selected: newSelectedKeys.has(key),
        selectedNodes,
        node: clickedNode,
        event: event.nativeEvent
      });
    }
  }, [currentSelectedKeys, selectKeys, config.Multiple, treeData, onSelect, findNode]);

  // Handle checkbox
  const handleCheck = useCallback((key: string, checked: boolean) => {
    const newCheckedKeys = new Set(internalCheckedKeys);
    
    // Helper to get all descendant keys
    const getDescendantKeys = (node: TreeNodeData): string[] => {
      const keys: string[] = [node.key];
      if (node.children) {
        node.children.forEach(child => {
          keys.push(...getDescendantKeys(child));
        });
      }
      return keys;
    };
    
    const node = findNode(treeData, key);
    if (!node) return;
    
    // Update checked state for node and descendants
    const descendantKeys = getDescendantKeys(node);
    descendantKeys.forEach(k => {
      if (checked) {
        newCheckedKeys.add(k);
      } else {
        newCheckedKeys.delete(k);
      }
    });
    
    setInternalCheckedKeys(newCheckedKeys);
    
    // Find checked nodes for callback
    const findNodes = (nodes: TreeNodeData[], keys: Set<string>): TreeNodeData[] => {
      const result: TreeNodeData[] = [];
      const traverse = (nodeList: TreeNodeData[]) => {
        nodeList.forEach(node => {
          if (keys.has(node.key)) result.push(node);
          if (node.children) traverse(node.children);
        });
      };
      traverse(nodes);
      return result;
    };
    
    const checkedNodes = findNodes(treeData, newCheckedKeys);
    
    if (onCheck) {
      onCheck(Array.from(newCheckedKeys), {
        checked,
        checkedNodes,
        node,
        halfCheckedKeys: Array.from(halfCheckedKeys)
      });
    }
  }, [internalCheckedKeys, treeData, onCheck, halfCheckedKeys, findNode]);

  return (
    <div className="tree-view  rounded-md bg-white" role="tree">
      {treeData.map((node, index) => (
        <TreeNode
          key={node.key}
          node={node}
          level={0}
          config={config}
          isExpanded={currentExpandedKeys.has(node.key)}
          isSelected={currentSelectedKeys.has(node.key)}
          isChecked={internalCheckedKeys.has(node.key)}
          isHalfChecked={halfCheckedKeys.has(node.key)}
          expandedKeys={currentExpandedKeys}
          selectedKeys={currentSelectedKeys}
          checkedKeys={internalCheckedKeys}
          halfCheckedKeys={halfCheckedKeys}
          onToggleExpand={handleToggleExpand}
          onSelect={handleSelect}
          onCheck={handleCheck}
          titleRender={titleRender}
          showLine={!!config.showLine}
          isLast={index === treeData.length - 1}
          parentLines={[]}
        />
      ))}
    </div>
  );
};
