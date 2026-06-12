<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    protected $fillable = [
        'title',
        'description',
        'order_sequence',
        'game_type',
        'minimum_passing_score',
        'icon',
        'color',
    ];

    public function studentProgress(): HasMany
    {
        return $this->hasMany(StudentProgress::class);
    }

    public function gameHistories(): HasMany
    {
        return $this->hasMany(GameHistory::class);
    }
}
