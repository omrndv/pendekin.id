<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('url') && ! $this->has('original_url')) {
            $this->merge(['original_url' => $this->input('url')]);
        }
    }

    public function rules(): array
    {
        $reservedSlugs = implode(',', config('pendekin.slug.reserved', []));

        return [
            'original_url' => ['required', 'url', 'max:2048'],
            'title' => ['nullable', 'string', 'max:255'],
            'custom_slug' => ['nullable', 'string', 'min:3', 'max:64', 'alpha_dash', "not_in:{$reservedSlugs}"],
            'domain' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:4', 'max:32'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'max_clicks' => ['nullable', 'integer', 'min:1'],
            'team_id' => ['nullable', 'exists:teams,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $featureGate = app(\App\Services\FeatureGateService::class);
            $user = $this->user();

            if ($this->filled('custom_slug') && ! $featureGate->canUseCustomSlug($user)) {
                $validator->errors()->add('custom_slug', 'Fitur Custom Alias membutuhkan paket Pro atau Business.');
            }

            if ($this->filled('password') && ! $featureGate->canUsePassword($user)) {
                $validator->errors()->add('password', 'Fitur Perlindungan Password membutuhkan paket Pro atau Business.');
            }

            if ($this->filled('expires_at') && ! $featureGate->canUseExpiration($user)) {
                $validator->errors()->add('expires_at', 'Fitur Link Expiration membutuhkan paket Pro atau Business.');
            }

            if ($this->filled('domain') && ! $featureGate->canUseCustomDomain($user)) {
                $validator->errors()->add('domain', 'Fitur Custom Domain membutuhkan paket Business.');
            }

            if ($featureGate->hasReachedLinkQuota($user)) {
                $validator->errors()->add('original_url', 'Batas kuota link bulanan kamu sudah habis. Silakan tingkatkan paket Anda.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'original_url.required' => 'URL tujuan wajib diisi.',
            'original_url.url' => 'Format URL tidak valid.',
            'custom_slug.not_in' => 'Alias ini bersifat sistem dan tidak dapat digunakan.',
            'custom_slug.alpha_dash' => 'Alias hanya boleh berisi huruf, angka, strip (-), dan garis bawah (_).',
        ];
    }
}
