import { Head } from '@inertiajs/react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
            <Head title="Sistem Dalam Pemeliharaan" />

            <div className="max-w-md w-full space-y-3">
                <h1 className="text-2xl font-extrabold font-display text-white">
                    Sistem Sedang Dalam Pemeliharaan
                </h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Platform Pendekin sedang menjalani perawatan berkala dan pembaruan sistem oleh Administrator untuk meningkatkan kualitas layanan.
                </p>
            </div>
        </div>
    );
}
