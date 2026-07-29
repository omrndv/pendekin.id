import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import { Check, X } from 'lucide-react';

interface PermissionMatrixItem {
    permission: string;
    description: string;
    user: boolean;
    moderator: boolean;
    admin: boolean;
    superadmin: boolean;
}

const matrix: PermissionMatrixItem[] = [
    {
        permission: 'links.create',
        description: 'Membuat dan memperpendek URL baru',
        user: true,
        moderator: true,
        admin: true,
        superadmin: true,
    },
    {
        permission: 'links.custom_alias',
        description: 'Menggunakan custom alias & QR code',
        user: true,
        moderator: true,
        admin: true,
        superadmin: true,
    },
    {
        permission: 'links.moderate_global',
        description: 'Inspeksi & memblokir link milik pengguna lain',
        user: false,
        moderator: true,
        admin: true,
        superadmin: true,
    },
    {
        permission: 'users.manage',
        description: 'Membekukan user & mengubah role',
        user: false,
        moderator: false,
        admin: true,
        superadmin: true,
    },
    {
        permission: 'system.settings',
        description: 'Mengubah konfigurasi platform & maintenance',
        user: false,
        moderator: false,
        admin: true,
        superadmin: true,
    },
];

export default function AdminRolesPage() {
    return (
        <>
            <Head title="Role & RBAC Policy Matrix" />

            <PageHeader
                title="Role & RBAC Policy Matrix"
                description="Gambaran umum hak akses dan hierarki izin yang didukung oleh platform Pendekin."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Role & RBAC' }]}
            />

            <DataTable<PermissionMatrixItem>
                data={matrix}
                keyExtractor={(item) => item.permission}
                columns={[
                    {
                        header: 'Permission Code',
                        cell: (item) => (
                            <div>
                                <span className="font-mono text-xs font-bold text-gray-900">{item.permission}</span>
                                <div className="text-[11px] text-gray-500">{item.description}</div>
                            </div>
                        ),
                    },
                    {
                        header: 'User',
                        cell: (item) => (
                            item.user ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-gray-300" />
                        ),
                    },
                    {
                        header: 'Moderator',
                        cell: (item) => (
                            item.moderator ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-gray-300" />
                        ),
                    },
                    {
                        header: 'Admin',
                        cell: (item) => (
                            item.admin ? <Check size={16} className="text-amber-600" /> : <X size={16} className="text-gray-300" />
                        ),
                    },
                    {
                        header: 'Superadmin',
                        cell: (item) => (
                            item.superadmin ? <Check size={16} className="text-purple-600" /> : <X size={16} className="text-gray-300" />
                        ),
                    },
                ]}
            />
        </>
    );
}

AdminRolesPage.layout = (page: any) => <AppLayout children={page} />;
