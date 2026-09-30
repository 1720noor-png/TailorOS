<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\User;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }
    }

    public function stats(Request $request)
    {
        $this->checkAdmin($request);

        $totalUsers = User::count();
        $totalTools = Tool::count();
        $paidTools = Tool::where('is_paid', true)->count();
        $totalPurchases = Purchase::where('status', 'completed')->count();
        $totalRevenue = Purchase::where('status', 'completed')->sum('amount');
        
        $recentPurchases = Purchase::with(['user', 'tool'])
            ->latest()
            ->take(10)
            ->get();

        $topTools = Tool::orderByDesc('use_count')
            ->take(10)
            ->get(['slug', 'name', 'category_slug', 'use_count', 'view_count', 'purchase_count', 'is_paid', 'price']);

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_users' => $totalUsers,
                'total_tools' => $totalTools,
                'paid_tools' => $paidTools,
                'total_purchases' => $totalPurchases,
                'total_revenue' => (float)$totalRevenue,
                'currency' => 'USD',
            ],
            'recent_purchases' => $recentPurchases,
            'top_tools' => $topTools,
        ]);
    }

    public function users(Request $request)
    {
        $this->checkAdmin($request);

        $users = User::withCount('purchases')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'users' => $users,
        ]);
    }

    public function tools(Request $request)
    {
        $this->checkAdmin($request);

        $query = Tool::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%");
        }

        if ($request->category) {
            $query->where('category_slug', $request->category);
        }

        if ($request->has('is_paid')) {
            $query->where('is_paid', filter_var($request->is_paid, FILTER_VALIDATE_BOOLEAN));
        }

        $tools = $query->orderBy('name')->paginate(30);

        return response()->json([
            'status' => 'success',
            'tools' => $tools,
        ]);
    }

    public function updateTool(Request $request, $id)
    {
        $this->checkAdmin($request);

        $tool = Tool::findOrFail($id);

        $validated = $request->validate([
            'is_paid' => 'required|boolean',
            'price' => 'required|numeric|min:0',
            'download_enabled' => 'boolean',
            'download_type' => 'nullable|string',
            'preview_summary' => 'nullable|string',
        ]);

        $tool->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Tool pricing and settings updated.',
            'tool' => $tool,
        ]);
    }

    public function purchases(Request $request)
    {
        $this->checkAdmin($request);

        $purchases = Purchase::with(['user', 'tool'])
            ->latest()
            ->paginate(25);

        return response()->json([
            'status' => 'success',
            'purchases' => $purchases,
        ]);
    }
}
