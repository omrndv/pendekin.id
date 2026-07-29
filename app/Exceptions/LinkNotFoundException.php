<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class LinkNotFoundException extends Exception
{
    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage() ?: 'Short link tidak ditemukan atau sudah kedaluwarsa.',
            'error_code' => 'LINK_NOT_FOUND',
        ], 404);
    }
}
