<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HangSx extends Model
{
    protected $table = 't_hang_sx';
    protected $primaryKey = 'ma_hang_sx';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_hang_sx',
        'hang_sx',
        'ma_nuoc_thuong_hieu',
    ];

    public function danhMucSps()
    {
        return $this->hasMany(DanhMucSp::class, 'ma_hang_sx', 'ma_hang_sx');
    }
}
