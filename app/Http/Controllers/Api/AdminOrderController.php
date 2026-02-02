<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HoaDonBan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = HoaDonBan::with('khachHang')->orderByDesc('ma_hoa_don')->get();
        return response()->json($orders);
    }

    public function detail(int $maHoaDon)
    {
        $order = HoaDonBan::with(['khachHang', 'chiTietHdbs.danhMucSp'])->where('ma_hoa_don', $maHoaDon)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function update(Request $request, int $maHoaDon)
    {
        $order = HoaDonBan::where('ma_hoa_don', $maHoaDon)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        if ((int) $order->status === 2) {
            return response()->json(['message' => 'Order delivered'], 409);
        }

        $data = $request->validate([
            'status' => ['nullable', 'integer'],
            'phuong_thuc_thanh_toan' => ['nullable', 'integer'],
            'ghi_chu' => ['nullable', 'string'],
            'ma_so_thue' => ['nullable', 'string'],
            'thong_tin_thue' => ['nullable', 'string'],
        ]);

        $order->fill($data);
        $order->save();

        return response()->json($order);
    }

    public function destroy(int $maHoaDon)
    {
        $order = HoaDonBan::where('ma_hoa_don', $maHoaDon)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['status' => true]);
    }

    public function stats(Request $request)
    {
        $month = (int) $request->query('month');
        $year = (int) $request->query('year');

        if (!$month || !$year) {
            return response()->json(['message' => 'month and year required'], 422);
        }

        $sum = HoaDonBan::query()
            ->whereRaw('YEAR(STR_TO_DATE(ngay_hoa_don, "%Y-%m-%d %H:%i:%s")) = ?', [$year])
            ->whereRaw('MONTH(STR_TO_DATE(ngay_hoa_don, "%Y-%m-%d %H:%i:%s")) = ?', [$month])
            ->where('status', 2)
            ->sum('tong_tien_hd');

        return response()->json(['total' => $sum]);
    }

    public function rangeStats(Request $request)
    {
        $range = $request->query('range', '7d');
        $deliveredStatus = 2;

        if ($range === '12m') {
            $start = Carbon::now()->subMonths(11)->startOfMonth();
            $end = Carbon::now()->endOfMonth();

            $rows = HoaDonBan::query()
                ->selectRaw("DATE_FORMAT(STR_TO_DATE(ngay_hoa_don, '%Y-%m-%d %H:%i:%s'), '%Y-%m') as label")
                ->selectRaw("SUM(CASE WHEN status = ? THEN tong_tien_hd ELSE 0 END) as revenue", [$deliveredStatus])
                ->selectRaw("SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as orders", [$deliveredStatus])
                ->whereRaw("STR_TO_DATE(ngay_hoa_don, '%Y-%m-%d %H:%i:%s') between ? and ?", [$start, $end])
                ->groupBy('label')
                ->orderBy('label')
                ->get()
                ->keyBy('label');

            $labels = [];
            $revenues = [];
            $orders = [];
            $cursor = $start->copy();
            while ($cursor->lte($end)) {
                $key = $cursor->format('Y-m');
                $labels[] = $cursor->format('m/Y');
                $row = $rows->get($key);
                $revenues[] = (float) ($row->revenue ?? 0);
                $orders[] = (int) ($row->orders ?? 0);
                $cursor->addMonth();
            }

            return response()->json([
                'labels' => $labels,
                'revenues' => $revenues,
                'orders' => $orders,
            ]);
        }

        $days = $range === '30d' ? 30 : 7;
        $start = Carbon::now()->subDays($days - 1)->startOfDay();
        $end = Carbon::now()->endOfDay();

        $rows = HoaDonBan::query()
            ->selectRaw("DATE(STR_TO_DATE(ngay_hoa_don, '%Y-%m-%d %H:%i:%s')) as label")
            ->selectRaw("SUM(CASE WHEN status = ? THEN tong_tien_hd ELSE 0 END) as revenue", [$deliveredStatus])
            ->selectRaw("SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as orders", [$deliveredStatus])
            ->whereRaw("STR_TO_DATE(ngay_hoa_don, '%Y-%m-%d %H:%i:%s') between ? and ?", [$start, $end])
            ->groupBy('label')
            ->orderBy('label')
            ->get()
            ->keyBy('label');

        $labels = [];
        $revenues = [];
        $orders = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $key = $cursor->toDateString();
            $labels[] = $cursor->format('d/m');
            $row = $rows->get($key);
            $revenues[] = (float) ($row->revenue ?? 0);
            $orders[] = (int) ($row->orders ?? 0);
            $cursor->addDay();
        }

        return response()->json([
            'labels' => $labels,
            'revenues' => $revenues,
            'orders' => $orders,
        ]);
    }
}
