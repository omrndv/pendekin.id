<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->constrained('coupon_codes')->nullOnDelete();
            $table->decimal('discount_amount', 12, 2)->default(0)->after('gross_amount');
            $table->decimal('tax_amount', 12, 2)->default(0)->after('discount_amount');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('discount_amount', 12, 2)->default(0)->after('total_amount');
            $table->decimal('tax_amount', 12, 2)->default(0)->after('discount_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropColumn(['coupon_id', 'discount_amount', 'tax_amount']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['discount_amount', 'tax_amount']);
        });
    }
};
