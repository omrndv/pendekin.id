import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonElementProps = ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: never };
type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

type ButtonProps = (ButtonElementProps | AnchorElementProps) & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: ReactNode;
};

export default function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    as = 'button',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md',
        secondary: 'bg-primary-soft text-primary hover:bg-emerald-100',
        outline: 'border border-border text-text-primary hover:border-primary hover:text-primary',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-full',
        md: 'px-6 py-3 text-[15px] rounded-full',
        lg: 'px-8 py-4 text-base rounded-full',
        icon: 'p-3 rounded-full',
    };

    const mergedClass = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

    if (as === 'a') {
        const { disabled, ...anchorProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean };
        return (
            <a
                {...anchorProps}
                className={clsx(mergedClass, disabled && 'opacity-50 cursor-not-allowed pointer-events-none')}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
            className={mergedClass}
        >
            {children}
        </button>
    );
}
