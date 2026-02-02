<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatLieu;
use App\Models\LoaiDt;
use App\Models\LoaiSp;
use App\Models\QuocGia;

class MetaController extends Controller
{
    public function categories()
    {
        return response()->json(LoaiSp::withCount('danhMucSps')->orderBy('loai')->get());
    }

    public function types()
    {
        return response()->json(LoaiDt::orderBy('ten_loai')->get());
    }

    public function materials()
    {
        return response()->json(ChatLieu::orderBy('chat_lieu')->get());
    }

    public function countries()
    {
        return response()->json(QuocGia::orderBy('ten_nuoc')->get());
    }
}
