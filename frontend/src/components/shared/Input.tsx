import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-imo-dark">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-all bg-white text-imo-dark placeholder:text-gray-400 ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-imo-gray focus:border-imo-green focus:ring-2 focus:ring-imo-green/20"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";