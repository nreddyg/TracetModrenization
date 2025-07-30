
import React, { useState } from 'react';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label?: string;
  tooltip?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  isSearchable?: boolean;
  isDisabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
}

const customStyles: StylesConfig<Option, true> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '32px',
    height: '32px',
    fontSize: '14px',
    borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
    boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
    '&:hover': {
      borderColor: 'hsl(var(--border))',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '32px',
    padding: '0 6px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '32px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'hsl(var(--primary))',
    borderRadius: '4px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'hsl(var(--primary-foreground))',
    fontSize: '12px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'hsl(var(--primary-foreground))',
    '&:hover': {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
    },
  }),
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  tooltip,
  placeholder = "Select options...",
  options,
  value,
  onChange,
  isSearchable = true,
  isDisabled = false,
  className = "",
  required = false,
  error,
}) => {
  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    onChange(selectedOptions.map(option => option.value));
  };

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
      <Select
        isMulti
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelectDropdown;
