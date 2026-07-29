import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import FilterDropdown from '@/Components/UI/FilterDropdown';
import Modal from '@/Components/UI/Modal';
import { AbuseReport, PageProps } from '@/types';
import { Check, X, ShieldAlert, ImageIcon, MessageSquareText, Eye } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface AdminReportsProps {
    reports: PaginatedData<AbuseReport & { short_link?: any }>;
    filters: {
        status: string;
    };
}

export default function AdminReportsPage({ reports, filters }: AdminReportsProps) {
    const flash = usePage<PageProps>().props.flash;
    const [actionTarget, setActionTarget] = useState<{ report: AbuseReport; action: 'approve' | 'reject' } | null>(null);
    const [viewTarget, setViewTarget] = useState<AbuseReport & { short_link?: any } | null>(null);

    const handleActionConfirm = () => {
        if (!actionTarget) return;
        const { report, action } = actionTarget;

        router.post(`/admin/reports/${report.id}/${action}`, {}, {
            onSuccess: () => {
                setActionTarget(null);
                setViewTarget(null);
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/reports', { status: filters.status, page }, { preserveState: true });
    };

    const handleFilterStatus = (val: string) => {
        router.get('/admin/reports', { status: val, page: 1 }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Moderasi Abuse Reports" />

            <PageHeader
                title="Antrean Laporan Penyalahgunaan"
                description="Tinjau dan ambil tindakan terhadap tautan yang dilaporkan oleh pengguna (Phishing, Scam, Malware, dll)."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Abuse Reports' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <div className="flex justify-end mb-4">
                <FilterDropdown
                    options={[
                        { label: 'Semua Status Laporan', value: '' },
                        { label: 'Menunggu Ditinjau (Pending)', value: 'pending' },
                        { label: 'Disetujui (Approved)', value: 'approved' },
                        { label: 'Ditolak (Rejected)', value: 'rejected' },
                    ]}
                    selected={filters.status}
                    onChange={handleFilterStatus}
                />
            </div>

            <DataTable<AbuseReport & { short_link?: any }>
                data={reports.data || []}
                keyExtractor={(item) => item.id}
                currentPage={reports.meta?.current_page ?? 1}
                lastPage={reports.meta?.last_page ?? 1}
                totalData={reports.meta?.total ?? reports.data.length}
                perPage={reports.meta?.per_page ?? 15}
                onPageChange={handlePageChange}
                emptyTitle="Tidak Ada Laporan Penyalahgunaan"
                emptyDescription="Antrean moderasi saat ini bersih."
                columns={[
                    {
                        header: 'Tautan Dilaporkan',
                        cell: (item) => (
                            <Link href={`/admin/links/${item.short_link_id}`} className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200/60 hover:underline">
                                {item.short_link?.short_slug || 'Unknown Link'}
                            </Link>
                        ),
                    },
                    {
                        header: 'Alasan & Tingkat Keparahan',
                        cell: (item) => (
                            <div>
                                <span className="text-xs text-gray-800 font-bold block mb-1">{item.reason}</span>
                                <Badge variant={
                                    item.severity === 'critical' ? 'error' :
                                    item.severity === 'high' ? 'error' :
                                    item.severity === 'medium' ? 'warning' : 'emerald'
                                } className="uppercase">
                                    {item.severity || 'low'}
                                </Badge>
                            </div>
                        ),
                    },
                    {
                        header: 'Pelapor',
                        cell: (item) => (
                            <span className="text-xs text-gray-500 block truncate max-w-[150px]" title={item.reporter_email}>{item.reporter_email}</span>
                        ),
                    },
                    {
                        header: 'Status',
                        cell: (item) => (
                            <Badge variant={item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'error' : 'gray'}>
                                {item.status === 'pending' ? 'Menunggu' : item.status === 'approved' ? 'Link Disuspend' : 'Ditolak'}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Waktu Laporan',
                        cell: (item) => (
                            <span className="text-xs text-gray-500 font-medium">{new Date(item.created_at).toLocaleString('id-ID')}</span>
                        ),
                    },
                    {
                        header: 'Aksi Moderasi',
                        cell: (item) => (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewTarget(item)}
                                    className="px-2 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                                    title="Lihat Detail & Bukti"
                                >
                                    <Eye size={14} /> Lihat Detail
                                </button>
                                
                                {item.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => setActionTarget({ report: item, action: 'approve' })}
                                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                                            title="Setujui Laporan & Suspend Link"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => setActionTarget({ report: item, action: 'reject' })}
                                            className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                                            title="Tolak Laporan"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={!!actionTarget}
                onClose={() => setActionTarget(null)}
                onConfirm={handleActionConfirm}
                title={actionTarget?.action === 'approve' ? 'Setujui Laporan & Suspend Link?' : 'Tolak Laporan Ini?'}
                message={
                    actionTarget?.action === 'approve'
                        ? `Apakah kamu yakin ingin menyetujui laporan ini? Tautan terkait (${actionTarget.report.short_link?.short_slug}) akan langsung DISUSPEND (tidak dapat diakses) dan laporan lain untuk tautan ini akan ditutup otomatis.`
                        : `Apakah kamu yakin ingin menolak dan mengabaikan laporan ini? Tautan tidak akan diblokir.`
                }
                confirmText={actionTarget?.action === 'approve' ? 'Ya, Suspend Link' : 'Tolak Laporan'}
                variant={actionTarget?.action === 'approve' ? 'danger' : 'warning'}
            />

            {/* View Detail Modal */}
            <Modal
                isOpen={!!viewTarget}
                onClose={() => setViewTarget(null)}
                title="Detail Laporan Penyalahgunaan"
                maxWidth="2xl"
            >
                {viewTarget && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Target Link</label>
                                <div className="text-sm font-bold text-gray-900">{viewTarget.short_link?.short_slug}</div>
                                <a href={viewTarget.short_link?.original_url} target="_blank" className="text-xs text-blue-600 hover:underline break-all block mt-1">
                                    {viewTarget.short_link?.original_url}
                                </a>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Pelapor</label>
                                <div className="text-sm font-bold text-gray-900">{viewTarget.reporter_email}</div>
                                <div className="text-xs text-gray-500 mt-1">{new Date(viewTarget.created_at).toLocaleString('id-ID')}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Alasan</label>
                                <div className="text-sm font-bold text-gray-900">{viewTarget.reason}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Severity</label>
                                <Badge variant={
                                    viewTarget.severity === 'critical' ? 'error' :
                                    viewTarget.severity === 'high' ? 'error' :
                                    viewTarget.severity === 'medium' ? 'warning' : 'emerald'
                                } className="uppercase">
                                    {viewTarget.severity}
                                </Badge>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="text-xs font-semibold text-gray-500 block mb-2 flex items-center gap-1">
                                <MessageSquareText size={14} /> Deskripsi Tambahan
                            </label>
                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-800 leading-relaxed min-h-[80px]">
                                {viewTarget.description || <span className="text-gray-400 italic">Tidak ada deskripsi yang diberikan oleh pelapor.</span>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="text-xs font-semibold text-gray-500 block mb-2 flex items-center gap-1">
                                <ImageIcon size={14} /> Lampiran Tangkapan Layar (Screenshot)
                            </label>
                            {viewTarget.screenshot_path ? (
                                <a 
                                    href={`/storage/${viewTarget.screenshot_path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="block relative group overflow-hidden rounded-xl border border-gray-200"
                                >
                                    <img 
                                        src={`/storage/${viewTarget.screenshot_path}`} 
                                        alt="Bukti Laporan" 
                                        className="w-full h-auto max-h-[400px] object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                                        Lihat Gambar Penuh
                                    </div>
                                </a>
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                    <span className="text-sm font-medium">Pelapor tidak menyertakan tangkapan layar</span>
                                </div>
                            )}
                        </div>

                        {viewTarget.status === 'pending' && (
                            <div className="flex items-center gap-3 justify-end pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setActionTarget({ report: viewTarget, action: 'reject' });
                                        setViewTarget(null);
                                    }}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Tolak Laporan
                                </button>
                                <button
                                    onClick={() => {
                                        setActionTarget({ report: viewTarget, action: 'approve' });
                                        setViewTarget(null);
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition-colors flex items-center gap-2"
                                >
                                    <ShieldAlert size={16} />
                                    Setujui & Suspend Link
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}

AdminReportsPage.layout = (page: any) => <AppLayout children={page} />;
