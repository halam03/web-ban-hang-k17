<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuocGia extends Model
{
    protected $table = 't_quoc_gia';
    protected $primaryKey = 'ma_nuoc';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_nuoc',
        'ten_nuoc',
    ];

    public function danhMucSps()
    {
        return $this->hasMany(DanhMucSp::class, 'ma_nuoc_sx', 'ma_nuoc');
    }
}
