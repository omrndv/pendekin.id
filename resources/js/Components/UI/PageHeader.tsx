import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    action?: ReactNode;
    children?: ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action, children }: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-2">
                        {breadcrumbs.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                {idx > 0 && <ChevronRight size={12} className="text-gray-300" />}
                                {item.href ? (
                                    <Link href={item.href} className="hover:text-emerald-600 transition-colors">
                                        {item.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-600 font-semibold">{item.name}</span>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {(action || children) && (
                <div className="shrink-0 flex items-center gap-3">
                    {action}
                    {children}
                </div>
            )}
        </div>
    );
}
