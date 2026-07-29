import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Badge from '@/Components/UI/Badge';
import { BarChart3, Globe, Smartphone } from 'lucide-react';

interface AnalyticsProps {
    summary: {
        total_clicks: number;
        clicks_30_days: number;
        top_country: string;
        top_device: string;
    };
    clickTrends: Array<{
        date: string;
        day: string;
        clicks: number;
    }>;
    countries: Array<{
        country: string;
        count: number;
        percentage: number;
    }>;
    devices: Array<{
        name: string;
        count: number;
        percentage: number;
    }>;
}

export default function UserAnalyticsPage({ summary, clickTrends, countries, devices }: AnalyticsProps) {
    return (
        <>
            <Head title="Analytics" />

            <PageHeader
                title="Laporan Analytics & Traffic"
                description="Analisis mendalam mengenai asal-usul pengunjung, perangkat yang digunakan, dan waktu puncak klik."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Analytics' }]}
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Total Klik (30 Hari)"
                    value={summary.clicks_30_days.toLocaleString()}
                    change="Realtime"
                    isPositive={true}
                    icon={BarChart3}
                    subtitle={`Total klik seluruh waktu: ${summary.total_clicks.toLocaleString()}`}
                    variant="emerald"
                />
                <StatCard
                    title="Negara Teratas"
                    value={summary.top_country || '-'}
                    change="Dominan"
                    isPositive={true}
                    icon={Globe}
                    subtitle="Lokasi lalu lintas utama"
                    variant="blue"
                />
                <StatCard
                    title="Perangkat Dominan"
                    value={summary.top_device || '-'}
                    change="Tinggi"
                    isPositive={true}
                    icon={Smartphone}
                    subtitle="Platform pengunjung utama"
                    variant="purple"
                />
            </div>

            {/* Geo & Devices Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Countries Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 font-display mb-4 flex items-center justify-between">
                        <span>Lokasi Pengunjung Teratas</span>
                        <Badge variant="emerald">Negara</Badge>
                    </h3>

                    {countries.length === 0 ? (
                        <p className="text-xs text-gray-400 py-6 text-center font-medium">Belum ada data lokasi pengunjung.</p>
                    ) : (
                        <div className="space-y-4">
                            {countries.map((item, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-gray-900">{item.country}</span>
                                        <span className="text-gray-500">{item.count.toLocaleString()} klik ({item.percentage}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Devices & Browsers */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 font-display mb-4 flex items-center justify-between">
                        <span>Perangkat & Browser</span>
                        <Badge variant="info">Device</Badge>
                    </h3>

                    {devices.length === 0 ? (
                        <p className="text-xs text-gray-400 py-6 text-center font-medium">Belum ada data perangkat pengunjung.</p>
                    ) : (
                        <div className="space-y-4">
                            {devices.map((item, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-gray-900">{item.name}</span>
                                        <span className="text-gray-500">{item.count.toLocaleString()} klik ({item.percentage}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

UserAnalyticsPage.layout = (page: any) => <AppLayout children={page} />;
