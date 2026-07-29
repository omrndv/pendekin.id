<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class HealthCheckController extends Controller
{
    /**
     * Production Health Check Endpoint.
     */
    public function __invoke(): JsonResponse
    {
        $status = 'healthy';
        $checks = [];

        // 1. Database Check
        try {
            DB::connection()->getPdo();
            $checks['database'] = 'ok';
        } catch (\Throwable $e) {
            $status = 'unhealthy';
            $checks['database'] = 'failed: '.$e->getMessage();
        }

        // 2. Cache & Redis Check
        try {
            Cache::put('health_check', true, 10);
            $checks['cache'] = Cache::get('health_check') ? 'ok' : 'failed';
        } catch (\Throwable $e) {
            $status = 'unhealthy';
            $checks['cache'] = 'failed: '.$e->getMessage();
        }

        // 3. Storage Write Check
        try {
            $checks['storage'] = is_writable(storage_path()) ? 'ok' : 'failed';
        } catch (\Throwable $e) {
            $checks['storage'] = 'failed';
        }

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'app_version' => config('app.version', '1.0.0'),
            'environment' => config('app.env'),
            'checks' => $checks,
        ], $status === 'healthy' ? 200 : 503);
    }
}
