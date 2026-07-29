import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import SearchInput from '@/Components/UI/SearchInput';
import FilterDropdown from '@/Components/UI/FilterDropdown';
import Badge from '@/Components/UI/Badge';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { ShortLink, PageProps } from '@/types';
import { ShieldAlert, ShieldCheck, ExternalLink, Eye, Trash2, RotateCcw, PowerOff, Power } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface AdminLinksProps {
    links: PaginatedData<ShortLink>;
    filters: {
        search: string;
        flagged: string;
    };
}

export default function AdminLinksPage({ links, filters }: AdminLinksProps) {
    const flash = usePage<PageProps>().props.flash;
    const [search, setSearch] = useState(filters.search || '');
    const [flaggedFilter, setFlaggedFilter] = useState(filters.flagged || '');
    const [blockTarget, setBlockTarget] = useState<ShortLink | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ShortLink | null>(null);
    const [restoreTarget, setRestoreTarget] = useState<ShortLink | null>(null);
    const [forceDeleteTarget, setForceDeleteTarget] = useState<ShortLink | null>(null);
    const [suspendTarget, setSuspendTarget] = useState<ShortLink | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get('/admin/links', { search: val, flagged: flaggedFilter }, { preserveState: true, replace: true });
    };

    const handleFilterFlagged = (val: string) => {
        setFlaggedFilter(val);
        router.get('/admin/links', { search, flagged: val }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/links', { search, flagged: flaggedFilter, page }, { preserveState: true });
    };

    const handleToggleBlock = () => {
        if (!blockTarget) return;
        router.patch(`/admin/links/${blockTarget.id}/flag`, {}, {
            onSuccess: () => setBlockTarget(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/links/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleRestore = () => {
        if (!restoreTarget) return;
        router.post(`/admin/links/${restoreTarget.id}/restore`, {}, {
            onSuccess: () => setRestoreTarget(null),
        });
    };

    const handleForceDeleteLink = () => {
        if (!forceDeleteTarget) return;
        router.delete(`/admin/links/${forceDeleteTarget.id}/force`, {
            onSuccess: () => setForceDeleteTarget(null),
        });
    };

    const handleToggleStatus = () => {
        if (!suspendTarget) return;
        const endpoint = suspendTarget.is_active ? 'suspend' : 'activate';
        router.patch(`/admin/links/${suspendTarget.id}/${endpoint}`, {}, {
            onSuccess: () => setSuspendTarget(null),
        });
    };

    return (
        <>
            <Head title="Global Link Moderation" />

            <PageHeader
                title="Global Link Moderation"
                description="Inspeksi seluruh link yang terdaftar di platform dan blokir link terindikasi bahaya atau phishing."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Links' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Cari slug, URL asli, atau pembuat link..."
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <FilterDropdown
                        options={[
                            { label: 'Semua Status Link', value: '' },
                            { label: 'Terindikasi Bahaya (Flagged)', value: 'flagged' },
                            { label: 'Normal & Aman', value: 'normal' },
                            { label: 'Suspended (Nonaktif)', value: 'suspended' },
                            { label: 'Dihapus (Deleted)', value: 'deleted' },
                        ]}
                        selected={flaggedFilter}
                        onChange={handleFilterFlagged}
                    />
                </div>
            </div>

            <DataTable<ShortLink>
                data={links.data}
                keyExtractor={(item) => item.id}
                currentPage={links.meta?.current_page ?? 1}
                lastPage={links.meta?.last_page ?? 1}
                totalData={links.meta?.total ?? links.data.length}
                perPage={links.meta?.per_page ?? 15}
                onPageChange={handlePageChange}
                columns={[
                    {
                        header: 'Short URL & Slug',
                        cell: (item) => (
                            <div>
                                <Link href={`/admin/links/${item.id}`} className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 hover:bg-emerald-100 hover:underline">
                                    {item.short_slug}
                                </Link>
                                <div className="font-bold text-gray-900 text-xs font-display mt-1">{item.title}</div>
                            </div>
                        ),
                    },
                    {
                        header: 'URL Tujuan',
                        cell: (item) => (
                            <div className="max-w-xs truncate">
                                <a
                                    href={item.original_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-gray-600 hover:text-emerald-600 font-mono flex items-center gap-1"
                                >
                                    <span className="truncate">{item.original_url}</span>
                                    <ExternalLink size={12} className="shrink-0" />
                                </a>
                            </div>
                        ),
                    },
                    {
                        header: 'Pemilik Link',
                        cell: (item) => (
                            <span className="font-semibold text-xs text-gray-800">{item.user?.name || 'System'}</span>
                        ),
                    },
                    {
                        header: 'Klik Global',
                        cell: (item) => (
                            <span className="font-bold text-xs text-gray-900">{item.clicks_count.toLocaleString()}</span>
                        ),
                    },
                    {
                        header: 'Status Moderasi',
                        cell: (item) => {
                            if (item.deleted_at) return <Badge variant="gray">Deleted</Badge>;
                            return (
                                <Badge variant={item.is_flagged ? 'error' : item.is_active ? 'emerald' : 'gray'}>
                                    {item.is_flagged ? 'Blocked / Flagged' : item.is_active ? 'Aman' : 'Nonaktif'}
                                </Badge>
                            );
                        },
                    },
                    {
                        header: 'Aksi Moderasi',
                        cell: (item) => (
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/admin/links/${item.id}`}
                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                    title="View Detail"
                                >
                                    <Eye size={15} />
                                </Link>
                                {!item.deleted_at ? (
                                    <>
                                        <button
                                            onClick={() => setBlockTarget(item)}
                                            className={`p-1.5 rounded-xl transition-colors ${
                                                item.is_flagged
                                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                                    : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                                            }`}
                                            title={item.is_flagged ? 'Unblock Link' : 'Block / Flag Link'}
                                        >
                                            {item.is_flagged ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
                                        </button>
                                        <button
                                            onClick={() => setSuspendTarget(item)}
                                            className={`p-1.5 rounded-xl transition-colors ${
                                                item.is_active
                                                    ? 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                                                    : 'text-amber-600 hover:bg-amber-50'
                                            }`}
                                            title={item.is_active ? 'Suspend Link' : 'Activate Link'}
                                        >
                                            {item.is_active ? <PowerOff size={15} /> : <Power size={15} />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Hapus Link"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setRestoreTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            title="Pulihkan Link"
                                        >
                                            <RotateCcw size={15} />
                                        </button>
                                        <button
                                            onClick={() => setForceDeleteTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Hapus Permanen"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            {/* Confirm Block Dialog */}
            <ConfirmDialog
                isOpen={!!blockTarget}
                onClose={() => setBlockTarget(null)}
                onConfirm={handleToggleBlock}
                title={blockTarget?.is_flagged ? 'Buka Blokir Link Ini?' : 'Blokir Link Terindikasi Bahaya?'}
                message={
                    blockTarget?.is_flagged
                        ? `Apakah kamu yakin ingin membuka blokir link "${blockTarget?.short_slug}"?`
                        : `Apakah kamu yakin ingin memblokir link "${blockTarget?.short_slug}"? Pengunjung yang membuka link ini akan dialihkan ke halaman peringatan keamanan.`
                }
                confirmText={blockTarget?.is_flagged ? 'Unblock' : 'Blokir (Block)'}
                variant={blockTarget?.is_flagged ? 'warning' : 'danger'}
            />

            <ConfirmDialog
                isOpen={!!suspendTarget}
                onClose={() => setSuspendTarget(null)}
                onConfirm={handleToggleStatus}
                title={suspendTarget?.is_active ? 'Suspend Link Ini?' : 'Aktifkan Link Ini?'}
                message={`Apakah kamu yakin ingin ${suspendTarget?.is_active ? 'menskors (suspend)' : 'mengaktifkan'} link "${suspendTarget?.short_slug}"?`}
                confirmText={suspendTarget?.is_active ? 'Suspend' : 'Aktifkan'}
                variant={suspendTarget?.is_active ? 'warning' : 'emerald'}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Link Secara Logikal?"
                message={`Link "${deleteTarget?.short_slug}" akan dihapus sementara (Soft Delete).`}
                confirmText="Hapus Link"
                variant="danger"
            />

            {/* Confirm Restore Dialog */}
            <ConfirmDialog
                isOpen={!!restoreTarget}
                onClose={() => setRestoreTarget(null)}
                onConfirm={handleRestore}
                title="Pulihkan Link?"
                message={`Apakah kamu yakin ingin memulihkan link "${restoreTarget?.short_slug}"? Link akan kembali dapat diakses.`}
                confirmText="Ya, Pulihkan Link"
                variant="warning"
            />

            {/* Confirm Force Delete Dialog */}
            <ConfirmDialog
                isOpen={!!forceDeleteTarget}
                onClose={() => setForceDeleteTarget(null)}
                onConfirm={handleForceDeleteLink}
                title="Hapus Permanen Link?"
                message={`PERINGATAN: Apakah kamu yakin ingin menghapus PERMANEN link "${forceDeleteTarget?.short_slug}"? Seluruh data analitik klik dan riwayat link ini akan terhapus selamanya dan tidak dapat dikembalikan!`}
                confirmText="Ya, Hapus Permanen"
                variant="danger"
            />
        </>
    );
}

AdminLinksPage.layout = (page: any) => <AppLayout children={page} />;
