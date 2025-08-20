<?php
// filepath: c:\Users\fadwa\Herd\ofoqy\app\Http\Controllers\ProfileController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TestPersonnalite;
use App\Models\Student;
use Illuminate\Container\Attributes\Storage;
use Illuminate\Support\Facades\Storage as FacadesStorage;

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

    public function logout(Request $request)
    {
        $student = Auth::guard("student")->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect("/login");
    }



    public function deleteAccount(Request $request)
    {

        $student = Auth::guard("student")->user();

        $request->validate([
            'password' => [
                'required',
                function ($attribute, $value, $fail) use ($student) {
                    if (!Auth::guard('student')->attempt(['email' => $student->email, 'password' => $value])) {
                        $fail('Le mot de passe est incorrect.');
                    }
                }
            ],
        ]);

        if ($student->profile_photo_path && FacadesStorage::disk('public')->exists($student->profile_photo_path)) {
            FacadesStorage::disk('public')->delete($student->profile_photo_path);
        }

        $studentId = $student->id;

        Auth::guard('student')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        TestPersonnalite::where('student_id', $studentId)->delete();

        // Ensure $student is an Eloquent model before deleting
        $studentModel = Student::find($studentId);
        if ($studentModel) {
            $studentModel->delete();
        }

        return redirect('/login')->with('success', 'Votre compte a été supprimé avec succès.');


    }

}