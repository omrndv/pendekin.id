import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import SearchInput from '@/Components/UI/SearchInput';
import FilterDropdown from '@/Components/UI/FilterDropdown';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Modal from '@/Components/UI/Modal';
import { User, UserRole, PageProps } from '@/types';
import { UserX, UserCheck, Edit3, Trash2, RotateCcw, Eye, Key } from 'lucide-react';
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

interface AdminUsersProps {
    users: PaginatedData<User>;
    filters: {
        search: string;
        role: string;
        status: string;
    };
}

export default function AdminUsersPage({ users, filters }: AdminUsersProps) {
    const flash = usePage<PageProps>().props.flash;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
    const [roleEditTarget, setRoleEditTarget] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('user');
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [restoreTarget, setRestoreTarget] = useState<User | null>(null);
    const [forceDeleteTarget, setForceDeleteTarget] = useState<User | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get('/admin/users', { search: val, role: roleFilter, status: statusFilter }, { preserveState: true, replace: true });
    };

    const handleRoleFilter = (val: string) => {
        setRoleFilter(val);
        router.get('/admin/users', { search, role: val, status: statusFilter }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val: string) => {
        setStatusFilter(val);
        router.get('/admin/users', { search, role: roleFilter, status: val }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/users', { search, role: roleFilter, status: statusFilter, page }, { preserveState: true });
    };

    const handleToggleStatus = () => {
        if (!suspendTarget) return;
        const endpoint = suspendTarget.is_active ? 'suspend' : 'activate';
        router.patch(`/admin/users/${suspendTarget.id}/${endpoint}`, {}, {
            onSuccess: () => setSuspendTarget(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/users/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleRestoreUser = () => {
        if (!restoreTarget) return;
        router.post(`/admin/users/${restoreTarget.id}/restore`, {}, {
            onSuccess: () => setRestoreTarget(null),
        });
    };

    const handleForceDelete = () => {
        if (!forceDeleteTarget) return;
        router.delete(`/admin/users/${forceDeleteTarget.id}/force`, {
            onSuccess: () => setForceDeleteTarget(null),
        });
    };

    const handleSaveRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleEditTarget) return;
        router.patch(`/admin/users/${roleEditTarget.id}/role`, { role: selectedRole }, {
            onSuccess: () => setRoleEditTarget(null),
        });
    };

    return (
        <>
            <Head title="User Management" />

            <PageHeader
                title="User Management"
                description="Kelola daftar pengguna terdaftar, atur hak akses (role), dan lakukan tindakan moderasi akun."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Users' }]}
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
                    placeholder="Cari nama atau email user..."
                    className="w-full sm:w-80"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <FilterDropdown
                        options={[
                            { label: 'Semua Role', value: '' },
                            { label: 'Admin', value: 'admin' },
                            { label: 'User', value: 'user' },
                        ]}
                        selected={roleFilter}
                        onChange={handleRoleFilter}
                    />

                    <FilterDropdown
                        options={[
                            { label: 'Semua Status', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Suspended', value: 'suspended' },
                            { label: 'Deleted', value: 'deleted' },
                        ]}
                        selected={statusFilter}
                        onChange={handleStatusFilter}
                    />
                </div>
            </div>

            <DataTable<User>
                data={users.data}
                keyExtractor={(item) => item.id}
                currentPage={users.meta?.current_page ?? 1}
                lastPage={users.meta?.last_page ?? 1}
                totalData={users.meta?.total ?? users.data.length}
                perPage={users.meta?.per_page ?? 15}
                onPageChange={handlePageChange}
                columns={[
                    {
                        header: 'Pengguna',
                        cell: (item) => (
                            <div className="flex items-center gap-3">
                                <Avatar name={item.name} src={item.avatar} size="md" role={item.role} />
                                <div>
                                    <Link href={`/admin/users/${item.id}`} className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline text-xs font-display">{item.name}</Link>
                                    <div className="text-[11px] text-gray-400">{item.email}</div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Role',
                        cell: (item) => (
                            <Badge variant={item.role === 'admin' ? 'amber' : 'gray'} className="capitalize">
                                {item.role}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Total Link',
                        cell: (item) => (
                            <span className="font-bold text-xs text-gray-900">{item.short_links_count ?? 0}</span>
                        ),
                    },
                    {
                        header: 'Status Akun',
                        cell: (item) => (
                            <Badge variant={item.deleted_at ? 'gray' : (item.is_active ? 'emerald' : 'error')}>
                                {item.deleted_at ? 'Deleted' : (item.is_active ? 'Active' : 'Suspended')}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Tanggal Terdaftar',
                        cell: (item) => (
                            <span className="text-xs text-gray-500 font-medium">{item.created_at?.split('T')[0]}</span>
                        ),
                    },
                    {
                        header: 'Aksi Moderasi',
                        cell: (item) => (
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/admin/users/${item.id}`}
                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                    title="View Detail"
                                >
                                    <Eye size={15} />
                                </Link>
                                {!item.deleted_at ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setRoleEditTarget(item);
                                                setSelectedRole(item.role);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                                            title="Ubah Role"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            onClick={() => setSuspendTarget(item)}
                                            className={`p-1.5 rounded-xl transition-colors ${
                                                item.is_active
                                                    ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                                    : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                            }`}
                                            title={item.is_active ? 'Suspend User' : 'Aktifkan User'}
                                        >
                                            {item.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Hapus Akun"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setRestoreTarget(item)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            title="Pulihkan Akun"
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

            {/* Suspend Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!suspendTarget}
                onClose={() => setSuspendTarget(null)}
                onConfirm={handleToggleStatus}
                title={suspendTarget?.is_active ? 'Bekukan Akun User ini?' : 'Aktifkan Kembali Akun?'}
                message={
                    suspendTarget?.is_active
                        ? `Apakah kamu yakin ingin membekukan akun ${suspendTarget?.name}? User ini tidak akan bisa login ke platform.`
                        : `Apakah kamu yakin ingin mengaktifkan kembali akun ${suspendTarget?.name}?`
                }
                confirmText={suspendTarget?.is_active ? 'Bekukan (Suspend)' : 'Aktifkan'}
                variant={suspendTarget?.is_active ? 'danger' : 'emerald'}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Hapus Akun Pengguna?"
                message={`Apakah Anda yakin ingin menghapus akun ${deleteTarget?.name}? Akun akan di-soft-delete dan dapat dipulihkan nanti.`}
                confirmText="Hapus Akun"
                variant="danger"
            />

            {/* Restore Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!restoreTarget}
                onClose={() => setRestoreTarget(null)}
                onConfirm={handleRestoreUser}
                title="Pulihkan Pengguna?"
                message={`Apakah kamu yakin ingin memulihkan akun ${restoreTarget?.name}? User akan dapat kembali mengakses layanannya.`}
                confirmText="Ya, Pulihkan Akun"
                variant="warning"
            />

            {/* Force Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!forceDeleteTarget}
                onClose={() => setForceDeleteTarget(null)}
                onConfirm={handleForceDelete}
                title="Hapus Permanen Pengguna?"
                message={`PERINGATAN: Apakah kamu yakin ingin menghapus PERMANEN akun ${forceDeleteTarget?.name}? Seluruh data link, analitik, dan riwayat akan hilang selamanya dan tidak dapat dikembalikan!`}
                confirmText="Ya, Hapus Permanen"
                variant="danger"
            />

            {/* Change Role Modal */}
            <Modal
                isOpen={!!roleEditTarget}
                onClose={() => setRoleEditTarget(null)}
                title={`Ubah Role Hak Akses: ${roleEditTarget?.name}`}
                description="Pilih hak akses baru untuk pengguna ini."
            >
                <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Pilihan Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        >
                            <option value="user">User (Standard Access)</option>
                            <option value="admin">Admin (Full System Access)</option>
                            <option value="moderator">Moderator (Content Moderation)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setRoleEditTarget(null)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                        >
                            Simpan Perubahan Role
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

AdminUsersPage.layout = (page: any) => <AppLayout children={page} />;
