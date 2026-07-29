import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import DataTable from '@/Components/UI/DataTable';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';
import { User, ShortLink } from '@/types';
import { Users, Link2, MousePointerClick, ShieldAlert, ArrowRight, DollarSign, Ticket as TicketIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_links: number;
        total_clicks: number;
        pending_reports: number;
        open_tickets: number;
        monthly_revenue: number;
    };
    recentUsers: User[];
    recentLinks: ShortLink[];
    charts: {
        labels: string[];
        registrations: number[];
        revenue: number[];
        clicks: number[];
    };
}

export default function AdminDashboardPage({ stats, recentUsers, recentLinks, charts }: AdminDashboardProps) {
    return (
        <>
            <Head title="Admin Dashboard Hub" />

            <PageHeader
                title="Admin Control Center"
                description="Pusat kontrol ekosistem Pendekin: kelola seluruh pengguna, link, laporan penyalahgunaan, dan kesehatan sistem."
                breadcrumbs={[{ name: 'Admin Console' }]}
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6 mb-8">
                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={`Rp ${Number(stats.monthly_revenue).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`}
                    change="Bulan Ini"
                    isPositive={true}
                    icon={DollarSign}
                    variant="emerald"
                    href="/admin/billing"
                />
                <StatCard
                    title="Total Pengguna"
                    value={stats.total_users.toLocaleString()}
                    change="Terdaftar"
                    isPositive={true}
                    icon={Users}
                    variant="blue"
                    href="/admin/users"
                />
                <StatCard
                    title="Total Link"
                    value={stats.total_links.toLocaleString()}
                    change="Global"
                    isPositive={true}
                    icon={Link2}
                    variant="indigo"
                    href="/admin/links"
                />
                <StatCard
                    title="Total Klik"
                    value={stats.total_clicks.toLocaleString()}
                    change="Global"
                    isPositive={true}
                    icon={MousePointerClick}
                    variant="purple"
                    href="/admin/analytics"
                />
                <StatCard
                    title="Open Tickets"
                    value={stats.open_tickets}
                    change="Butuh Aksi"
                    isPositive={stats.open_tickets === 0}
                    icon={TicketIcon}
                    variant="amber"
                    href="/admin/tickets"
                />
                <StatCard
                    title="Abuse Reports"
                    value={stats.pending_reports}
                    change="Butuh Moderasi"
                    isPositive={stats.pending_reports === 0}
                    icon={ShieldAlert}
                    variant="error"
                    href="/admin/reports"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 font-display mb-6">Revenue 30 Hari Terakhir</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.labels.map((label, index) => ({ name: label, value: charts.revenue[index] }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} minTickGap={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(val) => `Rp ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`} />
                                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`, 'Revenue']}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Users & Clicks Charts */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Registrations Chart */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col h-[200px]">
                        <h3 className="text-sm font-bold text-gray-900 font-display mb-4">Pendaftaran User (30 Hari)</h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.labels.map((label, index) => ({ name: label, value: charts.registrations[index] }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: any) => [value, 'Users']}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Clicks Chart */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col h-[200px]">
                        <h3 className="text-sm font-bold text-gray-900 font-display mb-4">Lalu Lintas Klik (30 Hari)</h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.labels.map((label, index) => ({ name: label, value: charts.clicks[index] }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: any) => [value, 'Clicks']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Users Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 font-display">Pengguna Baru</h3>
                        <Link href="/admin/users" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            <span>Kelola Users</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {(recentUsers || []).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} src={user.avatar} size="sm" role={user.role} />
                                    <div>
                                        <div className="font-bold text-gray-900 text-xs">{user.name}</div>
                                        <div className="text-[11px] text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <Badge variant={user.role === 'admin' ? 'amber' : 'gray'} className="capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Links Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 font-display">Link Terbaru Dibuat</h3>
                        <Link href="/admin/links" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            <span>Moderasi Links</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {(recentLinks || []).map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                                <div>
                                    <div className="font-mono text-xs font-bold text-emerald-600">/{link.short_slug}</div>
                                    <div className="text-[11px] text-gray-400 truncate max-w-xs">{link.original_url}</div>
                                </div>
                                <Badge variant={link.is_flagged ? 'error' : link.is_active ? 'emerald' : 'gray'}>
                                    {link.is_flagged ? 'Flagged' : link.is_active ? 'Active' : 'Disabled'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboardPage.layout = (page: any) => <AppLayout children={page} />;
