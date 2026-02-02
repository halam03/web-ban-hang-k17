<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucSp;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = DanhMucSp::query()->with(['hangSx', 'loaiSp', 'loaiDt']);

        if ($search = $request->query('search')) {
            $query->where('ten_sp', 'like', '%' . $search . '%');
        }

        if ($brand = $request->query('brand')) {
            $query->where('ma_hang_sx', $brand);
        }

        if ($category = $request->query('category')) {
            $query->where('ma_loai', $category);
        }

        if ($type = $request->query('type')) {
            $query->where('ma_dt', $type);
        }

        $priceRanges = $request->query('price_ranges');
        if (is_array($priceRanges) && count($priceRanges) > 0 && !in_array('all', $priceRanges, true)) {
            $query->where(function ($q) use ($priceRanges) {
                foreach ($priceRanges as $range) {
                    [$min, $max] = array_pad(explode('-', $range), 2, null);
                    if ($min !== null && $max !== null) {
                        $q->orWhereBetween('gia_lon_nhat', [(float) $min, (float) $max]);
                    }
                }
            });
        }

        $perPage = (int) $request->query('per_page', 8);
        $products = $query->orderBy('ten_sp')->paginate($perPage);

        return response()->json($products);
    }

    public function show(string $maSp)
    {
        $product = DanhMucSp::with(['anhSps', 'hangSx', 'loaiSp', 'loaiDt', 'quocGia', 'chatLieu'])
            ->where('ma_sp', $maSp)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }
}
