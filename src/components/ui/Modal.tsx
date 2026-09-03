'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Dialog card */}
      <div
        className={`relative w-full ${maxWidths[maxWidth]} bg-[#FAF8F5] text-[#2B2824] rounded-3xl border border-[#D8C3A5] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="p-6 sm:p-7 border-b border-[#D8C3A5]/50 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-xl font-extrabold text-[#2B2824] tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#8E8D8A] mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8E8D8A] hover:text-[#2B2824] hover:bg-[#D8C3A5]/20 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-7">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
