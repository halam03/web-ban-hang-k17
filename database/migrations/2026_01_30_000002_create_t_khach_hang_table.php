<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_khach_hang', function (Blueprint $table) {
            $table->string('ma_khach_hang', 25)->primary();
            $table->string('username', 100)->nullable();
            $table->string('ten_khach_hang', 100)->nullable();
            $table->date('ngay_sinh')->nullable();
            $table->string('so_dien_thoai', 15)->nullable();
            $table->string('dia_chi', 150)->nullable();
            $table->unsignedTinyInteger('loai_khach_hang')->nullable();
            $table->string('anh_dai_dien', 100)->nullable();
            $table->string('ghi_chu', 100)->nullable();

            $table->foreign('username')
                ->references('username')
                ->on('t_user')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_khach_hang');
    }
};
