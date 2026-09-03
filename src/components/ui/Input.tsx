import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[#2B2824] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#8E8D8A] pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full px-3.5 py-2.5 text-sm text-[#2B2824] bg-[#FAF8F5] rounded-xl border transition-all duration-200 outline-none placeholder:text-[#8E8D8A] ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-[#D8C3A5] focus:border-[#E85A4F] focus:ring-2 focus:ring-[#E85A4F]/20'
            } ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-[#8E8D8A] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#8E8D8A]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
