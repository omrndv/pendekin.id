import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Badge from '@/Components/UI/Badge';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';

export default function AdminAnalyticsPage() {
    return (
        <>
            <Head title="Platform Global Analytics" />

            <PageHeader
                title="Global Platform Analytics"
                description="Statistik akumulasi lalu lintas jaringan, throughput request, dan beban server seluruh pengguna."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Analytics' }]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Total Traffic Bandwidth"
                    value="1.42 TB"
                    change="+14.2%"
                    isPositive={true}
                    icon={Activity}
                    subtitle="Bulan ini"
                    variant="emerald"
                />
                <StatCard
                    title="Peak Requests / Sec"
                    value="1,240 RPS"
                    change="Stable"
                    isPositive={true}
                    icon={Zap}
                    subtitle="Beban tertinggi pukul 14:00"
                    variant="blue"
                />
                <StatCard
                    title="Storage Usage"
                    value="14.8 GB"
                    change="22%"
                    isPositive={true}
                    icon={HardDrive}
                    subtitle="Database & Redis Key Cache"
                    variant="purple"
                />
            </div>
        </>
    );
}

AdminAnalyticsPage.layout = (page: any) => <AppLayout children={page} />;
