import { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import DataTable from '@/Components/UI/DataTable';
import Modal from '@/Components/UI/Modal';
import Badge from '@/Components/UI/Badge';
import { PageProps } from '@/types';
import { Key, Plus, Trash2, Copy, Check, Lock, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

interface ApiKeyItem {
    id: number;
    name: string;
    key_prefix: string;
    is_active: boolean;
    last_used_at?: string;
    created_at: string;
}

interface ApiKeysProps {
    apiKeys: ApiKeyItem[];
    isEntitled?: boolean;
}

export default function ApiKeysPage({ apiKeys, isEntitled = true }: ApiKeysProps) {
    const flash = usePage<PageProps>().props.flash;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);

    const form = useForm({
        name: '',
    });

    const handleCreateKey = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/api-keys', {
            onSuccess: () => {
                form.reset();
                setIsCreateModalOpen(false);
            },
        });
    };

    const handleDeleteKey = (id: number) => {
        if (confirm('Apakah kamu yakin ingin mencabut (revoke) API Key ini? Token ini tidak dapat dipergunakan kembali.')) {
            useForm().delete(`/dashboard/api-keys/${id}`);
        }
    };

    return (
        <>
            <Head title="Manajemen API Keys" />

            <PageHeader
                title="Developer & API Keys"
                description="Kelola token autentikasi REST API v1 untuk mengintegrasikan layanan Pendekin SaaS dengan aplikasi milikmu."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'API Keys' }]}
                action={
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/api-docs"
                            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <FileText size={15} />
                            <span>Dokumentasi API</span>
                        </Link>
                        {isEntitled && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Plus size={15} />
                                <span>Buat API Key Baru</span>
                            </button>
                        )}
                    </div>
                }
            />

            {!isEntitled && (
                <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-amber-500/20 text-amber-600 rounded-xl">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900 font-display">Akses REST API v1 Terkunci</h4>
                            <p className="text-xs text-gray-600">
                                Integrasi REST API v1 hanya tersedia untuk pengguna Paket Pro dan Business. Upgrade sekarang untuk mendapatkan akses token API secara instan.
                            </p>
                        </div>
                    </div>
                    <a
                        href="/dashboard/billing"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-sm transition-all whitespace-nowrap"
                    >
                        Upgrade ke Paket Pro
                    </a>
                </div>
            )}

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in flex flex-col gap-2">
                    <div>{flash.success}</div>
                </div>
            )}

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900 font-display">Daftar API Key Aktif</h3>
                </div>

                <DataTable<ApiKeyItem>
                    data={apiKeys || []}
                    keyExtractor={(item) => item.id}
                    emptyTitle="Belum Ada API Key"
                    emptyDescription="Buat API key pertama kamu untuk mulai mengakses REST API v1 Pendekin SaaS."
                    columns={[
                        {
                            header: 'Nama Key',
                            cell: (item) => (
                                <div className="flex items-center gap-2">
                                    <Key size={14} className="text-emerald-500" />
                                    <span className="font-bold text-xs text-gray-900">{item.name}</span>
                                </div>
                            ),
                        },
                        {
                            header: 'Prefix Key',
                            cell: (item) => (
                                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                    {item.key_prefix}...
                                </span>
                            ),
                        },
                        {
                            header: 'Status',
                            cell: (item) => (
                                <Badge variant={item.is_active ? 'emerald' : 'error'}>
                                    {item.is_active ? 'Aktif' : 'Revoked'}
                                </Badge>
                            ),
                        },
                        {
                            header: 'Dibuat Pada',
                            cell: (item) => (
                                <span className="text-xs text-gray-500">{item.created_at?.split('T')[0]}</span>
                            ),
                        },
                        {
                            header: 'Aksi',
                            cell: (item) => (
                                <button
                                    onClick={() => handleDeleteKey(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Cabut (Revoke) Key"
                                >
                                    <Trash2 size={15} />
                                </button>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Create API Key Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Buat API Key Baru"
                description="Berikan nama unik untuk mengidentifikasi penggunaan token ini."
            >
                <form onSubmit={handleCreateKey} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama API Key</label>
                        <input
                            type="text"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Contoh: Mobile App Integration"
                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                            Generate API Key
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

ApiKeysPage.layout = (page: any) => <AppLayout children={page} />;
