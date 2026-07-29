import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import { Key, Copy, Check, Code, ArrowLeft, Terminal, ShieldCheck, Zap, Server } from 'lucide-react';

export default function ApiDocsPage() {
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'php' | 'python'>('php');

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const baseUrl = 'http://127.0.0.1:8000/api/v1';

    return (
        <>
            <Head title="Dokumentasi REST API v1" />

            <PageHeader
                title="Dokumentasi REST API v1"
                description="Panduan lengkap dan tutorial integrasi REST API Pendekin menggunakan bahasa PHP dan Python."
                breadcrumbs={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'API Keys', href: '/dashboard/api-keys' },
                    { name: 'Dokumentasi API' }
                ]}
                action={
                    <Link
                        href="/dashboard/api-keys"
                        className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft size={15} />
                        <span>Kembali ke API Keys</span>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Navigation Index */}
                <div className="lg:col-span-1 space-y-2">
                    <Card className="p-4 sticky top-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Navigasi Dokumentasi</h4>
                        <nav className="space-y-1 text-xs font-semibold">
                            <a href="#authentication" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">1. Autentikasi API Header</a>
                            <a href="#create-link" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">2. Buat Link Baru (POST)</a>
                            <a href="#list-links" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">3. Daftar Link (GET)</a>
                            <a href="#get-analytics" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">4. Analitik Link (GET)</a>
                            <a href="#delete-link" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">5. Hapus Link (DELETE)</a>
                            <a href="#error-codes" className="block px-3 py-2 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">6. Kode HTTP Response</a>
                        </nav>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* Language Switcher Tabs: Focused on PHP & Python */}
                    <div className="bg-gray-900 p-2 rounded-2xl flex items-center justify-between text-xs font-bold text-white shadow-xl">
                        <span className="text-gray-400 px-3 flex items-center gap-1.5">
                            <Code size={16} className="text-emerald-400" /> Pilih Bahasa Pemrograman:
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedLanguage('php')}
                                className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                                    selectedLanguage === 'php' ? 'bg-emerald-500 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <span className="font-mono text-xs">🐘 PHP (cURL / Guzzle)</span>
                            </button>
                            <button
                                onClick={() => setSelectedLanguage('python')}
                                className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                                    selectedLanguage === 'python' ? 'bg-emerald-500 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <span className="font-mono text-xs">🐍 Python (requests)</span>
                            </button>
                        </div>
                    </div>

                    {/* Section 1: Authentication */}
                    <section id="authentication" className="space-y-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="emerald">Authentication</Badge>
                                <span className="text-xs text-gray-400 font-mono">Bearer Token</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">1. Autentikasi API Header</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Seluruh panggilan REST API v1 memerlukan Header HTTP <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-emerald-600 font-bold">Authorization</code> yang berisi token rahasia API Key milikmu.
                            </p>

                            <div className="relative bg-gray-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
                                <button
                                    onClick={() => handleCopy(`Authorization: Bearer pdk_live_your_secret_api_key`, 'auth')}
                                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    {copiedIndex === 'auth' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <code>Authorization: Bearer pdk_live_your_secret_api_key</code>
                            </div>
                        </Card>
                    </section>

                    {/* Section 2: Create Short Link */}
                    <section id="create-link" className="space-y-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                                <span className="font-mono text-xs text-gray-800 font-bold">{baseUrl}/shorten</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">2. Membuat Short Link Baru</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Gunakan endpoint ini untuk menyingkat URL secara otomatis melalui script backend PHP atau Python kamu.
                            </p>

                            {/* Code Snippet */}
                            <div className="relative bg-gray-900 text-gray-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto mb-4">
                                <button
                                    onClick={() => handleCopy(
                                        selectedLanguage === 'php'
                                            ? `<?php\n\n$apiKey = 'pdk_live_your_secret_api_key';\n$url = '${baseUrl}/shorten';\n\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    'Authorization: Bearer ' . $apiKey,\n    'Content-Type: application/json',\n    'Accept: application/json'\n]);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([\n    'url' => 'https://google.com',\n    'custom_slug' => 'promo-spesial',\n    'title' => 'Kempen Diskon Merdeka'\n]));\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;`
                                            : `import requests\n\napi_key = "pdk_live_your_secret_api_key"\nurl = "${baseUrl}/shorten"\n\nheaders = {\n    "Authorization": f"Bearer {api_key}",\n    "Content-Type": "application/json",\n    "Accept": "application/json"\n}\n\npayload = {\n    "url": "https://google.com",\n    "custom_slug": "promo-spesial",\n    "title": "Kempen Diskon Merdeka"\n}\n\nresponse = requests.post(url, headers=headers, json=payload)\nprint(response.json())`,
                                        'code_create'
                                    )}
                                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    {copiedIndex === 'code_create' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <pre className="text-emerald-400 leading-relaxed">
                                    {selectedLanguage === 'php' ? `<?php

$apiKey = 'pdk_live_your_secret_api_key';
$url = '${baseUrl}/shorten';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://google.com',
    'custom_slug' => 'promo-spesial',
    'title' => 'Kempen Diskon Merdeka'
]));

$response = curl_exec($ch);
curl_close($ch);

echo $response;` : `import requests

api_key = "pdk_live_your_secret_api_key"
url = "${baseUrl}/shorten"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

payload = {
    "url": "https://google.com",
    "custom_slug": "promo-spesial",
    "title": "Kempen Diskon Merdeka"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`}
                                </pre>
                            </div>

                            {/* Response JSON Preview */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Contoh Response (JSON 201 Created):</label>
                                <pre className="bg-gray-950 text-gray-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
{`{
  "success": true,
  "message": "Short link berhasil dibuat.",
  "data": {
    "id": 42,
    "short_slug": "promo-spesial",
    "short_url": "http://127.0.0.1:8000/promo-spesial",
    "original_url": "https://google.com",
    "title": "Kempen Diskon Merdeka",
    "clicks_count": 0,
    "is_active": true,
    "created_at": "2026-07-27T07:45:00.000000Z"
  }
}`}
                                </pre>
                            </div>
                        </Card>
                    </section>

                    {/* Section 3: List Links */}
                    <section id="list-links" className="space-y-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px]">GET</span>
                                <span className="font-mono text-xs text-gray-800 font-bold">{baseUrl}/links</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">3. Mengambil Seluruh Daftar Link</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Mengambil seluruh daftar short link milikmu beserta pagination dan total jumlah klik.
                            </p>

                            <div className="relative bg-gray-900 text-gray-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto mb-4">
                                <button
                                    onClick={() => handleCopy(
                                        selectedLanguage === 'php'
                                            ? `<?php\n\n$apiKey = 'pdk_live_your_secret_api_key';\n$url = '${baseUrl}/links?per_page=15';\n\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    'Authorization: Bearer ' . $apiKey,\n    'Accept: application/json'\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\nvar_dump(json_decode($response, true));`
                                            : `import requests\n\napi_key = "pdk_live_your_secret_api_key"\nurl = "${baseUrl}/links?per_page=15"\n\nheaders = {"Authorization": f"Bearer {api_key}"}\nresponse = requests.get(url, headers=headers)\nprint(response.json())`,
                                        'code_list'
                                    )}
                                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    {copiedIndex === 'code_list' ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <pre className="text-emerald-400 leading-relaxed">
                                    {selectedLanguage === 'php' ? `<?php

$apiKey = 'pdk_live_your_secret_api_key';
$url = '${baseUrl}/links?per_page=15';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Accept: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

var_dump(json_decode($response, true));` : `import requests

api_key = "pdk_live_your_secret_api_key"
url = "${baseUrl}/links?per_page=15"

headers = {"Authorization": f"Bearer {api_key}"}
response = requests.get(url, headers=headers)
print(response.json())`}
                                </pre>
                            </div>
                        </Card>
                    </section>

                    {/* Section 4: Get Single Link */}
                    <section id="get-analytics" className="space-y-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px]">GET</span>
                                <span className="font-mono text-xs text-gray-800 font-bold">{baseUrl}/links/&#123;slug&#125;</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">4. Detail Analitik Link Spasifik</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Mengambil rincian data link berdasarkan alias/slug.
                            </p>
                        </Card>
                    </section>

                    {/* Section 5: Delete Link */}
                    <section id="delete-link" className="space-y-4">
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">DELETE</span>
                                <span className="font-mono text-xs text-gray-800 font-bold">{baseUrl}/links/&#123;slug&#125;</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">5. Menghapus Link</h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Menghapus link dari sistem sehingga tidak lagi dapat diakses oleh pengunjung.
                            </p>
                        </Card>
                    </section>

                    {/* Section 6: Error Codes */}
                    <section id="error-codes" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 font-display mb-3">6. Kode HTTP & Rate Limit</h3>
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                    <Badge variant="emerald">200 / 201 Success</Badge>
                                    <span className="text-gray-700 font-semibold">Permintaan berhasil dieksekusi.</span>
                                </div>
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                                    <Badge variant="warning">401 Unauthorized</Badge>
                                    <span className="text-gray-700 font-semibold">API Key tidak terkirim atau tidak valid.</span>
                                </div>
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                                    <Badge variant="error">429 Rate Limit Exceeded</Badge>
                                    <span className="text-gray-700 font-semibold">Batas 60 permintaan per menit telah terlampaui.</span>
                                </div>
                            </div>
                        </Card>
                    </section>

                </div>
            </div>
        </>
    );
}

ApiDocsPage.layout = (page: any) => <AppLayout children={page} />;
