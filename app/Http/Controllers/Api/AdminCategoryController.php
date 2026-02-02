<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoaiSp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = LoaiSp::withCount('danhMucSps')
            ->orderBy('loai')
            ->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_loai' => ['required', 'string', 'max:25', 'unique:t_loai_sp,ma_loai'],
            'loai' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = LoaiSp::create($request->only(['ma_loai', 'loai']));
        return response()->json(['category' => $category]);
    }

    public function update(Request $request, string $maLoai)
    {
        $category = LoaiSp::where('ma_loai', $maLoai)->first();
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'loai' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->loai = $request->input('loai');
        $category->save();

        return response()->json(['category' => $category]);
    }

    public function destroy(string $maLoai)
    {
        $category = LoaiSp::where('ma_loai', $maLoai)->first();
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        if ($category->danhMucSps()->count() > 0) {
            return response()->json(['message' => 'Category has products'], 409);
        }

        $category->delete();
        return response()->json(['status' => true]);
    }
}