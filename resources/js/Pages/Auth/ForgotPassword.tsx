import { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout 
            title="Lupa Password?" 
            description="Masukkan email kamu untuk menerima instruksi pemulihan kata sandi."
        >
            <Head title="Reset Password" />

            {status && (
                <div className="mb-5 p-3 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    {status}
                </div>
            )}

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
                            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans`}
                            autoFocus
                            placeholder="budi@contoh.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-11 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                    {processing ? 'Memproses...' : 'Kirim Link Reset Password'}
                </button>

                <div className="text-center mt-2">
                    <Link 
                        href={route('login')} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft size={14} /> Kembali ke halaman Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
