import { UserRole } from '@/types';

export interface NavItemConfig {
    name: string;
    href: string;
    icon: string;
    routeName: string;
    roles: UserRole[];
    badge?: string;
    isPro?: boolean;
}

export interface NavGroupConfig {
    groupName: string;
    items: NavItemConfig[];
}

export const userNavigationGroups: NavGroupConfig[] = [
    {
        groupName: 'Utama',
        items: [
            { name: 'Dashboard', href: '/dashboard', routeName: 'dashboard', icon: 'LayoutDashboard', roles: ['user', 'admin'] },
            { name: 'My Links', href: '/dashboard/links', routeName: 'dashboard.links', icon: 'Link2', roles: ['user', 'admin'] },
            { name: 'Analytics', href: '/dashboard/analytics', routeName: 'dashboard.analytics', icon: 'BarChart3', roles: ['user', 'admin'] },
            { name: 'QR Codes', href: '/dashboard/qr-codes', routeName: 'dashboard.qr-codes', icon: 'QrCode', roles: ['user', 'admin'] },
            { name: 'Notifications', href: '/dashboard/notifications', routeName: 'dashboard.notifications', icon: 'Bell', roles: ['user', 'admin'] },
        ],
    },
    {
        groupName: 'Pengaturan',
        items: [
            { name: 'Profil & Keamanan', href: '/profile', routeName: 'profile.edit', icon: 'Settings', roles: ['user', 'admin'] },
        ],
    },
    {
        groupName: 'Bantuan & Dukungan',
        items: [
            { name: 'Helpdesk & Ticket', href: '/dashboard/support', routeName: 'dashboard.support', icon: 'MessageSquareText', roles: ['user', 'admin'] },
        ],
    },
];

export const adminNavigationGroups: NavGroupConfig[] = [
    {
        groupName: 'Admin Hub',
        items: [
            { name: 'Overview Admin', href: '/admin/dashboard', routeName: 'admin.dashboard', icon: 'ShieldCheck', roles: ['admin'] },
            { name: 'User Management', href: '/admin/users', routeName: 'admin.users', icon: 'Users', roles: ['admin'] },
            { name: 'Link Management', href: '/admin/links', routeName: 'admin.links', icon: 'Globe', roles: ['admin'] },
            { name: 'Abuse Reports', href: '/admin/reports', routeName: 'admin.reports', icon: 'AlertTriangle', roles: ['admin'] },
            { name: 'Helpdesk Tickets', href: '/admin/tickets', routeName: 'admin.tickets', icon: 'MessageSquareText', roles: ['admin'] },
        ],
    },
    {
        groupName: 'Pemantauan Server',
        items: [
            { name: 'Global Analytics', href: '/admin/analytics', routeName: 'admin.analytics', icon: 'Activity', roles: ['admin'] },
            { name: 'API Monitoring', href: '/admin/api-monitoring', routeName: 'admin.api-monitoring', icon: 'Cpu', roles: ['admin'] },
            { name: 'System Logs', href: '/admin/logs', routeName: 'admin.logs', icon: 'FileText', roles: ['admin'] },
        ],
    },
    {
        groupName: 'Konfigurasi Platform',
        items: [
            { name: 'Platform Settings', href: '/admin/settings', routeName: 'admin.settings', icon: 'Sliders', roles: ['admin'] },
            { name: 'Role & RBAC', href: '/admin/roles', routeName: 'admin.roles', icon: 'UserCheck', roles: ['admin'] },
        ],
    },
];
