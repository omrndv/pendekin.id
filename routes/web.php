<?php

use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminApiMonitoringController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminLinkController;
use App\Http\Controllers\Admin\AdminLogController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\AnalyticsController;
use App\Http\Controllers\User\ApiKeyController;
use App\Http\Controllers\User\BillingController;
use App\Http\Controllers\User\LinkController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\QrCodeController;
use App\Http\Controllers\User\UserDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing', [
        'totalLinks' => \App\Models\ShortLink::count(),
        'totalUsers' => \App\Models\User::count(),
    ]);
});

// Dynamic Secret Maintenance Bypass Route for Admin Device
Route::get('/bypass/{bypass_code}', function (\Illuminate\Http\Request $request, string $bypassCode) {
    $activeSecret = strtolower(\App\Models\SystemSetting::get('maintenance_secret_code', 'admin-ganteng'));

    if (strtolower($bypassCode) === $activeSecret) {
        $cookie = cookie('bypass_maintenance', 'true', 60 * 24 * 60); // 60 days

        if (auth()->check() && ! auth()->user()->hasRole('admin')) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        $request->session()->put('bypass_maintenance', true);

        if (auth()->check() && auth()->user()->hasRole('admin')) {
            return redirect('/admin/dashboard')->withCookie($cookie)->with('flash', [
                'success' => 'Akses Bypass Maintenance aktif! Selamat datang kembali Admin.',
            ]);
        }

        return redirect('/login')->withCookie($cookie)->with('flash', [
            'success' => 'Akses Bypass Maintenance aktif! Silakan login menggunakan Akun Admin.',
        ]);
    }

    return redirect('/login');
});

// removed bad catch all route

// Public Report Route
Route::get('/report', [\App\Http\Controllers\ReportController::class, 'create'])->name('report.create');
Route::post('/report', [\App\Http\Controllers\ReportController::class, 'store'])->name('report.store');

// Public Contact Route
Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

// Public Legal Routes
Route::get('/terms', fn() => \Inertia\Inertia::render('Public/Terms'))->name('terms');
Route::get('/privacy', fn() => \Inertia\Inertia::render('Public/Privacy'))->name('privacy');

// User Dashboard Hub
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    // Link Engine Routes
    Route::get('/dashboard/links', [LinkController::class, 'index'])->name('dashboard.links');
    Route::post('/dashboard/links', [LinkController::class, 'store'])->name('dashboard.links.store');
    Route::patch('/dashboard/links/{link}', [LinkController::class, 'update'])->name('dashboard.links.update');
    Route::delete('/dashboard/links/{link}', [LinkController::class, 'destroy'])->name('dashboard.links.destroy');
    Route::post('/dashboard/links/{id}/restore', [LinkController::class, 'restore'])->name('dashboard.links.restore');
    Route::patch('/dashboard/links/{link}/toggle', [LinkController::class, 'toggleStatus'])->name('dashboard.links.toggle');

    // User Tickets (Helpdesk)
    Route::get('/dashboard/support', [\App\Http\Controllers\User\UserTicketController::class, 'index'])->name('dashboard.support');
    Route::get('/dashboard/support/create', [\App\Http\Controllers\User\UserTicketController::class, 'create'])->name('dashboard.support.create');
    Route::post('/dashboard/support', [\App\Http\Controllers\User\UserTicketController::class, 'store'])->name('dashboard.support.store');
    Route::get('/dashboard/support/{ticket}', [\App\Http\Controllers\User\UserTicketController::class, 'show'])->name('dashboard.support.show');
    Route::post('/dashboard/support/{ticket}/reply', [\App\Http\Controllers\User\UserTicketController::class, 'reply'])->name('dashboard.support.reply');

    Route::get('/dashboard/analytics', [AnalyticsController::class, 'index'])->name('dashboard.analytics');
    Route::get('/dashboard/qr-codes', [QrCodeController::class, 'index'])->name('dashboard.qr-codes');
    Route::post('/dashboard/qr-codes', [QrCodeController::class, 'store'])->name('dashboard.qr-codes.store');
    Route::get('/dashboard/api-keys', [ApiKeyController::class, 'index'])->name('dashboard.api-keys');
    Route::get('/dashboard/api-docs', fn () => Inertia::render('Dashboard/ApiDocs'))->name('dashboard.api-docs');
    Route::middleware(['subscription.feature:api_access'])->group(function () {
        Route::post('/dashboard/api-keys', [ApiKeyController::class, 'store'])->name('dashboard.api-keys.store');
        Route::delete('/dashboard/api-keys/{apiKey}', [ApiKeyController::class, 'destroy'])->name('dashboard.api-keys.destroy');
    });
    Route::get('/dashboard/billing', [BillingController::class, 'index'])->name('dashboard.billing');
    Route::post('/dashboard/billing/checkout', [BillingController::class, 'checkout'])->name('dashboard.billing.checkout');
    Route::post('/dashboard/billing/cancel', [BillingController::class, 'cancelRenewal'])->name('dashboard.billing.cancel');
    Route::post('/dashboard/billing/cancel-renewal', [BillingController::class, 'cancelRenewal'])->name('dashboard.billing.cancel-renewal');
    Route::get('/dashboard/notifications', [NotificationController::class, 'index'])->name('dashboard.notifications');
    Route::post('/dashboard/notifications/mark-read', [NotificationController::class, 'markAllRead'])->name('dashboard.notifications.mark-read');
    Route::post('/dashboard/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('dashboard.notifications.read');
    Route::delete('/dashboard/notifications/{id}', [NotificationController::class, 'destroy'])->name('dashboard.notifications.destroy');
});

