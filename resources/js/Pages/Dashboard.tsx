import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import WelcomeCard from '@/Components/Dashboard/WelcomeCard';
import QuickShortenCard from '@/Components/Dashboard/QuickShortenCard';
import AnalyticsSummary from '@/Components/Dashboard/AnalyticsSummary';
import RecentLinks from '@/Components/Dashboard/RecentLinks';

export default function Dashboard() {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Overview</h2>
                <p className="text-text-secondary mt-1 font-medium">Pantau performa link kamu hari ini.</p>
            </div>
            <Head title="Dashboard" />

            <WelcomeCard />
            
            <AnalyticsSummary />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <QuickShortenCard />
                    <RecentLinks />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: any) => <AppLayout children={page} />;
