import { Head, Link as InertiaLink } from '@inertiajs/react';
import React from 'react';

export default function Privacy() {
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
                <Head title="Kebijakan Privasi - Pendekin" />
                
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 font-display mb-2">Kebijakan Privasi</h1>
                    <p className="text-sm text-gray-500 mb-8">Terakhir Diperbarui: 29 Juli 2026</p>
                    
                    <div className="prose prose-emerald text-gray-600 text-sm leading-relaxed space-y-6">
                        <p>
                            Di <strong>Pendekin</strong>, privasi pengunjung situs kami dan pengguna tautan pendek adalah prioritas utama kami. Dokumen Kebijakan Privasi ini menjelaskan jenis data pribadi apa saja yang kami kumpulkan, bagaimana kami menggunakannya, dan langkah-langkah keamanan yang kami terapkan untuk melindunginya.
                        </p>

                        <hr className="border-gray-100 my-8" />

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">1. Informasi yang Kami Kumpulkan</h2>
                            <p>
                                Kami mengumpulkan data dalam dua skenario utama untuk kepentingan operasional analitik dan keamanan platform:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Untuk Pengguna Terdaftar (Pembuat Link):</strong> Kami mengumpulkan informasi pendaftaran seperti nama Anda, alamat email, dan kredensial akun yang digunakan untuk login (termasuk profil Google jika mendaftar via SSO).
                                </li>
                                <li>
                                    <strong>Untuk Pengunjung Link Pendek (Analitik):</strong> Ketika seseorang mengeklik tautan Pendekin, kami secara otomatis mencatat data non-personal untuk laporan analitik pembuat link, yang meliputi:
                                    <ul className="list-circle pl-6 mt-1 space-y-1">
                                        <li>Alamat IP yang disamarkan (<i>anonymized IP address</i>) demi melindungi privasi individu.</li>
                                        <li>Negara asal pengunjung berdasarkan database lokasi IP.</li>
                                        <li>Tipe perangkat (Mobile, Tablet, Desktop) dan nama web browser yang digunakan.</li>
                                        <li>Waktu dan tanggal tepat kunjungan tersebut terjadi.</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">2. Bagaimana Kami Menggunakan Informasi</h2>
                            <p>
                                Informasi yang dikumpulkan digunakan semata-mata untuk:
                            </p>
                            <ul className="list-disc pl-6 space-y-1.5">
                                <li>Menyediakan dasbor analitik grafik bagi pemilik tautan agar dapat melacak performa link mereka.</li>
                                <li>Memantau dan mencegah penyalahgunaan layanan (seperti mendeteksi bot, spammer, dan upaya phishing).</li>
                                <li>Meningkatkan fungsionalitas, kecepatan respons, dan stabilitas server platform Pendekin.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">3. Berbagi Informasi dengan Pihak Ketiga</h2>
                            <p>
                                Kami berkomitmen penuh untuk <strong>tidak pernah menjual, menyewakan, memperdagangkan, atau memberikan</strong> data pribadi pengguna maupun analitik pengunjung tautan Anda kepada pihak ketiga mana pun untuk kepentingan pemasaran/iklan.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-900">4. Keamanan Data Pribadi</h2>
                            <p>
                                Kami menerapkan protokol keamanan data terenkripsi (SSL/HTTPS) standar industri untuk melindungi transmisi data database. Data Anda dilindungi dari akses ilegal, manipulasi, atau kebocoran informasi pihak luar.
                            </p>
                        </section>

                        <hr className="border-gray-100 my-8" />

                        <p className="text-xs text-gray-400 text-center">
                            Jika Anda memiliki keluhan atau pertanyaan lebih lanjut terkait kebijakan privasi kami, jangan ragu untuk menghubungi kami melalui formulir <InertiaLink href="/contact" className="text-emerald-500 font-bold hover:underline">Hubungi Kami</InertiaLink>.
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
                            <li><InertiaLink href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</InertiaLink></li>
                            <li><InertiaLink href="/privacy" className="hover:text-white transition-colors text-emerald-400">Kebijakan Privasi</InertiaLink></li>
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
