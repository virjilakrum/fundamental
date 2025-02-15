import { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-card-bg border border-gray-800 rounded-lg text-primary transition-all",
            "focus:ring-2 focus:ring-secondary/20 focus:border-secondary",
            icon && "pl-10",
            error && "border-urgent",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-urgent">{error}</p>
      )}
    </div>
  )
);