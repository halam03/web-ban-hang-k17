<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLieu extends Model
{
    protected $table = 't_chat_lieu';
    protected $primaryKey = 'ma_chat_lieu';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ma_chat_lieu',
        'chat_lieu',
    ];

    public function danhMucSps()
    {
        return $this->hasMany(DanhMucSp::class, 'ma_chat_lieu', 'ma_chat_lieu');
    }
}
