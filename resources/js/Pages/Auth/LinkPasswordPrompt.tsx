import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

interface PasswordPromptProps {
    slug: string;
    linkTitle?: string;
}

export default function LinkPasswordPrompt({ slug, linkTitle }: PasswordPromptProps) {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/${slug}/unlock`);
    };

    return (
        <AuthLayout title="Link Dilindungi Sandi" description="Masukkan kata sandi untuk mengakses link yang dilindungi.">
            <Head title="Masukkan Kata Sandi Link" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                    Tautan <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200/50">/{slug}</span> terlindungi dan membutuhkan kata sandi untuk diakses.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Kata Sandi Link
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            placeholder="Masukkan kata sandi..."
                            className="w-full pl-4 pr-10 py-3 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {form.errors.password && <p className="mt-1 text-xs text-rose-600 font-bold">{form.errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    <KeyRound size={16} />
                    <span>Buka Link & Lanjutkan</span>
                </button>
            </form>
        </AuthLayout>
    );
}
