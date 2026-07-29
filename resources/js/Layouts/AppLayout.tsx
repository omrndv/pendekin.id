import { useState, ReactNode, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Link as LinkIcon, 
    LayoutDashboard, 
    Link2, 
    BarChart3, 
    QrCode,
    KeyRound,
    CreditCard,
    Bell,
    Settings, 
    ShieldCheck,
    Users,
    Globe,
    AlertTriangle,
    Activity,
    Cpu,
    FileText,
    Sliders,
    UserCheck,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
    ChevronRight,
    MessageSquareText,
    LucideIcon
} from 'lucide-react';
import { PageProps } from '@/types';
import { userNavigationGroups, adminNavigationGroups, NavItemConfig } from '@/Config/navigation';
import Avatar from '@/Components/UI/Avatar';
import Badge from '@/Components/UI/Badge';

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Link2,
    BarChart3,
    QrCode,
    KeyRound,
    CreditCard,
    Bell,
    Settings,
    ShieldCheck,
    Users,
    Globe,
    AlertTriangle,
    Activity,
    Cpu,
    FileText,
    Sliders,
    UserCheck,
    MessageSquareText,
};

interface AppLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

export default function AppLayout({ header, children }: AppLayoutProps) {
    const user = usePage<PageProps>().props.auth.user;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const unreadCount = usePage<PageProps>().props.auth.unread_notifications_count || 0;
    const pendingReportsCount = usePage<PageProps>().props.auth.pending_reports_count || 0;
    const openTicketsCount = usePage<PageProps>().props.auth.open_tickets_count || 0;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const isAdmin = user?.role === 'admin';
    const isUserPro = isAdmin || (user as any)?.subscription?.plan?.slug === 'pro' || (user as any)?.subscription?.status === 'active';

    const renderNavItem = (item: NavItemConfig & { isPro?: boolean }) => {
        const IconComponent = iconMap[item.icon] || Link2;
        const isActive = currentUrl === item.href || (item.href !== '/dashboard' && currentUrl.startsWith(item.href));
        const isLocked = item.isPro && !isUserPro;

        if (isLocked) {
            return (
                <div
                    key={item.name}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 bg-gray-50/40 border border-gray-100 cursor-not-allowed opacity-60 select-none"
                    title="Fitur Pro - Upgrade akun untuk mengaktifkan"
                >
                    <div className="flex items-center gap-2.5">
                        <IconComponent size={17} className="text-gray-300" />
                        <span>{item.name}</span>
                    </div>
                    <Badge variant="gray" className="text-[10px] py-0 px-1.5 font-bold">
                        PRO 🔒
                    </Badge>
                </div>
            );
        }

        return (
            <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm font-bold'
                        : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 border border-transparent'
                }`}
            >
                <div className="flex items-center gap-2.5">
                    <IconComponent size={17} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                    <span>{item.name}</span>
                </div>

                {(item.badge || (item.routeName === 'admin.reports' && pendingReportsCount > 0) || (item.routeName === 'admin.tickets' && openTicketsCount > 0)) && (
                    <Badge variant={item.routeName.startsWith('admin') ? 'amber' : 'emerald'} className="text-[10px] py-0 px-1.5 font-bold">
                        {item.routeName === 'admin.reports' && pendingReportsCount > 0 
                            ? pendingReportsCount 
                            : item.routeName === 'admin.tickets' && openTicketsCount > 0
                                ? openTicketsCount
                                : item.badge}
                    </Badge>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans flex selection:bg-emerald-500/20 selection:text-emerald-700">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 bottom-0 z-50 w-[270px] bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 group">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md group-hover:scale-105 transition-transform">
                            <LinkIcon size={18} />
                        </span>
                        <span className="font-display">Pendekin</span>
                    </Link>
                    <button 
                        className="lg:hidden text-gray-400 hover:text-gray-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
                    {/* User Navigation Groups */}
                    {userNavigationGroups.map((group) => (
                        <div key={group.groupName}>
                            <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-sans">
                                {group.groupName}
                            </div>
                            <div className="space-y-1">
                                {group.items.map(renderNavItem)}
                            </div>
                        </div>
                    ))}

                    {/* Admin Navigation Groups (Conditional on Admin Role) */}
                    {isAdmin && adminNavigationGroups.map((group) => (
                        <div key={group.groupName} className="pt-2 border-t border-gray-100">
                            <div className="px-3 mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 font-sans">
                                    {group.groupName}
                                </span>
                                <Badge variant="amber" className="text-[9px]">Admin</Badge>
                            </div>
                            <div className="space-y-1">
                                {group.items.map(renderNavItem)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer User Info */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={user.name} src={user.avatar} size="sm" role={user.role} />
                            <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-900 truncate font-display">{user.name}</div>
                                <div className="text-[10px] text-gray-500 capitalize">{user.role} Account</div>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px] transition-all">
                {/* Topbar */}
                <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button 
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Role Indicator Badge */}
                        <Badge variant={isAdmin ? 'amber' : 'emerald'} className="hidden sm:inline-flex capitalize">
                            {isAdmin ? 'Shield Mode (Admin)' : 'User Workspace'}
                        </Badge>

                        {/* Notifications Popover Trigger */}
                        <Link href="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100">
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                            )}
                        </Link>

                        <div className="h-5 w-px bg-gray-200" />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Avatar name={user.name} src={user.avatar} size="sm" role={user.role} />
                                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                            </button>

                            {userDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200/90 rounded-2xl shadow-xl py-2 z-50 animate-scale-up">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <div className="text-xs font-bold text-gray-900 font-display">{user.name}</div>
                                            <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                                        </div>

                                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                                            <Settings size={14} className="text-gray-400" />
                                            <span>Pengaturan Akun</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50">
                                                <ShieldCheck size={14} className="text-amber-600" />
                                                <span>Admin Console</span>
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-100 my-1" />

                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                        >
                                            <LogOut size={14} />
                                            <span>Keluar</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
                    {header && (
                        <div className="mb-6">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
