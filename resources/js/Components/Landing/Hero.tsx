import { useState, FormEvent } from 'react';
import { Users, Link as LinkIcon, ArrowRight, CheckCircle2, Copy, Check, Globe, Scissors, Zap } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

export default function Hero() {
    const [url, setUrl] = useState('');
    const [shortLink, setShortLink] = useState('');
    const { auth } = usePage().props as any;

    const handleShorten = (e: FormEvent) => {
        e.preventDefault();
        const value = url.trim();
        if (!value) return;

        let finalUrl = value;
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'http://' + finalUrl;
        }

        try {
            new URL(finalUrl);
        } catch (err) {
            alert('Mohon masukkan URL yang valid!');
            return;
        }

        if (auth && auth.user) {
            router.post('/dashboard/links', {
                original_url: finalUrl
            }, {
                onSuccess: () => {
                    router.visit('/dashboard');
                }
            });
        } else {
            window.location.href = `/login?pending_url=${encodeURIComponent(finalUrl)}`;
        }
    };

    const copyToClipboard = () => {
        if (!shortLink) return;
        navigator.clipboard.writeText(`https://${shortLink}`);
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 1800);
        }
    };

    return (
        <section className="hero">
            <div className="hero-blob hero-blob-1" aria-hidden="true"></div>
            <div className="hero-blob hero-blob-2" aria-hidden="true"></div>

            <div className="hero-inner">
                <div className="hero-copy fade-up">
                    <span className="badge badge-soft">
                        <Users size={14} />
                        Dipercaya oleh 5.000+ pengguna
                    </span>

                    <h1 className="hero-title">
                        Pendekin link.<br />
                        Bagikan lebih mudah.
                    </h1>

                    <p className="hero-subtitle">
                        Ubah URL panjang menjadi link pendek yang lebih rapi, mudah dibagikan,
                        dan dapat dilacak dalam hitungan detik.
                    </p>

                    <form className="shorten-form" id="heroForm" onSubmit={handleShorten}>
                        <div className="shorten-input-wrap">
                            <LinkIcon size={18} className="input-icon" />
                            <input
                                type="url"
                                id="heroUrlInput"
                                className="shorten-input"
                                placeholder="https://example.com/very-long-url"
                                autoComplete="off"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" id="heroShortenBtn">
                            <span>Pendekin Sekarang</span>
                            <ArrowRight size={17} />
                        </button>
                    </form>

                    <div className={`hero-result ${shortLink ? 'show' : ''}`} id="heroResult">
                        <CheckCircle2 size={18} />
                        <span className="hero-result-link" id="heroResultLink">{shortLink || `${typeof window !== 'undefined' ? window.location.host : 'pdk.id'}/x82Kd`}</span>
                        <button type="button" className="icon-btn" id="heroCopyBtn" aria-label="Salin link" onClick={copyToClipboard}>
                            <Copy size={16} />
                        </button>
                    </div>

                    <ul className="trust-list">
                        <li><Check size={16} /> Gratis digunakan</li>
                        <li><Check size={16} /> Tanpa registrasi</li>
                        <li><Check size={16} /> Analytics tersedia</li>
                    </ul>
                </div>

                <div className="hero-visual fade-up" data-delay="1">
                    <div className="compress-card">
                        <div className="compress-row compress-row-long">
                            <Globe size={18} className="compress-icon" />
                            <span className="compress-text" id="compressLong">https://example.com/products/category?id=92832</span>
                        </div>

                        <div className="compress-divider">
                            <span className="compress-line"></span>
                            <span className="compress-scissor"><Scissors size={16} /></span>
                            <span className="compress-line"></span>
                        </div>

                        <div className="compress-row compress-row-short">
                            <Zap size={18} className="compress-icon compress-icon-accent" />
                            <span className="compress-text compress-text-short" id="compressShort">{typeof window !== 'undefined' ? window.location.host : 'pdk.id'}/x82Kd</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
