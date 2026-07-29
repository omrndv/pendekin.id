import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    children: ReactNode;
}

export default function Card({
    hoverEffect = false,
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            {...props}
            className={twMerge(
                clsx(
                    'bg-surface border border-border rounded-2xl p-6 shadow-sm transition-all duration-300',
                    hoverEffect && 'hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30',
                    className
                )
            )}
        >
            {children}
        </div>
    );
}
