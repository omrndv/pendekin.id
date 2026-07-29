<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class TicketService
{
    /**
     * Create a new ticket (User side)
     */
    public function createTicket(User $user, array $data, ?array $attachments = []): Ticket
    {
        return DB::transaction(function () use ($user, $data, $attachments) {
            // Generate ticket number e.g. PDK-000001
            $lastTicket = Ticket::orderBy('id', 'desc')->first();
            $nextId = $lastTicket ? $lastTicket->id + 1 : 1;
            $ticketNumber = 'PDK-'.str_pad($nextId, 6, '0', STR_PAD_LEFT);

            $ticket = Ticket::create([
                'ticket_number' => $ticketNumber,
                'user_id' => $user->id,
                'subject' => $data['subject'],
                'category' => $data['category'],
                'priority' => $data['priority'] ?? 'normal',
                'status' => 'open',
            ]);

            // Create initial reply (the description of the ticket)
            $ticket->replies()->create([
                'user_id' => $user->id,
                'message' => $data['message'],
                'is_internal' => false,
            ]);

            // Handle attachments
            $this->handleAttachments($ticket, $attachments);

            return $ticket;
        });
    }

    /**
     * Add a reply to an existing ticket
     */
    public function replyToTicket(Ticket $ticket, User $user, array $data, ?array $attachments = []): TicketReply
    {
        return DB::transaction(function () use ($ticket, $user, $data, $attachments) {
            $isInternal = $data['is_internal'] ?? false;

            // Admin replying
            if ($user->hasRole('admin')) {
                if ($ticket->status === 'open') {
                    $ticket->status = 'waiting_user';
                }
                if (is_null($ticket->first_response_at) && ! $isInternal) {
                    $ticket->first_response_at = now();
                }
            } else {
                // User replying
                if ($ticket->status === 'waiting_user' || $ticket->status === 'resolved') {
                    $ticket->status = 'open';
                    $ticket->resolved_at = null; // Reopen if they reply after resolved
                }
            }

            $ticket->save();

            $reply = $ticket->replies()->create([
                'user_id' => $user->id,
                'message' => $data['message'],
                'is_internal' => $isInternal,
            ]);

            // Handle attachments specific to this reply context
            // But our schema links attachments to the ticket, not reply.
            // That's fine, we can still upload them and link them to the ticket.
            $this->handleAttachments($ticket, $attachments);

            return $reply;
        });
    }

    /**
     * Change ticket status (Admin side)
     */
    public function updateStatus(Ticket $ticket, string $status, ?User $closedBy = null): void
    {
        $ticket->status = $status;

        if ($status === 'resolved' || $status === 'closed') {
            $ticket->resolved_at = now();
            if ($closedBy) {
                $ticket->closed_by = $closedBy->id;
            }
        }

        $ticket->save();
    }

    /**
     * Assign ticket to an admin
     */
    public function assignAdmin(Ticket $ticket, User $admin): void
    {
        $ticket->assigned_to = $admin->id;
        $ticket->save();
    }

    /**
     * Handle file uploads and attachment creation
     */
    protected function handleAttachments(Ticket $ticket, ?array $attachments): void
    {
        if (empty($attachments)) {
            return;
        }

        foreach ($attachments as $file) {
            if ($file instanceof UploadedFile) {
                $path = $file->store('tickets/'.$ticket->ticket_number, 'public');

                $ticket->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }
    }
}
