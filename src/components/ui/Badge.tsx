import React from 'react';

export type BadgeVariant = 'draft' | 'sent' | 'paid' | 'overdue' | 'neutral' | 'blue' | 'pro';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  size = 'md',
}) => {
  const normalizedVariant = (typeof children === 'string'
    ? children.toLowerCase()
    : variant) as BadgeVariant;

  const variants: Record<string, string> = {
    draft: 'bg-[#D8C3A5]/40 text-[#2B2824] border-[#D8C3A5]',
    sent: 'bg-[#E98074]/15 text-[#E85A4F] border-[#E98074]/30',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    overdue: 'bg-[#E85A4F]/20 text-[#E85A4F] border-[#E85A4F]/40',
    neutral: 'bg-[#D8C3A5]/30 text-[#6B6864] border-[#D8C3A5]',
    blue: 'bg-[#E98074]/15 text-[#E85A4F] border-[#E98074]/30',
    pro: 'bg-[#E85A4F] text-white border-transparent',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const currentVariant = variants[normalizedVariant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border shadow-2xs ${currentVariant} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{children}</span>
    </span>
  );
};

export default Badge;
