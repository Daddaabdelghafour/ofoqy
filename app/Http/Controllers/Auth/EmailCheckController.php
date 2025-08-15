<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class EmailCheckController extends Controller
{
    public function checkEmail(Request $request)
    {
        $email = $request->input('email');
        $exists = Student::where('email', $email)->exists();
        
        return response()->json(['exists' => $exists]);
    }
}
