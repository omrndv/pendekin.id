import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout 
            title="Verifikasi Email" 
            description="Silakan periksa email kamu dan klik link verifikasi yang telah kami kirimkan."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-5 p-3 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    Link verifikasi baru telah dikirimkan ke email kamu.
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-11 mt-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                    {processing ? 'Memproses...' : 'Kirim Ulang Email Verifikasi'}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                    <Link
                        href={route('profile.edit')}
                        className="font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Edit Profil
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                        Keluar (Log Out)
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
