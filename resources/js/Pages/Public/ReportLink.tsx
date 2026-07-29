import { Head, useForm, usePage, Link as InertiaLink } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ShieldAlert, ImagePlus, Link, AlertTriangle } from 'lucide-react';
import React, { useRef } from 'react';

interface ReportLinkProps extends PageProps {
    slug: string;
}

export default function ReportLink({ slug }: ReportLinkProps) {
    const { flash } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        slug: slug || '',
        reporter_email: '',
        reason: 'Phishing',
        severity: 'medium',
        description: '',
        screenshot: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/report', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Tailwind Header */}
            <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <InertiaLink href="/" className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 15L15 9M10 6.5L11.5 5C13.4 3.1 16.5 3.1 18.4 5C20.3 6.9 20.3 10 18.4 11.9L16.9 13.4M14 17.5L12.5 19C10.6 20.9 7.5 20.9 5.6 19C3.7 17.1 3.7 14 5.6 12.1L7.1 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                        <span className="text-gray-900 font-bold tracking-tight">Pendekin</span>
                    </InertiaLink>
                    <div className="flex items-center gap-4">
                        <InertiaLink href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Login</InertiaLink>
                        <InertiaLink href="/register" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all">Get Started</InertiaLink>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-4 py-16">
                <Head title="Laporkan Penyalahgunaan Tautan (Abuse Report)" />
            
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-rose-50 border-b border-rose-100 p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Laporkan Penyalahgunaan Tautan</h1>
                    <p className="text-rose-600/80 mt-2 font-medium max-w-md text-sm">
                        Bantu kami menjaga keamanan platform dengan melaporkan tautan yang mengandung unsur penipuan, spam, atau konten berbahaya.
                    </p>
                </div>

                <div className="p-8">
                    {flash?.success ? (
                        <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                            <ShieldAlert size={48} className="text-emerald-500 mb-4" />
                            <h3 className="text-lg font-bold">Laporan Berhasil Terkirim</h3>
                            <p className="text-sm opacity-90 mt-1">{flash.success}</p>
                            <button 
                                onClick={() => window.location.href = '/'}
                                className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-md transition-all"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Short Slug */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tautan yang Dilaporkan <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Link size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Contoh: pdk.id/6u6geG atau cukup 6u6geG"
                                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${errors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500/20'} text-gray-900 font-mono`}
                                        value={data.slug}
                                        onChange={(e) => {
                                            const val = e.target.value.trim();
                                            // Strip protocol
                                            let slugVal = val.replace(/^(https?:\/\/)/i, '');
                                            // If it contains a slash, extract the last segment as the slug
                                            if (slugVal.includes('/')) {
                                                const parts = slugVal.split('/');
                                                slugVal = parts[parts.length - 1] || slugVal;
                                            }
                                            setData('slug', slugVal);
                                        }}
                                        required
                                    />
                                </div>
                                {errors.slug && <p className="text-red-500 text-xs mt-1 font-medium">{errors.slug}</p>}
                            </div>

                            {/* Reporter Email */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Anda <span className="text-rose-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="Untuk konfirmasi laporan"
                                    className={`w-full px-4 py-3 rounded-2xl border ${errors.reporter_email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-rose-500'} focus:ring-4 focus:ring-rose-500/10 text-sm`}
                                    value={data.reporter_email}
                                    onChange={(e) => setData('reporter_email', e.target.value)}
                                    required
                                />
                                {errors.reporter_email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.reporter_email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Alasan Laporan <span className="text-rose-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        required
                                    >
                                        <option value="Phishing">Phishing / Penipuan</option>
                                        <option value="Scam">Scam / Uang Cepat</option>
                                        <option value="Malware">Malware / Virus</option>
                                        <option value="Spam">Spam / Iklan Mengganggu</option>
                                        <option value="Adult">Konten Dewasa (Adult)</option>
                                        <option value="Violence">Kekerasan (Violence)</option>
                                        <option value="Copyright">Pelanggaran Hak Cipta</option>
                                        <option value="Fake News">Berita Palsu (Hoax)</option>
                                        <option value="Other">Lainnya</option>
                                    </select>
                                    {errors.reason && <p className="text-red-500 text-xs mt-1 font-medium">{errors.reason}</p>}
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tingkat Bahaya <span className="text-rose-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm"
                                        value={data.severity}
                                        onChange={(e) => setData('severity', e.target.value)}
                                        required
                                    >
                                        <option value="low">Rendah (Low)</option>
                                        <option value="medium">Sedang (Medium)</option>
                                        <option value="high">Tinggi (High) - Bahaya</option>
                                        <option value="critical">Kritis (Critical) - Mengancam Nyawa/Uang</option>
                                    </select>
                                    {errors.severity && <p className="text-red-500 text-xs mt-1 font-medium">{errors.severity}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detail Bukti Pelanggaran</label>
                                <textarea
                                    placeholder="Jelaskan mengapa Anda melaporkan tautan ini secara detail..."
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm h-32 resize-none"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Unggah Tangkapan Layar (Opsional)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center hover:border-rose-400 hover:bg-rose-50/50 transition-colors cursor-pointer"
                                     onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={(e) => setData('screenshot', e.target.files ? e.target.files[0] : null)}
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/jpg" 
                                    />
                                    {data.screenshot ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
                                                <ImagePlus size={24} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{data.screenshot.name}</span>
                                            <span className="text-xs text-gray-500 mt-1">Klik untuk mengganti gambar</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3">
                                                <ImagePlus size={24} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">Pilih gambar untuk diunggah</span>
                                            <span className="text-xs text-gray-400 mt-1">Maks. 5MB (JPG, PNG)</span>
                                        </div>
                                    )}
                                </div>
                                {errors.screenshot && <p className="text-red-500 text-xs mt-1 font-medium">{errors.screenshot}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? (
                                    <>Mengirim Laporan...</>
                                ) : (
                                    <>
                                        <AlertTriangle size={18} />
                                        Kirim Laporan Abuse
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500 mb-8">
                Penyalahgunaan laporan palsu yang disengaja dapat mengakibatkan pemblokiran IP Address Anda dari sistem kami.
            </div>
            </div>

            {/* Tailwind Footer */}
            <footer className="w-full bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <InertiaLink href="/" className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 15L15 9M10 6.5L11.5 5C13.4 3.1 16.5 3.1 18.4 5C20.3 6.9 20.3 10 18.4 11.9L16.9 13.4M14 17.5L12.5 19C10.6 20.9 7.5 20.9 5.6 19C3.7 17.1 3.7 14 5.6 12.1L7.1 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="text-white font-bold tracking-tight">Pendekin</span>
                        </InertiaLink>
                        <p className="text-xs text-gray-400 leading-relaxed">Perpendek link, lacak performanya, bagikan lebih mudah.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Fitur</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><InertiaLink href="/#features" className="hover:text-white transition-colors">Pemendek URL</InertiaLink></li>
                            <li><InertiaLink href="/#features" className="hover:text-white transition-colors">Kustomisasi QR Code</InertiaLink></li>
                            <li><InertiaLink href="/#analytics" className="hover:text-white transition-colors">Analitik Lengkap</InertiaLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Dukungan</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><InertiaLink href="/contact" className="hover:text-white transition-colors">Hubungi Kami</InertiaLink></li>
                            <li><InertiaLink href="/report" className="hover:text-white transition-colors text-emerald-400">Laporkan Tautan</InertiaLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Hukum</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><InertiaLink href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</InertiaLink></li>
                            <li><InertiaLink href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</InertiaLink></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60 mt-8 pt-6 text-center text-[10px] text-gray-500">
                    &copy; {new Date().getFullYear()} Pendekin. Seluruh hak cipta dilindungi.
                </div>
            </footer>
        </div>
    );
}
