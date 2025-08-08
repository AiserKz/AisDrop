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
        Schema::create('dialogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_one_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('user_two_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('last_message')->nullable();
            $table->timestamps();

            $table->index(['user_one_id', 'user_two_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dialog_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index('dialog_id');
            $table->index('sender_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dialogs');
    }
};
