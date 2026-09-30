<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedResult extends Model
{
    protected $fillable = [
        'user_id',
        'tool_slug',
        'title',
        'payload',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
