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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('capacity');
            $table->integer('attendees_count')->default(0);
            $table->string('image_url')->nullable();
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected', 'live', 'completed', 'cancelled'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('status');
            $table->index('featured');
            $table->fullText(['title', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
