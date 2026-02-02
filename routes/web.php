<?php

use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{maSp}', [ProductController::class, 'show']);

    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{maHangSx}/products', [BrandController::class, 'products']);

    Route::get('/meta/categories', [MetaController::class, 'categories']);
    Route::get('/meta/types', [MetaController::class, 'types']);
    Route::get('/meta/materials', [MetaController::class, 'materials']);
    Route::get('/meta/countries', [MetaController::class, 'countries']);

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::post('/orders', [OrderController::class, 'create']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/products', [AdminProductController::class, 'index']);
        Route::post('/admin/products', [AdminProductController::class, 'store']);
        Route::put('/admin/products/{maSp}', [AdminProductController::class, 'update']);
        Route::delete('/admin/products/{maSp}', [AdminProductController::class, 'destroy']);

        Route::get('/admin/orders', [AdminOrderController::class, 'index']);
        Route::get('/admin/orders/{maHoaDon}', [AdminOrderController::class, 'detail']);
        Route::put('/admin/orders/{maHoaDon}', [AdminOrderController::class, 'update']);
        Route::delete('/admin/orders/{maHoaDon}', [AdminOrderController::class, 'destroy']);
        Route::get('/admin/stats', [AdminOrderController::class, 'stats']);
        Route::get('/admin/stats/range', [AdminOrderController::class, 'rangeStats']);

        Route::get('/admin/categories', [AdminCategoryController::class, 'index']);
        Route::post('/admin/categories', [AdminCategoryController::class, 'store']);
        Route::put('/admin/categories/{maLoai}', [AdminCategoryController::class, 'update']);
        Route::delete('/admin/categories/{maLoai}', [AdminCategoryController::class, 'destroy']);

        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::put('/admin/users/{username}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{username}', [AdminUserController::class, 'destroy']);
    });
});

Route::view('/', 'app');
Route::view('/{any}', 'app')->where('any', '.*');
