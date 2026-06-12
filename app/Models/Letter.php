<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $fillable = [
        'char_arabic',
        'name',
        'read_latin',
        'pronunciation_desc',
        'audio_path',
        'example_word',
        'example_image_path',
        'order_sequence',
        'fathah',
        'kasrah',
        'dhammah',
    ];

    protected $casts = [
        'fathah'  => 'array',
        'kasrah'  => 'array',
        'dhammah' => 'array',
    ];
}
