<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    /**
     * Process a one-time tool purchase (NO Subscriptions)
     */
    public function purchase(Request $request)
    {
        $validated = $request->validate([
            'tool_slug' => 'required|string',
            'guest_email' => 'nullable|email',
            'payment_method' => 'required|string|in:stripe,paypal,sandbox',
        ]);

        $tool = Tool::where('slug', $validated['tool_slug'])->first();

        if (!$tool || !$tool->is_paid) {
            return response()->json([
                'status' => 'error',
                'message' => 'This tool is not available for purchase or is already free.',
            ], 400);
        }

        $user = $request->user();
        $email = $user ? $user->email : ($validated['guest_email'] ?? 'guest@example.com');

        // Check if already purchased
        if ($user) {
            $existing = Purchase::where('user_id', $user->id)
                ->where('tool_slug', $tool->slug)
                ->where('status', 'completed')
                ->first();

            if ($existing && $existing->canDownload()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'You already have access to this tool export!',
                    'purchase' => $existing,
                    'download_token' => $existing->download_token,
                ]);
            }
        }

        // Generate one-time transaction and download token
        $transactionId = 'TXN_' . strtoupper(Str::random(12));
        $downloadToken = 'DL_' . Str::random(40);

        $purchase = Purchase::create([
            'user_id' => $user ? $user->id : null,
            'guest_email' => $email,
            'tool_slug' => $tool->slug,
            'transaction_id' => $transactionId,
            'amount' => $tool->price,
            'currency' => $tool->currency ?: 'USD',
            'payment_gateway' => $validated['payment_method'],
            'status' => 'completed', // Instant completion for sandbox / verified payment
            'download_token' => $downloadToken,
            'download_limit' => 20,
            'download_count' => 0,
            'expires_at' => now()->addDays(365), // 1 year unlimited access
            'metadata' => [
                'tool_name' => $tool->name,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);

        $tool->increment('purchase_count');

        return response()->json([
            'status' => 'success',
            'message' => 'One-time purchase successful! Your high-res export is unlocked.',
            'purchase' => [
                'id' => $purchase->id,
                'transaction_id' => $purchase->transaction_id,
                'amount' => $purchase->amount,
                'currency' => $purchase->currency,
                'download_token' => $purchase->download_token,
                'download_limit' => $purchase->download_limit,
                'download_count' => $purchase->download_count,
                'expires_at' => $purchase->expires_at,
                'created_at' => $purchase->created_at,
            ],
        ], 201);
    }

    /**
     * List user's purchases
     */
    public function userPurchases(Request $request)
    {
        $user = $request->user();
        $purchases = Purchase::with('tool')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'purchases' => $purchases,
        ]);
    }
}
