import { MousePointerClick, Link as LinkIcon, TrendingUp, Globe2 } from 'lucide-react';
import Card from '@/Components/Card';

export default function AnalyticsSummary() {
    const stats = [
        {
            title: 'Total Klik',
            value: '24.5k',
            change: '+12%',
            isPositive: true,
            icon: MousePointerClick,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            title: 'Total Link',
            value: '142',
            change: '+3',
            isPositive: true,
            icon: LinkIcon,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
        {
            title: 'CTR Rata-rata',
            value: '18.2%',
            change: '+2.4%',
            isPositive: true,
            icon: TrendingUp,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
        {
            title: 'Top Lokasi',
            value: 'Jakarta',
            change: '45% klik',
            isPositive: true,
            icon: Globe2,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <Card key={i} className="p-6 border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stat.change}
                        </div>
                    </div>
                    <div className="text-text-secondary font-medium mb-1">{stat.title}</div>
                    <div className="text-3xl font-extrabold text-text-primary tracking-tight">
                        {stat.value}
                    </div>
                </Card>
            ))}
        </div>
    );
}
