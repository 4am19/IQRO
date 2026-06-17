<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\GameHistory;
use App\Models\StudentProgress;
use App\Models\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $students = $user->students()->with(['progress.level', 'gameHistories.level'])->get();

        $selectedStudentId = $request->query('student_id');
        $selectedStudent = null;
        $stats = null;

        if ($selectedStudentId) {
            $selectedStudent = $students->firstWhere('id', (int) $selectedStudentId);
        } elseif ($students->isNotEmpty()) {
            $selectedStudent = $students->first();
        }

        if ($selectedStudent) {
            $weaknessesMap = [];
            foreach ($selectedStudent->gameHistories as $history) {
                if (is_array($history->wrong_answers)) {
                    foreach ($history->wrong_answers as $wrong) {
                        $weaknessesMap[$wrong] = ($weaknessesMap[$wrong] ?? 0) + 1;
                    }
                }
            }
            arsort($weaknessesMap);
            $topWeaknesses = [];
            foreach (array_slice($weaknessesMap, 0, 5, true) as $item => $count) {
                $topWeaknesses[] = [
                    'item' => $item,
                    'count' => $count,
                ];
            }

            // Chart Data for last 7 days
            $last7Days = [];
            $now = \Carbon\Carbon::now();
            for ($i = 6; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i)->format('Y-m-d');
                $dayName = $now->copy()->subDays($i)->isoFormat('ddd'); // Sen, Sel, etc
                $last7Days[$date] = ['day' => $dayName, 'score' => 0];
            }

            foreach ($selectedStudent->gameHistories as $history) {
                $date = \Carbon\Carbon::parse($history->played_at)->format('Y-m-d');
                if (isset($last7Days[$date])) {
                    $last7Days[$date]['score'] += $history->score_achieved;
                }
            }
            $chartData = array_values($last7Days);

            $stats = [
                'total_score' => $selectedStudent->total_score,
                'levels_completed' => $selectedStudent->progress->where('is_completed', true)->count(),
                'total_levels' => Level::count(),
                'total_games_played' => $selectedStudent->gameHistories->count(),
                'total_time_minutes' => round($selectedStudent->gameHistories->sum('duration_seconds') / 60, 1),
                'average_score' => round($selectedStudent->gameHistories->avg('score_achieved') ?? 0),
                'recent_games' => $selectedStudent->gameHistories()
                    ->with('level')
                    ->orderBy('played_at', 'desc')
                    ->take(10)
                    ->get(),
                'progress' => $selectedStudent->progress()->with('level')->get(),
                'weaknesses' => $topWeaknesses,
                'chart_data' => $chartData,
            ];
        }

        return Inertia::render('Parent/Dashboard', [
            'students' => $students,
            'selectedStudent' => $selectedStudent,
            'stats' => $stats,
        ]);
    }
}
