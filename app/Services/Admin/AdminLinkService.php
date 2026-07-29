<?php

namespace App\Services\Admin;

use App\Models\AuditLog;
use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminLinkService
{
    public function suspend(ShortLink $link, User $admin, ?string $reason = null): bool
    {
        return DB::transaction(function () use ($link, $admin, $reason) {
            $oldValue = ['is_active' => $link->is_active];
            $link->is_active = false;
            $link->save();

            $this->logAction($admin, $link, 'suspend_link', $oldValue, ['is_active' => false, 'reason' => $reason]);

            return true;
        });
    }

    public function activate(ShortLink $link, User $admin): bool
    {
        return DB::transaction(function () use ($link, $admin) {
            $oldValue = ['is_active' => $link->is_active];
            $link->is_active = true;
            $link->save();

            $this->logAction($admin, $link, 'activate_link', $oldValue, ['is_active' => true]);

            return true;
        });
    }

    public function delete(ShortLink $link, User $admin): bool
    {
        return DB::transaction(function () use ($link, $admin) {
            $link->delete();
            $this->logAction($admin, $link, 'soft_delete_link', null, ['deleted_at' => now()]);

            return true;
        });
    }

    public function forceDelete(ShortLink $link, User $admin): bool
    {
        return DB::transaction(function () use ($link, $admin) {
            $this->logAction($admin, $link, 'force_delete_link', ['id' => $link->id, 'slug' => $link->short_slug], null);
            $link->forceDelete();

            return true;
        });
    }

    public function restore(ShortLink $link, User $admin): bool
    {
        return DB::transaction(function () use ($link, $admin) {
            $link->restore();
            $this->logAction($admin, $link, 'restore_link', ['deleted_at' => $link->deleted_at], ['deleted_at' => null]);

            return true;
        });
    }

    public function toggleFlag(ShortLink $link, User $admin): bool
    {
        return DB::transaction(function () use ($link, $admin) {
            $oldValue = ['is_flagged' => $link->is_flagged];
            $link->is_flagged = ! $link->is_flagged;
            $link->save();

            $this->logAction($admin, $link, 'toggle_flag_link', $oldValue, ['is_flagged' => $link->is_flagged]);

            return true;
        });
    }

    protected function logAction(User $actor, ShortLink $target, string $action, ?array $oldValue = null, ?array $newValue = null): void
    {
        AuditLog::create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => ShortLink::class,
            'auditable_id' => $target->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
