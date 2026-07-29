import { ReactNode } from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'emerald' | 'amber' | 'gray' | 'purple' | 'blue' | 'indigo' | 'danger';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({ children, variant = 'emerald', className }: BadgeProps) {
    const variantStyles: Record<BadgeVariant, string> = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
        success: 'bg-green-50 text-green-700 border-green-200/80',
        warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
        error: 'bg-rose-50 text-rose-700 border-rose-200/80',
        info: 'bg-sky-50 text-sky-700 border-sky-200/80',
        purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
        blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
        danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
