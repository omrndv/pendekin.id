import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import { CreditCard, DollarSign, Users, TrendingUp, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AdminBillingProps {
    metrics: {
        total_revenue: number;
        active_subscribers: number;
        mrr: number;
        arr: number;
    };
    transactions: {
        data: Array<{
            id: number;
            invoice_number: string;
            user?: { name: string; email: string };
            gross_amount: number;
            status: string;
            created_at: string;
        }>;
    };
    subscriptions: Array<{
        id: number;
        user?: { name: string; email: string };
        plan_name: string;
        status: string;
        cycle: string;
        starts_at: string;
        ends_at: string;
        is_corrupt: boolean;
    }>;
}

export default function AdminBillingPage({ metrics, transactions, subscriptions }: AdminBillingProps) {
    const handleManualActivate = (id: number) => {
        if (confirm('Aktifkan subscription ini secara manual?')) {
            router.patch(`/admin/billing/subscriptions/${id}/activate`);
        }
    };

    const handlePurgeCorrupt = (id: number) => {
        if (confirm('Reset subscription corrupt ini menjadi Expired?')) {
            router.patch(`/admin/billing/subscriptions/${id}/purge`);
        }
    };

    return (
        <>
            <Head title="SaaS Revenue & Billing Console" />

            <PageHeader
                title="SaaS Revenue & Billing Console"
                description="Pantau pendapatan bulanan (MRR), tahunan (ARR), transaksi global, dan identifikasi anomaly/corrupt data."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Billing' }]}
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Pendapatan"
                    value={`Rp ${Number(metrics.total_revenue).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`}
                    change="Akumulasi"
                    isPositive={true}
                    icon={DollarSign}
                    subtitle="Pendapatan bersih platform"
                    variant="emerald"
                />
                <StatCard
                    title="Monthly Recurring (MRR)"
                    value={`Rp ${Number(metrics.mrr).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`}
                    change="30 Hari"
                    isPositive={true}
                    icon={TrendingUp}
                    subtitle="Pendapatan berulang bulanan"
                    variant="blue"
                />
                <StatCard
                    title="Annual Recurring (ARR)"
                    value={`Rp ${Number(metrics.arr).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`}
                    change="Proyeksi"
                    isPositive={true}
                    icon={CreditCard}
                    subtitle="Proyeksi pendapatan tahunan"
                    variant="purple"
                />
                <StatCard
                    title="Pelanggan Aktif"
                    value={metrics.active_subscribers}
                    change="Subscribers"
                    isPositive={true}
                    icon={Users}
                    subtitle="Pengguna berbayar aktif"
                    variant="amber"
                />
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-gray-900 font-display mb-4">Subscription Monitor & Integrity Check</h3>
                <DataTable<any>
                    data={subscriptions || []}
                    keyExtractor={(item) => item.id}
                    columns={[
                        {
                            header: 'Pengguna',
                            cell: (item) => (
                                <div>
                                    <div className="font-bold text-xs text-gray-900">{item.user?.name || 'User'}</div>
                                    <div className="text-[11px] text-gray-400">{item.user?.email}</div>
                                </div>
                            ),
                        },
                        {
                            header: 'Paket',
                            cell: (item) => (
                                <span className="text-xs font-bold text-gray-800">{item.plan_name}</span>
                            ),
                        },
                        {
                            header: 'Status Integrity',
                            cell: (item) => (
                                <div className="flex flex-col gap-1">
                                    <Badge variant={item.status === 'active' ? 'emerald' : 'warning'}>
                                        {item.status}
                                    </Badge>
                                    {item.is_corrupt && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                                            <AlertTriangle size={12} />
                                            <span>Active without payment!</span>
                                        </span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: 'Masa Berlaku',
                            cell: (item) => (
                                <span className="text-xs text-gray-500">{item.ends_at?.split('T')[0] || '-'}</span>
                            ),
                        },
                        {
                            header: 'Aksi Admin',
                            cell: (item) => (
                                <div className="flex items-center gap-2">
                                    {item.is_corrupt ? (
                                        <button
                                            onClick={() => handlePurgeCorrupt(item.id)}
                                            className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <ShieldAlert size={13} />
                                            <span>Reset Expired</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleManualActivate(item.id)}
                                            className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <CheckCircle size={13} />
                                            <span>Aktifkan Manual</span>
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
}

AdminBillingPage.layout = (page: any) => <AppLayout children={page} />;
