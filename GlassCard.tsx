
import React from 'react';

interface GlassCardProps {
  // Fix: Made children optional to support empty cards or cards with only comments
  children?: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass rounded-[24px] p-6 ${className}`}>
      {children}
    </div>
  );
};
