import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import { ShortLink, PageProps } from '@/types';
import { 
    Link2, 
    MousePointerClick, 
    CheckCircle2, 
    TrendingUp, 
    ArrowRight, 
    Copy, 
    Check, 
    QrCode, 
    BarChart3, 
    Sparkles, 
    Zap 
} from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
}

interface UserDashboardProps {
    recentLinks: PaginatedData<ShortLink>;
    stats: {
        total_links: number;
        active_links: number;
        total_clicks: number;
        avg_clicks: number;
    };
}

export default function UserDashboardIndex({ recentLinks, stats }: UserDashboardProps) {
    const flash = usePage<PageProps>().props.flash;
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const quickForm = useForm({
        original_url: '',
        custom_slug: '',
    });

    const handleCopy = (id: number, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleQuickShorten = (e: React.FormEvent) => {
        e.preventDefault();
        quickForm.post('/dashboard/links', {
            onSuccess: () => {
                quickForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Dashboard Overview" />

            <PageHeader
                title="Dashboard Overview"
                description="Pantau performa link, perpendek URL secara instan, dan lihat analitik klik kamu secara realtime."
                breadcrumbs={[{ name: 'Dashboard' }]}
            />

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 animate-fade-in">
                    {flash.error}
                </div>
            )}

            {/* Quick Shorten Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-gray-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Sparkles size={16} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Quick Shortener</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold font-display mb-2">
                    Perpendek URL Instan
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mb-6">
                    Tempelkan link panjang kamu di bawah ini untuk menghasilkan link pendek rapi berkecepatan tinggi secara otomatis.
                </p>

                <form onSubmit={handleQuickShorten} className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="url"
                            value={quickForm.data.original_url}
                            onChange={(e) => quickForm.setData('original_url', e.target.value)}
                            placeholder="https://example.com/url-panjang-yang-ingin-diperpendek"
                            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 font-sans transition-all"
                            required
                        />
                        <input
                            type="text"
                            value={quickForm.data.custom_slug}
                            onChange={(e) => quickForm.setData('custom_slug', e.target.value)}
                            placeholder="Custom Alias (Opsional)"
                            className="w-full sm:w-48 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 font-sans transition-all"
                        />
                        <button
                            type="submit"
                            disabled={quickForm.processing}
                            className="h-11 px-6 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                        >
                            <span>{quickForm.processing ? 'Memproses...' : 'Pendekin'}</span>
                            <Zap size={16} />
                        </button>
                    </div>
                    {quickForm.errors.original_url && <p className="text-xs font-bold text-rose-400 animate-fade-in">{quickForm.errors.original_url}</p>}
                    {quickForm.errors.custom_slug && <p className="text-xs font-bold text-rose-400 animate-fade-in">{quickForm.errors.custom_slug}</p>}
                </form>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Link"
                    value={stats.total_links.toLocaleString()}
                    change="Aktif"
                    isPositive={true}
                    icon={Link2}
                    subtitle="Total link yang terdaftar"
                    variant="emerald"
                />
                <StatCard
                    title="Total Klik"
                    value={stats.total_clicks.toLocaleString()}
                    change="Realtime"
                    isPositive={true}
                    icon={MousePointerClick}
                    subtitle="Akumulasi kunjungan"
                    variant="blue"
                />
                <StatCard
                    title="Link Aktif"
                    value={stats.active_links.toLocaleString()}
                    change="Online"
                    isPositive={true}
                    icon={CheckCircle2}
                    subtitle="Siap untuk redirect"
                    variant="purple"
                />
                <StatCard
                    title="Rata-rata Klik/Link"
                    value={stats.avg_clicks}
                    change="Optimal"
                    isPositive={true}
                    icon={TrendingUp}
                    subtitle="Tingkat konversi rata-rata"
                    variant="amber"
                />
            </div>

            {/* Recent Links Table */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900 font-display">
                        Link Terbaru
                    </h3>
                    <Link href="/dashboard/links" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        <span>Lihat Semua Link</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <DataTable<ShortLink>
                    data={recentLinks.data}
                    keyExtractor={(item) => item.id}
                    columns={[
                        {
                            header: 'Judul & Link Asli',
                            cell: (item) => (
                                <div className="max-w-[220px] sm:max-w-[320px] md:max-w-[420px]">
                                    <div className="font-bold text-gray-900 text-xs font-display truncate" title={item.title}>{item.title}</div>
                                    <div className="text-[11px] text-gray-400 truncate mt-0.5" title={item.original_url}>{item.original_url}</div>
                                </div>
                            ),
                        },
                        {
                            header: 'Link Pendek',
                            cell: (item) => (
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60">
                                        {item.short_slug}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(item.id, item.short_url)}
                                        className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                                        title="Salin Link"
                                    >
                                        {copiedId === item.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            ),
                        },
                        {
                            header: 'Klik',
                            cell: (item) => (
                                <span className="font-bold text-xs text-gray-900">{item.clicks_count.toLocaleString()}</span>
                            ),
                        },
                        {
                            header: 'Status',
                            cell: (item) => (
                                <Badge variant={item.is_active ? 'emerald' : 'gray'}>
                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            ),
                        },
                        {
                            header: 'Tanggal Dibuat',
                            cell: (item) => (
                                <span className="text-xs text-gray-500 font-medium">{item.created_at?.split('T')[0]}</span>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
}

UserDashboardIndex.layout = (page: any) => <AppLayout children={page} />;
