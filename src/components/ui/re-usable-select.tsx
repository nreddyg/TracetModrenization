import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface ClearableSelectProps {
  name?: string
  value: string | number | undefined
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
  triggerClassName?: string
}

export function ReUsableSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
  clearable = true,
  className,
  triggerClassName,
}: ClearableSelectProps) {
  return (
    <div className={className}>
      <Select
        name={name}
        value={value !== undefined ? String(value) : undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          hasValue={!!value}
          onClear={clearable ? () => onChange("") : undefined}
          className={triggerClassName}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options?.map((opt) => (
            <SelectItem
              key={opt.value}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
