import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    lastPage,
    total,
    perPage,
    onPageChange,
}: PaginationProps) {
    const from = Math.min((currentPage - 1) * perPage + 1, total);
    const to = Math.min(currentPage * perPage, total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white border-t border-gray-200/80 rounded-b-2xl">
            <div className="text-xs text-gray-500 font-medium">
                Menampilkan <span className="font-bold text-gray-900">{from}</span> hingga{' '}
                <span className="font-bold text-gray-900">{to}</span> dari{' '}
                <span className="font-bold text-gray-900">{total}</span> data
            </div>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                <span className="text-xs font-bold text-gray-700 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                    {currentPage} / {lastPage}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
