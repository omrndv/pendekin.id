<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Models\BillingPlan;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBillingController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService
    ) {}

    public function index(Request $request): Response
    {
        $totalRevenue = PaymentTransaction::where('status', PaymentStatus::SUCCESS)->sum('gross_amount');
        $activeSubscribers = Subscription::whereIn('status', [SubscriptionStatus::ACTIVE, SubscriptionStatus::TRIALING])->count();

        // Monthly Recurring Revenue (MRR)
        $mrr = PaymentTransaction::where('status', PaymentStatus::SUCCESS)
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('gross_amount');

        $arr = $mrr * 12;

        $transactions = PaymentTransaction::with(['user', 'subscription.plan'])->latest()->paginate(15);

        // Fetch subscriptions with payment verification flag
        $subscriptions = Subscription::with(['user', 'plan', 'transactions'])
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($sub) {
                $hasValidPayment = $sub->transactions->contains(fn ($t) => $t->status === PaymentStatus::SUCCESS);
                $isCorrupt = $sub->status === SubscriptionStatus::ACTIVE && ! $hasValidPayment;

                return [
                    'id' => $sub->id,
                    'user' => $sub->user ? ['name' => $sub->user->name, 'email' => $sub->user->email] : null,
                    'plan_name' => $sub->plan_snapshot['name'] ?? $sub->plan->name,
                    'status' => $sub->status->value,
                    'cycle' => $sub->cycle->value,
                    'starts_at' => $sub->starts_at?->toIso8601String(),
                    'ends_at' => $sub->ends_at?->toIso8601String(),
                    'is_corrupt' => $isCorrupt,
                ];
            });

        $plans = BillingPlan::all();

        return Inertia::render('Admin/Billing', [
            'metrics' => [
                'total_revenue' => (float) $totalRevenue,
                'active_subscribers' => $activeSubscribers,
                'mrr' => (float) $mrr,
                'arr' => (float) $arr,
            ],
            'transactions' => $transactions,
            'subscriptions' => $subscriptions,
            'plans' => $plans,
        ]);
    }

    public function manualActivate(Request $request, Subscription $subscription): RedirectResponse
    {
        $cycle = \App\Enums\BillingCycle::tryFrom($request->input('cycle', 'monthly')) ?? \App\Enums\BillingCycle::MONTHLY;
        $this->subscriptionService->activateSubscription($subscription, $cycle);

        return redirect()->back()->with('flash', [
            'success' => "Subscription #{$subscription->id} berhasil diaktifkan secara manual.",
        ]);
    }

    public function purgeCorrupt(Subscription $subscription): RedirectResponse
    {
        $subscription->update(['status' => SubscriptionStatus::EXPIRED]);

        return redirect()->back()->with('flash', [
            'success' => "Subscription corrupt #{$subscription->id} berhasil di-reset menjadi EXPIRED.",
        ]);
    }
}
