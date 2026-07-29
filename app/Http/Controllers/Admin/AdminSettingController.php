<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => [
                'allow_registration' => (bool) SystemSetting::get('allow_registration', true),
                'maintenance_mode' => (bool) SystemSetting::get('maintenance_mode', false),
                'maintenance_secret_code' => (string) SystemSetting::get('maintenance_secret_code', 'admin-ganteng'),
                'free_link_limit' => (int) SystemSetting::get('free_link_limit', 50),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'allow_registration' => ['required', 'boolean'],
            'maintenance_mode' => ['required', 'boolean'],
            'maintenance_secret_code' => ['required', 'string', 'alpha_dash', 'min:3', 'max:50'],
            'free_link_limit' => ['required', 'integer', 'min:1', 'max:10000'],
        ]);

        SystemSetting::set('allow_registration', $request->input('allow_registration'));
        SystemSetting::set('maintenance_mode', $request->input('maintenance_mode'));
        SystemSetting::set('maintenance_secret_code', strtolower($request->input('maintenance_secret_code')));
        SystemSetting::set('free_link_limit', $request->input('free_link_limit'));

        return redirect()->back()->with('flash', [
            'success' => 'Konfigurasi platform berhasil diperbarui.',
        ]);
    }
}
