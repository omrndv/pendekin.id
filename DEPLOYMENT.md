# Production Deployment Guide — Pendekin SaaS

Panduan langkah demi langkah untuk melakukan *deployment* platform **Pendekin SaaS** ke server produksi (VPS, AWS, DigitalOcean, Cloud Provider).

---

## 1. Prerequisites System Requirements

- PHP 8.2 / 8.3+ dengan ekstensi: `pdo`, `pdo_mysql` / `pdo_pgsql`, `mbstring`, `exif`, `pcntl`, `bcmath`, `gd`, `opcache`, `redis`.
- Database: MySQL 8.0+ / PostgreSQL 14+.
- Redis Server 7.0+.
- Web Server: Nginx / Apache.
- Node.js 18+ & NPM.

---

## 2. Environment Variables Setup (`.env`)

Salin `.env.example` ke `.env` dan sesuaikan variabel kunci:

```ini
APP_NAME=Pendekin
APP_ENV=production
APP_DEBUG=false
APP_URL=https://pendekin.id

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pendekin
DB_USERNAME=pendekin_user
DB_PASSWORD=secret_password

# Redis & Cache
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Midtrans Payment Gateway (Production)
MIDTRANS_SERVER_KEY=Mid-server-YOUR_REAL_KEY
MIDTRANS_CLIENT_KEY=Mid-client-YOUR_REAL_KEY
MIDTRANS_IS_PRODUCTION=true
MIDTRANS_IS_3DS=true
```

---

## 3. Production Deployment Commands

Jalankan perintah berikut di server produksi:

```bash
# 1. Install PHP dependencies
composer install --no-dev --optimize-autoloader

# 2. Migration Database
php artisan migrate --force

# 3. Cache Configuration & Routes
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 4. Install & Build Frontend Assets
npm ci
npm run build
```

---

## 4. Supervisor Configuration (Background Queue Worker)

Buat file `/etc/supervisor/conf.d/pendekin-worker.conf`:

```ini
[program:pendekin-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/worker.log
```

---

## 5. Cron Job Setup (Daily Scheduler)

Tambahkan entri berikut pada `crontab -e`:

```cron
* * * * * cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Automated Backup Strategy

Tambahkan jalannya backup harian pada cron:

```cron
0 2 * * * /var/www/html/scripts/backup.sh >> /var/www/html/storage/logs/backup.log 2>&1
```
