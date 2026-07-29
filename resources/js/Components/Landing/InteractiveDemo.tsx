import { useState, FormEvent, KeyboardEvent } from 'react';
import { Link as LinkIcon, Link, Copy } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

export default function InteractiveDemo() {
    const [url, setUrl] = useState('');
    const [shortLink, setShortLink] = useState('');
    const { auth } = usePage().props as any;

    const generate = () => {
        const value = url.trim();
        if (!value) return;

        let finalUrl = value;
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'http://' + finalUrl;
        }

        try {
            new URL(finalUrl);
        } catch (e) {
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generate();
        }
    };

    const copyToClipboard = () => {
        if (!shortLink) return;
        const protocol = typeof window !== 'undefined' ? window.location.protocol + '//' : 'https://';
        navigator.clipboard.writeText(`${protocol}${shortLink}`);
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 1800);
        }
    };

    return (
        <section className="section demo-section">
            <div className="demo-card fade-up">
                <div className="demo-copy">
                    <span className="section-eyebrow">Coba langsung</span>
                    <h2 className="section-title">Rasakan kecepatannya sekarang</h2>
                    <p className="section-desc">Tanpa perlu daftar. Ketik URL apa saja, lihat hasilnya secara instan.</p>
                </div>

                <div className="demo-box">
                    <div className="demo-input-row">
                        <div className="shorten-input-wrap">
                            <LinkIcon size={18} className="input-icon" />
                            <input
                                type="text"
                                id="demoUrlInput"
                                className="shorten-input"
                                placeholder="https://contoh-website.com/halaman-panjang-sekali"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button className="btn btn-primary" id="demoShortenBtn" onClick={generate}>
                            Perpendek
                        </button>
                    </div>

                    <div className={`demo-result ${shortLink ? 'show' : ''}`} id="demoResult">
                        <Link size={17} />
                        <span id="demoResultLink">{shortLink || `${typeof window !== 'undefined' ? window.location.host : 'pdk.id'}/demo123`}</span>
                        <button className="icon-btn" id="demoCopyBtn" aria-label="Salin link" onClick={copyToClipboard}>
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
