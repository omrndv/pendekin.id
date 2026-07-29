<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    use \App\Traits\HandlesPendingUrl;

    /**
     * Redirect to Google OAuth page.
     */
    public function redirect(\Illuminate\Http\Request $request)
    {
        $this->storePendingUrl($request);
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($user) {
                // Update existing user with google_id & avatar if missing
                $user->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar ?? $user->avatar,
                ]);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name ?? $googleUser->nickname ?? 'User',
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => Hash::make(Str::random(24)),
                ]);
            }

            Auth::login($user, true);

            $this->handlePendingUrl($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Throwable $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Gagal melakukan otentikasi dengan Google: '.$e->getMessage(),
            ]);
        }
    }
}
