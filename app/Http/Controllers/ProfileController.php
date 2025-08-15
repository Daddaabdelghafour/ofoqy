<?php
// filepath: c:\Users\fadwa\Herd\ofoqy\app\Http\Controllers\ProfileController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TestPersonnalite;
use App\Models\Student;

class ProfileController extends Controller
{
    public function profile()
    {
        // Check if student is authenticated
        if (!Auth::guard('student')->check()) {
            return redirect('/login');
        }
        
        $student = Auth::guard('student')->user();
        
        // Get their MBTI result if they have one
        $mbtiResult = TestPersonnalite::where('student_id', $student->id)->first();

        return Inertia::render('Dashboard/Profile', [
            'student' => $student,
            'mbtiResult' => $mbtiResult
        ]);
    }

}