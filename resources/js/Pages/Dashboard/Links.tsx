import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import SearchInput from '@/Components/UI/SearchInput';
import FilterDropdown from '@/Components/UI/FilterDropdown';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { ShortLink, PageProps } from '@/types';
import { Plus, Copy, Check, ExternalLink, Trash2, Edit3, RotateCcw, Power } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface UserLinksProps {
    links: PaginatedData<ShortLink>;
    filters: {
        search: string;
        status: string;
    };
}

export default function UserLinksPage({ links, filters }: UserLinksProps) {
    const flash = usePage<PageProps>().props.flash;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Modals & Target States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ShortLink | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ShortLink | null>(null);

    // Create Form
    const createForm = useForm({
        original_url: '',
        title: '',
        custom_slug: '',
        password: '',
        expires_at: '',
        max_clicks: '',
    });

    // Edit Form
    const editForm = useForm({
        original_url: '',
        title: '',
        password: '',
        expires_at: '',
        max_clicks: '',
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get('/dashboard/links', { search: val, status: statusFilter }, { preserveState: true, replace: true });
    };

    const handleFilterStatus = (val: string) => {
        setStatusFilter(val);
        router.get('/dashboard/links', { search, status: val }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/dashboard/links', { search, status: statusFilter, page }, { preserveState: true });
    };

    const handleCopy = (id: number, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/dashboard/links', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTarget) return;

        editForm.patch(`/dashboard/links/${editTarget.id}`, {
            onSuccess: () => {
                setEditTarget(null);
                editForm.reset();
            },
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        router.delete(`/dashboard/links/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleRestore = (id: number) => {
        router.post(`/dashboard/links/${id}/restore`);
    };

    const handleToggleStatus = (link: ShortLink) => {
        router.patch(`/dashboard/links/${link.id}/toggle`);
    };

    const openEditModal = (item: ShortLink) => {
        setEditTarget(item);
        editForm.setData({
            original_url: item.original_url,
            title: item.title || '',
            password: '',
            expires_at: item.expires_at ? item.expires_at.substring(0, 10) : '',
            max_clicks: item.max_clicks ? String(item.max_clicks) : '',
        });
    };

    return (
        <>
            <Head title="My Links" />

            <PageHeader
                title="Manajemen Link"
                description="Kelola seluruh URL pendek kamu, kustomisasi alias, dan pantau analitik performanya."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'My Links' }]}
                action={
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-10 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Buat Link Baru</span>
                    </button>
                }
            />

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in flex items-center justify-between">
                    <span>{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 animate-fade-in flex items-center justify-between">
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Cari judul, slug, atau URL asli..."
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <FilterDropdown
                        options={[
                            { label: 'Semua Status', value: '' },
                            { label: 'Aktif', value: 'active' },
                            { label: 'Nonaktif', value: 'inactive' },
                            { label: 'Diarsipkan (Soft Delete)', value: 'archived' },
                        ]}
                        selected={statusFilter}
                        onChange={handleFilterStatus}
                    />
                </div>
            </div>

            {/* Links Table */}
            <DataTable<ShortLink>
                data={links.data}
                keyExtractor={(item) => item.id}
                currentPage={links.meta?.current_page ?? 1}
                lastPage={links.meta?.last_page ?? 1}
                totalData={links.meta?.total ?? links.data.length}
                perPage={links.meta?.per_page ?? 10}
                onPageChange={handlePageChange}
                emptyTitle="Tidak Ada Link Ditemukan"
                emptyDescription="Belum ada link yang sesuai dengan kriteria pencarian kamu."
                emptyAction={
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                        Buat Link Pertama
                    </button>
                }
                columns={[
                    {
                        header: 'Judul & URL Asli',
                        cell: (item) => (
                            <div className="max-w-[220px] sm:max-w-[320px] md:max-w-[420px]">
                                <div className="font-bold text-gray-900 text-xs font-display flex items-center gap-2">
                                    <span className="truncate" title={item.title}>{item.title}</span>
                                    <a
                                        href={item.original_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 hover:text-emerald-600 transition-colors shrink-0"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="text-[11px] text-gray-400 truncate mt-0.5" title={item.original_url}>{item.original_url}</div>
                            </div>
                        ),
                    },
                    {
                        header: 'Short URL',
                        cell: (item) => (
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                                    {item.short_slug}
                                </span>
                                <button
                                    onClick={() => handleCopy(item.id, item.short_url)}
                                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
                    {
                        header: 'Aksi',
                        cell: (item) => (
                            <div className="flex items-center gap-1.5">
                                {statusFilter === 'archived' ? (
                                    <button
                                        onClick={() => handleRestore(item.id)}
                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                        title="Pulihkan Link"
                                    >
                                        <RotateCcw size={15} />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                                            title={item.is_active ? 'Nonaktifkan Link' : 'Aktifkan Link'}
                                        >
                                            <Power size={15} />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                            title="Edit Link"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                            title="Arsipkan Link"
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

            {/* Create Link Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Buat Link Shortener Baru"
                description="Masukkan URL tujuan dan alias opsional untuk memperpendek link."
            >
                <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            URL Tujuan (Destination URL)
                        </label>
                        <input
                            type="url"
                            value={createForm.data.original_url}
                            onChange={(e) => createForm.setData('original_url', e.target.value)}
                            placeholder="https://myshop.com/halaman-produk-panjang"
                            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                            required
                        />
                        {createForm.errors.original_url && <p className="mt-1 text-xs text-rose-600">{createForm.errors.original_url}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Judul Link (Opsional)
                        </label>
                        <input
                            type="text"
                            value={createForm.data.title}
                            onChange={(e) => createForm.setData('title', e.target.value)}
                            placeholder="Campaign Promo Juli"
                            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Custom Slug / Alias (Opsional)
                        </label>
                        <div className="flex items-center">
                            <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-2xl text-xs text-gray-500 font-mono">
                                {typeof window !== 'undefined' ? window.location.host + '/' : '/'}
                            </span>
                            <input
                                type="text"
                                value={createForm.data.custom_slug}
                                onChange={(e) => createForm.setData('custom_slug', e.target.value)}
                                placeholder="promo-juli"
                                className="flex-1 px-4 py-2.5 rounded-r-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono"
                            />
                        </div>
                        {createForm.errors.custom_slug && <p className="mt-1 text-xs text-rose-600">{createForm.errors.custom_slug}</p>}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fitur Tambahan (Gratis)</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                    Batas Klik Maksimal
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={createForm.data.max_clicks}
                                    onChange={(e) => createForm.setData('max_clicks', e.target.value)}
                                    placeholder="Contoh: 1000"
                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                />
                                {createForm.errors.max_clicks && <p className="mt-1 text-xs text-rose-600">{createForm.errors.max_clicks}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                    Tanggal Kedaluwarsa
                                </label>
                                <input
                                    type="date"
                                    value={createForm.data.expires_at}
                                    onChange={(e) => createForm.setData('expires_at', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                />
                                {createForm.errors.expires_at && <p className="mt-1 text-xs text-rose-600">{createForm.errors.expires_at}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Password Pengaman Link
                            </label>
                            <input
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Masukkan password untuk mengunci link"
                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                autoComplete="new-password"
                            />
                            {createForm.errors.password && <p className="mt-1 text-xs text-rose-600">{createForm.errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Simpan & Buat Link
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Link Modal */}
            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title={`Perbarui Link #${editTarget?.short_slug}`}
                description="Ubah URL tujuan, judul, atau parameter kedaluwarsa link."
            >
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            URL Tujuan Baru
                        </label>
                        <input
                            type="url"
                            value={editForm.data.original_url}
                            onChange={(e) => editForm.setData('original_url', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Judul Link
                        </label>
                        <input
                            type="text"
                            value={editForm.data.title}
                            onChange={(e) => editForm.setData('title', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fitur Tambahan (Gratis)</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                    Batas Klik Maksimal
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editForm.data.max_clicks}
                                    onChange={(e) => editForm.setData('max_clicks', e.target.value)}
                                    placeholder="Contoh: 1000"
                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                />
                                {editForm.errors.max_clicks && <p className="mt-1 text-xs text-rose-600">{editForm.errors.max_clicks}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                    Tanggal Kedaluwarsa
                                </label>
                                <input
                                    type="date"
                                    value={editForm.data.expires_at}
                                    onChange={(e) => editForm.setData('expires_at', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                />
                                {editForm.errors.expires_at && <p className="mt-1 text-xs text-rose-600">{editForm.errors.expires_at}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Password Pengaman Link Baru
                            </label>
                            <input
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="Kosongkan jika tidak ingin mengubah password"
                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                                autoComplete="new-password"
                            />
                            {editForm.errors.password && <p className="mt-1 text-xs text-rose-600">{editForm.errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setEditTarget(null)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="Arsipkan Link Ini?"
                message={`Apakah kamu yakin ingin mengarsipkan link "${deleteTarget?.title}"? Link dapat dipulihkan kapan saja dari filter Arsip.`}
                confirmText="Arsipkan Link"
                variant="danger"
            />
        </>
    );
}

UserLinksPage.layout = (page: any) => <AppLayout children={page} />;
