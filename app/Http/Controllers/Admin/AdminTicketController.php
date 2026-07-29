<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->input('status');

        $query = Ticket::with('user')->withCount('replies');

        if ($status) {
            $query->where('status', $status);
        }

        $tickets = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => [
                'status' => $status ?? '',
            ],
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load(['replies.user', 'attachments', 'user', 'assignedAdmin']);

        $admins = User::whereIn('role', ['admin', 'moderator'])->select('id', 'name')->get();

        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket,
            'admins' => $admins,
        ]);
    }

    public function reply(Ticket $ticket, Request $request): RedirectResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'is_internal' => ['nullable', 'boolean'],
            'attachments.*' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf,zip,doc,docx'],
        ]);

        $this->ticketService->replyToTicket(
            $ticket,
            $request->user(),
            [
                'message' => $request->message,
                'is_internal' => $request->boolean('is_internal'),
            ],
            $request->file('attachments')
        );

        return redirect()->back()->with('flash', [
            'success' => 'Balasan atau catatan internal berhasil ditambahkan.',
        ]);
    }

    public function updateStatus(Ticket $ticket, Request $request): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:open,waiting_user,waiting_admin,resolved,closed'],
        ]);

        $closedBy = in_array($request->status, ['resolved', 'closed']) ? $request->user() : null;

        $this->ticketService->updateStatus($ticket, $request->status, $closedBy);

        return redirect()->back()->with('flash', [
            'success' => "Status tiket berhasil diubah menjadi {$request->status}.",
        ]);
    }

    public function assign(Ticket $ticket, Request $request): RedirectResponse
    {
        $request->validate([
            'admin_id' => ['required', 'exists:users,id'],
        ]);

        $admin = User::findOrFail($request->admin_id);
        $this->ticketService->assignAdmin($ticket, $admin);

        return redirect()->back()->with('flash', [
            'success' => "Tiket berhasil di-assign ke {$admin->name}.",
        ]);
    }
}
