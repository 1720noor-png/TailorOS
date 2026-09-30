<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ToolApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Tool::query();

        if ($request->has('is_paid')) {
            $query->where('is_paid', filter_var($request->is_paid, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('category')) {
            $query->where('category_slug', $request->category);
        }

        $tools = $query->orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'count' => $tools->count(),
            'tools' => $tools,
        ]);
    }

    public function show(Request $request, $slug)
    {
        $tool = Tool::where('slug', $slug)->first();

        $isPurchased = false;
        $activePurchase = null;

        // Check if user is authenticated and has purchased
        $user = Auth::guard('sanctum')->user();
        if ($user && $tool && $tool->is_paid) {
            $purchase = Purchase::where('user_id', $user->id)
                ->where('tool_slug', $slug)
                ->where('status', 'completed')
                ->latest()
                ->first();

            if ($purchase && $purchase->canDownload()) {
                $isPurchased = true;
                $activePurchase = [
                    'transaction_id' => $purchase->transaction_id,
                    'download_token' => $purchase->download_token,
                    'download_count' => $purchase->download_count,
                    'download_limit' => $purchase->download_limit,
                    'created_at' => $purchase->created_at,
                ];
            }
        }

        if ($tool) {
            $tool->increment('view_count');
        }

        return response()->json([
            'status' => 'success',
            'tool' => $tool,
            'is_purchased' => $isPurchased,
            'purchase' => $activePurchase,
        ]);
    }

    public function incrementUsage($slug)
    {
        $tool = Tool::where('slug', $slug)->first();
        if ($tool) {
            $tool->increment('use_count');
        }

        return response()->json(['status' => 'success']);
    }
}
