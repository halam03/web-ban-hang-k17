<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HangSx;
use App\Models\DanhMucSp;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json(HangSx::orderBy('hang_sx')->get());
    }

    public function products(string $maHangSx)
    {
        $products = DanhMucSp::where('ma_hang_sx', $maHangSx)->orderBy('ten_sp')->get();
        return response()->json($products);
    }
}
