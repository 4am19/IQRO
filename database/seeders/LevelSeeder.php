<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            [
                'title' => 'Level 1: Huruf Dasar',
                'description' => 'Kenali dan tebak 28 huruf hijaiyah dasar berdasarkan cara membacanya.',
                'order_sequence' => 1,
                'game_type' => 'multiple_choice',
                'minimum_passing_score' => 80,
                'icon' => 'star',
                'color' => 'ocean',
            ],
            [
                'title' => 'Level 2: Huruf & Harakat',
                'description' => 'Tebalkan huruf hijaiyah mengikuti garis titik-titik dan pelajari harakat (Fathah, Kasrah, Dammah).',
                'order_sequence' => 2,
                'game_type' => 'tracing',
                'minimum_passing_score' => 80,
                'icon' => 'pencil',
                'color' => 'grape',
            ],
            [
                'title' => 'Level 3: Susun Kata',
                'description' => 'Susun huruf hijaiyah untuk membentuk kata sederhana dengan drag & drop.',
                'order_sequence' => 3,
                'game_type' => 'drag_drop',
                'minimum_passing_score' => 80,
                'icon' => 'trophy',
                'color' => 'sunshine',
            ],
            [
                'title' => 'Level 4: Tajwid Dasar',
                'description' => 'Uji pengetahuanmu tentang hukum bacaan tajwid dasar (Nun Mati & Tanwin).',
                'order_sequence' => 4,
                'game_type' => 'tajwid',
                'minimum_passing_score' => 80,
                'icon' => 'book',
                'color' => 'purple',
            ],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(['order_sequence' => $level['order_sequence']], $level);
        }
    }
}
