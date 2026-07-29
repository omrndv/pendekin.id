<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class SlugAlreadyExistsException extends Exception
{
    public function render($request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => $this->getMessage() ?: 'Custom alias ini sudah digunakan. Silakan pilih alias lain.',
                'error_code' => 'SLUG_ALREADY_EXISTS',
            ], 422);
        }

        return redirect()->back()
            ->withInput()
            ->withErrors(['custom_slug' => $this->getMessage() ?: 'Custom alias ini sudah digunakan. Silakan pilih alias lain.'])
            ->with('flash', [
                'error' => $this->getMessage() ?: 'Custom alias ini sudah digunakan. Silakan pilih alias lain.',
            ]);
    }
}
