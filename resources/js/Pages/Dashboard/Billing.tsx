import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import DataTable from '@/Components/UI/DataTable';
import Modal from '@/Components/UI/Modal';
import { PageProps } from '@/types';
import { CreditCard, Check, Zap, ArrowUpRight, FileText, RefreshCw, XCircle, AlertTriangle, Sparkles, Clock, Copy, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface BillingProps {
    plan_details: {
        type: 'free' | 'trial' | 'paid';
        name: string;
        slug: string;
        status: string;
        status_label: string;
        cycle: string;
        ends_at?: string | null;
        cancels_at?: string | null;
        features: Record<string, any>;
    };
    usage: {
        current_links: number;
        quota: number;
        percentage: number;
    };
    feature_labels: Record<string, string>;
    plans: Array<{
        id: number;
        name: string;
        slug: string;
        price_monthly: number;
        price_yearly: number;
        link_quota: number;
        features: Record<string, any>;
    }>;
    transactions: Array<any>;
    invoices: Array<any>;
}

export default function UserBillingPage({ plan_details, usage, feature_labels, plans, transactions, invoices }: BillingProps) {
    const flash = usePage<PageProps>().props.flash;
    const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [checkoutTarget, setCheckoutTarget] = useState<any | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);

    const form = useForm({
        plan_id: 0,
        cycle: 'monthly',
    });

    const currentLinks = usage?.current_links ?? 0;
    const quota = usage?.quota ?? 50;
    const percentage = Math.min(usage?.percentage ?? 0, 100);

    const isPaid = plan_details.type === 'paid';

    const handleOpenCheckout = (plan: any) => {
        setCheckoutTarget(plan);
        form.setData({ plan_id: plan.id, cycle: selectedCycle });
    };

    const handleCancelRenewal = () => {
        if (confirm('Apakah kamu yakin ingin menghentikan perpanjangan otomatis? Fitur premium kamu akan tetap aktif hingga akhir periode pembayaran.')) {
            setIsCancelling(true);
            router.post('/dashboard/billing/cancel-renewal', {}, {
                onFinish: () => setIsCancelling(false),
            });
        }
    };

    const renderFeatureValue = (value: any, isBusiness: boolean = false, isPro: boolean = false) => {
        const textColor = isBusiness ? 'text-gray-300' : 'text-gray-800';
        const emptyColor = isBusiness ? 'text-gray-700' : 'text-gray-300';
        
        if (typeof value === 'boolean') {
            return value ? <Check size={18} className={`${isPro ? 'text-emerald-500' : 'text-emerald-400'} mx-auto drop-shadow-sm`} /> : <X size={18} className={`${emptyColor} mx-auto`} />;
        }
        if (typeof value === 'number') {
            if (value >= 10000 || value === 0) {
                return <span className={`font-bold text-xs ${isPro ? 'text-emerald-600' : (isBusiness ? 'text-emerald-400' : 'text-emerald-600')}`}>Unlimited</span>;
            }
            return <span className={`font-bold text-xs ${textColor}`}>{value.toLocaleString()}</span>;
        }
        return <span className={`font-bold text-xs ${textColor}`}>{value}</span>;
    };

    return (
        <>
            <Head title="Billing & Subscription Portal" />

            <PageHeader
                title="Langganan & Billing Portal"
                description="Kelola paket langganan aktif, penggunaan kuota bulanan, histori transaksi, dan invoice."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Billing' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex flex-col gap-2">
                    <div>{flash.success}</div>
                    {flash.redirect_url && (
                        <a href={flash.redirect_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-700 underline font-extrabold">
                            <span>Lanjutkan Pembayaran</span>
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <div>{flash.error}</div>
                </div>
            )}

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-extrabold text-gray-900 font-display">
                                Paket {plan_details.name}
                            </h3>
                            <Badge variant={isPaid ? 'emerald' : 'gray'}>
                                {plan_details.status_label}
                            </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                            {isPaid ? (
                                <>Siklus: <span className="font-bold text-gray-800 uppercase">{plan_details.cycle}</span> • Berakhir <span className="font-bold text-gray-700">{plan_details.ends_at?.split('T')[0] || '-'}</span></>
                            ) : (
                                <span>Akses fitur dasar gratis. Upgrade untuk membuka batas limit dan fitur lanjutan.</span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isPaid && (
                            plan_details.cancels_at ? (
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                                    Akan Berakhir {plan_details.cancels_at.split('T')[0]}
                                </span>
                            ) : (
                                <button
                                    onClick={handleCancelRenewal}
                                    disabled={isCancelling}
                                    className="px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold text-xs rounded-2xl cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                                >
                                    {isCancelling ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
                                    <span>Hentikan Auto Renewal</span>
                                </button>
                            )
                        )}
                        <button
                            onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-2xl cursor-pointer transition-colors"
                        >
                            Kelola Paket
                        </button>
                    </div>
                </div>

                <div className="pt-6">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-gray-700">Penggunaan Quota Link Bulanan</span>
                        <span className={percentage > 90 ? "text-rose-600" : "text-emerald-600"}>
                            {currentLinks.toLocaleString()} / {quota === 0 || quota >= 10000 ? 'Unlimited' : quota.toLocaleString()} Link ({percentage}%)
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div id="pricing-plans" className="mb-14">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 font-display tracking-tight">Tingkatkan Performa Bisnismu</h3>
                        <p className="text-xs text-gray-500 mt-1">Pilih paket yang sesuai dengan kebutuhan operasional URL management.</p>
                    </div>
                    <div className="flex items-center p-1 bg-gray-100/85 rounded-2xl border border-gray-200/80 shadow-inner">
                        <button
                            onClick={() => setSelectedCycle('monthly')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                selectedCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setSelectedCycle('yearly')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                selectedCycle === 'yearly' ? 'bg-gray-900 text-white shadow-sm ring-1 ring-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span>Tahunan</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${selectedCycle === 'yearly' ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>Hemat 2 Bulan</span>
                        </button>
                    </div>
                </div>

                {/* World-Class SaaS Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
                    {plans.map(plan => {
                        const price = selectedCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
                        const isCurrent = plan_details.slug === plan.slug && (isPaid || plan.slug === 'free');
                        const isPro = plan.slug === 'pro';
                        const isBusiness = plan.slug === 'business';

                        // Custom card descriptions
                        const descriptions: Record<string, string> = {
                            free: 'Untuk kebutuhan personal & link sharing sederhana sehari-hari.',
                            pro: 'Untuk profesional, kreator, dan bisnis berkembang yang butuh kontrol penuh.',
                            business: 'Untuk tim, korporasi, dan developer yang butuh integrasi API & skala besar.',
                        };

                        // Key highlights to render inside cards
                        const highlights: Record<string, string[]> = {
                            free: [
                                '50 Link Baru per Bulan',
                                'Custom Short Slug (Alias)',
                                'QR Code Generator Standar',
                                'Dasbor Analytics (7 Hari)',
                            ],
                            pro: [
                                '500 Link Baru per Bulan',
                                'Kustomisasi QR Code Lengkap',
                                'Lindungi Link dengan Password',
                                'Atur Tanggal Kadaluarsa Link',
                                'Simpan Analytics hingga 365 Hari',
                                'Dukungan Prioritas via Tiket',
                            ],
                            business: [
                                'Unlimited Link per Bulan',
                                'Developer API & Webhooks',
                                'Custom Domain Sendiri',
                                'Data Analytics Abadi',
                                'Keamanan & Enkripsi Maksimal',
                                'Dukungan Premium 24/7',
                            ],
                        };

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                                    isPro
                                        ? 'bg-white border-2 border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.12)] scale-[1.03] z-10 md:-translate-y-1'
                                        : isBusiness
                                        ? 'bg-gray-900 text-white border border-gray-800 shadow-xl'
                                        : 'bg-white border border-gray-200/80 shadow-sm hover:shadow-md'
                                }`}
                            >
                                {isPro && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-4 py-1 rounded-full shadow-md tracking-wider uppercase">
                                        Paling Populer
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`text-lg font-black font-display tracking-tight uppercase ${isPro ? 'text-emerald-500' : (isBusiness ? 'text-white' : 'text-gray-900')}`}>{plan.name}</h4>
                                        {isBusiness && (
                                            <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 uppercase tracking-widest">
                                                Enterprise
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs mb-6 ${isBusiness ? 'text-gray-400' : 'text-gray-500'}`}>{descriptions[plan.slug]}</p>

                                    <div className="mb-8 flex items-baseline">
                                        {Number(price) === 0 ? (
                                            <span className="text-4xl font-black font-display tracking-tight">Gratis</span>
                                        ) : (
                                            <>
                                                <span className="text-xl font-bold mr-1">Rp</span>
                                                <span className="text-4xl font-black font-display tracking-tight">
                                                    {Number(price).toLocaleString('id-ID')}
                                                </span>
                                                <span className={`text-xs font-semibold ml-1 ${isBusiness ? 'text-gray-400' : 'text-gray-500'}`}>/{selectedCycle === 'yearly' ? 'thn' : 'bln'}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Features List */}
                                    <div className="border-t border-gray-100/80 my-6 pt-6">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-4 ${isBusiness ? 'text-gray-400' : 'text-gray-400'}`}>Fitur Unggulan</span>
                                        <ul className="space-y-3.5">
                                            {highlights[plan.slug].map((feat, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-xs">
                                                    <span className={`p-0.5 rounded-full shrink-0 ${isPro ? 'bg-emerald-50 text-emerald-600' : (isBusiness ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-gray-100 text-gray-600')}`}>
                                                        <Check size={12} className="stroke-[3]" />
                                                    </span>
                                                    <span className={isBusiness ? 'text-gray-300' : 'text-gray-700'}>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4">
                                    {isCurrent ? (
                                        <div className={`w-full py-3 text-center text-xs font-bold rounded-2xl border ${isPro ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : (isBusiness ? 'text-gray-300 bg-gray-800 border-gray-700' : 'text-gray-700 bg-gray-100 border-gray-300')}`}>
                                            Paket Aktif Saat Ini
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenCheckout(plan)}
                                            className={`w-full py-3 text-xs font-extrabold rounded-2xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform active:scale-[0.98] ${
                                                isPro
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white ring-2 ring-emerald-400/20'
                                                    : isBusiness
                                                    ? 'bg-white hover:bg-gray-100 text-gray-900 font-black'
                                                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                                            }`}
                                        >
                                            {plan.slug === 'free' ? 'Kembali ke Free' : `Pilih ${plan.name}`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed Comparison Trigger Button */}
                <div className="flex justify-center mt-12">
                    <button
                        onClick={() => setIsComparisonOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs rounded-2xl shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                    >
                        <Sparkles size={14} className="text-emerald-500" />
                        <span>Bandingkan Fitur Selengkapnya</span>
                    </button>
                </div>
            </div>

            {/* Detailed Comparison Modal */}
            <Modal
                isOpen={isComparisonOpen}
                onClose={() => setIsComparisonOpen(false)}
                title="Perbandingan Fitur Lengkap"
                description="Bandingkan detail spesifikasi teknis dan batasan fitur dari masing-masing paket."
                maxWidth="4xl"
            >
                <div className="w-full overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
                    <div className="min-w-[700px] flex flex-col">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 border-b border-gray-200/60 bg-gray-50/50 text-center font-display">
                            <div className="p-4 pl-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Spesifikasi</div>
                            <div className="p-4 text-xs font-black text-gray-700 uppercase tracking-wider">FREE</div>
                            <div className="p-4 text-xs font-black text-emerald-600 uppercase tracking-wider bg-emerald-50/10 border-x border-gray-100">PRO</div>
                            <div className="p-4 text-xs font-black text-gray-900 uppercase tracking-wider bg-gray-900/5">BUSINESS</div>
                        </div>

                        {/* Table Rows */}
                        <div className="flex flex-col">
                            {Object.entries(feature_labels).map(([key, label], idx) => {
                                const isPremiumSection = idx === 6; // password is index 6
                                return (
                                    <div key={key}>
                                        {isPremiumSection && (
                                            <div className="grid grid-cols-4 bg-gray-50/40 border-b border-gray-200/40">
                                                <div className="p-2.5 pl-6 text-left">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Premium Features</span>
                                                </div>
                                                <div className="p-2.5" />
                                                <div className="p-2.5 bg-emerald-50/10 border-x border-gray-100" />
                                                <div className="p-2.5 bg-gray-900/5" />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-4 items-center border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                                            <div className="p-3.5 pl-6 text-xs font-bold text-gray-600 text-left">
                                                {label}
                                            </div>
                                            {plans.map(plan => {
                                                const isPro = plan.slug === 'pro';
                                                const isBusiness = plan.slug === 'business';
                                                return (
                                                    <div
                                                        key={plan.id}
                                                        className={`p-3.5 text-center ${
                                                            isPro
                                                                ? 'bg-emerald-50/10 border-x border-gray-100 font-bold text-emerald-600'
                                                                : isBusiness
                                                                ? 'bg-gray-900/5 font-semibold text-gray-800'
                                                                    : 'font-medium text-gray-600'
                                                        }`}
                                                    >
                                                        {renderFeatureValue(plan.features?.[key], false, isPro)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsComparisonOpen(false)}
                        className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </Modal>

            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 font-display mb-4">Histori Pembayaran</h3>
                <DataTable<any>
                    data={invoices || []}
                    keyExtractor={(item) => item.id}
                    columns={[
                        { header: 'Invoice', cell: (item) => <span className="font-mono text-xs">{item.invoice_number}</span> },
                        { header: 'Total', cell: (item) => <span className="text-xs font-bold">Rp {item.total_amount.toLocaleString()}</span> },
                        { header: 'Status', cell: (item) => <Badge variant={item.status === 'paid' ? 'emerald' : 'warning'}>{item.status}</Badge> },
                    ]}
                />
            </div>

            <CheckoutModal
                checkoutTarget={checkoutTarget}
                selectedCycle={selectedCycle}
                onClose={() => setCheckoutTarget(null)}
                onSuccess={() => { setCheckoutTarget(null); router.reload(); }}
            />
        </>
    );
}

function CheckoutModal({ checkoutTarget, selectedCycle, onClose, onSuccess }: {
    checkoutTarget: any;
    selectedCycle: 'monthly' | 'yearly';
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (checkoutTarget) {
            setStep(1);
            setIsProcessing(false);
        }
    }, [checkoutTarget]);

    if (!checkoutTarget) return null;

    const basePrice = selectedCycle === 'yearly' ? Number(checkoutTarget.price_yearly) : Number(checkoutTarget.price_monthly);
    const taxAmount = basePrice * 0.11;
    const totalAmount = basePrice + taxAmount;

    const handleSimulatePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(3);
        }, 1500);
    };

    return (
        <Modal
            isOpen={!!checkoutTarget}
            onClose={onClose}
            title={step === 1 ? `Checkout Paket ${checkoutTarget.name}` : step === 2 ? 'Pembayaran' : 'Pembayaran Berhasil!'}
            description={step === 1 ? 'Ringkasan transaksi paket kamu.' : step === 2 ? 'Silakan selesaikan pembayaran.' : 'Transaksi telah diverifikasi.'}
        >
            {step === 1 && (
                <div className="flex flex-col gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-2xl">
                        <div className="flex items-center justify-between font-bold text-gray-900 mb-2">
                            <span>Paket {checkoutTarget.name} ({selectedCycle === 'yearly' ? 'Tahunan' : 'Bulanan'})</span>
                            <span className="text-gray-900">
                                Rp {basePrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600 border border-gray-100">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rp {basePrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>PPN (11%)</span>
                            <span>Rp {taxAmount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-gray-900 text-sm">
                            <span>Total Pembayaran</span>
                            <span className="text-emerald-600 font-mono">
                                Rp {totalAmount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                        <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer">Lanjut ke Pembayaran</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col gap-4">
                    <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 font-mono font-bold text-lg text-gray-900">
                            <span>VA-8801293810</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Transfer tepat sejumlah <strong className="text-gray-800">Rp {totalAmount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</strong>
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-center">
                        <button
                            type="button" disabled={isProcessing} onClick={handleSimulatePayment}
                            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={16} />}
                            {isProcessing ? 'Verifikasi...' : 'Simulasi Bayar Sekarang'}
                        </button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                        <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">Pembayaran Berhasil!</h3>
                    <button type="button" onClick={onSuccess} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl mt-4">Selesai</button>
                </div>
            )}
        </Modal>
    );
}

UserBillingPage.layout = (page: any) => <AppLayout children={page} />;
