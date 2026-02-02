<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_hoa_don_ban', function (Blueprint $table) {
            $table->integer('ma_hoa_don')->primary();
            $table->string('ngay_hoa_don', 255)->nullable();
            $table->string('ma_khach_hang', 25)->nullable();
            $table->decimal('tong_tien_hd', 18, 2)->nullable();
            $table->float('giam_gia_hd')->nullable();
            $table->unsignedTinyInteger('phuong_thuc_thanh_toan')->nullable();
            $table->string('ma_so_thue', 100)->nullable();
            $table->string('thong_tin_thue', 250)->nullable();
            $table->string('ghi_chu', 100)->nullable();
            $table->integer('status')->nullable();

            $table->foreign('ma_khach_hang')->references('ma_khach_hang')->on('t_khach_hang')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_hoa_don_ban');
    }
};
