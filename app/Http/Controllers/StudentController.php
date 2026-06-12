<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = auth()->user()->students;
        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer|min:3|max:15',
            'avatar_url' => 'nullable|string|in:boy,girl',
        ]);

        $student = auth()->user()->students()->create($validated);

        return redirect()->back()->with('success', 'Profil anak berhasil ditambahkan!');
    }

    public function update(Request $request, Student $student)
    {
        if ($student->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer|min:3|max:15',
            'avatar_url' => 'nullable|string|in:boy,girl',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Profil anak berhasil diperbarui!');
    }

    public function destroy(Student $student)
    {
        if ($student->user_id !== auth()->id()) {
            abort(403);
        }

        $student->delete();

        return redirect()->back()->with('success', 'Profil anak berhasil dihapus.');
    }
}
