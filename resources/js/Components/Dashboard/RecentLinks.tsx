import { Copy, ExternalLink, BarChart2, Calendar, Link2 } from 'lucide-react';
import Button from '@/Components/Button';
import { ShortLink } from '@/types';

interface RecentLinksProps {
    links?: ShortLink[];
}

export default function RecentLinks({ links = [] }: RecentLinksProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-text-primary font-display">Link Terbaru</h3>
                    <p className="text-sm text-text-secondary mt-1">Daftar link yang baru saja kamu perpendek.</p>
                </div>
                <a href="/dashboard/links" className="inline-flex items-center px-4 py-2 text-xs font-bold bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl transition-all shadow-sm">
                    Lihat Semua Link
                </a>
            </div>

            {links.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                        <Link2 size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 font-display mb-1">Belum Ada Short Link</h4>
                    <p className="text-xs text-gray-500">Perpendek URL pertama kamu di atas untuk mulai melacak analitik.</p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {links.map((link) => {
                        const shortUrl = link.short_url || `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.short_slug}`;

                        return (
                            <div key={link.id} className="p-6 md:p-8 hover:bg-bg transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                {/* Link Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-emerald-600 hover:text-emerald-700 transition-colors truncate font-mono">
                                            {shortUrl}
                                        </a>
                                        {!link.is_active && (
                                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">Non-aktif</span>
                                        )}
                                    </div>
                                    <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary truncate block hover:text-text-primary transition-colors max-w-xl">
                                        {link.original_url}
                                    </a>
                                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-text-secondary">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} /> {link.created_at?.split('T')[0]}
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                        <div className="flex items-center gap-1.5 text-text-primary font-bold">
                                            <BarChart2 size={14} className="text-emerald-500" /> {link.clicks_count?.toLocaleString() ?? 0} klik
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => copyToClipboard(shortUrl)}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-emerald-50 hover:text-emerald-600 border border-border transition-all bg-white cursor-pointer"
                                        title="Salin Link"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <a
                                        href="/dashboard/analytics"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-sky-50 hover:text-sky-600 border border-border transition-all bg-white"
                                        title="Lihat Analitik"
                                    >
                                        <BarChart2 size={16} />
                                    </a>
                                    <a
                                        href={link.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-gray-100 hover:text-gray-900 border border-border transition-all bg-white"
                                        title="Buka URL Asli"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
