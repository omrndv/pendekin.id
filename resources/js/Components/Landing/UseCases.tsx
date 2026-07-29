import { Megaphone, GraduationCap, ShoppingBag, Briefcase } from 'lucide-react';

export default function UseCases() {
    return (
        <section className="section usecases">
            <div className="section-head fade-up">
                <span className="section-eyebrow">Penggunaan</span>
                <h2 className="section-title">Solusi untuk segala kebutuhan</h2>
                <p className="section-desc">Dari kreator konten sampai enterprise, link pendek memberikan value nyata untuk pertumbuhan audiens.</p>
            </div>

            <div className="usecase-grid">
                <div className="card usecase-card fade-up">
                    <div className="usecase-icon"><Megaphone size={20} /></div>
                    <h3>Digital Marketing</h3>
                    <p>Optimasi CTR kampanye iklan dan SMS marketing dengan link pendek bermerek.</p>
                </div>

                <div className="card usecase-card fade-up">
                    <div className="usecase-icon"><GraduationCap size={20} /></div>
                    <h3>Edukasi</h3>
                    <p>Bagikan materi kuliah dan tugas dengan link yang rapi agar mudah diingat mahasiswa.</p>
                </div>

                <div className="card usecase-card fade-up">
                    <div className="usecase-icon"><ShoppingBag size={20} /></div>
                    <h3>E-Commerce</h3>
                    <p>Masukkan link pendek ke bio Instagram atau TikTok untuk arahkan pembeli ke produk spesifik.</p>
                </div>

                <div className="card usecase-card fade-up">
                    <div className="usecase-icon"><Briefcase size={20} /></div>
                    <h3>Corporate</h3>
                    <p>Link internal perusahaan yang aman untuk dokumen sensitif atau materi presentasi.</p>
                </div>
            </div>
        </section>
    );
}
