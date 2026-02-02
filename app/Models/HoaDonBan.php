<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoaDonBan extends Model
{
    protected $table = 't_hoa_don_ban';
    protected $primaryKey = 'ma_hoa_don';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'ma_hoa_don',
        'ngay_hoa_don',
        'ma_khach_hang',
        'tong_tien_hd',
        'giam_gia_hd',
        'phuong_thuc_thanh_toan',
        'ma_so_thue',
        'thong_tin_thue',
        'ghi_chu',
        'status',
    ];

    protected $casts = [
        'tong_tien_hd' => 'float',
    ];

    public function khachHang()
    {
        return $this->belongsTo(KhachHang::class, 'ma_khach_hang', 'ma_khach_hang');
    }

    public function chiTietHdbs()
    {
        return $this->hasMany(ChiTietHdb::class, 'ma_hoa_don', 'ma_hoa_don');
    }
}
