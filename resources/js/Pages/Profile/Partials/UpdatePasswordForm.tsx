import { useState, useRef, FormEventHandler } from 'react';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Lock, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordForm({
    className = '',
    hasPassword = true,
}: {
    className?: string;
    hasPassword?: boolean;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-5 max-w-xl">
                {/* Current Password */}
                {hasPassword && (
                    <div>
                        <label htmlFor="current_password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                            Kata Sandi Saat Ini
                        </label>
                        <div className="relative">
                            <input
                                id="current_password"
                                ref={currentPasswordInput}
                                type={showCurrent ? 'text' : 'password'}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                autoComplete="current-password"
                                className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.current_password && <p className="mt-1 text-xs text-rose-600">{errors.current_password}</p>}
                    </div>
                )}

                {/* New Password */}
                <div>
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Kata Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            ref={passwordInput}
                            type={showNew ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-sans transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-xs text-rose-600">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <Save size={15} />
                        <span>{hasPassword ? 'Perbarui Kata Sandi' : 'Simpan Kata Sandi'}</span>
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 size={15} />
                            <span>Tersimpan!</span>
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
