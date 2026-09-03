import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  ...props
}) => {
  return (
    <div
      className={`bg-[#FAF8F5] text-[#2B2824] rounded-2xl border border-[#D8C3A5] ${
        elevated ? 'shadow-lg hover:shadow-xl' : 'shadow-xs hover:shadow-sm'
      } transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-6 py-5 border-b border-[#D8C3A5]/50 flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-6 py-4 bg-[#EAE7DC]/60 border-t border-[#D8C3A5]/50 rounded-b-2xl flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
