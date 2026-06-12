<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ParentDashboardController;
use App\Http\Controllers\StudentController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/game/select', [GameController::class, 'select'])->name('game.select');
Route::get('/game/play/{level}', [GameController::class, 'play'])->name('game.play');
Route::post('/game/score', [GameController::class, 'submitScore'])->name('game.score');

Route::get('/learn/tajwid', [LearningController::class, 'tajwid'])->name('learn.tajwid');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $students = auth()->user()->students ?? [];
        return Inertia::render('Profile/Select', [
            'students' => $students,
        ]);
    })->name('dashboard');

    Route::get('/learn', [LearningController::class, 'index'])->name('learn.index');

    Route::get('/parent/dashboard', [ParentDashboardController::class, 'index'])
        ->middleware('password.confirm')
        ->name('parent.dashboard');

    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::patch('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
