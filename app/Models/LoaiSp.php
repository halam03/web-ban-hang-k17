<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoaiSp extends Model
{
    protected $table = 't_loai_sp';
    protected $primaryKey = 'ma_loai';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_loai',
        'loai',
    ];

    public function danhMucSps()
    {
        return $this->hasMany(DanhMucSp::class, 'ma_loai', 'ma_loai');
    }
}
