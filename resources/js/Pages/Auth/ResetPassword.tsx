import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Buat Password Baru" 
            description="Silakan masukkan password baru untuk akun kamu."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5" htmlFor="email">
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-xs text-gray-500 font-sans cursor-not-allowed"
                            autoComplete="username"
                            readOnly
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5" htmlFor="password">
                        Password Baru
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
                            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border ${errors.password ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoComplete="new-password"
                            autoFocus
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5" htmlFor="password_confirmation">
                        Konfirmasi Password Baru
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
                            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border ${errors.password_confirmation ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
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
                    {processing ? 'Memproses...' : 'Simpan Password Baru'}
                </button>
            </form>
        </AuthLayout>
    );
}
