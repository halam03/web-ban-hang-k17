<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_quoc_gia', function (Blueprint $table) {
            $table->string('ma_nuoc', 25)->primary();
            $table->string('ten_nuoc', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_quoc_gia');
    }
};
