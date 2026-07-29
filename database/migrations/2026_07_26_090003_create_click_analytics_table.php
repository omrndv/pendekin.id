<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('click_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('short_link_id')->constrained('short_links')->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->string('country_code', 5)->nullable();
            $table->string('country_name', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('device_type', 20)->default('desktop');
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->text('referrer')->nullable();
            $table->timestamp('clicked_at')->useCurrent();

            // Time-series indexing for fast analytics breakdown queries
            $table->index(['short_link_id', 'clicked_at']);
            $table->index(['country_code']);
            $table->index(['device_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('click_analytics');
    }
};
