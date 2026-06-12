<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameHistory extends Model
{
    protected $fillable = [
        'student_id',
        'level_id',
        'score_achieved',
        'total_questions',
        'correct_answers',
        'duration_seconds',
        'wrong_answers',
        'played_at',
    ];

    protected $casts = [
        'played_at' => 'datetime',
        'wrong_answers' => 'array',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
}
