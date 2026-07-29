<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('short_link_id')->constrained('short_links')->onDelete('cascade');
            $table->string('fg_color', 10)->default('#10B981');
            $table->string('bg_color', 10)->default('#FFFFFF');
            $table->string('logo_path')->nullable();
            $table->string('format', 10)->default('png');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
