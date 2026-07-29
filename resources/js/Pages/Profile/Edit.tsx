import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Lock, Trash2 } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
    hasPassword = true,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; hasPassword?: boolean }>) {
    return (
        <>
            <Head title="Pengaturan Profil" />

            <PageHeader
                title="Pengaturan Profil & Keamanan"
                description="Kelola informasi pribadi, ubah kata sandi, dan atur keamanan akun Pendekin kamu."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Pengaturan Profil' }]}
            />

            <div className="space-y-6 max-w-4xl">
                {/* Information Form */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 font-display">
                                Informasi Profil
                            </h3>
                            <p className="text-xs text-gray-500">
                                Perbarui nama lengkap dan alamat email utama akun kamu.
                            </p>
                        </div>
                    </div>

                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Password Form */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 font-display">
                                {hasPassword ? 'Ubah Kata Sandi' : 'Buat Kata Sandi Baru'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {hasPassword 
                                    ? 'Pastikan akun kamu menggunakan kata sandi yang panjang dan aman.' 
                                    : 'Akun kamu masuk via Google OAuth. Buat kata sandi baru untuk mengaktifkan login konvensional.'}
                            </p>
                        </div>
                    </div>

                    <UpdatePasswordForm hasPassword={hasPassword} />
                </div>

                {/* Delete Account Form */}
                <div className="bg-white border border-rose-200/80 bg-rose-50/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-100">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 font-display">
                                Hapus Akun
                            </h3>
                            <p className="text-xs text-gray-500">
                                Tindakan ini bersifat permanen dan seluruh data link kamu akan dihapus.
                            </p>
                        </div>
                    </div>

                    <DeleteUserForm hasPassword={hasPassword} />
                </div>
            </div>
        </>
    );
}

Edit.layout = (page: any) => <AppLayout children={page} />;
