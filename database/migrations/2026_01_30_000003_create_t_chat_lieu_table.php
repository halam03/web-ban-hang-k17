<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_chat_lieu', function (Blueprint $table) {
            $table->string('ma_chat_lieu', 25)->primary();
            $table->string('chat_lieu', 150)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_chat_lieu');
    }
};
