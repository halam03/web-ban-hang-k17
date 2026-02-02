<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoaiDt extends Model
{
    protected $table = 't_loai_dt';
    protected $primaryKey = 'ma_dt';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_dt',
        'ten_loai',
    ];

    public function danhMucSps()
    {
        return $this->hasMany(DanhMucSp::class, 'ma_dt', 'ma_dt');
    }
}
