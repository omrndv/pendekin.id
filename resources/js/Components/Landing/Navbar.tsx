import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const toggleScrolled = () => {
            if (window.scrollY > 12) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        toggleScrolled();
        window.addEventListener('scroll', toggleScrolled, { passive: true });
        return () => window.removeEventListener('scroll', toggleScrolled);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="navbar-inner">
                <Link href="/" className="brand">
                    <span className="brand-mark" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 15L15 9M10 6.5L11.5 5C13.4 3.1 16.5 3.1 18.4 5C20.3 6.9 20.3 10 18.4 11.9L16.9 13.4M14 17.5L12.5 19C10.6 20.9 7.5 20.9 5.6 19C3.7 17.1 3.7 14 5.6 12.1L7.1 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    Pendekin
                </Link>

                <nav className="nav-links" aria-label="Navigasi utama">
                    <a href="#how">Cara Kerja</a>
                    <a href="#features">Fitur</a>
                    <Link href="/contact">Hubungi Kami</Link>
                </nav>

                <div className="nav-actions">
                    <Link href={route('login')} className="btn btn-ghost">Login</Link>
                    <Link href={route('register')} className="btn btn-primary btn-sm">Get Started</Link>
                </div>

                <button 
                    className="nav-toggle" 
                    id="navToggle" 
                    aria-label="Buka menu" 
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`} id="navMobile">
                <a href="#how" onClick={() => setMobileMenuOpen(false)}>Cara Kerja</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Hubungi Kami</Link>
                <Link href={route('login')} className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href={route('register')} className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>
        </header>
    );
}
