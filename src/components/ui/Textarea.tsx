import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold text-[#2B2824] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full px-3.5 py-2.5 text-sm text-[#2B2824] bg-[#FAF8F5] rounded-xl border transition-all duration-200 outline-none resize-y placeholder:text-[#8E8D8A] ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : 'border-[#D8C3A5] focus:border-[#E85A4F] focus:ring-2 focus:ring-[#E85A4F]/20'
          } ${className}`}
          {...props}
        />

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#8E8D8A]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
