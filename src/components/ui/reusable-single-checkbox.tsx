import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type ReusableCheckboxProps = {
  id?: string;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;   // 🔥 support defaultChecked
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
};

const ReusableSingleCheckbox: React.FC<ReusableCheckboxProps> = ({
  id,
  label,
  checked,
  defaultChecked,
  onChange,
  className,
  labelClassName,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}  // ✅ works when uncontrolled
        onCheckedChange={(value) => onChange(!!value)}
        className={className}
        disabled={disabled}
      />
      <Label htmlFor={id} className={`text-sm ${labelClassName || ""}`}>
        {label}
      </Label>
    </div>
  );
};

export default ReusableSingleCheckbox;
