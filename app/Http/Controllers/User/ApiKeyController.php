<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use App\Services\FeatureGateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ApiKeyController extends Controller
{
    public function __construct(
        protected FeatureGateService $featureGate
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $keys = ApiKey::where('user_id', $user->id)->latest()->get();
        $isEntitled = $this->featureGate->canAccessApi($user);

        return Inertia::render('Dashboard/ApiKeys', [
            'apiKeys' => $keys,
            'isEntitled' => $isEntitled,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (! $this->featureGate->canAccessApi($user)) {
            return redirect()->route('dashboard.billing')->with('flash', [
                'error' => 'Akses API hanya tersedia untuk pengguna paket Pro atau Business.',
            ]);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $tokenSecret = 'pdk_live_'.Str::random(32);
        $prefix = substr($tokenSecret, 0, 12);
        $hash = hash('sha256', $tokenSecret);

        ApiKey::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'key_prefix' => $prefix,
            'key_hash' => $hash,
            'is_active' => true,
        ]);

        return redirect()->back()->with('flash', [
            'success' => "API Key '{$request->name}' berhasil dibuat! SIMPAN TOKEN RAHASIA INI KARENA HANYA DITAMPILKAN SEKALI: {$tokenSecret}",
        ]);
    }

    public function destroy(ApiKey $apiKey): RedirectResponse
    {
        if ($apiKey->user_id !== auth()->id() && ! auth()->user()->isAdmin()) {
            abort(403);
        }

        $apiKey->delete();

        return redirect()->back()->with('flash', [
            'success' => "API Key '{$apiKey->name}' berhasil dicabut (revoked).",
        ]);
    }
}
