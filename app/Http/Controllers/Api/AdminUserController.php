<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KhachHang;
use App\Models\UserAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = UserAccount::with('khachHang')->orderBy('username')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'email'],
            'password' => ['required', 'min:6'],
            'loai_user' => ['nullable', 'integer'],
            'ten_khach_hang' => ['nullable', 'string'],
            'so_dien_thoai' => ['nullable', 'string'],
            'dia_chi' => ['nullable', 'string'],
            'ghi_chu' => ['nullable', 'string'],
        ]);

        if (UserAccount::where('username', $data['username'])->exists()) {
            return response()->json(['message' => 'Username already exists'], 409);
        }

        $user = UserAccount::create([
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'loai_user' => $data['loai_user'] ?? 1,
        ]);

        KhachHang::updateOrCreate(
            ['ma_khach_hang' => $user->username],
            [
                'username' => $user->username,
                'ten_khach_hang' => $data['ten_khach_hang'] ?? $user->username,
                'so_dien_thoai' => $data['so_dien_thoai'] ?? null,
                'dia_chi' => $data['dia_chi'] ?? null,
                'ghi_chu' => $data['ghi_chu'] ?? null,
            ]
        );

        return response()->json($user->load('khachHang'), 201);
    }

    public function update(Request $request, string $username)
    {
        $user = UserAccount::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validate([
            'password' => ['nullable', 'min:6'],
            'loai_user' => ['nullable', 'integer'],
            'ten_khach_hang' => ['nullable', 'string'],
            'so_dien_thoai' => ['nullable', 'string'],
            'dia_chi' => ['nullable', 'string'],
            'ghi_chu' => ['nullable', 'string'],
        ]);

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if (array_key_exists('loai_user', $data)) {
            $user->loai_user = $data['loai_user'];
        }

        $user->save();

        KhachHang::updateOrCreate(
            ['ma_khach_hang' => $user->username],
            [
                'username' => $user->username,
                'ten_khach_hang' => $data['ten_khach_hang'] ?? $user->username,
                'so_dien_thoai' => $data['so_dien_thoai'] ?? null,
                'dia_chi' => $data['dia_chi'] ?? null,
                'ghi_chu' => $data['ghi_chu'] ?? null,
            ]
        );

        return response()->json($user->load('khachHang'));
    }

    public function destroy(Request $request, string $username)
    {
        $current = $request->session()->get('username');
        if ($current === $username) {
            return response()->json(['message' => 'Khong the xoa tai khoan dang dang nhap'], 422);
        }

        $user = UserAccount::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        KhachHang::where('ma_khach_hang', $username)->delete();
        $user->delete();

        return response()->json(['status' => true]);
    }
}
