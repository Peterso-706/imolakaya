import React, { forwardRef } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-imo-dark">{label}</label>}
        <select
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-all bg-white text-imo-dark ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-imo-gray focus:border-imo-green focus:ring-2 focus:ring-imo-green/20"
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";