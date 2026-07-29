import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: LucideIcon;
    subtitle?: string;
    variant?: 'emerald' | 'amber' | 'blue' | 'purple' | 'indigo' | 'error' | 'rose' | 'gray';
    href?: string;
}

export default function StatCard({
    title,
    value,
    change,
    isPositive = true,
    icon: Icon,
    subtitle,
    variant = 'emerald',
    href,
}: StatCardProps) {
    const iconColors = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        blue: 'bg-sky-50 text-sky-600 border-sky-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        error: 'bg-rose-50 text-rose-600 border-rose-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-100',
    };

    const cardContent = (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {title}
                </span>
                <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', iconColors[variant])}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
                    {value}
                </div>

                {change && (
                    <div
                        className={clsx(
                            'inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full',
                            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        )}
                    >
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{change}</span>
                    </div>
                )}
            </div>

            {subtitle && (
                <p className="text-xs text-gray-400 mt-2 font-medium">
                    {subtitle}
                </p>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block group">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
