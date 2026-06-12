<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Level;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function index(Request $request)
    {
        $letters = Letter::orderBy('order_sequence')->get();
        $studentId = $request->query('student_id');
        $student = null;

        if ($studentId) {
            $student = Student::where('id', $studentId)
                ->where('user_id', auth()->id())
                ->first();
        }

        return Inertia::render('Learn/Index', [
            'letters' => $letters,
            'student' => $student,
        ]);
    }

    public function tajwid()
    {
        return Inertia::render('Learn/Tajwid');
    }
}
