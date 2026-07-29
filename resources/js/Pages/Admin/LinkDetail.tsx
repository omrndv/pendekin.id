import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { ShortLink, PageProps } from '@/types';
import Badge from '@/Components/UI/Badge';
import Card from '@/Components/UI/Card';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { ExternalLink, Copy, Calendar, MousePointerClick, Smartphone, Globe, ShieldAlert, MonitorSmartphone, Trash2, RotateCcw, Power, ShieldCheck, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LinkDetailProps extends PageProps {
    targetLink: ShortLink & { abuse_reports?: any[], user?: any, deleted_at?: string };
    analytics: any[];
    devices: any[];
    browsers: any[];
    countries: any[];
    referrers: any[];
    abuseReports: any[];
}

export default function AdminLinkDetail({ targetLink, analytics, devices, browsers, countries, referrers, abuseReports }: LinkDetailProps) {
    const [copied, setCopied] = useState(false);
    const [confirmForceDeleteOpen, setConfirmForceDeleteOpen] = useState(false);
    const [confirmSoftDeleteOpen, setConfirmSoftDeleteOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['targetLink', 'analytics', 'devices', 'browsers', 'countries', 'referrers'] });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSoftDelete = () => {
        router.delete(`/admin/links/${targetLink.id}`, {
            onSuccess: () => setConfirmSoftDeleteOpen(false),
        });
    };

    const handleForceDelete = () => {
        router.delete(`/admin/links/${targetLink.id}/force`, {
            onSuccess: () => router.visit('/admin/links'),
        });
    };

    const handleRestore = () => {
        router.post(`/admin/links/${targetLink.id}/restore`);
    };

    return (
        <>
            <Head title={`Detail Link - ${targetLink.short_slug}`} />

            <PageHeader
                title="Detail Link & Analitik"
                description={`Analitik komprehensif untuk link ${targetLink.short_slug}`}
                breadcrumbs={[
                    { name: 'Admin Console', href: '/admin/dashboard' },
                    { name: 'Links', href: '/admin/links' },
                    { name: targetLink.short_slug }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Link Metadata */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <ExternalLink size={24} />
                            </div>
                            <Badge variant={targetLink.deleted_at ? 'gray' : targetLink.is_flagged ? 'error' : targetLink.is_active ? 'emerald' : 'gray'}>
                                {targetLink.deleted_at ? 'Deleted' : targetLink.is_flagged ? 'Flagged' : targetLink.is_active ? 'Active' : 'Suspended'}
                            </Badge>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 font-display mb-2">{targetLink.title || 'Untitled Link'}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Short URL</label>
                                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                    <span className="text-sm font-mono text-emerald-600 font-semibold truncate flex-1">
                                        {targetLink.short_url}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(targetLink.short_url!)}
                                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors bg-white rounded-lg border border-gray-200"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">Original URL</label>
                                <a 
                                    href={targetLink.original_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:underline break-all block"
                                >
                                    {targetLink.original_url}
                                </a>
                            </div>

                            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Pembuat</label>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {targetLink.user?.name || 'Guest / System'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Tanggal Dibuat</label>
                                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(targetLink.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Masa Aktif</label>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {targetLink.expires_at ? new Date(targetLink.expires_at).toLocaleDateString('id-ID') : 'Selamanya'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Batas Klik</label>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {targetLink.max_clicks ? `${targetLink.clicks_count} / ${targetLink.max_clicks}` : 'Tidak Terbatas'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Admin Moderation Panel */}
                    <Card title="Aksi Moderasi Admin" className="p-6">
                        <div className="space-y-2">
                            {targetLink.deleted_at ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={handleRestore}
                                        className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <RotateCcw size={15} />
                                        Pulihkan Link (Restore)
                                    </button>
                                    <button
                                        onClick={() => setConfirmForceDeleteOpen(true)}
                                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                        Hapus Permanen (Force Delete)
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setConfirmSoftDeleteOpen(true)}
                                        className="w-full py-2.5 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                        Hapus Sementara (Soft Delete)
                                    </button>
                                    <button
                                        onClick={() => setConfirmForceDeleteOpen(true)}
                                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                        Hapus Permanen (Force Delete)
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Riwayat Laporan Penyalahgunaan (Abuse)" className="p-0 border-rose-100">
                        {abuseReports && abuseReports.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {abuseReports.map((report) => (
                                    <div key={report.id} className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="error" className="capitalize">{report.reason}</Badge>
                                            <span className="text-xs text-gray-400">{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <div className="text-sm text-gray-700 font-medium mb-1">{report.description || 'Tanpa deskripsi tambahan'}</div>
                                        <div className="text-xs text-gray-500">Pelapor: {report.reporter_email}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 flex flex-col items-center justify-center text-center text-gray-400">
                                <ShieldAlert size={24} className="text-gray-300 mb-2" />
                                <span className="text-sm font-medium">Link bersih, tidak ada laporan penyalahgunaan.</span>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Analytics Data */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{targetLink.clicks_count.toLocaleString('id-ID')}</div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <MousePointerClick size={14} className="text-emerald-500" />
                                Total Klik
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{devices?.find(d => d.device_type === 'Mobile')?.count || 0}</div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <Smartphone size={14} className="text-blue-500" />
                                Akses Mobile
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{devices?.find(d => d.device_type === 'Desktop')?.count || 0}</div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <MonitorSmartphone size={14} className="text-purple-500" />
                                Akses Desktop
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{countries.length}</div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <Globe size={14} className="text-amber-500" />
                                Negara Asal
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Devices */}
                        <Card title="Distribusi Perangkat" className="p-0 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-gray-500 font-semibold">Perangkat</th>
                                        <th className="px-5 py-3 text-gray-500 font-semibold text-right">Klik</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {devices.map((device, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{device.device_type || 'Unknown'}</td>
                                            <td className="px-5 py-3 font-bold text-gray-900 text-right">{device.count}</td>
                                        </tr>
                                    ))}
                                    {devices.length === 0 && (
                                        <tr><td colSpan={2} className="px-5 py-6 text-center text-gray-400">Belum ada data analitik.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>

                        {/* Browsers */}
                        <Card title="Distribusi Browser" className="p-0 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-gray-500 font-semibold">Browser</th>
                                        <th className="px-5 py-3 text-gray-500 font-semibold text-right">Klik</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {browsers.map((browser, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{browser.browser || 'Unknown'}</td>
                                            <td className="px-5 py-3 font-bold text-gray-900 text-right">{browser.count}</td>
                                        </tr>
                                    ))}
                                    {browsers.length === 0 && (
                                        <tr><td colSpan={2} className="px-5 py-6 text-center text-gray-400">Belum ada data analitik.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>

                        {/* Referrers */}
                        <Card title="Top Referrers" className="p-0 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-gray-500 font-semibold">Sumber / Referrer</th>
                                        <th className="px-5 py-3 text-gray-500 font-semibold text-right">Klik</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {referrers.map((referrer, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-medium text-gray-900 truncate max-w-[200px]">{referrer.referrer_host || 'Direct / Unknown'}</td>
                                            <td className="px-5 py-3 font-bold text-gray-900 text-right">{referrer.count}</td>
                                        </tr>
                                    ))}
                                    {referrers.length === 0 && (
                                        <tr><td colSpan={2} className="px-5 py-6 text-center text-gray-400">Belum ada data analitik.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>

                        {/* Countries */}
                        <Card title="Top Countries" className="p-0 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-gray-500 font-semibold">Negara</th>
                                        <th className="px-5 py-3 text-gray-500 font-semibold text-right">Klik</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {countries.map((country, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{country.country || 'Unknown'}</td>
                                            <td className="px-5 py-3 font-bold text-gray-900 text-right">{country.count}</td>
                                        </tr>
                                    ))}
                                    {countries.length === 0 && (
                                        <tr><td colSpan={2} className="px-5 py-6 text-center text-gray-400">Belum ada data analitik.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Soft Delete Confirm */}
            <ConfirmDialog
                isOpen={confirmSoftDeleteOpen}
                onClose={() => setConfirmSoftDeleteOpen(false)}
                onConfirm={handleSoftDelete}
                title="Hapus Sementara Link ini?"
                message={`Link "${targetLink.short_slug}" akan dinonaktifkan dan dipindahkan ke daftar soft delete. Link dapat dipulihkan kapan saja oleh Admin.`}
                confirmText="Ya, Soft Delete"
                variant="warning"
            />

            {/* Force Delete Confirm */}
            <ConfirmDialog
                isOpen={confirmForceDeleteOpen}
                onClose={() => setConfirmForceDeleteOpen(false)}
                onConfirm={handleForceDelete}
                title="Hapus PERMANEN Link ini?"
                message={`PERINGATAN: Apakah kamu benar-benar yakin ingin menghapus PERMANEN link "${targetLink.short_slug}"? Seluruh data analitik dan riwayat akan terhapus dari database selamanya!`}
                confirmText="Ya, Hapus Permanen"
                variant="danger"
            />
        </>
    );
}

AdminLinkDetail.layout = (page: any) => <AppLayout children={page} />;
