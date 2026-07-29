<?php

namespace App\Http\Controllers\User;

use App\Enums\BillingCycle;
use App\Http\Controllers\Controller;
use App\Models\BillingPlan;
use App\Models\CouponCode;
use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\ShortLink;
use App\Services\FeatureGateService;
use App\Services\PaymentService;
use App\Services\SubscriptionService;
use App\Services\UsageTrackerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected SubscriptionService $subscriptionService,
        protected FeatureGateService $featureGateService,
        protected UsageTrackerService $usageTracker
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $planDetails = $this->featureGateService->getPlanDetails($user);

        $linkCountThisMonth = ShortLink::where('user_id', $user->id)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        $defaultFreeQuota = (int) \App\Models\SystemSetting::get('free_link_limit', 50);
        $quota = (int) ($planDetails['features']['monthly_link_limit'] ?? $defaultFreeQuota);

        $plans = BillingPlan::where('is_active', true)->get()->map(function ($p) use ($defaultFreeQuota) {
            if ($p->slug === 'free') {
                $p->link_quota = $defaultFreeQuota;
                // Dynamically update the features array to reflect the setting
                if (is_array($p->features)) {
                    $features = $p->features;
                    if (isset($features['monthly_link_limit'])) {
                        $features['monthly_link_limit'] = $defaultFreeQuota;
                    }
                    $p->features = $features;
                }
            }

            return $p;
        });

        $transactions = PaymentTransaction::where('user_id', $user->id)->latest()->limit(10)->get();
        $invoices = Invoice::where('user_id', $user->id)->latest()->limit(10)->get();

        $featureLabels = [
            'short_link' => 'Short Link',
            'dashboard_analytics' => 'Dashboard Analytics',
            'qr_code_generator' => 'QR Code Generator',
            'custom_slug' => 'Custom Alias',
            'monthly_link_limit' => 'Batas Link Bulanan',
            'analytics_retention_days' => 'Retensi Data Analitik (Hari)',
            'password' => 'Perlindungan Password',
            'expires_at' => 'Batas Waktu Kedaluwarsa',
            'qr_customization' => 'Kustomisasi Warna QR Code',
            'api_access' => 'Akses Developer API',
            'custom_domain' => 'Dukungan Custom Domain',
            'priority_support' => 'Priority Support',
        ];

        return Inertia::render('Dashboard/Billing', [
            'plan_details' => $planDetails,
            'usage' => [
                'current_links' => $linkCountThisMonth,
                'quota' => $quota,
                'percentage' => $quota > 0 ? round(($linkCountThisMonth / $quota) * 100, 1) : 0,
            ],
            'plans' => $plans,
            'feature_labels' => $featureLabels,
            'transactions' => $transactions,
            'invoices' => $invoices,
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        $request->validate([
            'plan_id' => ['required', 'exists:billing_plans,id'],
            'cycle' => ['required', 'string', 'in:monthly,yearly'],
            'coupon_code' => ['nullable', 'string', 'exists:coupon_codes,code'],
        ]);

        $plan = BillingPlan::findOrFail($request->plan_id);
        $cycle = BillingCycle::from($request->cycle);
        $coupon = $request->coupon_code ? CouponCode::where('code', $request->coupon_code)->first() : null;

        if ($coupon && ! $coupon->isValid()) {
            return redirect()->back()->with('flash', [
                'error' => 'Kode kupon tidak valid atau sudah kedaluwarsa.',
            ]);
        }

        try {
            $session = $this->paymentService->checkout($request->user(), $plan, $cycle, $coupon);

            return redirect()->back()->with('flash', [
                'success' => 'Transaksi checkout berhasil dibuat! Silakan tuntaskan pembayaran di Midtrans.',
                'snap_token' => $session['snap_token'],
                'redirect_url' => $session['redirect_url'],
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'error' => 'Gagal menghubungi payment gateway: '.$e->getMessage(),
            ]);
        }
    }

    public function cancelRenewal(Request $request): RedirectResponse
    {
        $subscription = $this->featureGateService->getActiveSubscription($request->user());

        if ($subscription) {
            $this->subscriptionService->cancelRenewal($subscription);
            $cancelsAt = $subscription->cancels_at?->format('d M Y') ?? 'akhir periode';

            return redirect()->back()->with('flash', [
                'success' => "Perpanjangan otomatis berhasil dihentikan. Fitur Pro kamu tetap aktif sampai {$cancelsAt}.",
            ]);
        }

        return redirect()->back()->with('flash', [
            'error' => 'Tidak ditemukan langganan aktif yang dapat dibatalkan.',
        ]);
    }
}
