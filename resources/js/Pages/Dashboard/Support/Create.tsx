import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Card from '@/Components/UI/Card';
import { Send, Paperclip, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function SupportCreate() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        category: 'general',
        priority: 'normal',
        message: '',
        attachments: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPreviewFiles(prev => [...prev, ...filesArray]);
            setData('attachments', [...data.attachments, ...filesArray]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...previewFiles];
        newFiles.splice(index, 1);
        setPreviewFiles(newFiles);
        setData('attachments', newFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/support');
    };

    return (
        <>
            <Head title="Buat Tiket Bantuan" />

            <PageHeader
                title="Buat Tiket Bantuan"
                description="Deskripsikan kendala yang Anda alami sedetail mungkin agar tim kami dapat membantu dengan cepat."
                breadcrumbs={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Support', href: '/dashboard/support' },
                    { name: 'Buat Tiket' }
                ]}
            />

            <div className="max-w-3xl">
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Subjek <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Contoh: Gagal upgrade paket berlangganan"
                                className={`w-full px-4 py-3 rounded-2xl border ${errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'} focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium`}
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                required
                            />
                            {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategori <span className="text-rose-500">*</span></label>
                                <select
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    required
                                >
                                    <option value="general">Pertanyaan Umum</option>
                                    <option value="technical">Masalah Teknis / Bug</option>
                                    <option value="billing">Pembayaran & Tagihan</option>
                                    <option value="abuse">Laporan Penyalahgunaan (Abuse)</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Prioritas <span className="text-rose-500">*</span></label>
                                <select
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    required
                                >
                                    <option value="low">Rendah (Low)</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">Tinggi (High) - Mendesak</option>
                                    <option value="critical">Kritis (Critical) - Sistem Mati</option>
                                </select>
                                {errors.priority && <p className="text-red-500 text-xs mt-1 font-medium">{errors.priority}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pesan & Detail <span className="text-rose-500">*</span></label>
                            <textarea
                                placeholder="Jelaskan masalah Anda secara detail..."
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm h-40 resize-none font-medium"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                required
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Lampiran Bukti (Opsional)</label>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.pdf,.zip,.doc,.docx"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-100 font-semibold transition-colors w-fit"
                                >
                                    <Paperclip size={16} />
                                    Pilih File...
                                </button>
                                
                                {previewFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {previewFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs">
                                                <span className="font-semibold text-gray-700 truncate max-w-[150px]">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors['attachments.0'] && <p className="text-red-500 text-xs mt-1 font-medium">{errors['attachments.0']}</p>}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <Link href="/dashboard/support" className="px-6 py-2.5 rounded-full text-gray-500 font-bold hover:bg-gray-100 transition-colors text-sm">Batal</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center gap-2 text-sm disabled:opacity-70"
                            >
                                <Send size={16} />
                                {processing ? 'Mengirim...' : 'Kirim Tiket'}
                            </button>
                        </div>

                    </form>
                </Card>
            </div>
        </>
    );
}

SupportCreate.layout = (page: any) => <AppLayout children={page} />;
