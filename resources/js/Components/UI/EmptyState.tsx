import { ReactNode } from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export default function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300/80 my-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <Icon size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-900 font-display mb-1">
                {title}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action}
        </div>
    );
}
