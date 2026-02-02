<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\KhachHang;

class UserAccount extends Model
{
    protected $table = 't_user';
    protected $primaryKey = 'username';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'username',
        'password',
        'loai_user',
    ];

    protected $hidden = [
        'password',
    ];

    public function khachHang()
    {
        return $this->hasOne(KhachHang::class, 'username', 'username');
    }
}
