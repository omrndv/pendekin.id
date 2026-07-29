import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import FilterDropdown from '@/Components/UI/FilterDropdown';
import { PageProps } from '@/types';
import { Eye, Clock, MessageSquare, AlertTriangle } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface AdminTicketsProps {
    tickets: PaginatedData<any>;
    filters: {
        status: string;
    };
}

export default function AdminTicketsIndex({ tickets, filters }: AdminTicketsProps) {
    const flash = usePage<PageProps>().props.flash;
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handlePageChange = (page: number) => {
        router.get('/admin/tickets', { status: statusFilter, page }, { preserveState: true });
    };

    const handleFilterStatus = (val: string) => {
        setStatusFilter(val);
        router.get('/admin/tickets', { status: val, page: 1 }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Manajemen Tiket Helpdesk" />

            <PageHeader
                title="Helpdesk & Support"
                description="Kelola seluruh tiket bantuan dari pengguna. Pastikan seluruh tiket ditangani dengan cepat sesuai SLA."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Tickets' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <div className="flex justify-end mb-4">
                <FilterDropdown
                    options={[
                        { label: 'Semua Status Tiket', value: '' },
                        { label: 'Open (Baru)', value: 'open' },
                        { label: 'Waiting Admin (Butuh Respon)', value: 'waiting_admin' },
                        { label: 'Waiting User', value: 'waiting_user' },
                        { label: 'Resolved (Selesai)', value: 'resolved' },
                    ]}
                    selected={statusFilter}
                    onChange={handleFilterStatus}
                />
            </div>

            <DataTable<any>
                data={tickets.data || []}
                keyExtractor={(item) => item.id}
                currentPage={tickets.meta?.current_page ?? 1}
                lastPage={tickets.meta?.last_page ?? 1}
                totalData={tickets.meta?.total ?? tickets.data.length}
                perPage={tickets.meta?.per_page ?? 15}
                onPageChange={handlePageChange}
                emptyTitle="Tidak Ada Tiket"
                emptyDescription="Antrean bantuan saat ini bersih."
                columns={[
                    {
                        header: 'No. Tiket',
                        cell: (item) => (
                            <Link href={`/admin/tickets/${item.id}`} className="font-mono text-xs font-bold text-indigo-600 hover:underline">
                                {item.ticket_number}
                            </Link>
                        ),
                    },
                    {
                        header: 'Subjek & Kategori',
                        cell: (item) => (
                            <div>
                                <div className="max-w-[200px] truncate text-sm font-semibold text-gray-900 mb-1" title={item.subject}>
                                    {item.subject}
                                </div>
                                <span className="text-[11px] text-gray-500 font-bold uppercase">{item.category}</span>
                            </div>
                        ),
                    },
                    {
                        header: 'Pengguna',
                        cell: (item) => (
                            <div>
                                <Link href={`/admin/users/${item.user_id}`} className="text-xs font-bold text-emerald-600 hover:underline">
                                    {item.user?.name}
                                </Link>
                                <div className="text-[11px] text-gray-400">{item.user?.email}</div>
                            </div>
                        ),
                    },
                    {
                        header: 'Prioritas',
                        cell: (item) => (
                            <Badge variant={
                                item.priority === 'critical' ? 'error' :
                                item.priority === 'high' ? 'warning' : 'gray'
                            } className="uppercase">
                                {item.priority}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Status',
                        cell: (item) => (
                            <Badge variant={
                                item.status === 'open' ? 'emerald' :
                                item.status === 'waiting_user' ? 'amber' :
                                item.status === 'waiting_admin' ? 'blue' : 'gray'
                            } className="uppercase">
                                {item.status.replace('_', ' ')}
                            </Badge>
                        ),
                    },
                    {
                        header: 'Aksi',
                        cell: (item) => (
                            <Link
                                href={`/admin/tickets/${item.id}`}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-colors"
                            >
                                <MessageSquare size={14} className="mr-1.5" /> Jawab
                            </Link>
                        ),
                    },
                ]}
            />
        </>
    );
}

AdminTicketsIndex.layout = (page: any) => <AppLayout children={page} />;
