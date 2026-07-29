import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Badge from '@/Components/UI/Badge';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';

export default function AdminApiMonitoringPage() {
    return (
        <>
            <Head title="API Monitoring" />

            <PageHeader
                title="API Health & Rate Limiting"
                description="Pemantauan pemanggilan REST API oleh client, kuota rate-limit 60 req/min, dan error rate 4xx/5xx."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'API Monitoring' }]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="API Requests (24 Jam)"
                    value="184,920"
                    change="+5.4%"
                    isPositive={true}
                    icon={Cpu}
                    subtitle="Rata-rata 128 ms response"
                    variant="emerald"
                />
                <StatCard
                    title="Error Rate (4xx/5xx)"
                    value="0.04%"
                    change="-0.01%"
                    isPositive={true}
                    icon={ShieldCheck}
                    subtitle="Sangat sehat & stabil"
                    variant="purple"
                />
                <StatCard
                    title="Active API Keys"
                    value="342"
                    change="+12"
                    isPositive={true}
                    icon={Activity}
                    subtitle="Client aktif terdaftar"
                    variant="blue"
                />
            </div>
        </>
    );
}

AdminApiMonitoringPage.layout = (page: any) => <AppLayout children={page} />;
