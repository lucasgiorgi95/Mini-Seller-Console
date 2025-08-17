import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false
}) => {
  const baseClasses = 'inline-flex items-center font-semibold transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error: 'bg-error/10 text-error border border-error/20',
    secondary: 'bg-surface-hover text-text-secondary border border-border'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-lg gap-1',
    md: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    lg: 'px-4 py-2 text-sm rounded-xl gap-2'
  };

  const dotColors = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    secondary: 'bg-text-muted'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {dot && (
        <div className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};