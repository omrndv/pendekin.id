<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\AdminUserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function __construct(
        protected AdminUserService $adminUserService
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::withTrashed()->withCount('shortLinks')->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->input('status')) {
            if ($status === 'suspended') {
                $query->where('is_active', false)->whereNull('deleted_at');
            } elseif ($status === 'deleted') {
                $query->whereNotNull('deleted_at');
            } elseif ($status === 'active') {
                $query->where('is_active', true)->whereNull('deleted_at');
            }
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->load(['subscription.plan', 'apiKeys']);
        $user->loadCount(['shortLinks', 'apiKeys', 'qrCodes']);

        // Stats: Total Clicks
        $totalClicks = \App\Models\ShortLink::where('user_id', $user->id)->sum('clicks_count');

        // Revenue: Total Gross Amount from PaymentTransactions
        $totalRevenue = \App\Models\PaymentTransaction::where('user_id', $user->id)
            ->where('status', \App\Enums\PaymentStatus::SUCCESS)
            ->sum('gross_amount');

        // Login History
        $loginHistory = \App\Models\LoginHistory::where('user_id', $user->id)
            ->latest()
            ->take(10)
            ->get();

        // Active Sessions from sessions table
        $activeSessions = \Illuminate\Support\Facades\DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderBy('last_activity', 'desc')
            ->get();

        $latestSession = $activeSessions->first();
        $latestLogin = $loginHistory->first();

        $userAgent = $latestSession?->user_agent ?? $latestLogin?->user_agent ?? request()->userAgent();
        $browser = 'Chrome';
        if (str_contains($userAgent, 'Firefox')) {
            $browser = 'Firefox';
        } elseif (str_contains($userAgent, 'Safari') && ! str_contains($userAgent, 'Chrome')) {
            $browser = 'Safari';
        } elseif (str_contains($userAgent, 'Edge')) {
            $browser = 'Edge';
        }

        $device = 'Desktop';
        if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android') || str_contains($userAgent, 'iPhone')) {
            $device = 'Mobile';
        }

        $user->last_ip = $user->last_ip ?? $latestSession?->ip_address ?? $latestLogin?->ip_address ?? request()->ip();
        $user->last_activity_at = $user->last_login_at ?? ($latestSession ? \Carbon\Carbon::createFromTimestamp($latestSession->last_activity)->toIso8601String() : null) ?? $latestLogin?->created_at?->toIso8601String();
        $user->last_browser = $user->last_browser ?? $browser;
        $user->last_device = $user->last_device ?? $device;

        $plans = \App\Models\BillingPlan::where('is_active', true)->get();

        return Inertia::render('Admin/UserDetail', [
            'targetUser' => $user,
            'stats' => [
                'total_clicks' => $totalClicks,
                'total_revenue' => $totalRevenue,
            ],
            'loginHistory' => $loginHistory,
            'activeSessions' => $activeSessions,
            'plans' => $plans,
        ]);
    }

    public function suspend(User $user, Request $request): RedirectResponse
    {
        $this->authorize('suspend', $user);

        $reason = $request->input('reason', 'Violation of terms.');
        $this->adminUserService->suspend($user, $request->user(), $reason);

        return redirect()->back()->with('flash', [
            'success' => "Akun {$user->name} berhasil ditangguhkan (Suspended).",
        ]);
    }

    public function activate(User $user, Request $request): RedirectResponse
    {
        $this->authorize('suspend', $user);

        $this->adminUserService->activate($user, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Akun {$user->name} berhasil diaktifkan kembali.",
        ]);
    }

    public function destroy(User $user, Request $request): RedirectResponse
    {
        $this->authorize('delete', $user);

        $this->adminUserService->softDelete($user, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Akun {$user->name} berhasil dihapus sementara (Soft Delete).",
        ]);
    }

    public function forceDelete(User $user, Request $request): RedirectResponse
    {
        $this->authorize('delete', $user);

        $this->adminUserService->forceDelete($user, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Akun {$user->name} berhasil dihapus secara permanen.",
        ]);
    }

    public function restore(User $user, Request $request): RedirectResponse
    {
        $this->authorize('restore', $user);

        $this->adminUserService->restore($user, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Akun {$user->name} berhasil dipulihkan dari daftar hapus.",
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $this->authorize('changeRole', $user);

        $request->validate([
            'role' => ['required', 'string', 'in:user,admin,moderator'],
        ]);

        $this->adminUserService->changeRole($user, $request->role, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Role {$user->name} berhasil diubah menjadi {$request->role}.",
        ]);
    }

    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $this->authorize('resetPassword', $user);

        try {
            if ($request->input('type') === 'email') {
                $this->adminUserService->sendPasswordResetEmail($user, $request->user());
                $message = "Link reset password berhasil dikirim ke email {$user->email}.";
            } else {
                $customPassword = $request->input('password');
                $newPassword = ! empty($customPassword) ? $customPassword : Str::random(12);
                $this->adminUserService->forceResetPassword($user, $request->user(), $newPassword);
                $message = "Password akun {$user->name} berhasil diperbarui menjadi: {$newPassword}";
            }

            return redirect()->back()->with('flash', [
                'success' => $message,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function updatePlan(Request $request, User $user): RedirectResponse
    {
        $this->authorize('changeRole', $user); // Use changeRole authorization or view

        $request->validate([
            'plan_id' => ['required', 'exists:billing_plans,id'],
        ]);

        $plan = \App\Models\BillingPlan::findOrFail($request->plan_id);
        $this->adminUserService->assignPlan($user, $plan, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Paket langganan {$user->name} berhasil diubah menjadi {$plan->name}.",
        ]);
    }
}
