import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { User, PageProps } from '@/types';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';
import Modal from '@/Components/UI/Modal';
import { Mail, Clock, ShieldCheck, Link2, Key, MousePointerClick, QrCode, MonitorSmartphone, Smartphone, Globe, RefreshCw, Sparkles } from 'lucide-react';
import Card from '@/Components/UI/Card';

interface UserDetailProps extends PageProps {
    targetUser: User & { 
        subscription?: any; 
        api_keys_count?: number; 
        qr_codes_count?: number; 
        deleted_at?: string;
        last_ip?: string;
        last_browser?: string;
        last_device?: string;
        last_activity_at?: string;
        google_id?: string;
        email_verified_at?: string;
    };
    stats: {
        total_clicks: number;
        total_revenue: number;
    };
    loginHistory: any[];
    activeSessions: any[];
    plans: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export default function AdminUserDetail({ targetUser, stats, loginHistory, activeSessions, plans }: UserDetailProps) {
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [customPassword, setCustomPassword] = useState('');

    const handleResetPassword = () => {
        if(confirm(`Kirim link email reset password ke ${targetUser.email}?`)) {
            router.post(`/admin/users/${targetUser.id}/reset-password`, { type: 'email' });
        }
    };

    const handleGenerateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let res = '';
        for (let i = 0; i < 12; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCustomPassword(res);
    };

    const handleForceResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/users/${targetUser.id}/reset-password`, { 
            type: 'force',
            password: customPassword 
        }, {
            onSuccess: () => {
                setPasswordModalOpen(false);
                setCustomPassword('');
            }
        });
    };

    return (
        <>
            <Head title={`User Detail - ${targetUser.name}`} />

            <PageHeader
                title={`Detail Pengguna`}
                description={`Analitik dan Manajemen untuk pengguna ${targetUser.name}`}
                breadcrumbs={[
                    { name: 'Admin Console', href: '/admin/dashboard' }, 
                    { name: 'Users', href: '/admin/users' },
                    { name: targetUser.name }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Identity & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 flex flex-col items-center text-center">
                        <Avatar name={targetUser.name} src={targetUser.avatar} size="xl" role={targetUser.role} />
                        <h2 className="mt-4 text-lg font-bold text-gray-900 font-display">{targetUser.name}</h2>
                        <div className="text-gray-500 text-sm mb-4 flex items-center gap-1 justify-center">
                            <Mail size={14} /> {targetUser.email}
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            <Badge variant={targetUser.role === 'admin' ? 'amber' : 'gray'} className="capitalize">
                                {targetUser.role}
                            </Badge>
                            <Badge variant={targetUser.deleted_at ? 'gray' : (targetUser.is_active ? 'emerald' : 'error')}>
                                {targetUser.deleted_at ? 'Deleted' : (targetUser.is_active ? 'Active' : 'Suspended')}
                            </Badge>
                            {targetUser.google_id ? (
                                <Badge variant="blue">Google OAuth</Badge>
                            ) : (
                                <Badge variant="gray">Email / Password</Badge>
                            )}
                            {targetUser.email_verified_at && (
                                <Badge variant="emerald">Verified</Badge>
                            )}
                        </div>

                        {!targetUser.deleted_at && (
                            <div className="w-full space-y-2 mt-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={handleResetPassword}
                                    className="w-full py-2 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Key size={14} />
                                    Kirim Link Reset Email
                                </button>
                                <button 
                                    onClick={() => {
                                        handleGenerateRandomPassword();
                                        setPasswordModalOpen(true);
                                    }}
                                    className="w-full py-2 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    Ubah Password Langsung (Force)
                                </button>
                            </div>
                        )}
                    </Card>

                    <Card title="Informasi Berlangganan" className="p-6">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Paket Aktif Saat Ini</div>
                                <div className="font-bold text-gray-900 mb-2">
                                    {targetUser.subscription?.plan?.name ?? 'Paket Gratis (Free Plan)'}
                                </div>
                                
                                {!targetUser.deleted_at && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Ganti Paket (Manual)</label>
                                        <select
                                            className="w-full text-xs border-gray-200 rounded-xl py-1.5 px-3 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            value={targetUser.subscription?.billing_plan_id ?? plans?.find(p => p.slug === 'free')?.id ?? ''}
                                            onChange={(e) => {
                                                const planId = e.target.value;
                                                if (confirm(`Ubah paket berlangganan ${targetUser.name}?`)) {
                                                    router.post(`/admin/users/${targetUser.id}/plan`, { plan_id: planId });
                                                }
                                            }}
                                        >
                                            {plans?.map((plan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name} {plan.slug === 'free' ? '(Gratis)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Total Transaksi Selesai</div>
                                <div className="font-bold text-emerald-600 text-lg">
                                    Rp {Number(stats.total_revenue).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Analytics & Info */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                                <Link2 size={20} className="text-indigo-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{targetUser.short_links_count ?? 0}</div>
                            <div className="text-xs text-gray-500 font-medium">Total Link Dibuat</div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                                <MousePointerClick size={20} className="text-emerald-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total_clicks}</div>
                            <div className="text-xs text-gray-500 font-medium">Total Link Diklik</div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                                <ShieldCheck size={20} className="text-amber-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{targetUser.api_keys_count ?? 0}</div>
                            <div className="text-xs text-gray-500 font-medium">Total API Key</div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
                                <QrCode size={20} className="text-rose-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{targetUser.qr_codes_count ?? 0}</div>
                            <div className="text-xs text-gray-500 font-medium">Total QR Code</div>
                        </div>
                    </div>

                    {/* Metadata & Tracking */}
                    <Card title="Metadata Akses & Aktivitas Terakhir" className="p-0">
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">Terakhir Aktif (Last Activity)</div>
                                <div className="text-sm font-semibold text-gray-900">{targetUser.last_activity_at ? new Date(targetUser.last_activity_at).toLocaleString('id-ID') : 'Belum pernah aktif'}</div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">Terakhir Login (IP Address)</div>
                                <div className="text-sm font-semibold text-gray-900">{targetUser.last_ip ?? '-'}</div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">Browser & Device Terakhir</div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="gray" className="capitalize">{targetUser.last_browser ?? 'Unknown'}</Badge>
                                    <Badge variant="gray" className="capitalize">{targetUser.last_device ?? 'Unknown'}</Badge>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">Tanggal Pendaftaran</div>
                                <div className="text-sm font-semibold text-gray-900">{new Date(targetUser.created_at).toLocaleString('id-ID')}</div>
                            </div>
                        </div>
                    </Card>

                    {/* Login History */}
                    <Card title="Riwayat Login Terbaru" className="p-0">
                        {loginHistory.length > 0 ? (
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Tanggal</th>
                                        <th className="px-6 py-3 font-semibold">IP Address</th>
                                        <th className="px-6 py-3 font-semibold">Perangkat & OS</th>
                                        <th className="px-6 py-3 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loginHistory.map((login) => (
                                        <tr key={login.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-900">{new Date(login.created_at).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-gray-600">{login.ip_address}</td>
                                            <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                                                {login.device === 'Mobile' ? <Smartphone size={14}/> : <MonitorSmartphone size={14}/>}
                                                {login.device} ({login.os}) - {login.browser}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge variant={login.is_success ? 'emerald' : 'error'}>
                                                    {login.is_success ? 'Success' : 'Failed'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-sm text-gray-400">
                                Belum ada riwayat login yang tercatat.
                            </div>
                        )}
                    </Card>

                </div>
            </div>

            {/* Force Reset Password Modal */}
            <Modal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                title={`Ubah Password Akun: ${targetUser.name}`}
                description="Masukkan kata sandi baru untuk pengguna atau gunakan tombol ACAK untuk membuat kata sandi acak yang aman."
            >
                <form onSubmit={handleForceResetSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Password Baru</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customPassword}
                                onChange={(e) => setCustomPassword(e.target.value)}
                                placeholder="Masukkan password baru..."
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleGenerateRandomPassword}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
                                title="Generate Password Acak"
                            >
                                <RefreshCw size={14} /> Acak
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                            Minimal 8 karakter. Kamu dapat menyalin password di atas dan memberikannya kepada pengguna.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setPasswordModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <Sparkles size={14} />
                            Simpan Password Baru
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

AdminUserDetail.layout = (page: any) => <AppLayout children={page} />;
