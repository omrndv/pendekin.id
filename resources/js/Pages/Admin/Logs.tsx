import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import { AuditLog } from '@/types';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface AdminLogsProps {
    logs: PaginatedData<AuditLog>;
}

export default function AdminLogsPage({ logs }: AdminLogsProps) {
    const handlePageChange = (page: number) => {
        router.get('/admin/logs', { page }, { preserveState: true });
    };

    return (
        <>
            <Head title="System Audit Logs" />

            <PageHeader
                title="System Audit Logs"
                description="Rekapan aktivitas sensitif di seluruh sistem untuk audit keamanan dan transparansi operasional."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Audit Logs' }]}
            />

            <DataTable<AuditLog>
                data={logs.data || []}
                keyExtractor={(item) => item.id}
                currentPage={logs.meta?.current_page ?? 1}
                lastPage={logs.meta?.last_page ?? 1}
                totalData={logs.meta?.total ?? logs.data.length}
                perPage={logs.meta?.per_page ?? 20}
                onPageChange={handlePageChange}
                emptyTitle="Belum Ada Log Audit"
                emptyDescription="Aktivitas sistem akan otomatis terekam secara realtime di halaman ini."
                columns={[
                    {
                        header: 'Aksi Sistem',
                        cell: (item) => (
                            <div className="font-bold text-xs text-gray-900 font-mono">{item.action}</div>
                        ),
                    },
                    {
                        header: 'Aktor / Pengguna',
                        cell: (item) => (
                            <span className="font-semibold text-xs text-gray-800">{item.user?.name || 'System Auto'}</span>
                        ),
                    },
                    {
                        header: 'IP Address',
                        cell: (item) => (
                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                {item.ip_address || '127.0.0.1'}
                            </span>
                        ),
                    },
                    {
                        header: 'Target Model',
                        cell: (item) => (
                            <Badge variant="info">
                                {item.auditable_type?.split('\\').pop()} #{item.auditable_id}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Waktu Aktivitas',
                        cell: (item) => (
                            <span className="text-xs text-gray-500 font-medium">{item.created_at}</span>
                        ),
                    },
                ]}
            />
        </>
    );
}

AdminLogsPage.layout = (page: any) => <AppLayout children={page} />;
