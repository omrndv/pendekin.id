import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import { PageProps } from '@/types';
import { Bell, CheckCircle2, AlertCircle, Info, CheckCheck, Trash2 } from 'lucide-react';

interface NotificationData {
    title?: string;
    message?: string;
    subject?: string;
    [key: string]: any;
}

interface NotificationItem {
    id: string;
    type: string;
    data: NotificationData;
    read_at?: string | null;
    created_at: string;
}

interface NotificationsPageProps {
    notifications: {
        data: NotificationItem[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        per_page?: number;
    };
}

export default function UserNotificationsPage({ notifications }: NotificationsPageProps) {
    const flash = usePage<PageProps>().props.flash;
    const items = notifications?.data || [];

    const handleMarkAllRead = () => {
        router.post('/dashboard/notifications/mark-read');
    };

    const handleMarkRead = (id: string) => {
        router.post(`/dashboard/notifications/${id}/read`);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Apakah kamu yakin ingin menghapus notifikasi ini?')) {
            router.delete(`/dashboard/notifications/${id}`);
        }
    };

    return (
        <>
            <Head title="Pusat Pemberitahuan" />

            <PageHeader
                title="Pusat Pemberitahuan"
                description="Pantau pesan sistem, pencapaian link, dan notifikasi penting akun kamu."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Notifications' }]}
                action={
                    items.length > 0 ? (
                        <button
                            onClick={handleMarkAllRead}
                            className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <CheckCheck size={15} />
                            <span>Tandai Semua Dibaca</span>
                        </button>
                    ) : null
                }
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <div className="bg-white border border-gray-200/80 rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                            <Bell size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 font-display mb-1">Belum Ada Notifikasi</h4>
                        <p className="text-xs text-gray-500">Notifikasi sistem, tagihan, dan milestone akun kamu akan tampil secara real-time di sini.</p>
                    </div>
                ) : (
                    items.map((item) => {
                        const isRead = !!item.read_at;
                        const title = item.data?.subject || item.data?.title || 'Pemberitahuan Sistem';
                        const message = item.data?.message || 'Ada pembaruan aktivitas pada akun kamu.';

                        return (
                            <div
                                key={item.id}
                                onClick={() => !isRead && handleMarkRead(item.id)}
                                className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                                    !isRead ? 'bg-emerald-50/30' : 'hover:bg-gray-50/50'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${!isRead ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <Bell size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className={`text-xs font-bold font-display ${!isRead ? 'text-gray-900' : 'text-gray-600'}`}>{title}</h4>
                                        <span className="text-[11px] text-gray-400 font-medium">{item.created_at?.split('T')[0]}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">{message}</p>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                                    title="Hapus notifikasi"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {items.length > 0 && notifications.last_page > 1 && (
                <div className="mt-6">
                    <Pagination 
                        currentPage={notifications.current_page}
                        lastPage={notifications.last_page}
                        total={notifications.total}
                        perPage={notifications.per_page || 15}
                        onPageChange={(page) => router.get(`/dashboard/notifications?page=${page}`)}
                    />
                </div>
            )}
        </>
    );
}

UserNotificationsPage.layout = (page: any) => <AppLayout children={page} />;
