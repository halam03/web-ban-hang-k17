<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KhachHang extends Model
{
    protected $table = 't_khach_hang';
    protected $primaryKey = 'ma_khach_hang';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_khach_hang',
        'username',
        'ten_khach_hang',
        'ngay_sinh',
        'so_dien_thoai',
        'dia_chi',
        'loai_khach_hang',
        'anh_dai_dien',
        'ghi_chu',
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'username', 'username');
    }

    public function hoaDonBans()
    {
        return $this->hasMany(HoaDonBan::class, 'ma_khach_hang', 'ma_khach_hang');
    }
}
