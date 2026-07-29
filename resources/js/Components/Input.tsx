import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    hasError?: boolean;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(
    { type = 'text', className, isFocused = false, hasError = false, ...props },
    ref,
) {
    return (
        <input
            {...props}
            type={type}
            className={twMerge(
                clsx(
                    'w-full px-5 py-4 bg-surface border rounded-xl text-[15px] outline-none transition-all duration-200 ease-out',
                    hasError 
                        ? 'border-error focus:border-error focus:ring-4 focus:ring-red-50' 
                        : 'border-border focus:border-primary focus:ring-4 focus:ring-primary-soft',
                    className
                )
            )}
            ref={ref}
        />
    );
});
