import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <Link href="/" className="brand">
                        <span className="brand-mark" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 15L15 9M10 6.5L11.5 5C13.4 3.1 16.5 3.1 18.4 5C20.3 6.9 20.3 10 18.4 11.9L16.9 13.4M14 17.5L12.5 19C10.6 20.9 7.5 20.9 5.6 19C3.7 17.1 3.7 14 5.6 12.1L7.1 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                        Pendekin
                    </Link>
                    <p>Perpendek link, lacak performanya, bagikan lebih mudah.</p>
                </div>

                <div className="footer-col">
                    <h4>Fitur</h4>
                    <a href="#features">Pemendek URL</a>
                    <a href="#features">Kustomisasi QR Code</a>
                    <a href="#analytics">Analitik Lengkap</a>
                </div>

                <div className="footer-col">
                    <h4>Dukungan</h4>
                    <Link href="/contact">Hubungi Kami</Link>
                    <Link href="/report">Laporkan Tautan</Link>
                </div>

                <div className="footer-col">
                    <h4>Hukum</h4>
                    <Link href="/terms">Syarat & Ketentuan</Link>
                    <Link href="/privacy">Kebijakan Privasi</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Pendekin. Seluruh hak cipta dilindungi.</p>
            </div>
        </footer>
    );
}

