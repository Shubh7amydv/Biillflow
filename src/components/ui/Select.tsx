import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-[#2B2824] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none px-3.5 py-2.5 pr-10 text-sm text-[#2B2824] bg-[#FAF8F5] rounded-xl border transition-all duration-200 outline-none cursor-pointer ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-[#D8C3A5] focus:border-[#E85A4F] focus:ring-2 focus:ring-[#E85A4F]/20'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 text-[#8E8D8A] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
