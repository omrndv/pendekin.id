import React from 'react';

interface CardProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export default function Card({ title, description, children, className = '', action }: CardProps) {
    return (
        <div className={`bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden ${className}`}>
            {(title || action) && (
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-base font-bold text-gray-900 font-display">{title}</h3>}
                        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={title ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
}
