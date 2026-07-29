<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class UnauthorizedAccessException extends Exception
{
    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage() ?: 'Anda tidak memiliki hak akses untuk melakukan aksi ini.',
            'error_code' => 'UNAUTHORIZED_ACCESS',
        ], 403);
    }
}
