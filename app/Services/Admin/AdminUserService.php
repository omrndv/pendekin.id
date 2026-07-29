<?php

namespace App\Services\Admin;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AdminUserService
{
    /**
     * Suspend a user.
     */
    public function suspend(User $user, User $admin, ?string $reason = null): bool
    {
        return DB::transaction(function () use ($user, $admin, $reason) {
            $oldValue = ['is_active' => $user->is_active];
            $user->is_active = false;
            $user->save();

            $this->logAction($admin, $user, 'suspend_user', $oldValue, ['is_active' => false, 'reason' => $reason]);

            // Send Notification
            // $user->notify(new UserSuspendedNotification($reason));
            return true;
        });
    }

    /**
     * Activate a user.
     */
    public function activate(User $user, User $admin): bool
    {
        return DB::transaction(function () use ($user, $admin) {
            $oldValue = ['is_active' => $user->is_active];
            $user->is_active = true;
            $user->save();

            $this->logAction($admin, $user, 'activate_user', $oldValue, ['is_active' => true]);

            return true;
        });
    }

    /**
     * Force delete a user permanently.
     */
    public function forceDelete(User $user, User $admin): bool
    {
        return DB::transaction(function () use ($user, $admin) {
            $this->logAction($admin, $user, 'force_delete_user', ['id' => $user->id, 'email' => $user->email], null);
            $user->forceDelete();

            return true;
        });
    }

    /**
     * Soft delete a user.
     */
    public function softDelete(User $user, User $admin): bool
    {
        return DB::transaction(function () use ($user, $admin) {
            $user->delete();
            $this->logAction($admin, $user, 'soft_delete_user', null, ['deleted_at' => now()]);

            return true;
        });
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restore(User $user, User $admin): bool
    {
        return DB::transaction(function () use ($user, $admin) {
            $user->restore();
            $this->logAction($admin, $user, 'restore_user', ['deleted_at' => $user->deleted_at], ['deleted_at' => null]);

            return true;
        });
    }

    /**
     * Change user role.
     */
    public function changeRole(User $user, string $role, User $admin): bool
    {
        return DB::transaction(function () use ($user, $role, $admin) {
            $oldValue = ['role' => $user->role];
            $user->role = $role;
            $user->save();

            $this->logAction($admin, $user, 'change_role', $oldValue, ['role' => $role]);

            return true;
        });
    }

    /**
     * Force reset password (generates new random and sends email, or just updates it).
     */
    public function forceResetPassword(User $user, User $admin, string $newPassword): bool
    {
        return DB::transaction(function () use ($user, $admin, $newPassword) {
            $user->password = Hash::make($newPassword);
            $user->save();

            $this->logAction($admin, $user, 'force_reset_password', null, ['password_changed' => true]);

            return true;
        });
    }

    /**
     * Send password reset email via standard Laravel Password broker.
     */
    public function sendPasswordResetEmail(User $user, User $admin): bool
    {
        Password::broker()->sendResetLink(['email' => $user->email]);

        $this->logAction($admin, $user, 'send_password_reset_email', null, ['email_sent' => true]);

        return true;
    }

    /**
     * Manually assign subscription plan to a user.
     */
    public function assignPlan(User $user, \App\Models\BillingPlan $plan, User $admin): bool
    {
        return DB::transaction(function () use ($user, $plan, $admin) {
            $oldValue = [
                'plan_id' => $user->subscription?->billing_plan_id,
                'plan_name' => $user->subscription?->plan?->name ?? 'Free',
            ];

            if ($plan->slug === 'free') {
                if ($user->subscription) {
                    $user->subscription->delete();
                }
            } else {
                $user->subscription()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'billing_plan_id' => $plan->id,
                        'status' => 'active',
                        'starts_at' => now(),
                        'ends_at' => now()->addYear(),
                        'cancels_at' => null,
                    ]
                );
            }

            $this->logAction($admin, $user, 'assign_plan', $oldValue, [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
            ]);

            return true;
        });
    }

    /**
     * Helper to log actions.
     */
    protected function logAction(User $actor, User $target, string $action, ?array $oldValue = null, ?array $newValue = null): void
    {
        AuditLog::create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => User::class,
            'auditable_id' => $target->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
