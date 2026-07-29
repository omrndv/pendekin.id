import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4"/>
        <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.24 21.3 7.31 24 12 24z" fill="#34A853"/>
        <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z" fill="#FBBC05"/>
        <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
    </svg>
);

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Mulai Sekarang" 
            description="Buat akun gratis untuk menikmati semua fitur Pendekin."
        >
            <Head title="Daftar" />

            <form onSubmit={submit} className="flex flex-col gap-3">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1" htmlFor="name">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <User size={16} />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={`w-full pl-10 pr-4 py-2 rounded-2xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoComplete="name"
                            autoFocus
                            placeholder="Budi Santoso"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1" htmlFor="email">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail size={16} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`w-full pl-10 pr-4 py-2 rounded-2xl border ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoComplete="username"
                            placeholder="budi@contoh.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock size={16} />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className={`w-full pl-10 pr-10 py-2 rounded-2xl border ${errors.password ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1" htmlFor="password_confirmation">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock size={16} />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={`w-full pl-10 pr-10 py-2 rounded-2xl border ${errors.password_confirmation ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password_confirmation}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-11 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                    {processing ? 'Memproses...' : 'Buat Akun Gratis'}
                </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 absolute">
                    atau daftar menggunakan google
                </span>
            </div>

            {/* Google Sign-in Option */}
            <div className="mb-2">
                <a
                    href={route('auth.google')}
                    className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-all shadow-sm hover:shadow active:scale-[0.99]"
                >
                    <GoogleIcon />
                    <span>Daftar dengan Google</span>
                </a>
            </div>

            <p className="text-center text-xs font-medium text-gray-500 mt-5">
                Sudah punya akun?{' '}
                <Link href={route('login')} className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                    Masuk di sini
                </Link>
            </p>
        </AuthLayout>
    );
}
