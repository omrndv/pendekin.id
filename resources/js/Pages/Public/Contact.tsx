import { Head, useForm, usePage, Link as InertiaLink } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Mail, MessageSquare, ImagePlus, AlertCircle, Send, Check } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ContactProps extends PageProps {
    initialEmail: string;
    isGuest: boolean;
}

export default function Contact({ initialEmail, isGuest }: ContactProps) {
    const { flash } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = useState<File[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: initialEmail || '',
        subject: '',
        category: 'general',
        message: '',
        attachments: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setAttachments(filesArray);
            setData('attachments', filesArray);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAttachments([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
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
                <Head title="Hubungi Kami - Pendekin Support" />
                
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">Hubungi Kami</h1>
                        <p className="text-emerald-600/80 mt-2 font-medium max-w-md text-sm">
                            Punya pertanyaan, kendala teknis, atau masukan? Kirimkan pesan Anda langsung di sini.
                        </p>
                    </div>

                    <div className="p-8">
                        {flash?.success ? (
                            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                    <Check size={24} />
                                </div>
                                <h3 className="text-lg font-bold">Pesan Berhasil Dikirim</h3>
                                <p className="text-sm opacity-90 mt-2 max-w-md">{flash.success}</p>
                                <InertiaLink 
                                    href="/"
                                    className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-md transition-all"
                                >
                                    Kembali ke Beranda
                                </InertiaLink>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Anda <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Contoh: nama@domain.com"
                                            className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'} focus:ring-4 focus:ring-emerald-500/10 text-gray-900 text-sm`}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={!isGuest}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                    {!isGuest && <p className="text-gray-400 text-xs mt-1">Anda terdeteksi login. Email otomatis disesuaikan.</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Pertanyaan <span className="text-rose-500">*</span></label>
                                        <select
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            required
                                        >
                                            <option value="general">Pertanyaan Umum (General)</option>
                                            <option value="technical">Kendala Teknis (Technical)</option>
                                            <option value="billing">Pertanyaan Billing / Fitur</option>
                                            <option value="abuse">Laporan Khusus</option>
                                            <option value="other">Lainnya</option>
                                        </select>
                                        {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category}</p>}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subjek / Judul <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Tanya batas limit QR Code"
                                            className={`w-full px-4 py-3 rounded-2xl border ${errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'} focus:ring-4 focus:ring-emerald-500/10 text-sm`}
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject}</p>}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Isi Pesan / Keluhan <span className="text-rose-500">*</span></label>
                                    <textarea
                                        placeholder="Ketikkan pesan atau detail pertanyaan Anda di sini..."
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm h-32 resize-none"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
                                </div>

                                {/* Attachments Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Lampiran Tambahan (Opsional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                                         onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange}
                                            className="hidden" 
                                            multiple
                                            accept="image/*,application/pdf,application/zip" 
                                        />
                                        {attachments.length > 0 ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                                    <ImagePlus size={24} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{attachments.length} file dipilih</span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {attachments.map(f => f.name).join(', ')}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3">
                                                    <ImagePlus size={24} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">Pilih berkas lampiran</span>
                                                <span className="text-xs text-gray-400 mt-1">Maks. 5MB (Gambar, PDF, ZIP)</span>
                                            </div>
                                        )}
                                    </div>
                                    {errors.attachments && <p className="text-red-500 text-xs mt-1 font-medium">{errors.attachments}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                                >
                                    {processing ? (
                                        <>Mengirim Pesan...</>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Kirim Pesan Dukungan
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
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
                            <li><InertiaLink href="/contact" className="hover:text-white transition-colors text-emerald-400">Hubungi Kami</InertiaLink></li>
                            <li><InertiaLink href="/report" className="hover:text-white transition-colors">Laporkan Tautan</InertiaLink></li>
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
