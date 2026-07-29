import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between items-center relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-600">
            {/* Background Decorative Gradients */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Spacer Top */}
            <div className="pt-8" />

            {/* Main Auth Content Card */}
            <main className="w-full max-w-[440px] px-4 py-4 relative z-10 my-auto">
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl shadow-xl p-8 sm:p-10 transition-all">
                    {/* Header Brand & Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-gray-900 group">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md group-hover:scale-105 transition-transform">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 15L15 9M10 6.5L11.5 5C13.4 3.1 16.5 3.1 18.4 5C20.3 6.9 20.3 10 18.4 11.9L16.9 13.4M14 17.5L12.5 19C10.6 20.9 7.5 20.9 5.6 19C3.7 17.1 3.7 14 5.6 12.1L7.1 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="font-display">Pendekin</span>
                        </Link>

                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors bg-gray-100/80 hover:bg-emerald-50 px-3 py-1.5 rounded-full"
                        >
                            <ArrowLeft size={14} />
                            <span>Beranda</span>
                        </Link>
                    </div>

                    <div className="text-left mb-6">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-display mb-1.5">
                            {title}
                        </h1>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </main>

            {/* Footer Copyright */}
            <footer className="w-full text-center py-6 text-xs text-gray-400 font-medium relative z-10">
                &copy; {new Date().getFullYear()} Pendekin. Seluruh hak cipta dilindungi.
            </footer>
        </div>
    );
}
