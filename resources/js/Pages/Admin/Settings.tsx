import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import { PageProps } from '@/types';
import { Sliders, Save, Check, ShieldAlert, Zap, RefreshCw, KeyRound } from 'lucide-react';

interface SettingsProps extends PageProps {
    settings: {
        allow_registration: boolean;
        maintenance_mode: boolean;
        maintenance_secret_code: string;
        free_link_limit: number;
    };
}

export default function AdminSettingsPage({ settings }: SettingsProps) {
    const flash = usePage<PageProps>().props.flash;
    const { data, setData, post, processing } = useForm({
        allow_registration: settings?.allow_registration ?? true,
        maintenance_mode: settings?.maintenance_mode ?? false,
        maintenance_secret_code: settings?.maintenance_secret_code ?? 'admin-ganteng',
        free_link_limit: settings?.free_link_limit ?? 50,
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <>
            <Head title="Platform Settings" />

            <PageHeader
                title="Platform Settings & Feature Switches"
                description="Atur konfigurasi sistem global platform SaaS Pendekin secara dinamis."
                breadcrumbs={[{ name: 'Admin Console', href: '/admin/dashboard' }, { name: 'Settings' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in flex items-center gap-2">
                    <Check size={16} />
                    <span>{flash.success}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm max-w-2xl space-y-6">
                
                {/* Switch 1: Public Registration */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-gray-900 font-display">Registrasi Publik</h4>
                            <Badge variant={data.allow_registration ? 'emerald' : 'error'}>
                                {data.allow_registration ? 'Terbuka' : 'Ditutup'}
                            </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                            Mengatur apakah pengunjung publik dapat mendaftarkan akun baru di halaman <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">/register</code>.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.allow_registration}
                            onChange={(e) => setData('allow_registration', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                {/* Switch 2: Maintenance Mode */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-gray-900 font-display">Mode Pemeliharaan (Maintenance)</h4>
                            <Badge variant={data.maintenance_mode ? 'error' : 'gray'}>
                                {data.maintenance_mode ? 'AKTIF' : 'Nonaktif'}
                            </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                            Saat aktif, pengguna non-admin yang mengakses aplikasi akan langsung dialihkan ke halaman Maintenance.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.maintenance_mode}
                            onChange={(e) => setData('maintenance_mode', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                </div>

                {/* Secret Bypass URL Setting */}
                <div className="py-2 border-b border-gray-100 pb-4">
                    <label className="block text-xs font-bold text-gray-900 font-display mb-1 flex items-center gap-1.5">
                        <KeyRound size={15} className="text-amber-500" />
                        <span>Kode URL Rahasia Bypass Maintenance</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">http://127.0.0.1:8000/</span>
                        <input
                            type="text"
                            value={data.maintenance_secret_code}
                            onChange={(e) => setData('maintenance_secret_code', e.target.value)}
                            placeholder="admin-ganteng"
                            className="flex-1 px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-mono font-bold text-emerald-600 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            required
                        />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                        Ketikkan URL di atas pada browser perangkat kamu (contoh: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">/{data.maintenance_secret_code || 'admin-ganteng'}</code>) untuk mengizinkan peranti tersebut melewati mode maintenance.
                    </p>
                </div>

                {/* Switch 3: Default Free Quota */}
                <div className="py-2">
                    <label className="block text-xs font-bold text-gray-900 font-display mb-1">
                        Kuota Link Gratis Bawaan (Bulanan)
                    </label>
                    <input
                        type="number"
                        value={data.free_link_limit}
                        onChange={(e) => setData('free_link_limit', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        required
                        min={1}
                        max={10000}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                        Batas maksimal jumlah short link bulanan yang dapat dibuat oleh pengguna Paket Free secara otomatis terdistribusi ke seluruh dashboard & portal billing.
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {processing ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{processing ? 'Menyimpan...' : 'Simpan Konfigurasi Platform'}</span>
                    </button>
                </div>
            </form>
        </>
    );
}

AdminSettingsPage.layout = (page: any) => <AppLayout children={page} />;
