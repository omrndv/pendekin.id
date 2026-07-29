<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserTicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    public function index(Request $request): Response
    {
        $tickets = Ticket::where('user_id', $request->user()->id)
            ->withCount('replies')
            ->latest()
            ->paginate(10);

        return Inertia::render('Dashboard/Support/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/Support/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:billing,technical,abuse,general,other'],
            'priority' => ['required', 'string', 'in:low,normal,high,critical'],
            'message' => ['required', 'string', 'max:5000'],
            'attachments.*' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,zip,doc,docx'], // max 5MB per file
        ]);

        $this->ticketService->createTicket(
            $request->user(),
            $request->only(['subject', 'category', 'priority', 'message']),
            $request->file('attachments')
        );

        return redirect()->route('dashboard.support')->with('flash', [
            'success' => 'Tiket dukungan berhasil dibuat. Tim kami akan segera meninjau tiket Anda.',
        ]);
    }

    public function show(Ticket $ticket, Request $request): Response
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $ticket->load(['replies.user', 'attachments']);

        // Hide internal notes from user
        $ticket->setRelation('replies', $ticket->replies->where('is_internal', false)->values());

        return Inertia::render('Dashboard/Support/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Ticket $ticket, Request $request): RedirectResponse
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'attachments.*' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,zip,doc,docx'],
        ]);

        $this->ticketService->replyToTicket(
            $ticket,
            $request->user(),
            ['message' => $request->message, 'is_internal' => false],
            $request->file('attachments')
        );

        return redirect()->back()->with('flash', [
            'success' => 'Balasan berhasil dikirim.',
        ]);
    }
}
