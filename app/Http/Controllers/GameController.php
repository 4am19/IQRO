<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Level;
use App\Models\Student;
use App\Models\StudentProgress;
use App\Models\GameHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function select(Request $request)
    {
        $studentId = $request->query('student_id');
        $student = null;
        $progress = [];

        if (auth()->check()) {
            if ($studentId) {
                $student = Student::where('id', $studentId)
                    ->where('user_id', auth()->id())
                    ->first();
            } else {
                $student = auth()->user()->students()->first();
            }

            if ($student) {
                $progress = StudentProgress::where('student_id', $student->id)
                    ->get()
                    ->keyBy('level_id');
            }
        }

        $levels = Level::orderBy('order_sequence')->get();
        $students = auth()->check() ? auth()->user()->students : [];

        $totalStars = 0;
        if ($student && !empty($progress)) {
            $totalStars = collect($progress)->sum(function($prog) {
                return $prog->highest_score >= 80 ? 3 : ($prog->highest_score >= 50 ? 2 : ($prog->highest_score > 0 ? 1 : 0));
            });
        }

        return Inertia::render('Game/Select', [
            'levels' => $levels,
            'student' => $student,
            'progress' => $progress,
            'students' => $students,
            'totalStars' => $totalStars,
        ]);
    }

    public function play(Request $request, Level $level)
    {
        $studentId = $request->query('student_id');
        $student = null;

        if ($studentId && auth()->check()) {
            $student = Student::where('id', $studentId)
                ->where('user_id', auth()->id())
                ->first();
        }

        // Check if previous levels are completed (gating)
        if ($student && $level->order_sequence > 1) {
            $previousLevel = Level::where('order_sequence', $level->order_sequence - 1)->first();
            if ($previousLevel) {
                $previousProgress = StudentProgress::where('student_id', $student->id)
                    ->where('level_id', $previousLevel->id)
                    ->where('is_completed', true)
                    ->first();

                if (!$previousProgress) {
                    return redirect()->route('game.select', ['student_id' => $studentId])
                        ->with('error', 'Selesaikan level sebelumnya terlebih dahulu!');
                }
            }
        }

        $letters = Letter::orderBy('order_sequence')->get();

        $pageMap = [
            'multiple_choice' => 'Game/MultipleChoice',
            'tracing' => 'Game/Tracing',
            'drag_drop' => 'Game/DragDrop',
            'tajwid' => 'Game/Tajwid',
        ];

        $page = $pageMap[$level->game_type] ?? 'Game/MultipleChoice';

        $nextLevel = Level::where('order_sequence', '>', $level->order_sequence)
            ->orderBy('order_sequence')
            ->first();

        return Inertia::render($page, [
            'level' => $level,
            'nextLevel' => $nextLevel,
            'letters' => $letters,
            'student' => $student,
        ]);
    }

    public function submitScore(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'nullable|exists:students,id',
            'level_id' => 'required|exists:levels,id',
            'score' => 'required|integer|min:0|max:100',
            'total_questions' => 'required|integer|min:0',
            'correct_answers' => 'required|integer|min:0',
            'duration_seconds' => 'required|integer|min:0',
            'wrong_answers' => 'nullable|array',
        ]);

        $level = Level::findOrFail($validated['level_id']);

        if (!$validated['student_id'] || !auth()->check()) {
            return response()->json([
                'success' => true,
                'passed' => $validated['score'] >= $level->minimum_passing_score,
                'progress' => [
                    'is_completed' => $validated['score'] >= $level->minimum_passing_score,
                    'highest_score' => $validated['score']
                ]
            ]);
        }

        // Verify student belongs to authenticated user
        $student = Student::where('id', $validated['student_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Save game history
        GameHistory::create([
            'student_id' => $student->id,
            'level_id' => $level->id,
            'score_achieved' => $validated['score'],
            'total_questions' => $validated['total_questions'],
            'correct_answers' => $validated['correct_answers'],
            'duration_seconds' => $validated['duration_seconds'],
            'wrong_answers' => $validated['wrong_answers'] ?? null,
            'played_at' => now(),
        ]);

        $existingProgress = StudentProgress::where('student_id', $student->id)
            ->where('level_id', $level->id)
            ->first();
            
        $isCompleted = ($existingProgress && $existingProgress->is_completed) 
            || ($validated['score'] >= $level->minimum_passing_score);

        // Update or create student progress
        $progress = StudentProgress::updateOrCreate(
            [
                'student_id' => $student->id,
                'level_id' => $level->id,
            ],
            [
                'highest_score' => max(
                    $validated['score'],
                    $existingProgress->highest_score ?? 0
                ),
                'is_completed' => $isCompleted,
                'attempts' => \DB::raw('attempts + 1'),
            ]
        );

        // Update total score
        $student->total_score = GameHistory::where('student_id', $student->id)
            ->max('score_achieved') ?? 0;
        $student->total_score = StudentProgress::where('student_id', $student->id)
            ->sum('highest_score');
        $student->save();

        return response()->json([
            'success' => true,
            'passed' => $validated['score'] >= $level->minimum_passing_score,
            'progress' => $progress,
        ]);
    }
}
