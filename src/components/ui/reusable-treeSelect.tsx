import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronRight, X, Search, Check } from 'lucide-react';

// Types
export interface TreeNode {
    title: string;
    value: string | number;
    key?: string;
    children?: TreeNode[];
    disabled?: boolean;
    checkable?: boolean;
}

interface MultiSelectConfig {
    isHierarchy?: boolean;
    labelClassName?: string;
    className?: string;
    maxTagsCount?: number;
    maxTagTextLen?: number;
    treeCheckable?: boolean;
    multiple?: boolean;
    onSelect?: (selectedKeys: any, info: any, treeData: TreeNode[]) => void;
    placement?: 'top' | 'bottom';
    size?: 'small' | 'default' | 'large';
    icon?: React.ReactNode;
    errorMsgClass?: string;
    showSearch?: boolean;
}

interface TracetTreeSelectProps {
    // Extracted eObj properties
    label: string;
    name?: string;
    value: (string | number)[];
    placeholder?: string;
    treeData?: TreeNode[];
    isRequired?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
    showError?: boolean;
    type?: string;
    onChange: (newValue: (string | number)[], extra: string, treeData: TreeNode[]) => void;
    multiSelectConfig?: MultiSelectConfig;
    onClear?: () => void;
    className?: string;
    isArrowRequired?: boolean;
    listHeight?: number;
    showLevelPath?: boolean;
    path?: string;
    errorMessage?: string;
    usePortal?: boolean;
}

interface PopupPosition {
    top: number;
    left: number;
    width: number;
    transform?: string;
}

// Tree Node Component
const TreeSelectNode: React.FC<{
    node: TreeNode;
    level: number;
    expanded: boolean;
    onToggle: () => void;
    checked: boolean;
    indeterminate: boolean;
    onCheck: (checked: boolean) => void;
    searchValue: string;
    treeCheckable: boolean;
    onSelect: (value: string | number, node: TreeNode) => void;
}> = ({
    node,
    level,
    expanded,
    onToggle,
    checked,
    indeterminate,
    onCheck,
    searchValue,
    treeCheckable,
    onSelect
}) => {
        const hasChildren = node.children && node.children.length > 0;
        const isMatch = searchValue && (
            node.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            node.value.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
            (node.key && node.key.toLowerCase().includes(searchValue.toLowerCase()))
        );

        const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onCheck(e.target.checked);
        };

        const handleNodeClick = () => {
            if (treeCheckable) {
                onCheck(!checked);
            } else {
                onSelect(node.value, node);
            }
        };

        // Highlight search matches
        const highlightText = (text: string, highlight: string) => {
            if (!highlight) return text;

            const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
            return parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ?
                    <span key={index} className="bg-yellow-200 font-medium">{part}</span> : part
            );
        };

        return (
            <div className={`tree-node ${isMatch ? 'bg-blue-50' : ''}`}>
                <div
                    className={`flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer ${level > 0 ? `ml-${level * 4}` : ''}`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={handleNodeClick}
                >
                    {hasChildren && (
                        <button
                            className="flex items-center justify-center w-4 h-4 mr-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle();
                            }}
                        >
                            {expanded ? (
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                        </button>
                    )}

                    {!hasChildren && <div className="w-5 mr-1" />}

                    {treeCheckable && (
                        <div className="relative mr-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={checked}
                                ref={(el) => {
                                    if (el) el.indeterminate = indeterminate;
                                }}
                                onChange={handleCheckboxChange}
                                disabled={node.disabled}
                            />
                        </div>
                    )}

                    <span className={`text-sm ${node.disabled ? 'text-gray-400' : 'text-gray-700'} flex-1`}>
                        {highlightText(node.title, searchValue)}
                    </span>
                </div>
            </div>
        );
    };

// Tag Component for selected items
const SelectionTag: React.FC<{
    title: string;
    onRemove: () => void;
    disabled?: boolean;
    maxTextLen?: number;
}> = ({ title, onRemove, disabled, maxTextLen = 20 }) => {
    const displayTitle = title.length > maxTextLen ? `${title.slice(0, maxTextLen)}...` : title;

    return (
        <span className="inline-flex items-center px-2 py-1 mr-1 mb-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <span title={title}>{displayTitle}</span>
            {!disabled && (
                <button
                    className="ml-1 inline-flex items-center justify-center w-3 h-3 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <X className="w-2 h-2" />
                </button>
            )}
        </span>
    );
};

