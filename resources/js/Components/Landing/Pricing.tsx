import { useState } from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="section pricing" id="pricing">
            <div className="section-head fade-up" style={{ marginBottom: '32px' }}>
                <span className="section-eyebrow">Harga</span>
                <h2 className="section-title">Harga sederhana & transparan</h2>
                <p className="section-desc">Pilih paket yang paling sesuai dengan kebutuhan kamu.</p>
            </div>

            <div className="pricing-toggle fade-up">
                <span className={`toggle-label ${!isYearly ? 'active' : ''}`} id="labelMonthly">Bulanan</span>
                <button 
                    type="button" 
                    className="switch" 
                    id="billingSwitch" 
                    role="switch" 
                    aria-checked={isYearly}
                    aria-label="Pilih langganan tahunan"
                    onClick={() => setIsYearly(!isYearly)}
                >
                    <span className="switch-thumb"></span>
                </button>
                <span className={`toggle-label ${isYearly ? 'active' : ''}`} id="labelYearly">
                    Tahunan <span className="badge badge-save">Hemat 20%</span>
                </span>
            </div>

            <div className="pricing-grid">
                {/* Free Plan */}
                <div className="card pricing-card fade-up">
                    <div className="pricing-header">
                        <h3>Gratis</h3>
                        <p className="pricing-desc">Cocok untuk mencoba & penggunaan personal.</p>
                    </div>
                    <div className="pricing-price price">
                        <span className="currency">Rp</span>
                        <span className="amount price-amount">0</span>
                        <span className="price-period">/{isYearly ? 'thn' : 'bln'}</span>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={16} /> 50 Link Baru per Bulan</li>
                        <li><Check size={16} /> Custom Short Slug (Alias)</li>
                        <li><Check size={16} /> QR Code Generator Standar</li>
                        <li><Check size={16} /> Dasbor Analytics (7 Hari)</li>
                    </ul>
                    <a href="/register" className="btn btn-secondary btn-block">Mulai Gratis</a>
                </div>

                {/* Pro Plan */}
                <div className="card pricing-card pricing-card-featured pricing-card-highlight fade-up" data-delay="1">
                    <span className="badge badge-popular">Paling Populer</span>
                    <div className="pricing-header">
                        <h3>Pro</h3>
                        <p className="pricing-desc">Untuk kreator, marketer & UMKM.</p>
                    </div>
                    <div className="pricing-price price">
                        <span className="currency">Rp</span>
                        <span className="amount price-amount">{isYearly ? '249.000' : '24.900'}</span>
                        <span className="price-period">/{isYearly ? 'thn' : 'bln'}</span>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={16} /> 500 Link Baru per Bulan</li>
                        <li><Check size={16} /> Kustomisasi QR Code Lengkap</li>
                        <li><Check size={16} /> Lindungi Link dengan Password</li>
                        <li><Check size={16} /> Atur Tanggal Kadaluarsa Link</li>
                        <li><Check size={16} /> Simpan Analytics hingga 365 Hari</li>
                        <li><Check size={16} /> Dukungan Prioritas via Tiket</li>
                    </ul>
                    <a href="/register" className="btn btn-primary btn-block">Mulai Pro</a>
                </div>

                {/* Business Plan */}
                <div className="card pricing-card fade-up" data-delay="2">
                    <div className="pricing-header">
                        <h3>Business</h3>
                        <p className="pricing-desc">Untuk tim besar & kebutuhan skala bisnis.</p>
                    </div>
                    <div className="pricing-price price">
                        <span className="currency">Rp</span>
                        <span className="amount price-amount">{isYearly ? '549.000' : '54.900'}</span>
                        <span className="price-period">/{isYearly ? 'thn' : 'bln'}</span>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={16} /> Unlimited Link per Bulan</li>
                        <li><Check size={16} /> Developer API & Webhooks</li>
                        <li><Check size={16} /> Custom Domain Sendiri</li>
                        <li><Check size={16} /> Data Analytics Abadi</li>
                        <li><Check size={16} /> Keamanan & Enkripsi Maksimal</li>
                        <li><Check size={16} /> Dukungan Premium 24/7</li>
                    </ul>
                    <a href="/register" className="btn btn-secondary btn-block">Mulai Bisnis</a>
                </div>
            </div>
        </section>
    );
}

