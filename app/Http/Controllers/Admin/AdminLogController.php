<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = AuditLog::with('user')->latest()->paginate(20);

        return Inertia::render('Admin/Logs', [
            'logs' => $logs,
        ]);
    }
}
