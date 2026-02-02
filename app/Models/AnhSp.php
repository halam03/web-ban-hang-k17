<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnhSp extends Model
{
    protected $table = 't_anh_sp';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = null;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_sp',
        'ten_file_anh',
        'vi_tri',
    ];

    public function danhMucSp()
    {
        return $this->belongsTo(DanhMucSp::class, 'ma_sp', 'ma_sp');
    }
}
