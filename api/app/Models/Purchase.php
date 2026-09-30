<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'user_id',
        'guest_email',
        'tool_slug',
        'transaction_id',
        'amount',
        'currency',
        'payment_gateway',
        'status',
        'download_token',
        'download_limit',
        'download_count',
        'expires_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'download_limit' => 'integer',
        'download_count' => 'integer',
        'expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tool()
    {
        return $this->belongsTo(Tool::class, 'tool_slug', 'slug');
    }

    public function canDownload(): bool
    {
        if ($this->status !== 'completed') return false;
        if ($this->download_count >= $this->download_limit) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        return true;
    }
}
