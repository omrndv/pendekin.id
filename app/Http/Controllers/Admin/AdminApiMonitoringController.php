<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminApiMonitoringController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ApiMonitoring');
    }
}
