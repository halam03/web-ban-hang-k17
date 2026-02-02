<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_hang_sx', function (Blueprint $table) {
            $table->string('ma_hang_sx', 25)->primary();
            $table->string('hang_sx', 100)->nullable();
            $table->string('ma_nuoc_thuong_hieu', 25)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_hang_sx');
    }
};
