import React from 'react';
import Button from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-16 px-6 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#D8C3A5] flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#E85A4F]/15 border border-[#E98074]/30 flex items-center justify-center text-[#E85A4F] mb-4 shadow-2xs">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-[#2B2824] tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#6B6864] mt-2 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