// Public Webhook Routes (CSRF Exempt)
Route::post('/webhooks/midtrans', [\App\Http\Controllers\WebhookController::class, 'handleMidtrans'])->name('webhook.midtrans');

// Admin Dashboard Hub (Role Protected)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show')->withTrashed();
    Route::patch('/users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('admin.users.suspend')->withTrashed();
    Route::patch('/users/{user}/activate', [AdminUserController::class, 'activate'])->name('admin.users.activate')->withTrashed();
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy')->withTrashed();
    Route::delete('/users/{user}/force', [AdminUserController::class, 'forceDelete'])->name('admin.users.force-delete')->withTrashed();
    Route::post('/users/{user}/restore', [AdminUserController::class, 'restore'])->name('admin.users.restore')->withTrashed();
    Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.role')->withTrashed();
    Route::post('/users/{user}/plan', [AdminUserController::class, 'updatePlan'])->name('admin.users.plan')->withTrashed();
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.users.reset-password')->withTrashed();

    Route::get('/links', [AdminLinkController::class, 'index'])->name('admin.links');
    Route::get('/links/{id}', [AdminLinkController::class, 'show'])->name('admin.links.show');
    Route::patch('/links/{id}/suspend', [AdminLinkController::class, 'suspend'])->name('admin.links.suspend');
    Route::patch('/links/{id}/activate', [AdminLinkController::class, 'activate'])->name('admin.links.activate');
    Route::delete('/links/{id}', [AdminLinkController::class, 'destroy'])->name('admin.links.destroy');
    Route::delete('/links/{id}/force', [AdminLinkController::class, 'forceDelete'])->name('admin.links.force-delete');
    Route::post('/links/{id}/restore', [AdminLinkController::class, 'restore'])->name('admin.links.restore');
    Route::patch('/links/{id}/flag', [AdminLinkController::class, 'toggleFlag'])->name('admin.links.flag');

    Route::get('/reports', [AdminReportController::class, 'index'])->name('admin.reports');
    Route::post('/reports/{report}/approve', [AdminReportController::class, 'approve'])->name('admin.reports.approve');
    Route::post('/reports/{report}/reject', [AdminReportController::class, 'reject'])->name('admin.reports.reject');

    // Admin Tickets (Helpdesk)
    Route::get('/tickets', [\App\Http\Controllers\Admin\AdminTicketController::class, 'index'])->name('admin.tickets');
    Route::get('/tickets/{ticket}', [\App\Http\Controllers\Admin\AdminTicketController::class, 'show'])->name('admin.tickets.show');
    Route::post('/tickets/{ticket}/reply', [\App\Http\Controllers\Admin\AdminTicketController::class, 'reply'])->name('admin.tickets.reply');
    Route::patch('/tickets/{ticket}/status', [\App\Http\Controllers\Admin\AdminTicketController::class, 'updateStatus'])->name('admin.tickets.status');
    Route::post('/tickets/{ticket}/assign', [\App\Http\Controllers\Admin\AdminTicketController::class, 'assign'])->name('admin.tickets.assign');

    Route::get('/billing', [\App\Http\Controllers\Admin\AdminBillingController::class, 'index'])->name('admin.billing');
    Route::patch('/billing/subscriptions/{subscription}/activate', [\App\Http\Controllers\Admin\AdminBillingController::class, 'manualActivate'])->name('admin.billing.activate');
    Route::patch('/billing/subscriptions/{subscription}/purge', [\App\Http\Controllers\Admin\AdminBillingController::class, 'purgeCorrupt'])->name('admin.billing.purge');
    Route::patch('/billing/subscriptions/{subscription}/cancel', [\App\Http\Controllers\Admin\AdminBillingController::class, 'cancelSubscription'])->name('admin.billing.cancel');

    Route::get('/analytics', [AdminAnalyticsController::class, 'index'])->name('admin.analytics');
    Route::get('/api-monitoring', [AdminApiMonitoringController::class, 'index'])->name('admin.api-monitoring');
    Route::get('/logs', [AdminLogController::class, 'index'])->name('admin.logs');
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');
    Route::get('/roles', [AdminRoleController::class, 'index'])->name('admin.roles');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Ultra-Fast Redirect Engine (Must be registered last to avoid route conflicts)
Route::middleware(['throttle:300,1'])->group(function () {
    Route::post('/{slug}/unlock', [\App\Http\Controllers\RedirectController::class, 'unlockPassword'])->name('link.unlock');
    Route::get('/{slug}', function (\Illuminate\Http\Request $request, string $slug) {
        $activeSecret = strtolower(\App\Models\SystemSetting::get('maintenance_secret_code', 'admin-ganteng'));

        if (strtolower($slug) === $activeSecret) {
            $cookie = cookie('bypass_maintenance', 'true', 60 * 24 * 60); // 60 days

            if (auth()->check() && ! auth()->user()->hasRole('admin')) {
                auth()->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            $request->session()->put('bypass_maintenance', true);

            if (auth()->check() && auth()->user()->hasRole('admin')) {
                return redirect('/admin/dashboard')->withCookie($cookie)->with('flash', [
                    'success' => 'Akses Bypass Maintenance aktif! Selamat datang kembali Admin.',
                ]);
            }

            return redirect('/login')->withCookie($cookie)->with('flash', [
                'success' => 'Akses Bypass Maintenance aktif! Silakan login menggunakan Akun Admin.',
            ]);
        }

        return app(\App\Http\Controllers\RedirectController::class)->redirect($request, $slug);
    })->name('link.redirect');
});
