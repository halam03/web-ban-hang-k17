<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_chi_tiet_hdb', function (Blueprint $table) {
            $table->integer('id')->primary();
            $table->integer('ma_hoa_don');
            $table->string('ma_sp', 50);
            $table->integer('so_luong_ban')->nullable();
            $table->decimal('don_gia_ban', 18, 2)->nullable();
            $table->float('giam_gia')->nullable();
            $table->string('ghi_chu', 100)->nullable();

            $table->foreign('ma_hoa_don')->references('ma_hoa_don')->on('t_hoa_don_ban')->cascadeOnDelete();
            $table->foreign('ma_sp')->references('ma_sp')->on('t_danh_muc_sp')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_chi_tiet_hdb');
    }
};
