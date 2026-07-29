import { useState, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Link2, Settings2, Copy, CheckCircle2 } from 'lucide-react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function QuickShortenCard() {
    const [showOptions, setShowOptions] = useState(false);
    const [createdUrl, setCreatedUrl] = useState<string | null>(null);

    const form = useForm({
        original_url: '',
        custom_slug: '',
        title: '',
    });

    const handleShorten = (e: FormEvent) => {
        e.preventDefault();
        if (!form.data.original_url) return;

        form.post('/dashboard/links', {
            onSuccess: (page: any) => {
                const domain = typeof window !== 'undefined' ? window.location.origin : '';
                const slug = form.data.custom_slug || 'link';
                setCreatedUrl(`${domain}/${slug}`);
                form.reset();
                setShowOptions(false);
            },
        });
    };

    return (
        <div className="bg-surface p-6 md:p-8 rounded-3xl border border-border shadow-sm mb-8">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2 font-display">
                <div className="p-2 bg-primary-soft text-primary rounded-lg">
                    <Link2 size={20} />
                </div>
                Perpendek Link Baru
            </h3>

            <form onSubmit={handleShorten}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Input
                            type="url"
                            placeholder="https://contoh-website.com/halaman-sangat-panjang-sekali"
                            value={form.data.original_url}
                            onChange={(e) => form.setData('original_url', e.target.value)}
                            required
                            className="w-full pl-5 py-4 bg-bg border-transparent focus:bg-surface focus:border-primary"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-[56px] px-6 shrink-0 md:hidden"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <Settings2 size={20} /> Opsi
                    </Button>
                    <Button type="submit" disabled={form.processing} className="h-[56px] px-8 shrink-0 shadow-md">
                        {form.processing ? 'Memproses...' : 'Perpendek'}
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5 hidden md:flex cursor-pointer"
                    >
                        <Settings2 size={16} /> Opsi Tambahan (Custom Alias)
                    </button>
                </div>

                {showOptions && (
                    <div className="mt-4 p-5 bg-bg rounded-2xl border border-border animate-fade-in-up">
                        <label className="block text-sm font-bold text-text-primary mb-2 font-display">
                            Custom Alias (Opsional)
                        </label>
                        <div className="flex items-center gap-3">
                            <span className="text-text-secondary font-mono text-xs">
                                {typeof window !== 'undefined' ? window.location.host + '/' : '/'}
                            </span>
                            <Input
                                type="text"
                                placeholder="my-campaign"
                                value={form.data.custom_slug}
                                onChange={(e) => form.setData('custom_slug', e.target.value)}
                                className="flex-1 bg-surface border-border py-3 font-mono text-xs"
                            />
                        </div>
                    </div>
                )}
            </form>

            {createdUrl && (
                <div className="mt-6 flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-fade-in-up">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="truncate">
                            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">Link Berhasil Dibuat!</div>
                            <span className="font-mono font-bold text-emerald-900 text-base">{createdUrl}</span>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white hover:bg-gray-50 border border-emerald-200 text-emerald-700 shrink-0 shadow-sm cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(createdUrl)}
                    >
                        <Copy size={16} /> Salin
                    </Button>
                </div>
            )}
        </div>
    );
}
