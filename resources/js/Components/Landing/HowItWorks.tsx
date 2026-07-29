import { ClipboardPaste, Wand2, Share2, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section className="section how-it-works" id="how">
            <div className="section-head fade-up">
                <span className="section-eyebrow">Alur kerja</span>
                <h2 className="section-title">Tiga langkah, langsung jadi</h2>
                <p className="section-desc">Tidak perlu setup rumit. Dari URL panjang ke link siap bagi dalam hitungan detik.</p>
            </div>

            <div className="timeline fade-up">
                <div className="timeline-step">
                    <span className="timeline-index">01</span>
                    <div className="timeline-icon"><ClipboardPaste size={24} /></div>
                    <h3>Paste URL</h3>
                    <p>Tempel link panjang apa pun ke kolom input Pendekin.</p>
                </div>

                <div className="timeline-connector" aria-hidden="true">
                    <ChevronRight size={20} />
                </div>

                <div className="timeline-step">
                    <span className="timeline-index">02</span>
                    <div className="timeline-icon"><Wand2 size={24} /></div>
                    <h3>Generate Short Link</h3>
                    <p>Sistem membuat link pendek unik secara instan, atau pakai alias sendiri.</p>
                </div>

                <div className="timeline-connector" aria-hidden="true">
                    <ChevronRight size={20} />
                </div>

                <div className="timeline-step">
                    <span className="timeline-index">03</span>
                    <div className="timeline-icon"><Share2 size={24} /></div>
                    <h3>Share Anywhere</h3>
                    <p>Bagikan ke mana saja sambil melacak setiap klik secara real-time.</p>
                </div>
            </div>
        </section>
    );
}
