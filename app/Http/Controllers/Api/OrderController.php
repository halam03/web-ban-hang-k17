<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChiTietHdb;
use App\Models\DanhMucSp;
use App\Models\HoaDonBan;
use App\Models\KhachHang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order' => ['required', 'array'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'customer' => ['nullable', 'array'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $username = $request->session()->get('username');
        $customerData = $request->input('customer', []);

        $khachHang = null;
        if ($username) {
            $khachHang = KhachHang::where('username', $username)->first();
            if (!$khachHang) {
                $khachHang = KhachHang::create([
                    'ma_khach_hang' => $username,
                    'username' => $username,
                    'ten_khach_hang' => $customerData['ten_khach_hang'] ?? 'Kh¨¢ch h¨¤ng',
                    'ngay_sinh' => $customerData['ngay_sinh'] ?? null,
                    'so_dien_thoai' => $customerData['so_dien_thoai'] ?? null,
                    'dia_chi' => $customerData['dia_chi'] ?? null,
                ]);
            }
        } else {
            if (!$customerData) {
                return response()->json(['message' => 'Customer information required'], 422);
            }
            $khachHang = KhachHang::create([
                'ma_khach_hang' => 'KH' . Str::upper(Str::random(8)),
                'ten_khach_hang' => $customerData['ten_khach_hang'] ?? 'Kh¨¢ch h¨¤ng',
                'ngay_sinh' => $customerData['ngay_sinh'] ?? null,
                'so_dien_thoai' => $customerData['so_dien_thoai'] ?? null,
                'dia_chi' => $customerData['dia_chi'] ?? null,
            ]);
        }

        $nextOrderId = (int) (HoaDonBan::max('ma_hoa_don') ?? 0) + 1;
        $orderInput = $request->input('order');

        $order = HoaDonBan::create([
            'ma_hoa_don' => $nextOrderId,
            'ngay_hoa_don' => $orderInput['ngay_hoa_don'] ?? now()->toDateTimeString(),
            'ma_khach_hang' => $khachHang?->ma_khach_hang,
            'tong_tien_hd' => $orderInput['tong_tien_hd'] ?? 0,
            'giam_gia_hd' => $orderInput['giam_gia_hd'] ?? 0,
            'phuong_thuc_thanh_toan' => $orderInput['phuong_thuc_thanh_toan'] ?? 0,
            'ma_so_thue' => $orderInput['ma_so_thue'] ?? null,
            'thong_tin_thue' => $orderInput['thong_tin_thue'] ?? null,
            'ghi_chu' => $orderInput['ghi_chu'] ?? null,
            'status' => $orderInput['status'] ?? 0,
        ]);

        $detailId = (int) (ChiTietHdb::max('id') ?? 0) + 1;
        foreach ($request->input('items') as $item) {
            $product = DanhMucSp::where('ma_sp', $item['product_id'])->first();
            if (!$product) {
                continue;
            }
            ChiTietHdb::create([
                'id' => $detailId++,
                'ma_hoa_don' => $order->ma_hoa_don,
                'ma_sp' => $product->ma_sp,
                'so_luong_ban' => $item['quantity'],
                'don_gia_ban' => $product->gia_lon_nhat ?? 0,
            ]);
        }

        return response()->json(['status' => true, 'order' => $order]);
    }
}
