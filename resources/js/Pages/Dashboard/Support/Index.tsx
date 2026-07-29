import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import { PageProps } from '@/types';
import { Ticket, Plus, Eye, MessagesSquare } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface SupportIndexProps {
    tickets: PaginatedData<any>;
}

export default function SupportIndex({ tickets }: SupportIndexProps) {
    const flash = usePage<PageProps>().props.flash;

    return (
        <>
            <Head title="Pusat Bantuan (Helpdesk)" />

            <PageHeader
                title="Pusat Bantuan"
                description="Ajukan pertanyaan, laporan masalah, atau permintaan dukungan teknis kepada tim kami."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Support' }]}
            >
                <Link
                    href="/dashboard/support/create"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-colors"
                >
                    <Plus size={16} />
                    Buat Tiket Baru
                </Link>
            </PageHeader>

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <DataTable<any>
                data={tickets.data || []}
                keyExtractor={(item) => item.id}
                currentPage={tickets.meta?.current_page ?? 1}
                lastPage={tickets.meta?.last_page ?? 1}
                totalData={tickets.meta?.total ?? tickets.data.length}
                perPage={tickets.meta?.per_page ?? 10}
                emptyTitle="Belum Ada Tiket Bantuan"
                emptyDescription="Jika Anda mengalami kendala atau butuh bantuan, silakan buat tiket baru."
                columns={[
                    {
                        header: 'No. Tiket',
                        cell: (item) => (
                            <Link href={`/dashboard/support/${item.id}`} className="font-mono text-xs font-bold text-indigo-600 hover:underline">
                                {item.ticket_number}
                            </Link>
                        ),
                    },
                    {
                        header: 'Subjek',
                        cell: (item) => (
                            <div className="max-w-[200px] truncate text-sm font-semibold text-gray-900" title={item.subject}>
                                {item.subject}
                            </div>
                        ),
                    },
                    {
                        header: 'Kategori',
                        cell: (item) => (
                            <span className="text-xs text-gray-600 capitalize">{item.category}</span>
                        ),
                    },
                    {
                        header: 'Status',
                        cell: (item) => {
                            let variant: any = 'gray';
                            let text = item.status;
                            if (item.status === 'open') { variant = 'emerald'; text = 'Menunggu Balasan Admin'; }
                            if (item.status === 'waiting_user') { variant = 'amber'; text = 'Menunggu Balasan Anda'; }
                            if (item.status === 'waiting_admin') { variant = 'blue'; text = 'Menunggu Balasan Admin'; }
                            if (item.status === 'resolved' || item.status === 'closed') { variant = 'gray'; text = 'Selesai'; }
                            
                            return <Badge variant={variant}>{text}</Badge>;
                        },
                    },
                    {
                        header: 'Update Terakhir',
                        cell: (item) => (
                            <span className="text-xs text-gray-500 font-medium">
                                {new Date(item.updated_at).toLocaleDateString('id-ID')}
                            </span>
                        ),
                    },
                    {
                        header: 'Aksi',
                        cell: (item) => (
                            <Link
                                href={`/dashboard/support/${item.id}`}
                                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                title="Lihat Detail Tiket"
                            >
                                <Eye size={18} />
                            </Link>
                        ),
                    },
                ]}
            />
        </>
    );
}

SupportIndex.layout = (page: any) => <AppLayout children={page} />;
