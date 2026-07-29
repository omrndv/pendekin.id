<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TicketService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    /**
     * Show public contact form.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        return Inertia::render('Public/Contact', [
            'initialEmail' => $user ? $user->email : '',
            'isGuest' => !$user,
        ]);
    }

    /**
     * Store the public contact submission.
     */
    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'subject' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:billing,technical,abuse,general,other'],
            'message' => ['required', 'string', 'max:5000'],
            'attachments.*' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,zip,doc,docx'],
        ];

        if (!$request->user()) {
            $rules['email'] = ['required', 'email', 'max:255'];
        }

        $request->validate($rules);

        // Get or create user relation
        if ($request->user()) {
            $user = $request->user();
        } else {
            // Find or create guest user account
            $user = User::firstOrCreate(
                ['email' => 'guest-support@pendekin.id'],
                [
                    'name' => 'Guest Visitor',
                    'password' => bcrypt(Str::random(24)),
                    'role' => 'user',
                    'is_active' => true,
                ]
            );
        }

        // Format message & subject to include guest email if guest
        $message = $request->message;
        $subject = $request->subject;
        
        if (!$request->user()) {
            $guestEmail = $request->email;
            $message = "Email Pengirim (Tamu): {$guestEmail}\n\n" . $message;
            $subject = "[GUEST - {$guestEmail}] " . $subject;
        }

        $this->ticketService->createTicket(
            $user,
            [
                'subject' => $subject,
                'category' => $request->category,
                'priority' => 'normal',
                'message' => $message,
            ],
            $request->file('attachments')
        );

        return redirect()->back()->with('flash', [
            'success' => 'Pesan Anda berhasil terkirim. Tim kami akan segera meninjau dan membalas melalui email Anda.',
        ]);
    }
}
