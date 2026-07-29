import { Zap, BarChart3, Palette, ShieldCheck, QrCode, TerminalSquare } from 'lucide-react';

export default function Features() {
    return (
        <section className="section features" id="features">
            <div className="section-head fade-up">
                <span className="section-eyebrow">Fitur</span>
                <h2 className="section-title">Semua yang dibutuhkan link modern</h2>
                <p className="section-desc">Bukan sekadar pemendek URL - Pendekin adalah platform lengkap untuk mengelola link.</p>
            </div>

            <div className="feature-grid">
                <div className="card feature-card fade-up">
                    <div className="feature-icon"><Zap size={22} /></div>
                    <h3>Instant Short Links</h3>
                    <p>Buat link pendek dalam waktu kurang dari satu detik, tanpa delay.</p>
                </div>

                <div className="card feature-card fade-up" id="analytics">
                    <div className="feature-icon"><BarChart3 size={22} /></div>
                    <h3>Analytics</h3>
                    <p>Pantau klik, lokasi, perangkat, dan sumber traffic secara real-time.</p>
                </div>

                <div className="card feature-card fade-up">
                    <div className="feature-icon"><Palette size={22} /></div>
                    <h3>Custom Alias</h3>
                    <p>Tentukan sendiri nama link agar sesuai brand atau kampanye kamu.</p>
                </div>

                <div className="card feature-card fade-up">
                    <div className="feature-icon"><ShieldCheck size={22} /></div>
                    <h3>Secure Links</h3>
                    <p>Proteksi dari malware dan link berbahaya dengan pemindaian otomatis.</p>
                </div>

                <div className="card feature-card fade-up">
                    <div className="feature-icon"><QrCode size={22} /></div>
                    <h3>QR Code</h3>
                    <p>Setiap link otomatis punya QR Code yang siap dipakai untuk cetak.</p>
                </div>

                <div className="card feature-card fade-up" id="api">
                    <div className="feature-icon"><TerminalSquare size={22} /></div>
                    <h3>Developer API</h3>
                    <p>Integrasikan Pendekin ke produkmu sendiri lewat REST API yang simpel.</p>
                </div>
            </div>
        </section>
    );
}
