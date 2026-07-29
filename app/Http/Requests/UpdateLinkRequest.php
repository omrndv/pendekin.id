<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'original_url' => ['nullable', 'url', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string', 'min:4', 'max:32'],
            'expires_at' => ['nullable', 'date'],
            'max_clicks' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $featureGate = app(\App\Services\FeatureGateService::class);
            $user = $this->user();

            if ($this->filled('password') && ! $featureGate->canUsePassword($user)) {
                $validator->errors()->add('password', 'Fitur Perlindungan Password membutuhkan paket Pro atau Business.');
            }

            if ($this->filled('expires_at') && ! $featureGate->canUseExpiration($user)) {
                $validator->errors()->add('expires_at', 'Fitur Link Expiration membutuhkan paket Pro atau Business.');
            }
        });
    }
}
