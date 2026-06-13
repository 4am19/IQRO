<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo parent user
        $user = User::factory()->create([
            'name' => 'Orang Tua Demo',
            'email' => 'demo@pintarhijaiyah.com',
            'password' => bcrypt('password'),
        ]);

        // Create demo student profiles
        Student::create([
            'user_id' => $user->id,
            'name' => 'Ahmad',
            'age' => 7,
            'gender' => 'L',
            'avatar_url' => 'boy',
            'total_score' => 0,
        ]);

        Student::create([
            'user_id' => $user->id,
            'name' => 'Aisyah',
            'age' => 5,
            'gender' => 'P',
            'avatar_url' => 'girl',
            'total_score' => 0,
        ]);

        // Seed master data
        $this->call([
            LetterSeeder::class,
            LevelSeeder::class,
        ]);
    }
}
