<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KhachHang;
use App\Models\UserAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'email'],
            'password' => ['required', 'min:6'],
            'ten_khach_hang' => ['required', 'string', 'max:100'],
            'so_dien_thoai' => ['required', 'string', 'max:15'],
            'dia_chi' => ['required', 'string', 'max:150'],
            'ngay_sinh' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = UserAccount::where('username', $request->input('username'))->exists();
        if ($exists) {
            return response()->json(['message' => 'Username already exists'], 409);
        }

        $user = null;
        DB::transaction(function () use ($request, &$user) {
            $username = $request->input('username');
            $customerId = $username;
            if (strlen($customerId) > 25) {
                $customerId = 'KH' . strtoupper(substr(md5($username), 0, 23));
            }

            $user = UserAccount::create([
                'username' => $username,
                'password' => Hash::make($request->input('password')),
                'loai_user' => 1,
            ]);

            KhachHang::create([
                'ma_khach_hang' => $customerId,
                'username' => $username,
                'ten_khach_hang' => $request->input('ten_khach_hang'),
                'ngay_sinh' => $request->input('ngay_sinh'),
                'so_dien_thoai' => $request->input('so_dien_thoai'),
                'dia_chi' => $request->input('dia_chi'),
                'loai_khach_hang' => 1,
            ]);
        });

        $request->session()->put('username', $user->username);
        $request->session()->put('loai_user', $user->loai_user);

        return response()->json(['user' => $user]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = UserAccount::where('username', $request->input('username'))->first();
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Login failed'], 401);
        }

        $request->session()->put('username', $user->username);
        $request->session()->put('loai_user', $user->loai_user);

        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => true]);
    }

    public function me(Request $request)
    {
        $username = $request->session()->get('username');
        if (!$username) {
            return response()->json(['user' => null]);
        }

        $user = UserAccount::where('username', $username)->first();
        return response()->json(['user' => $user]);
    }
}
