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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Пользователь, который создал жалобу
            $table->foreignId('ad_id')->constrained()->onDelete('cascade'); // Объявление, на которое создана жалоба
            $table->text('reason'); // Причина жалобы
            $table->tinyInteger('status')->default(0); // Статус жалобы 0 - новая, 1 - рассмотрена, 2 - отклонена
            $table->timestamps();
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->tinyInteger('status')->default(0); // Статус объявления 0 - на модераций, 1 - одобрено, 2 - отклонено, 3 - забанено
            $table->text('ban_reason')->nullable(); // Причина бана
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
