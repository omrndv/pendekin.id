# 🔗 Pendekin - Premium URL Shortener & Analytics Platform

**Pendekin** adalah platform pemendek tautan (URL Shortener) modern dan premium berbasis SaaS yang dilengkapi dengan analitik lalu lintas mendalam, QR Code studio dinamis, integrasi API pengembang, pusat bantuan, dan dashboard manajemen admin yang komprehensif.

Dibuat menggunakan kombinasi teknologi tangguh modern: **Laravel + React (TypeScript) + Inertia.js + Tailwind CSS**.

---

## 🚀 Fitur Utama

### 1. Fitur Publik & Pengunjung (Public Area)
* **Quick Shorten Instan:** Pengunjung umum dapat memendekkan tautan langsung dari Landing Page.
* **Integrasi Guest Support:** Form kontak publik `/contact` yang memungkinkan pengunjung umum mengirim pengaduan bantuan secara anonim tanpa wajib memiliki akun.
* **Aduan Penyalahgunaan (`/report`):** Membantu menjaga platform tetap aman dari tautan spam/negatif dengan fitur kompresi bukti screenshot otomatis (GD PHP) di bawah 300KB untuk efisiensi penyimpanan server.

### 2. Dashboard Pengguna (User Area)
* **Manajemen Tautan Lengkap:** Pembuatan short link dengan kustom alias (slug), batas maksimum klik, tanggal kedaluwarsa link, dan proteksi kata sandi (*password protected*).
* **QR Code Studio Dinamis:** Hasilkan QR Code secara instan dengan kustomisasi warna latar belakang/pola dan unduh ke format SVG (cetak) atau PNG (web).
* **Analitik Realtime & Geografis:** Grafik tren klik (Recharts), pelacakan asal negara pengunjung (GeoIP), rujukan (*referrer*), serta pembagian jenis perangkat & browser.
* **Developer API Access:** Pengguna paket pengembang dapat membuat token API kunci secara dinamis lengkap dengan monitoring penggunaan rate-limiting dan dokumentasi terpadu.
* **Helpdesk Tickets:** Ajukan pertanyaan atau kendala langsung ke admin melalui modul tiket internal.
* **SaaS Billing & Upgrade:** Pilihan paket *Free, Pro,* dan *Business* yang terintegrasi secara otomatis dengan gateway pembayaran **Midtrans** (termasuk fitur trial dan pembatalan langganan).

### 3. Panel Moderasi & Administrasi (Admin Area)
* **Overview Traffic Global:** Grafik visual pendaftaran pengguna, volume klik link, dan riwayat pemasukan biaya langganan bulanan.
* **Manajemen & Suspend User/Link:** Blokir akun bermasalah atau tangguhkan tautan yang terindikasi melanggar aturan secara aman (soft deleted & restore).
* **Pusat Bantuan Admin:** Balas tiket dukungan, ubah status tiket, dan alokasikan tiket ke staf tertentu.
* **API Health & Audit Logs:** Monitor performa endpoint API pengembang serta rekam jejak log aktivitas tindakan admin di dalam sistem.
* **Pengaturan Sistem Dinamis:** Ubah konfigurasi bypass mode pemeliharaan (*maintenance code*), kunci bypass, dan kredensial pembayaran langsung dari UI.

---

## 🛠️ Stack Teknologi

* **Backend / Core:** PHP 8.2+ & Laravel 11
* **Frontend:** React 19, TypeScript, Inertia.js (SPA Mode)
* **Styling / Design:** Tailwind CSS v4 & Lucide Icons
* **Database & Caching:** MySQL / PostgreSQL & Redis (Cache & Session)
* **Charts:** Recharts
* **Payment Gateway:** Midtrans API

---

## ⚙️ Panduan Instalasi Lokal

### 1. Klon Repositori
```bash
git clone https://github.com/username/short-link.git
cd short-link
```

### 2. Konfigurasi Environment & PHP Dependencies
Copy file `.env.example` menjadi `.env`, lalu sesuaikan database, konfigurasi pos email, dan API Midtrans Anda:
```bash
cp .env.example .env
composer install
php artisan key:generate
```

### 3. Migrasi & Seed Database
Jalankan migrasi database beserta data default/uji awal (termasuk user dummy, paket harga, dan setting default):
```bash
php artisan migrate --seed
```

### 5. Instalasi Frontend Dependencies & Compile
```bash
npm install
npm run build # Atau 'npm run dev' untuk mode development
```

### 6. Jalankan Server Lokal
```bash
php artisan serve
```
Buka `http://127.0.0.1:8000` pada browser Anda.

---

## 🛡️ Lisensi

Proyek platform **Pendekin** dilisensikan di bawah [MIT license](LICENSE).
