<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('short_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('original_url');
            $table->string('short_slug')->unique();
            $table->string('domain')->nullable();
            $table->boolean('is_custom_slug')->default(false);
            $table->string('password_hash')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->unsignedInteger('max_clicks')->nullable();
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_flagged')->default(false);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // High-performance composite indexing for redirects & user queries
            $table->index(['short_slug', 'is_active']);
            $table->index(['user_id', 'created_at']);
            $table->index(['is_active', 'is_flagged']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('short_links');
    }
};
