<?php

use App\Http\Controllers\Api\v1\ShortLinkApiController;
use App\Http\Middleware\AuthenticateApiKey;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| REST API v1 Routes (API Key / Token Protection)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware([AuthenticateApiKey::class, 'throttle:60,1'])->group(function () {
    Route::get('/links', [ShortLinkApiController::class, 'index']);
    Route::post('/links', [ShortLinkApiController::class, 'store']);
    Route::post('/shorten', [ShortLinkApiController::class, 'store']);
    Route::get('/links/{slug}', [ShortLinkApiController::class, 'show']);
    Route::delete('/links/{slug}', [ShortLinkApiController::class, 'destroy']);
});
