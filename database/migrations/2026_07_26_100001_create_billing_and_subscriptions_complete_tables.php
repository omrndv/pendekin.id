<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Payment Transactions Table
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->string('invoice_number')->unique();
            $table->string('gateway_provider')->default('midtrans');
            $table->string('gateway_reference')->nullable();
            $table->decimal('gross_amount', 14, 2);
            $table->decimal('fee_amount', 14, 2)->default(0);
            $table->string('currency', 3)->default('IDR');
            $table->string('payment_method')->nullable();
            $table->string('status')->default('pending'); // pending, success, failed, expired, refunded
            $table->json('payload_webhook')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // 2. Invoices Table
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->foreignId('payment_transaction_id')->nullable()->constrained('payment_transactions')->onDelete('set null');
            $table->string('invoice_number')->unique();
            $table->decimal('total_amount', 14, 2);
            $table->string('currency', 3)->default('IDR');
            $table->string('status')->default('unpaid'); // unpaid, paid, cancelled
            $table->json('line_items')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // 3. Subscription Event Audit Logs Table
        Schema::create('subscription_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('event_type'); // trial_started, activated, renewed, cancelled, expired, etc.
            $table->string('previous_status')->nullable();
            $table->string('new_status');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // 4. Usage Records Table
        Schema::create('usage_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('feature_key'); // monthly_links, api_requests, qr_codes
            $table->unsignedBigInteger('usage_count')->default(0);
            $table->string('billing_period'); // format YYYY-MM
            $table->timestamps();
            $table->unique(['user_id', 'feature_key', 'billing_period']);
        });

        // 5. Refunds Table
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_transaction_id')->constrained('payment_transactions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('IDR');
            $table->text('reason')->nullable();
            $table->string('gateway_reference')->nullable();
            $table->string('status')->default('completed'); // pending, completed, failed
            $table->timestamps();
        });

        // 6. Coupon Codes Table
        Schema::create('coupon_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->unsignedInteger('discount_percent')->nullable();
            $table->decimal('discount_amount', 14, 2)->nullable();
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add plan_snapshot & trial columns to subscriptions table if missing
        Schema::table('subscriptions', function (Blueprint $table) {
            if (! Schema::hasColumn('subscriptions', 'cycle')) {
                $table->string('cycle')->default('monthly')->after('billing_plan_id');
            }
            if (! Schema::hasColumn('subscriptions', 'plan_snapshot')) {
                $table->json('plan_snapshot')->nullable()->after('cycle');
            }
            if (! Schema::hasColumn('subscriptions', 'trial_started_at')) {
                $table->timestamp('trial_started_at')->nullable()->after('plan_snapshot');
            }
            if (! Schema::hasColumn('subscriptions', 'trial_ends_at')) {
                $table->timestamp('trial_ends_at')->nullable()->after('trial_started_at');
            }
            if (! Schema::hasColumn('subscriptions', 'failed_attempts')) {
                $table->unsignedTinyInteger('failed_attempts')->default(0)->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupon_codes');
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('usage_records');
        Schema::dropIfExists('subscription_events');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('payment_transactions');
    }
};
