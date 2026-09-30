<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'category_slug',
        'subcategory_slug',
        'is_paid',
        'price',
        'currency',
        'download_enabled',
        'download_type',
        'preview_summary',
        'view_count',
        'use_count',
        'purchase_count',
    ];

    protected $casts = [
        'is_paid' => 'boolean',
        'download_enabled' => 'boolean',
        'price' => 'decimal:2',
        'view_count' => 'integer',
        'use_count' => 'integer',
        'purchase_count' => 'integer',
    ];

    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'tool_slug', 'slug');
    }
}
