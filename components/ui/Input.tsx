import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button'; // Reusing cn utility if exported, or just duplicate

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, labelClassName, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className={cn("block text-sm font-medium text-gray-700 mb-1.5", labelClassName)}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
