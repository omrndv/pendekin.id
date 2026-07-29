import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'soft' | 'success' | 'error' | 'outline';
    children: ReactNode;
}

export default function Badge({
    variant = 'soft',
    className,
    children,
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase';
    
    const variants = {
        soft: 'bg-primary-soft text-primary',
        success: 'bg-green-100 text-success',
        error: 'bg-red-100 text-error',
        outline: 'border border-border text-text-secondary',
    };

    return (
        <span
            {...props}
            className={twMerge(clsx(baseStyles, variants[variant], className))}
        >
            {children}
        </span>
    );
}
