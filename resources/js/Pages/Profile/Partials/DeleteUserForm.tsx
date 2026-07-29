import { useRef, useState, FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
    hasPassword = true,
}: {
    className?: string;
    hasPassword?: boolean;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => {
                if (hasPassword) {
                    passwordInput.current?.focus();
                }
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <p className="text-xs text-gray-600 mb-4 max-w-xl leading-relaxed">
                Setelah akun kamu dihapus, seluruh resource, tautan pendek, dan analitik akan dihapus secara permanen dari server. Silakan cadangkan data penting kamu sebelum melanjutkan.
            </p>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
                <Trash2 size={15} />
                <span>Hapus Akun Permanen</span>
            </button>

            <Modal
                isOpen={confirmingUserDeletion}
                onClose={closeModal}
                title="Hapus Akun Kamu Secara Permanen?"
                description={hasPassword 
                    ? "Masukkan kata sandi kamu untuk memverifikasi tindakan penghapusan akun ini." 
                    : "Konfirmasi tindakan penghapusan akun Pendekin kamu."}
                maxWidth="md"
            >
                <form onSubmit={deleteUser} className="space-y-4">
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                        <AlertTriangle size={18} className="shrink-0 text-rose-600" />
                        <span>Tindakan ini tidak dapat dibatalkan. Seluruh data kamu akan terhapus selamanya.</span>
                    </div>

                    {hasPassword && (
                        <div>
                            <label htmlFor="delete_password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Kata Sandi Verifikasi
                            </label>
                            <div className="relative">
                                <input
                                    id="delete_password"
                                    ref={passwordInput}
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan kata sandi kamu"
                                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-sans"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Hapus Akun Permanen
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
