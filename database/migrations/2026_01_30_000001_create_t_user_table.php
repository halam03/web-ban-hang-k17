<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_user', function (Blueprint $table) {
            $table->string('username', 100)->primary();
            $table->string('password', 256);
            $table->unsignedTinyInteger('loai_user')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_user');
    }
};
