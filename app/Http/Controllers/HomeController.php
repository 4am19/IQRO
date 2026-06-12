<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\Level;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $students = $user ? $user->students : [];

        return Inertia::render('Home', [
            'students' => $students,
        ]);
    }
}