// Main TreeSelect Component
export const TracetTreeSelect: React.FC<TracetTreeSelectProps> = ({
    // Extracted eObj properties
    label,
    name,
    value = [],
    placeholder = 'Please select',
    treeData = [],
    isRequired = false,
    allowClear = true,
    disabled = false,
    showError = false,
    type,
    errorMessage,

    // Other props
    onChange,
    multiSelectConfig = {},
    onClear,
    className,
    isArrowRequired = true,
    listHeight = 256,
    showLevelPath = false,
    path,
    usePortal = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [inputValue, setInputValue] = useState(''); // For inline search
    const [isSearching, setIsSearching] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(value || []);
    const [popupPosition, setPopupPosition] = useState<PopupPosition>({
        top: 0,
        left: 0,
        width: 0,
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showSearch = multiSelectConfig.showSearch !== false; // Default to true

    // Smart position calculation - same as dropdown component
    const calculatePopupPosition = (): PopupPosition => {
        if (!containerRef.current) {
            return { top: 0, left: 0, width: 0 };
        }

        const inputRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const dropdownWidth = inputRect.width;
        const dropdownMaxHeight = listHeight + 100; // Account for header/padding
        const inputSpacing = 2; // Minimal gap between input and dropdown

        // Calculate available space
        const spaceBelow = viewportHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        let top: number;
        
        // Smart vertical positioning logic
        if (spaceBelow >= 100) {
            // Enough space below - position below the input
            top = inputRect.bottom + inputSpacing;
        } else if (spaceAbove >= 100) {
            // Not enough space below but space above - position above the input
            top = inputRect.top - inputSpacing - dropdownMaxHeight;
        } else {
            // No adequate space in either direction - default to below
            top = inputRect.bottom + inputSpacing;
        }

        const left = inputRect.left;
        const width = dropdownWidth;

        return { 
            top, 
            left, 
            width 
        };
    };

    // Update position when dropdown opens
    useEffect(() => {
        if (isOpen && containerRef.current) {
            // Calculate position immediately
            setPopupPosition(calculatePopupPosition());
            
            // Also recalculate after a tiny delay to handle any layout shifts
            const timer = setTimeout(() => {
                setPopupPosition(calculatePopupPosition());
            }, 1);
            
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Simplified scroll and resize handlers
    useEffect(() => {
        if (!isOpen) return;

        let rafId: number;
        
        const updatePosition = () => {
            // Use requestAnimationFrame for smooth updates
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setPopupPosition(calculatePopupPosition());
            });
        };

        const handleResize = () => updatePosition();
        const handleScroll = () => updatePosition();

        // Add listeners
        window.addEventListener('resize', handleResize);
        document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        document.addEventListener('wheel', handleScroll, { passive: true });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('wheel', handleScroll);
        };
    }, [isOpen]);

    // Update selected values when prop changes
    useEffect(() => {
        setSelectedValues(value || []);
    }, [value]);

    const handleSelectChange = (
        newValue: (string | number)[],
        extra: any,
        fullTreeData: TreeNode[]
    ) => {
        // Update RHF field
        onChange(newValue, extra, fullTreeData);

        // Fire optional onSelect from config
        if (multiSelectConfig?.onSelect) {
            multiSelectConfig.onSelect(newValue, extra, fullTreeData);
        }
    };

    // Build tree data
    const processedTreeData: TreeNode[] = React.useMemo(() => {
        if (multiSelectConfig?.isHierarchy) {
            return treeData || [];
        } else {
            if (treeData !== undefined && treeData.length !== 0) {
                return [{
                    title: 'Select All',
                    value: '0-0',
                    key: '0-0',
                    children: treeData
                }];
            }
        }
        return [];
    }, [treeData, multiSelectConfig?.isHierarchy]);

    // Auto expand for specific names
    useEffect(() => {
        if (name === "AssigneeSelectedUsers" ||
            name === "CCListSelectedUsers" ||
            name === "CCList" ||
            name === "AssignedTo" ||
            name === "AssignTo" ||
            name === "ServiceRequestTypeAdmin") {
            setExpandedKeys(new Set(['0-0', '0-0-0']));
        } else {
            // Default expand all when searching
            const getAllKeys = (nodes: TreeNode[], prefix = ''): string[] => {
                let keys: string[] = [];
                nodes.forEach((node, index) => {
                    const key = node.key || `${prefix}${index}`;
                    keys.push(key);
                    if (node.children) {
                        keys.push(...getAllKeys(node.children, `${key}-`));
                    }
                });
                return keys;
            };
            if (searchValue || inputValue) {
                setExpandedKeys(new Set(getAllKeys(treeData)));
            }
        }
    }, [treeData, name, searchValue, inputValue]);

    // Get all descendant values
    const getDescendantValues = (node: TreeNode): (string | number)[] => {
        let values: (string | number)[] = [node.value];
        if (node.children) {
            node.children.forEach(child => {
                values.push(...getDescendantValues(child));
            });
        }
        return values;
    };

    // Check if node is checked
    const isNodeChecked = (node: TreeNode): { checked: boolean; indeterminate: boolean } => {
        const descendants = getDescendantValues(node);
        const checkedDescendants = descendants.filter(val => selectedValues.includes(val));

        if (checkedDescendants.length === 0) {
            return { checked: false, indeterminate: false };
        }
        if (checkedDescendants.length === descendants.length) {
            return { checked: true, indeterminate: false };
        }
        return { checked: false, indeterminate: true };
    };

    // Handle node check
    const handleNodeCheck = (node: TreeNode, checked: boolean) => {
        const descendants = getDescendantValues(node);
        let newSelectedValues = [...selectedValues];

        if (checked) {
            // Add all descendants
            descendants.forEach(val => {
                if (!newSelectedValues.includes(val)) {
                    newSelectedValues.push(val);
                }
            });
        } else {
            // Remove all descendants
            newSelectedValues = newSelectedValues.filter(val => !descendants.includes(val));
        }

        setSelectedValues(newSelectedValues);
        handleSelectChange(newSelectedValues, '', treeData);
    };

    // Handle single select
    const handleNodeSelect = (value: string | number, node: TreeNode) => {
        const newSelectedValues = [value];
        setSelectedValues(newSelectedValues);
        handleSelectChange(newSelectedValues, '', treeData);

        setIsOpen(false);
        setInputValue('');
        setIsSearching(false);

        if (multiSelectConfig?.onSelect) {
            multiSelectConfig.onSelect(value, { node }, treeData);
        }
    };

    // Toggle expand
    const toggleExpand = (key: string) => {
        const newExpanded = new Set(expandedKeys);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedKeys(newExpanded);
    };

    // Filter tree nodes
    const filterTreeNodes = (nodes: TreeNode[], searchValue: string): TreeNode[] => {
        if (!searchValue) return nodes;

        const filter = (nodeList: TreeNode[]): TreeNode[] => {
            return nodeList.reduce((acc: TreeNode[], node) => {
                const nodeMatches = node.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                    node.value.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
                    (node.key && node.key.toLowerCase().includes(searchValue.toLowerCase()));

                const filteredChildren = node.children ? filter(node.children) : [];

                if (nodeMatches || filteredChildren.length > 0) {
                    acc.push({
                        ...node,
                        children: filteredChildren.length > 0 ? filteredChildren : node.children
                    });
                }

                return acc;
            }, []);
        };

        return filter(nodes);
    };

    // Find node by value
    const findNodeByValue = useCallback((nodes: TreeNode[], value: string | number): TreeNode | null => {
        for (const node of nodes) {
            if (node.value === value) return node;
            if (node.children) {
                const found = findNodeByValue(node.children, value);
                if (found) return found;
            }
        }
        return null;
    }, []);

    // Remove selected tag
    const removeSelectedValue = (valueToRemove: string | number) => {
        const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
        setSelectedValues(newSelectedValues);
        handleSelectChange(newSelectedValues, '', treeData);
    };

    // Render tree nodes
    const renderTreeNodes = (nodes: TreeNode[], level = 0, parentKey = ''): React.ReactNode => {
        return nodes.map((node, index) => {
            const key = node.key || `${parentKey}${index}`;
            const isExpanded = expandedKeys.has(key);
            const { checked, indeterminate } = isNodeChecked(node);

            return (
                <div key={key}>
                    <TreeSelectNode
                        node={node}
                        level={level}
                        expanded={isExpanded}
                        onToggle={() => toggleExpand(key)}
                        checked={checked}
                        indeterminate={indeterminate}
                        onCheck={(checked) => handleNodeCheck(node, checked)}
                        searchValue={searchValue || inputValue}
                        treeCheckable={multiSelectConfig.treeCheckable !== false}
                        onSelect={handleNodeSelect}
                    />
                    {isExpanded && node.children && (
                        <div>
                            {renderTreeNodes(node.children, level + 1, `${key}-`)}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Handle input change for inline search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchValue(value);
        setIsSearching(true);

        if (!isOpen) {
            setIsOpen(true);
        }
    };

    // Handle input focus
    const handleInputFocus = () => {
        if (showSearch) {
            setIsSearching(true);
            setIsOpen(true);
        }
    };

    // Handle input blur
    const handleInputBlur = () => {
        // Delay to allow for clicks on dropdown items
        setTimeout(() => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
                setIsSearching(false);
                setInputValue('');
                setSearchValue('');
            }
        }, 200);
    };

    // Handle input key down
    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setIsSearching(false);
            setInputValue('');
            setSearchValue('');
        } else if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // Get display content for input
    const getDisplayContent = () => {
        if (isSearching && showSearch) {
            return null; // Show input for typing
        }

        if (showLevelPath && path) {
            return <span className="truncate">{path}</span>;
        }

        if (selectedValues.length === 0) {
            return <span className="text-gray-500">{placeholder}</span>;
        }

        const maxTags = multiSelectConfig.maxTagsCount || 3;
        const maxTextLen = multiSelectConfig.maxTagTextLen || 20;

        if (multiSelectConfig.multiple && multiSelectConfig.treeCheckable) {
            // Show as tags for multiple selection
            if (selectedValues.length <= maxTags) {
                return (
                    <div className="flex flex-wrap items-center">
                        {selectedValues.map(val => {
                            const node = findNodeByValue(treeData, val);
                            const title = node?.title || val.toString();
                            return (
                                <SelectionTag
                                    key={val}
                                    title={title}
                                    onRemove={() => removeSelectedValue(val)}
                                    disabled={disabled}
                                    maxTextLen={maxTextLen}
                                />
                            );
                        })}
                    </div>
                );
            } else {
                return <span className="text-gray-900">{selectedValues.length} items selected</span>;
            }
        } else {
            // Single selection or comma-separated display
            const displayTexts = selectedValues.map(val => {
                const node = findNodeByValue(treeData, val);
                const title = node?.title || val.toString();
                return title.length > maxTextLen ? `${title.slice(0, maxTextLen)}...` : title;
            });

            return <span className="truncate text-gray-900">{displayTexts.join(', ')}</span>;
        }
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedValues([]);
        handleSelectChange([], "", treeData);

        setInputValue('');
        setSearchValue('');
        setIsSearching(false);
        if (onClear) {
            onClear();
        }
    };

    // Handle container click
    const handleContainerClick = () => {
        if (!disabled) {
            if (showSearch) {
                setIsSearching(true);
                inputRef.current?.focus();
            }
            setIsOpen(!isOpen);
        }
    };

    // Close dropdown when clicking outside - updated to work with portal
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
            const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
            
            if (isOutsideContainer && isOutsideDropdown) {
                setIsOpen(false);
                setIsSearching(false);
                setInputValue('');
                setSearchValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setIsSearching(false);
                setInputValue('');
                setSearchValue('');
                containerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const currentSearchValue = searchValue || inputValue;
    const filteredTreeData = filterTreeNodes(treeData, currentSearchValue);

    // Render dropdown content
    const renderDropdownContent = () => {
        return (
            <div className="py-1">
                {/* Search (only show if inline search is disabled) */}
                {!showSearch && (
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Tree Content */}
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: `${listHeight - (showSearch ? 0 : 60)}px` }}
                >
                    {filteredTreeData.length > 0 ? (
                        renderTreeNodes(filteredTreeData)
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            {currentSearchValue ? 'No matching results' : 'No data found'}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render popup with portal positioning
    const renderPopup = () => {
        const inputRect = containerRef.current?.getBoundingClientRect();
        if (!inputRect) return null;
   
        const margin = 8;            
        const idealHeight = listHeight + 100;
        const minHeight = 100;
   
        const spaceBelow = window.innerHeight - inputRect.bottom - margin;
        const spaceAbove = inputRect.top - margin;
   
        // Decide whether to place popup above or below
        const openAbove = spaceBelow < minHeight && spaceAbove > spaceBelow;
   
        // Use the space available in chosen direction to compute maxHeight
        const availableSpace = openAbove ? Math.max(0, spaceAbove) : Math.max(0, spaceBelow);
        const maxHeight = Math.max(minHeight, Math.min(idealHeight, availableSpace));
   
        const top = openAbove ? inputRect.top : inputRect.bottom;
        const transform = openAbove ? "translateY(-100%)" : "translateY(0)";
   
        return (
            <div
                ref={dropdownRef}
                className="bg-white border border-gray-300 rounded-md shadow-lg"
                style={{
                    position: "fixed",         
                    top,
                    left: inputRect.left,
                    zIndex: 9999,
                    transform,
                    width: inputRect.width,
                    maxHeight: `${maxHeight}px`,
                }}
            >
                <div
                    className="overflow-y-auto overflow-x-hidden"
                    style={{ maxHeight: `${maxHeight}px` }}
                >
                    {renderDropdownContent()}
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Label */}
            <div className="flex items-center gap-1 mb-2">
                <label
                    htmlFor={label}
                    className={`text-sm font-medium text-slate-700 ${multiSelectConfig.labelClassName || ''}`}
                    title={label}
                >
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>

            {/* TreeSelect Input */}
            <div className="relative">
                <div
                   className={`
            flex items-center rounded-md w-full p-0 min-w-0 h-10 border transition-colors relative overflow-hidden cursor-pointer
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-[hsl(238_73%_97%)] hover:border-gray-300'}
            ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
            ${multiSelectConfig.className || className || ''}
          `}
                    style={{ 
                        backgroundColor: disabled ? '#f3f4f6' : 'hsl(240deg 73.33% 97.06%)', 
                        borderColor: 'hsl(214.29deg 31.82% 91.37%)' 
                    }}
                    onClick={handleContainerClick}
                >
                    <div className="flex-1 min-w-0 px-3 py-2">
                        {isSearching && showSearch ? (
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-500"
                                placeholder={ placeholder}
                                value={inputValue}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                onKeyDown={handleInputKeyDown}
                                disabled={disabled}
                                autoComplete="off"
                            />
                        ) : (
                            getDisplayContent()
                        )}
                    </div>

                    <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-3 bg-inherit">
                        {allowClear && selectedValues.length > 0 && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {multiSelectConfig.icon || (
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        )}
                    </div>
                </div>

                {/* Dropdown */}
                {isOpen && !disabled && (
                    <>
                        {usePortal ? (
                            createPortal(renderPopup(), document.body)
                        ) : (
                            <div
                                className="absolute z-[9999] top-full left-0 mt-1 w-full"
                                style={{
                                    minWidth: '200px',
                                    maxHeight: `${listHeight}px`,
                                }}
                            >
                                <div className="bg-white border border-gray-300 rounded-md shadow-lg">
                                    {renderDropdownContent()}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Error Message */}
            <div className={multiSelectConfig.errorMsgClass || 'mt-1'}>
                {(showError && selectedValues.length === 0 && type !== 'password') && (
                    <span className="text-red-500 text-xs" role="alert">
                        {errorMessage || `${label} is Required`}
                    </span>
                )}
            </div>
        </div>
    );
};









// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { ChevronDown, ChevronRight, X, Search, Check } from 'lucide-react';

// // Types
// export interface TreeNode {
//     title: string;
//     value: string | number;
//     key?: string;
//     children?: TreeNode[];
//     disabled?: boolean;
//     checkable?: boolean;
// }

// interface MultiSelectConfig {
//     isHierarchy?: boolean;
//     labelClassName?: string;
//     className?: string;
//     maxTagsCount?: number;
//     maxTagTextLen?: number;
//     treeCheckable?: boolean;
//     multiple?: boolean;
//     onSelect?: (selectedKeys: any, info: any, treeData: TreeNode[]) => void;
//     placement?: 'top' | 'bottom';
//     size?: 'small' | 'default' | 'large';
//     icon?: React.ReactNode;
//     errorMsgClass?: string;
//     showSearch?: boolean;
// }

// interface TracetTreeSelectProps {
//     // Extracted eObj properties
//     label: string;
//     name?: string;
//     value: (string | number)[];
//     placeholder?: string;
//     treeData?: TreeNode[];
//     isRequired?: boolean;
//     allowClear?: boolean;
//     disabled?: boolean;
//     showError?: boolean;
//     type?: string;
//     onChange: (newValue: (string | number)[], extra: string, treeData: TreeNode[]) => void;
//     multiSelectConfig?: MultiSelectConfig;
//     onClear?: () => void;
//     className?: string;
//     isArrowRequired?: boolean;
//     listHeight?: number;
//     showLevelPath?: boolean;
//     path?: string;
//     errorMessage?: string;
// }

// // Tree Node Component
// const TreeSelectNode: React.FC<{
//     node: TreeNode;
//     level: number;
//     expanded: boolean;
//     onToggle: () => void;
//     checked: boolean;
//     indeterminate: boolean;
//     onCheck: (checked: boolean) => void;
//     searchValue: string;
//     treeCheckable: boolean;
//     onSelect: (value: string | number, node: TreeNode) => void;
// }> = ({
//     node,
//     level,
//     expanded,
//     onToggle,
//     checked,
//     indeterminate,
//     onCheck,
//     searchValue,
//     treeCheckable,
//     onSelect
// }) => {
//         const hasChildren = node.children && node.children.length > 0;
//         const isMatch = searchValue && (
//             node.title.toLowerCase().includes(searchValue.toLowerCase()) ||
//             node.value.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
//             (node.key && node.key.toLowerCase().includes(searchValue.toLowerCase()))
//         );

//         const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//             e.stopPropagation();
//             onCheck(e.target.checked);
//         };

//         const handleNodeClick = () => {
//             if (treeCheckable) {
//                 onCheck(!checked);
//             } else {
//                 onSelect(node.value, node);
//             }
//         };

//         // Highlight search matches
//         const highlightText = (text: string, highlight: string) => {
//             if (!highlight) return text;

//             const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
//             return parts.map((part, index) =>
//                 part.toLowerCase() === highlight.toLowerCase() ?
//                     <span key={index} className="bg-yellow-200 font-medium">{part}</span> : part
//             );
//         };

//         return (
//             <div className={`tree-node ${isMatch ? 'bg-blue-50' : ''}`}>
//                 <div
//                     className={`flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer ${level > 0 ? `ml-${level * 4}` : ''}`}
//                     style={{ paddingLeft: `${level * 16 + 8}px` }}
//                     onClick={handleNodeClick}
//                 >
//                     {hasChildren && (
//                         <button
//                             className="flex items-center justify-center w-4 h-4 mr-1"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onToggle();
//                             }}
//                         >
//                             {expanded ? (
//                                 <ChevronDown className="w-3 h-3 text-gray-500" />
//                             ) : (
//                                 <ChevronRight className="w-3 h-3 text-gray-500" />
//                             )}
//                         </button>
//                     )}

//                     {!hasChildren && <div className="w-5 mr-1" />}

//                     {treeCheckable && (
//                         <div className="relative mr-2">
//                             <input
//                                 type="checkbox"
//                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 checked={checked}
//                                 ref={(el) => {
//                                     if (el) el.indeterminate = indeterminate;
//                                 }}
//                                 onChange={handleCheckboxChange}
//                                 disabled={node.disabled}
//                             />
//                         </div>
//                     )}

//                     <span className={`text-sm ${node.disabled ? 'text-gray-400' : 'text-gray-700'} flex-1`}>
//                         {highlightText(node.title, searchValue)}
//                     </span>
//                 </div>
//             </div>
//         );
//     };

// // Tag Component for selected items
// const SelectionTag: React.FC<{
//     title: string;
//     onRemove: () => void;
//     disabled?: boolean;
//     maxTextLen?: number;
// }> = ({ title, onRemove, disabled, maxTextLen = 20 }) => {
//     const displayTitle = title.length > maxTextLen ? `${title.slice(0, maxTextLen)}...` : title;

//     return (
//         <span className="inline-flex items-center px-2 py-1 mr-1 mb-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//             <span title={title}>{displayTitle}</span>
//             {!disabled && (
//                 <button
//                     className="ml-1 inline-flex items-center justify-center w-3 h-3 text-blue-600 hover:text-blue-800"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onRemove();
//                     }}
//                 >
//                     <X className="w-2 h-2" />
//                 </button>
//             )}
//         </span>
//     );
// };

// // Main TreeSelect Component
// export const TracetTreeSelect: React.FC<TracetTreeSelectProps> = ({
//     // Extracted eObj properties
//     label,
//     name,
//     value = [],
//     placeholder = 'Please select',
//     treeData = [],
//     isRequired = false,
//     allowClear = true,
//     disabled = false,
//     showError = false,
//     type,
//     errorMessage,

//     // Other props
//     onChange,
//     multiSelectConfig = {},
//     onClear,
//     className,
//     isArrowRequired = true,
//     listHeight = 256,
//     showLevelPath = false,
//     path
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchValue, setSearchValue] = useState('');
//     const [inputValue, setInputValue] = useState(''); // For inline search
//     const [isSearching, setIsSearching] = useState(false);
//     const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
//     const [selectedValues, setSelectedValues] = useState<(string | number)[]>(value || []);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);

//     const showSearch = multiSelectConfig.showSearch !== false; // Default to true

//     // Update selected values when prop changes
//     useEffect(() => {
//         setSelectedValues(value || []);
//     }, [value]);

//     const handleSelectChange = (
//         newValue: (string | number)[],
//         extra: any,
//         fullTreeData: TreeNode[]
//     ) => {
//         // Update RHF field
//         onChange(newValue, extra, fullTreeData);

//         // Fire optional onSelect from config
//         if (multiSelectConfig?.onSelect) {
//             multiSelectConfig.onSelect(newValue, extra, fullTreeData);
//         }
//     };



//     // Build tree data
//     const processedTreeData: TreeNode[] = React.useMemo(() => {
//         if (multiSelectConfig?.isHierarchy) {
//             return treeData || [];
//         } else {
//             if (treeData !== undefined && treeData.length !== 0) {
//                 return [{
//                     title: 'Select All',
//                     value: '0-0',
//                     key: '0-0',
//                     children: treeData
//                 }];
//             }
//         }
//         return [];
//     }, [treeData, multiSelectConfig?.isHierarchy]);

//     // Auto expand for specific names
//     useEffect(() => {
//         if (name === "AssigneeSelectedUsers" ||
//             name === "CCListSelectedUsers" ||
//             name === "CCList" ||
//             name === "AssignedTo" ||
//             name === "AssignTo" ||
//             name === "ServiceRequestTypeAdmin") {
//             setExpandedKeys(new Set(['0-0', '0-0-0']));
//         } else {
//             // Default expand all when searching
//             const getAllKeys = (nodes: TreeNode[], prefix = ''): string[] => {
//                 let keys: string[] = [];
//                 nodes.forEach((node, index) => {
//                     const key = node.key || `${prefix}${index}`;
//                     keys.push(key);
//                     if (node.children) {
//                         keys.push(...getAllKeys(node.children, `${key}-`));
//                     }
//                 });
//                 return keys;
//             };
//             if (searchValue || inputValue) {
//                 setExpandedKeys(new Set(getAllKeys(treeData)));
//             }
//         }
//     }, [treeData, name, searchValue, inputValue]);

//     // Get all descendant values
//     const getDescendantValues = (node: TreeNode): (string | number)[] => {
//         let values: (string | number)[] = [node.value];
//         if (node.children) {
//             node.children.forEach(child => {
//                 values.push(...getDescendantValues(child));
//             });
//         }
//         return values;
//     };

//     // Check if node is checked
//     const isNodeChecked = (node: TreeNode): { checked: boolean; indeterminate: boolean } => {
//         const descendants = getDescendantValues(node);
//         const checkedDescendants = descendants.filter(val => selectedValues.includes(val));

//         if (checkedDescendants.length === 0) {
//             return { checked: false, indeterminate: false };
//         }
//         if (checkedDescendants.length === descendants.length) {
//             return { checked: true, indeterminate: false };
//         }
//         return { checked: false, indeterminate: true };
//     };

//     // Handle node check
//     const handleNodeCheck = (node: TreeNode, checked: boolean) => {
//         const descendants = getDescendantValues(node);
//         let newSelectedValues = [...selectedValues];

//         if (checked) {
//             // Add all descendants
//             descendants.forEach(val => {
//                 if (!newSelectedValues.includes(val)) {
//                     newSelectedValues.push(val);
//                 }
//             });
//         } else {
//             // Remove all descendants
//             newSelectedValues = newSelectedValues.filter(val => !descendants.includes(val));
//         }

//         setSelectedValues(newSelectedValues);
//         // onChange(newSelectedValues, '', processedTreeData);
//         handleSelectChange(newSelectedValues, '', treeData);

//     };

//     // Handle single select
//     const handleNodeSelect = (value: string | number, node: TreeNode) => {
//         const newSelectedValues = [value];
//         setSelectedValues(newSelectedValues);
//         // onChange(newSelectedValues, '', processedTreeData);
//         handleSelectChange(newSelectedValues, '', treeData);

//         setIsOpen(false);
//         setInputValue('');
//         setIsSearching(false);

//         if (multiSelectConfig?.onSelect) {
//             multiSelectConfig.onSelect(value, { node }, treeData);
//         }
//     };

//     // Toggle expand
//     const toggleExpand = (key: string) => {
//         const newExpanded = new Set(expandedKeys);
//         if (newExpanded.has(key)) {
//             newExpanded.delete(key);
//         } else {
//             newExpanded.add(key);
//         }
//         setExpandedKeys(newExpanded);
//     };

//     // Filter tree nodes
//     const filterTreeNodes = (nodes: TreeNode[], searchValue: string): TreeNode[] => {
//         if (!searchValue) return nodes;

//         const filter = (nodeList: TreeNode[]): TreeNode[] => {
//             return nodeList.reduce((acc: TreeNode[], node) => {
//                 const nodeMatches = node.title.toLowerCase().includes(searchValue.toLowerCase()) ||
//                     node.value.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
//                     (node.key && node.key.toLowerCase().includes(searchValue.toLowerCase()));

//                 const filteredChildren = node.children ? filter(node.children) : [];

//                 if (nodeMatches || filteredChildren.length > 0) {
//                     acc.push({
//                         ...node,
//                         children: filteredChildren.length > 0 ? filteredChildren : node.children
//                     });
//                 }

//                 return acc;
//             }, []);
//         };

//         return filter(nodes);
//     };

//     // Find node by value
//     const findNodeByValue = useCallback((nodes: TreeNode[], value: string | number): TreeNode | null => {
//         for (const node of nodes) {
//             if (node.value === value) return node;
//             if (node.children) {
//                 const found = findNodeByValue(node.children, value);
//                 if (found) return found;
//             }
//         }
//         return null;
//     }, []);

//     // Remove selected tag
//     const removeSelectedValue = (valueToRemove: string | number) => {
//         const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
//         setSelectedValues(newSelectedValues);
//         // onChange(newSelectedValues, '', processedTreeData);
//         handleSelectChange(newSelectedValues, '', treeData);

//     };

//     // Render tree nodes
//     const renderTreeNodes = (nodes: TreeNode[], level = 0, parentKey = ''): React.ReactNode => {
//         return nodes.map((node, index) => {
//             const key = node.key || `${parentKey}${index}`;
//             const isExpanded = expandedKeys.has(key);
//             const { checked, indeterminate } = isNodeChecked(node);

//             return (
//                 <div key={key}>
//                     <TreeSelectNode
//                         node={node}
//                         level={level}
//                         expanded={isExpanded}
//                         onToggle={() => toggleExpand(key)}
//                         checked={checked}
//                         indeterminate={indeterminate}
//                         onCheck={(checked) => handleNodeCheck(node, checked)}
//                         searchValue={searchValue || inputValue}
//                         treeCheckable={multiSelectConfig.treeCheckable !== false}
//                         onSelect={handleNodeSelect}
//                     />
//                     {isExpanded && node.children && (
//                         <div>
//                             {renderTreeNodes(node.children, level + 1, `${key}-`)}
//                         </div>
//                     )}
//                 </div>
//             );
//         });
//     };

//     // Handle input change for inline search
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setInputValue(value);
//         setSearchValue(value);
//         setIsSearching(true);

//         if (!isOpen) {
//             setIsOpen(true);
//         }
//     };

//     // Handle input focus
//     const handleInputFocus = () => {
//         if (showSearch) {
//             setIsSearching(true);
//             setIsOpen(true);
//         }
//     };

//     // Handle input blur
//     const handleInputBlur = () => {
//         // Delay to allow for clicks on dropdown items
//         setTimeout(() => {
//             if (!dropdownRef.current?.contains(document.activeElement)) {
//                 setIsSearching(false);
//                 setInputValue('');
//                 setSearchValue('');
//             }
//         }, 200);
//     };

//     // Handle input key down
//     const handleInputKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Escape') {
//             setIsOpen(false);
//             setIsSearching(false);
//             setInputValue('');
//             setSearchValue('');
//         } else if (e.key === 'Enter') {
//             e.preventDefault();
//         }
//     };

//     // Get display content for input
//     const getDisplayContent = () => {
//         if (isSearching && showSearch) {
//             return null; // Show input for typing
//         }

//         if (showLevelPath && path) {
//             return <span className="truncate">{path}</span>;
//         }

//         if (selectedValues.length === 0) {
//             return <span className="text-gray-500">{placeholder}</span>;
//         }

//         const maxTags = multiSelectConfig.maxTagsCount || 3;
//         const maxTextLen = multiSelectConfig.maxTagTextLen || 20;

//         if (multiSelectConfig.multiple && multiSelectConfig.treeCheckable) {
//             // Show as tags for multiple selection
//             if (selectedValues.length <= maxTags) {
//                 return (
//                     <div className="flex flex-wrap items-center">
//                         {selectedValues.map(val => {
//                             const node = findNodeByValue(treeData, val);
//                             const title = node?.title || val.toString();
//                             return (
//                                 <SelectionTag
//                                     key={val}
//                                     title={title}
//                                     onRemove={() => removeSelectedValue(val)}
//                                     disabled={disabled}
//                                     maxTextLen={maxTextLen}
//                                 />
//                             );
//                         })}
//                     </div>
//                 );
//             } else {
//                 return <span className="text-gray-900">{selectedValues.length} items selected</span>;
//             }
//         } else {
//             // Single selection or comma-separated display
//             const displayTexts = selectedValues.map(val => {
//                 const node = findNodeByValue(treeData, val);
//                 const title = node?.title || val.toString();
//                 return title.length > maxTextLen ? `${title.slice(0, maxTextLen)}...` : title;
//             });

//             return <span className="truncate text-gray-900">{displayTexts.join(', ')}</span>;
//         }
//     };

//     // Handle clear
//     const handleClear = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         setSelectedValues([]);
//         // onChange([], '', processedTreeData);
//         handleSelectChange([], "", treeData);

//         setInputValue('');
//         setSearchValue('');
//         setIsSearching(false);
//         if (onClear) {
//             onClear();
//         }
//     };

//     // Handle container click
//     const handleContainerClick = () => {
//         if (!disabled) {
//             if (showSearch) {
//                 setIsSearching(true);
//                 inputRef.current?.focus();
//             }
//             setIsOpen(!isOpen);
//         }
//     };

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//                 setIsSearching(false);
//                 setInputValue('');
//                 setSearchValue('');
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const currentSearchValue = searchValue || inputValue;
//     const filteredTreeData = filterTreeNodes(treeData, currentSearchValue);

//     return (
//         <div className="w-full">
//             {/* Label */}
//             <div className="mb-1">
//                 <label
//                     htmlFor={label}
//                     className={`block text-sm font-medium text-gray-700 ${multiSelectConfig.labelClassName || ''}`}
//                     title={label}
//                 >
//                     {label}
//                     {isRequired && <span className="text-red-500 ml-1">*</span>}
//                 </label>
//             </div>

//             {/* TreeSelect Input */}
//             <div className="relative" ref={containerRef}>
//            <div
//                     className={`
//             flex items-center bg-transparent outline-none w-full min-h-[41px] px-3 py-2 my-2 text-sm border border-gray-300 rounded-md cursor-pointer
//             ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
//             ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
//             ${multiSelectConfig.className || className || ''}
//           `}
//                     onClick={handleContainerClick}
//                 >
//                     <div className="flex-1 min-w-0">
//                         {isSearching && showSearch ? (
//                             <input
//                                 ref={inputRef}
//                                 type="text"
//                                 className="w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-500"
//                                 placeholder={selectedValues.length === 0 ? placeholder : 'Search...'}
//                                 value={inputValue}
//                                 onChange={handleInputChange}
//                                 onFocus={handleInputFocus}
//                                 onBlur={handleInputBlur}
//                                 onKeyDown={handleInputKeyDown}
//                                 disabled={disabled}
//                                 autoComplete="off"
//                             />
//                         ) : (
//                             getDisplayContent()
//                         )}
//                     </div>

//                     <div className="flex items-center space-x-1 ml-2">
//                         {allowClear && selectedValues.length > 0 && !disabled && (
//                             <button
//                                 className="p-1 hover:bg-gray-100 rounded"
//                                 onClick={handleClear}
//                             >
//                                 <X className="w-3 h-3 text-gray-400" />
//                             </button>
//                         )}

//                         {multiSelectConfig.icon || (
//                             <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                         )}
//                     </div>
//                 </div>

//                 {/* Dropdown */}
//                 {isOpen && (
//                     <div
//                         ref={dropdownRef}
//                         className={`
//               absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
//               ${multiSelectConfig.placement === 'top' ? 'bottom-full mb-1 mt-0' : ''}
//             `}
//                         style={{
//                             minWidth: '200px',
//                             maxHeight: `${listHeight}px`,
//                         }}
//                     >
//                         {/* Search (only show if inline search is disabled) */}
//                         {!showSearch && (
//                             <div className="p-2 border-b border-gray-200">
//                                 <div className="relative">
//                                     <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                     <input
//                                         type="text"
//                                         className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//                                         placeholder="Search..."
//                                         value={searchValue}
//                                         onChange={(e) => setSearchValue(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Tree Content */}
//                         <div
//                             className="overflow-y-auto"
//                             style={{ maxHeight: `${listHeight - (showSearch ? 0 : 60)}px` }}
//                         >
//                             {filteredTreeData.length > 0 ? (
//                                 renderTreeNodes(filteredTreeData)
//                             ) : (
//                                 <div className="p-4 text-center text-gray-500 text-sm">
//                                     {currentSearchValue ? 'No matching results' : 'No data found'}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Error Message */}
//             <div className={multiSelectConfig.errorMsgClass || 'mt-1'}>
//                 {(showError && selectedValues.length === 0 && type !== 'password') && (
//                     <span className="text-red-500 text-xs">
//                         {errorMessage || `${label} is Required`}
//                     </span>
//                 )}
//             </div>
//         </div>
//     );
// };

// example usage in DB

// IN DB
// {
//     fieldType: 'treeselect',
//     name: 'treeselect',
//     label: 'Select Documents',
//     placeholder: 'Type to search files...',
//     treeData: [],
//     isRequired: true,
//     allowClear: true,
//     disabled: false,
//     errormsg: false
//   }

// SAMPLE TREEDATA
  
//   const sampleData: TreeNode[] = [
//   {
//     title: 'Documents',
//     value: 'documents',
//     children: [
//       { title: 'Document 1.pdf', value: 'doc1' },
//       { title: 'Document 2.pdf', value: 'doc2' },
//       {
//         title: 'Subfolder',
//         value: 'subfolder',
//         children: [
//           { title: 'Nested Document.pdf', value: 'nested1' },
//           {
//             title: 'Another Nested File.docx', 
//             value: 'nested2', 
//             children: [
//               { title: 'Nest Nested Document.pdf', value: 'nested2' },
//               { title: 'Nest Nest Nested File.docx', value: 'nested3' }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Documents',
//     value: 'documents',
//     children: [
//       { title: 'Document 1.pdf', value: 'doc1' },
//       { title: 'Document 2.pdf', value: 'doc2' },
//       {
//         title: 'Subfolder',
//         value: 'subfolder',
//         children: [
//           { title: 'Nested Document.pdf', value: 'nested1' },
//           { title: 'Another Nested File.docx', value: 'nested2' }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Documents',
//     value: 'documents',
//     children: [
//       { title: 'Document 1.pdf', value: 'doc1' },
//       { title: 'Document 2.pdf', value: 'doc2' },
//       {
//         title: 'Subfolder',
//         value: 'subfolder',
//         children: [
//           { title: 'Nested Document.pdf', value: 'nested1' },
//           { title: 'Another Nested File.docx', value: 'nested2' }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Documents',
//     value: 'documents',
//     children: [
//       { title: 'Document 1.pdf', value: 'doc1' },
//       { title: 'Document 2.pdf', value: 'doc2' },
//       {
//         title: 'Subfolder',
//         value: 'subfolder',
//         children: [
//           { title: 'Nested Document.pdf', value: 'nested1' },
//           { title: 'Another Nested File.docx', value: 'nested2' }
//         ]
//       }
//     ]
//   },
//   {
//     title: 'Images',
//     value: 'images',
//     children: [
//       { title: 'Image 1.jpg', value: 'img1' },
//       { title: 'Image 2.png', value: 'img2' },
//       { title: 'Profile Picture.png', value: 'img3' }
//     ]
//   },
//   { title: 'Single File.txt', value: 'single' },
//   { title: 'Configuration.json', value: 'config' },
//   { title: 'README.md', value: 'readme' }
// ];

// When API is called 
// SETTING API DATA-------

//   async function getAssetLocTreedata(compId: number, BranchName: string) {
//     try {
//       const res = await getTreeAssetLocationData(compId, BranchName);
//       if (res.success && res.data) {
//         const treeData = treefunWithParent(res.data, "#", '', '', 'Code');
//         SettingLookupsData(treeData, 'assetLoc', 'treeselect');
//       }
//     } catch (err) {
//       console.error('Error fetching subscription by customer:', err);
//     }
//   }



//   TREEFUNWITHPARENT----------
//   const treefunWithParent = (data: any[], id: string | number, idName?: string, assetLocationUnique?: string, uniqVal?: string): any[] => {
//     const treeData: any[] = [];
//     const uniqueId = idName ? idName : "id";
//     data.forEach((item) => {
//       if (item["parent"] || item["Parent"]) {
//         let p = item["parent"] ? "parent" : "Parent";
//         if (item[p] == id) {
//           item.title = `${item.text || item.Name || item.LocationName}`;
//           item.label = `${item.text || item.Name || item.LocationName}`;
//           item.key = item[uniqueId];
//           item.value =       item[uniqVal as string] || item[assetLocationUnique as string] || item[uniqueId] || item[item.Name] || item.Name || item.text || item.LocationName;
//           const children = treefunWithParent(data, item[uniqueId], idName, assetLocationUnique, uniqVal);
//           if (children.length > 0) {
//             item.children = children;
//           }
//           treeData.push(item);
//         }
//       }
//     });
//     return treeData;
//   };

//   SETTING DATA IN LOOKUPS------------
//     function SettingLookupsData(lookupdata, jsonName, keyName) {
//     console.log("lookUpdata", lookupdata, jsonName, keyName)
//     let jsonData = [];
//     if (jsonName === "assetLoc") {
//       console.log("sachin");
//       jsonData = fields;
//       const index = jsonData.findIndex((x) => x.name === keyName)
//       console.log("ind",index);
//       jsonData[index].treeData   = lookupdata;
//     }
//     setFields(jsonData);
//   }


// MultiSelectConfig IN COMPONENT----------
  
//     const multiSelectConfig1: MultiSelectConfig = {
//     isHierarchy: true,
//     treeCheckable: true,
//     multiple: true,
//     maxTagsCount: 2,
//     maxTagTextLen: 15,
//     labelClassName: 'font-semibold',
//     className: 'custom-tree-select',
//     showSearch: true, // Enable inline search

//     onSelect: (selectedKeys, info, treeData) => {
//       console.log("✅ Selected Keys (IDs):", selectedKeys);
//       console.log("ℹ️ Info Object:", info);
//       console.log("🌳 Full Tree Data:", treeData);

      // If you want selected node's title(s)
//       const getSelectedTitles = (nodes, selectedValues) => {
//         let titles: string[] = [];
//         nodes.forEach(node => {
//           if (selectedValues.includes(node.value)) {
//             titles.push(node.title);
//           }
//           if (node.children) {
//             titles = titles.concat(getSelectedTitles(node.children, selectedValues));
//           }
//         });
//         return titles;
//       };

//       const selectedTitles = getSelectedTitles(treeData, selectedKeys);
//       console.log("📂 Selected Titles:", selectedTitles);
//     }
//   };
  
//   MULTISELECT INTERFACE-----------

//   interface MultiSelectConfig {
//   isHierarchy?: boolean;
//   labelClassName?: string;
//   className?: string;
//   maxTagsCount?: number;
//   maxTagTextLen?: number;
//   treeCheckable?: boolean;
//   multiple?: boolean;
//   onSelect?: (selectedKeys: any, info: any, treeData: TreeNode[]) => void;
//   placement?: 'top' | 'bottom';
//   size?: 'small' | 'default' | 'large';
//   icon?: React.ReactNode;
//   errorMsgClass?: string;
//   showSearch?: boolean; // New prop for inline search
// }

// INTERFACE-----------
// export interface TreeLeaf {
//   title: string;
//   label: string;
//   key: string | number;
//   value: string | number;
//   children?: TreeLeaf[];
//   [key: string]: any; // to allow extra dynamic fields
// }

// IN SWITCH CASE:
// case 'treeselect':
//         return (
//           <div>
//             <Controller
//               key={name}
//               name={name}
//               control={control}
//               rules={validationRules}
//               render={({ field: ctrl }) => (
//                 <TracetTreeSelect
//                   label={label!}
//                   {...field}
//                   value={ctrl.value}
//                   onChange={ctrl.onChange}
//                   treeData={field.treeData}
//                   errorMessage={errors[name]?.message as string}
//                   multiSelectConfig={multiSelectConfig1}
//                 />
//               )}
//             />
//           </div>
//         );

// GET FIELDS BY NAMES IN JSX-------
// No change just added treeselect at the end.
// {getFieldsByNames(['treeselect']).map(renderField)}