<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_danh_muc_sp', function (Blueprint $table) {
            $table->string('ma_sp', 50)->primary();
            $table->string('ten_sp', 150)->nullable();
            $table->string('ma_chat_lieu', 25)->nullable();
            $table->string('model', 55)->nullable();
            $table->string('ma_hang_sx', 25)->nullable();
            $table->string('ma_nuoc_sx', 25)->nullable();
            $table->string('ma_dac_tinh', 25)->nullable();
            $table->string('website', 155)->nullable();
            $table->float('thoi_gian_bao_hanh')->nullable();
            $table->text('gioi_thieu_sp')->nullable();
            $table->float('chiet_khau')->nullable();
            $table->string('ma_loai', 25)->nullable();
            $table->string('ma_dt', 25)->nullable();
            $table->string('anh_dai_dien', 100)->nullable();
            $table->decimal('gia_nho_nhat', 18, 2)->nullable();
            $table->decimal('gia_lon_nhat', 18, 2)->nullable();

            $table->foreign('ma_chat_lieu')->references('ma_chat_lieu')->on('t_chat_lieu')->nullOnDelete();
            $table->foreign('ma_hang_sx')->references('ma_hang_sx')->on('t_hang_sx')->nullOnDelete();
            $table->foreign('ma_nuoc_sx')->references('ma_nuoc')->on('t_quoc_gia')->nullOnDelete();
            $table->foreign('ma_loai')->references('ma_loai')->on('t_loai_sp')->nullOnDelete();
            $table->foreign('ma_dt')->references('ma_dt')->on('t_loai_dt')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_danh_muc_sp');
    }
};
