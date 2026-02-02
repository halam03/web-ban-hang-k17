<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietHdb extends Model
{
    protected $table = 't_chi_tiet_hdb';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'ma_hoa_don',
        'ma_sp',
        'so_luong_ban',
        'don_gia_ban',
        'giam_gia',
        'ghi_chu',
    ];

    protected $casts = [
        'don_gia_ban' => 'float',
    ];

    public function hoaDonBan()
    {
        return $this->belongsTo(HoaDonBan::class, 'ma_hoa_don', 'ma_hoa_don');
    }

    public function danhMucSp()
    {
        return $this->belongsTo(DanhMucSp::class, 'ma_sp', 'ma_sp');
    }
}
