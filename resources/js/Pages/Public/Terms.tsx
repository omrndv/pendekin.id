import { Head, Link as InertiaLink } from '@inertiajs/react';
import React from 'react';

export default function Terms() {
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

            {/* Content */}
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Head title="Syarat & Ketentuan Layanan - Pendekin" />
                
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 font-display mb-2">Syarat & Ketentuan Layanan</h1>
                    <p className="text-sm text-gray-500 mb-8">Terakhir Diperbarui: 29 Juli 2026</p>
                    
                    <div className="prose prose-emerald text-gray-600 text-sm leading-relaxed space-y-6">
                        <p>
                            Selamat datang di <strong>Pendekin</strong>. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat oleh Syarat & Ketentuan Layanan di bawah ini. Harap baca dokumen ini dengan saksama sebelum mulai menggunakan platform kami.
                        </p>

                        <hr className="border-gray-100 my-8" />

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">1. Ketentuan Penggunaan Layanan</h2>
                            <p>
                                Layanan Pendekin disediakan untuk membantu Anda memperpendek tautan URL yang panjang agar lebih mudah dibagikan. Anda bertanggung jawab penuh atas segala aktivitas dan konten tautan yang Anda buat di platform kami.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">2. Kebijakan Penyalahgunaan (Acceptable Use Policy)</h2>
                            <p>
                                Kami berkomitmen penuh untuk menjaga keamanan internet. Anda <strong>dilarang keras</strong> menggunakan Pendekin untuk memperpendek tautan yang mengarah pada:
                            </p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>Phishing, penipuan online, atau scam keuangan.</li>
                                <li>Penyebaran malware, virus, ransomware, atau perangkat lunak berbahaya lainnya.</li>
                                <li>Konten pornografi, eksploitasi seksual, atau materi dewasa ilegal.</li>
                                <li>Kekerasan, ujaran kebencian, pelecehan, atau ancaman terhadap individu maupun kelompok.</li>
                                <li>Pelanggaran Hak Cipta (materi bajakan/ilegal tanpa lisensi hak cipta resmi).</li>
                                <li>Spam berlebihan atau promosi ilegal.</li>
                            </ul>
                            <p className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 font-medium text-xs mt-2">
                                ⚠️ <strong>TINDAKAN TEGAS:</strong> Setiap tautan yang melanggar ketentuan di atas akan <strong>segera dinonaktifkan (suspend)</strong> secara sepihak oleh admin tanpa pemberitahuan terlebih dahulu, dan alamat IP pembuatnya akan kami blokir secara permanen dari sistem.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">3. Ketersediaan Layanan & Batasan Tanggung Jawab</h2>
                            <p>
                                Kami berupaya menjaga layanan tetap aktif 24/7 dengan uptime maksimal. Namun, layanan Pendekin disediakan secara "sebagaimana adanya" (<i>as is</i>) tanpa jaminan ketersediaan mutlak. Kami tidak bertanggung jawab atas kerugian materiil maupun non-materiil yang disebabkan oleh gangguan layanan atau penonaktifan tautan yang melanggar hukum.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">4. Perubahan Ketentuan</h2>
                            <p>
                                Kami berhak untuk mengubah atau memperbarui Syarat & Ketentuan Layanan ini sewaktu-waktu tanpa pemberitahuan sebelumnya demi menyesuaikan regulasi hukum dan operasional keamanan platform kami.
                            </p>
                        </section>

                        <hr className="border-gray-100 my-8" />

                        <p className="text-xs text-gray-400 text-center">
                            Jika Anda memiliki pertanyaan mengenai ketentuan layanan kami, silakan hubungi tim kami melalui formulir <InertiaLink href="/contact" className="text-emerald-500 font-bold hover:underline">Hubungi Kami</InertiaLink>.
                        </p>
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
                            <li><InertiaLink href="/contact" className="hover:text-white transition-colors">Hubungi Kami</InertiaLink></li>
                            <li><InertiaLink href="/report" className="hover:text-white transition-colors">Laporkan Tautan</InertiaLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Hukum</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><InertiaLink href="/terms" className="hover:text-white transition-colors text-emerald-400">Syarat & Ketentuan</InertiaLink></li>
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
