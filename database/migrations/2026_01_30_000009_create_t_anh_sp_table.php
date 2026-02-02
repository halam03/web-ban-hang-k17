<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_anh_sp', function (Blueprint $table) {
            $table->string('ma_sp', 50);
            $table->string('ten_file_anh', 100);
            $table->smallInteger('vi_tri')->nullable();

            $table->primary(['ma_sp', 'ten_file_anh']);
            $table->foreign('ma_sp')->references('ma_sp')->on('t_danh_muc_sp')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_anh_sp');
    }
};
