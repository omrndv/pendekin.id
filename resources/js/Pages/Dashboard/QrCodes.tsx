import { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import { ShortLink, PageProps } from '@/types';
import { QrCode as QrIcon, Download, Palette, Check, Save, Pipette } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PaginatedData<T> {
    data: T[];
}

interface UserQrCodesProps {
    userLinks: PaginatedData<ShortLink>;
    can_customize_qr: boolean;
}

export default function UserQrCodesPage({ userLinks, can_customize_qr }: UserQrCodesProps) {
    const flash = usePage<PageProps>().props.flash;
    const links = userLinks?.data || [];

    const colorInputRef = useRef<HTMLInputElement>(null);

    const [selectedLinkId, setSelectedLinkId] = useState<number>(links[0]?.id || 0);
    const [fgColor, setFgColor] = useState(can_customize_qr ? '#10B981' : '#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [downloaded, setDownloaded] = useState(false);

    const form = useForm({
        short_link_id: selectedLinkId,
        fg_color: fgColor,
        bg_color: bgColor,
    });

    const selectedLink = links.find((l) => l.id === Number(selectedLinkId)) || links[0];
    const targetUrl = selectedLink ? (selectedLink.short_url || `${typeof window !== 'undefined' ? window.location.origin : ''}/${selectedLink.short_slug}`) : 'https://pendekin.site/demo';

    const handleColorChange = (color: string) => {
        const isAllowed = can_customize_qr || color === '#10B981' || color === '#000000' || color === '#111827';
        if (!isAllowed) return;
        setFgColor(color);
        form.setData('fg_color', color);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!can_customize_qr) return;
        const color = e.target.value;
        setFgColor(color);
        form.setData('fg_color', color);
    };

    const handleSelectLink = (id: number) => {
        setSelectedLinkId(id);
        form.setData('short_link_id', id);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/qr-codes');
    };

    const handleDownload = () => {
        const svgElement = document.getElementById('previewQrSvg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, 1000, 1000);
                ctx.drawImage(img, 0, 0, 1000, 1000);

                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `qrcode_${selectedLink?.short_slug || 'pendekin'}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
    };

    return (
        <>
            <Head title="QR Code Studio" />

            <PageHeader
                title="QR Code Studio & Customizer"
                description="Buat dan kustomisasi QR Code vektor interaktif untuk pemasaran brosur, produk, dan media cetak."
                breadcrumbs={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'QR Codes' }]}
            />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 animate-fade-in">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Controls */}
                <form onSubmit={handleSave} className="lg:col-span-2 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 font-display">
                            Pilih Target Short Link
                        </label>
                        {links.length === 0 ? (
                            <p className="text-xs text-gray-400">Belum ada link terbuat. Buat link terlebih dahulu.</p>
                        ) : (
                            <select
                                value={selectedLinkId}
                                onChange={(e) => handleSelectLink(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono"
                            >
                                {links.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.title} ({l.short_slug})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2 font-display">
                            <Palette size={14} className="text-emerald-600" />
                            Pilih Warna Utama QR Code
                        </label>
                        <div className="flex items-center gap-3">
                            {/* Hijau Option */}
                            <button
                                type="button"
                                onClick={() => handleColorChange('#10B981')}
                                className={`w-9 h-9 rounded-xl border-2 transition-all cursor-pointer ${
                                    fgColor === '#10B981' ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: '#10B981' }}
                                title="Hijau Pendekin"
                            />

                            {/* Hitam Option */}
                            <button
                                type="button"
                                onClick={() => handleColorChange('#000000')}
                                className={`w-9 h-9 rounded-xl border-2 transition-all cursor-pointer ${
                                    fgColor === '#000000' ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: '#000000' }}
                                title="Hitam"
                            />

                            {/* Custom Color Option */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (can_customize_qr) {
                                            colorInputRef.current?.click();
                                        }
                                    }}
                                    className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                                        fgColor !== '#10B981' && fgColor !== '#000000'
                                            ? 'border-gray-900 scale-110 shadow-md'
                                            : 'border-gray-200'
                                    } ${!can_customize_qr ? 'opacity-30 cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                    style={{
                                        backgroundColor: fgColor !== '#10B981' && fgColor !== '#000000' ? fgColor : undefined
                                    }}
                                    title={can_customize_qr ? "Pilih Warna Kustom" : "Pilih Warna Kustom (PRO)"}
                                >
                                    <Pipette size={14} className={fgColor !== '#10B981' && fgColor !== '#000000' ? 'text-white mix-blend-difference' : ''} />
                                </button>
                                <input
                                    ref={colorInputRef}
                                    type="color"
                                    value={fgColor}
                                    onChange={handleCustomColorChange}
                                    className="sr-only"
                                    disabled={!can_customize_qr}
                                />
                            </div>
                        </div>
                        {!can_customize_qr && (
                            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider shrink-0">PRO</span>
                                <div className="text-[11px] font-bold text-emerald-800">
                                    Paket Free hanya dapat menggunakan warna <strong>Hitam</strong> & <strong>Hijau Pendekin</strong>. Upgrade untuk memilih warna kustom sendiri.
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing || links.length === 0}
                        className="h-10 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <Save size={15} />
                        <span>Simpan Konfigurasi QR</span>
                    </button>
                </form>

                {/* Live Vector SVG Preview Card */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <Badge variant="emerald" className="mb-4">Live Preview</Badge>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-3xl mb-6 shadow-inner flex items-center justify-center">
                        <QRCodeSVG
                            id="previewQrSvg"
                            value={targetUrl}
                            size={200}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            level="H"
                            includeMargin={true}
                            className="rounded-2xl border-4 border-white shadow-md transition-all duration-300"
                        />
                    </div>

                    <div className="text-xs font-mono font-bold text-gray-700 truncate max-w-xs mb-4">{targetUrl}</div>

                    <button
                        onClick={handleDownload}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {downloaded ? <Check size={16} /> : <Download size={16} />}
                        <span>{downloaded ? 'Terunduh!' : 'Unduh Berkas QR (PNG)'}</span>
                    </button>
                </div>
            </div>
        </>
    );
}

UserQrCodesPage.layout = (page: any) => <AppLayout children={page} />;
