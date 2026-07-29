import { ReactNode } from 'react';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import SkeletonLoader from './SkeletonLoader';
import { LucideIcon } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: LucideIcon;
    emptyAction?: ReactNode;
    currentPage?: number;
    lastPage?: number;
    totalData?: number;
    perPage?: number;
    onPageChange?: (page: number) => void;
    keyExtractor: (item: T) => string | number;
}

export default function DataTable<T>({
    columns,
    data,
    isLoading = false,
    emptyTitle = 'Tidak ada data',
    emptyDescription = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
    emptyIcon,
    emptyAction,
    currentPage = 1,
    lastPage = 1,
    totalData,
    perPage = 10,
    onPageChange,
    keyExtractor,
}: DataTableProps<T>) {
    const total = totalData ?? data.length;

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col gap-4">
                <SkeletonLoader className="h-10 w-full" />
                <SkeletonLoader className="h-16 w-full" />
                <SkeletonLoader className="h-16 w-full" />
                <SkeletonLoader className="h-16 w-full" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction}
            />
        );
    }

    return (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden transition-all">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200/80 bg-gray-50/60">
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 font-sans ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={keyExtractor(item)} className="hover:bg-emerald-50/30 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className={`px-6 py-4 text-xs font-medium text-gray-800 ${col.className || ''}`}>
                                        {col.cell
                                            ? col.cell(item)
                                            : col.accessorKey
                                            ? String(item[col.accessorKey] ?? '')
                                            : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {onPageChange && total > 0 && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    perPage={perPage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
