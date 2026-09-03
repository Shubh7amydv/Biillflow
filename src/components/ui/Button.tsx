import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-white shadow-sm hover:shadow-md shadow-[#E85A4F]/20',
      secondary:
        'bg-[#FAF8F5] hover:bg-[#EAE7DC] active:bg-[#D8C3A5]/40 text-[#2B2824] border border-[#D8C3A5]',
      outline:
        'border border-[#D8C3A5] hover:border-[#8E8D8A] bg-[#FAF8F5] hover:bg-[#EAE7DC] text-[#2B2824] shadow-2xs',
      ghost:
        'text-[#6B6864] hover:text-[#2B2824] hover:bg-[#D8C3A5]/25',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs',
      teal:
        'bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-white shadow-xs',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
