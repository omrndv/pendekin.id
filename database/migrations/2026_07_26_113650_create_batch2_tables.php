<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update Users Table
        if (! Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
                $table->string('last_ip')->nullable();
                $table->string('last_browser')->nullable();
                $table->string('last_device')->nullable();
                $table->timestamp('last_activity_at')->nullable();
            });
        }

        // 2. Create Login History Table
        if (! Schema::hasTable('login_histories')) {
            Schema::create('login_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('ip_address')->nullable();
                $table->text('user_agent')->nullable();
                $table->string('browser')->nullable();
                $table->string('device')->nullable();
                $table->string('os')->nullable();
                $table->boolean('is_success')->default(true);
                $table->timestamps();
            });
        }

        // 3. Update Audit Logs Table
        if (! Schema::hasColumn('audit_logs', 'old_value')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->json('old_value')->nullable();
                $table->json('new_value')->nullable();
                $table->string('browser')->nullable();
                $table->string('device')->nullable();
            });
        }

        // 4. Update Abuse Reports Table
        if (! Schema::hasColumn('abuse_reports', 'severity')) {
            Schema::table('abuse_reports', function (Blueprint $table) {
                $table->string('severity')->default('low'); // low, medium, high, critical
                $table->text('description')->nullable();
                $table->string('screenshot_path')->nullable();
            });
        }

        // 5. Create Tickets Table
        if (! Schema::hasTable('tickets')) {
            Schema::create('tickets', function (Blueprint $table) {
                $table->id();
                $table->string('ticket_number')->unique(); // PDK-000001
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('subject');
                $table->string('category');
                $table->string('priority')->default('low'); // low, medium, high, critical
                $table->string('status')->default('open'); // open, waiting_user, waiting_admin, in_progress, solved, closed
                $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('first_response_at')->nullable();
                $table->timestamp('resolved_at')->nullable();
                $table->timestamps();
            });
        }

        // 6. Create Ticket Replies Table
        if (! Schema::hasTable('ticket_replies')) {
            Schema::create('ticket_replies', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->text('message');
                $table->boolean('is_internal')->default(false); // For admin internal notes
                $table->timestamps();
            });
        }

        // 7. Create Ticket Attachments Table
        if (! Schema::hasTable('ticket_attachments')) {
            Schema::create('ticket_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ticket_reply_id')->nullable()->constrained()->cascadeOnDelete();
                $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
                $table->string('file_path');
                $table->string('file_name');
                $table->string('file_type');
                $table->integer('file_size');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_attachments');
        Schema::dropIfExists('ticket_replies');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('login_histories');

        Schema::table('abuse_reports', function (Blueprint $table) {
            $table->dropColumn(['severity', 'description', 'screenshot_path']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn(['old_value', 'new_value', 'browser', 'device']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['last_ip', 'last_browser', 'last_device', 'last_activity_at']);
        });
    }
};
