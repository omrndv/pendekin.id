<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("system_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            if (! $setting) {
                return $default;
            }

            $value = $setting->value;
            if ($value === 'true') {
                return true;
            }
            if ($value === 'false') {
                return false;
            }
            if (is_numeric($value)) {
                return $value + 0;
            }

            return $value;
        });
    }

    public static function set(string $key, mixed $value): void
    {
        $stringValue = is_bool($value) ? ($value ? 'true' : 'false') : (string) $value;
        static::updateOrCreate(['key' => $key], ['value' => $stringValue]);
        Cache::forget("system_setting_{$key}");
    }
}
