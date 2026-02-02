<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMucSp extends Model
{
    protected $table = 't_danh_muc_sp';
    protected $primaryKey = 'ma_sp';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_sp',
        'ten_sp',
        'ma_chat_lieu',
        'model',
        'ma_hang_sx',
        'ma_nuoc_sx',
        'ma_dac_tinh',
        'website',
        'thoi_gian_bao_hanh',
        'gioi_thieu_sp',
        'chiet_khau',
        'ma_loai',
        'ma_dt',
        'anh_dai_dien',
        'gia_nho_nhat',
        'gia_lon_nhat',
    ];

    protected $casts = [
        'gia_nho_nhat' => 'float',
        'gia_lon_nhat' => 'float',
    ];

    public function anhSps()
    {
        return $this->hasMany(AnhSp::class, 'ma_sp', 'ma_sp');
    }

    public function hangSx()
    {
        return $this->belongsTo(HangSx::class, 'ma_hang_sx', 'ma_hang_sx');
    }

    public function loaiSp()
    {
        return $this->belongsTo(LoaiSp::class, 'ma_loai', 'ma_loai');
    }

    public function loaiDt()
    {
        return $this->belongsTo(LoaiDt::class, 'ma_dt', 'ma_dt');
    }

    public function quocGia()
    {
        return $this->belongsTo(QuocGia::class, 'ma_nuoc_sx', 'ma_nuoc');
    }

    public function chatLieu()
    {
        return $this->belongsTo(ChatLieu::class, 'ma_chat_lieu', 'ma_chat_lieu');
    }
}
