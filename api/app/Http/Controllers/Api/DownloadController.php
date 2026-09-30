<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Tool;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    /**
     * Verify download token and serve verified payload/token status
     */
    public function verifyToken(Request $request, $token)
    {
        $purchase = Purchase::with('tool')->where('download_token', $token)->first();

        if (!$purchase) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid download token.',
            ], 404);
        }

        if (!$purchase->canDownload()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Download limit reached or token expired.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'valid' => true,
            'purchase' => [
                'tool_slug' => $purchase->tool_slug,
                'tool_name' => $purchase->tool ? $purchase->tool->name : $purchase->tool_slug,
                'download_count' => $purchase->download_count,
                'download_limit' => $purchase->download_limit,
                'expires_at' => $purchase->expires_at,
            ],
        ]);
    }

    /**
     * Register a download action
     */
    public function recordDownload(Request $request, $token)
    {
        $purchase = Purchase::where('download_token', $token)->first();

        if (!$purchase || !$purchase->canDownload()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unable to record download. Token invalid or limit exceeded.',
            ], 403);
        }

        $purchase->increment('download_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Download recorded.',
            'remaining_downloads' => $purchase->download_limit - $purchase->download_count,
        ]);
    }
}
