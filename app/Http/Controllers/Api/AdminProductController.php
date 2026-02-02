<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhSp;
use App\Models\DanhMucSp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = DanhMucSp::with(['hangSx', 'loaiSp', 'anhSps'])->orderBy('ten_sp')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_sp' => ['required', 'string', 'max:50', 'unique:t_danh_muc_sp,ma_sp'],
            'ten_sp' => ['required', 'string', 'max:150'],
            'ma_hang_sx' => ['nullable', 'string'],
            'ma_loai' => ['nullable', 'string'],
            'ma_dt' => ['nullable', 'string'],
            'ma_chat_lieu' => ['nullable', 'string'],
            'ma_nuoc_sx' => ['nullable', 'string'],
            'gia_lon_nhat' => ['nullable', 'numeric'],
            'gioi_thieu_sp' => ['nullable', 'string'],
            'anh_dai_dien' => ['nullable', 'string'],
            'anh_dai_dien_file' => ['nullable', 'file', 'image', 'max:4096'],
            'images' => ['nullable', 'array'],
            'images_files' => ['nullable', 'array'],
            'images_files.*' => ['file', 'image', 'max:4096'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $mainImage = $request->input('anh_dai_dien');
        if ($request->hasFile('anh_dai_dien_file')) {
            $mainImage = $this->storeImage($request->file('anh_dai_dien_file'));
        }

        $product = DanhMucSp::create($request->only([
            'ma_sp',
            'ten_sp',
            'ma_chat_lieu',
            'ma_hang_sx',
            'ma_nuoc_sx',
            'ma_loai',
            'ma_dt',
            'gia_lon_nhat',
            'gioi_thieu_sp',
        ]) + ['anh_dai_dien' => $mainImage]);

        $images = $request->input('images', []);
        if ($request->hasFile('images_files')) {
            $images = [];
            foreach ($request->file('images_files') as $file) {
                $images[] = $this->storeImage($file);
            }
        }
        foreach ($images as $image) {
            AnhSp::create([
                'ma_sp' => $product->ma_sp,
                'ten_file_anh' => $image,
            ]);
        }

        return response()->json(['product' => $product]);
    }

    public function update(Request $request, string $maSp)
    {
        $product = DanhMucSp::where('ma_sp', $maSp)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->fill($request->only([
            'ten_sp',
            'ma_chat_lieu',
            'ma_hang_sx',
            'ma_nuoc_sx',
            'ma_loai',
            'ma_dt',
            'gia_lon_nhat',
            'gioi_thieu_sp',
        ]));
        if ($request->has('anh_dai_dien')) {
            $product->anh_dai_dien = $request->input('anh_dai_dien');
        }
        if ($request->hasFile('anh_dai_dien_file')) {
            $product->anh_dai_dien = $this->storeImage($request->file('anh_dai_dien_file'));
        }
        $product->save();

        if ($request->has('images') || $request->hasFile('images_files')) {
            AnhSp::where('ma_sp', $product->ma_sp)->delete();
            $images = $request->input('images', []);
            if ($request->hasFile('images_files')) {
                $images = [];
                foreach ($request->file('images_files') as $file) {
                    $images[] = $this->storeImage($file);
                }
            }
            foreach ($images as $image) {
                AnhSp::create([
                    'ma_sp' => $product->ma_sp,
                    'ten_file_anh' => $image,
                ]);
            }
        }

        return response()->json(['product' => $product]);
    }

    private function storeImage($file): string
    {
        $dir = public_path('assets/img/ImageCamera');
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . ($extension ? '.' . $extension : '');
        $file->move($dir, $filename);
        return $filename;
    }

    public function destroy(string $maSp)
    {
        $product = DanhMucSp::where('ma_sp', $maSp)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        AnhSp::where('ma_sp', $maSp)->delete();
        $product->delete();

        return response()->json(['status' => true]);
    }
}
